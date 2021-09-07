<template>
	<div v-if="auth.data.token != null" id="app">
		<form enctype="multpart/form-data" id="userForm" name="userForm" v-if="user !== null" >
		<span v-if="auth.data.isAdmin">Adminstrateur connecté</span>
      <div class="card">
				<div class="card__submenu">
					<button class='btn' v-if=" auth.data.id == $route.query.id || auth.data.isAdmin " type="button" @click="viewAxisCode" >{{ textAxisCode }} </button>
					<button class='btn' v-if=" auth.data.id == $route.query.id || auth.data.isAdmin" type="button" @click="deleteUser(this.user.id)"><fa class="fa-trash" icon="trash"/></button>
				</div>
				<div class="card__profile" v-if="!btnAxisCode">
					<div class="card__profile__avatar">
						<img v-if="output==''" id="avatar" alt="Avatar" :src="user.avatar"/>
						<img   id="output"/>
						<input v-if="auth.data.id == $route.query.id || auth.data.isAdmin" type="file" @change="onFileSelected"/>
					</div>
					<div class="card__profile__body">
						<div class="card__profile__body__name">
							<div class="flex-row">
								<label for="firstName">Nom</label>
								<input type="text" id="firstName" name="firstName"	required v-model="user.firstName"/>
							</div>
							<div class="flex-row">
								<label for="lastName">Prénom</label>
								<input type="text" id="lastName" name="lastName" required v-model="user.lastName"/>
							</div>
						</div>
						<div class="card__profile__body__contents">
							<div class="flex-row">
								<label for="pseudo">Pseudo</label>
								<input type="text" id="pseudo" name="peusdo" required v-model="user.pseudo"/>
							</div>
							<div class="flex-row">
								<label for="bio">Bio</label>
								<textarea type="textarea" id="bio" name="bio" required v-model="user.bio" cols="22" rows="3" />
							</div>
						</div>
						<div class="card__profile__btn">
							<button	class="btn" v-if=" auth.data.id == $route.query.id || auth.data.isAdmin" type="button" @click="modifyUser(this.user.id)"><fa class="fa-save" icon="save"></fa></button>
						</div>
					</div>
				</div>
				<!-- Code d'axé   -->
				<div class="card__log" v-if="this.btnAxisCode">
					<div class="card__log__identity">
						<p>Entrez votre indentifiant</p>
						<div class="flex-row">
							<label for="email">Email</label>
							<input type="text" id="email"	name="email" required v-model="form.email" />
						</div>
						<div class="flex-row">
							<label for="password">Password</label>
							<input type="password" id="password" name="password" required v-model="form.password"	/>
						</div>
					</div>
					<div class="card__log__change">
						<div class="flex-row">
							<label for="email">Nouvel email</label>
							<input type="text" id="newEmail" name="email" required v-model="form.newEmail"	/>
						</div>
						<div class="flex-row">
							<label for="repeatedEmail">Répéter email</label>
							<input type="text" id="repeatedEmail" name="repeatedEmail" required v-model="form.repeatedEmail"	/>
						</div>
						<button v-if="auth.data.id == $route.query.id || auth.data.isAdmin" class="btn" type="button" @click="modifyEmail(this.auth.data.id)"> Modifier email	</button>
						<hr />
						<div class="flex-row">
							<label for="newPassword">Nouveau pass</label>
							<input type="password" id="newPassword" name="newPassword" required v-model="form.newPassword"	/>
						</div>
						<div class="flex-row">
							<label for="repeatedPassword">répéter pass</label>
							<input type="password" id="repeatedPassword" name="repeatedPassword" required v-model="form.repeatedPassword"/>
						</div>
						<button v-if=" auth.data.id == $route.query.id || auth.data.isAdmin" class="btn" type="button" @click="modifyPassword(this.auth.data.id)"> Modifier password	</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'User',
	data() {
		return {
			auth: {
				data: {
					id: null,
					token: null,
					isAdmin: null,
				},
			},
			user: {
				firstName: '',
				lastName: '',
				pseudo: '',
				email: '',
				bio: '',
				avatar: '',
				password: '',
				isAdmin: '',
			},
			form: {
				newEmail: '',
				repeatedEmail: '',
				newPassword: '',
				repeatedPassword: '',
			},
			selectedFile: null,
			btnAxisCode: false,
			textAxisCode: "Changer le code d'axé",
			output:'',
		};
	},
	created() {
		this.fetchData();
	},
	mounted() {
		if (localStorage.auth) {
			this.auth = JSON.parse(localStorage.auth);
			if (this.$route.query.id == null) {
				console.log(this.auth.data.id);
				this.$route.query.id = this.auth.data.id;
			}
			this.getUser(parseInt(this.$route.query.id));

		}
	},
	watch: {
		auth(newAuth) {
			localStorage.auth = JSON.stringify(newAuth);
		},
		//
		//  '$route': 'fetchData'
	},
	methods: {
		fetchData() {
			console.log(this.$route.query);
		},

		viewAxisCode() {
			this.btnAxisCode = 1 - this.btnAxisCode;
			if (this.btnAxisCode == true) {
				this.textAxisCode = 'Retour au Profile';
			} else {
				this.textAxisCode = "Retour au code d'axé";
			}
		},
		getUser(userId) {
			// Params
			// console.log(document.location.href.split(document.location.pathname)[0]);
			// console.log(document.location.port);
			// console.log(document.location.protocol);
			//console.log(document.location.origin);

			var key = 'http://localhost:3000/api/users/user-profile/' + userId;
			axios
				.get(key, {
					headers: {
						Authorization: 'Bearer ' + this.auth.data.token,
					},
				})
				.then((response) => {
					this.user = response.data;
					
				})
				.catch((err) => console.log(err));
		},
		onFileSelected(event) {
			this.selectedFile = event.target.files[0];
			this.output = document.getElementById('output');
			this.output.src = URL.createObjectURL(event.target.files[0]);
		},
		modifyUser(userId) {
			
			const fileData = new FormData();

			fileData.append('firstName', this.user.firstName);
			fileData.append('lastName', this.user.lastName);
			fileData.append('pseudo', this.user.pseudo);
			fileData.append('bio', this.user.bio);
			
			try {
				fileData.append(
					'image',
					this.selectedFile,
					this.selectedFile.name
				);
			} catch {
				console.log("pas d'image");
			}

			for (var value of fileData.values()) {
				console.log('->',value);
			}
			
			axios
				.put(
					`http://localhost:3000/api/users/modify-profile/${parseInt(userId)}`,
					fileData,
					{
						headers: {
							//"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${this.auth.data.token}`,
						},
					}
				)
				.then((response) => {
					console.log(response);
					this.$emit('modifyUser', { newAvatar: this.selectedFile})
					window.location.href = document.location.href;
				})
				.catch((err) => console.log(err));
		},
		modifyEmail(userId) {
			console.log(this.user);
			if (this.form.newEmail === this.form.repeatedEmail) {
				axios
					.put(
						`http://localhost:3000/api/users/modify-email/${userId}`,
						{
							email: this.form.email,
							password: this.form.password,
							newEmail: this.form.newEmail,
						},
						{
							headers: {
								// "Content-Type": "multipart/x-www-form-urlencoded",
								Authorization: `Bearer ${this.auth.data.token}`,
							},
						}
					)
					.then(() => {
						window.location.href = document.location.href;
					})
					.catch((err) => console.log(err));
			} else {
				console.log('Error email');
			}
		},
		modifyPassword(userId) {
			if (this.user.newPassword === this.user.repeatedPassword) {
				console.log(this.form);
				axios
					.put(
						`http://localhost:3000/api/users/modify-password/${userId}`,
						{
							email: this.form.email,
							password: this.form.password,
							newPassword: this.form.newPassword,
						},
						{
							headers: {
								// "Content-Type": "multipart/x-www-form-urlencoded",
								Authorization: `Bearer ${this.auth.data.token}`,
							},
						}
					)
					.then(() => {
						localStorage.removeItem('auth');
						window.location.href = document.location.href;
					})
					.catch((err) => console.log(err));
			} else {
				console.log('Error password');
			}
		},
		deleteUser(userId) {
			var key =
				'http://localhost:3000/api/users/delete-profiles/' + userId;

			axios
				.delete(key, {
					headers: {
						Authorization: 'Bearer ' + this.auth.data.token,
					},
				})
				.then((response) => {
					console.log(response);
					localStorage.removeItem('auth');
					window.location.href=document.location.origin;
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>

<style scoped lang="scss">
#app {
	width: 100%;
}
.card {
	display:flex;
	justify-content: center;
	flex-direction: column;
	width: 100%px;
	margin: 0px auto;
	background-color: white;
	box-shadow: 0px 5px 20px #999;
	&__submenu{
		display:flex;
		justify-content: space-between;
	}
	&__profile{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		&__avatar{
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
		}
		
		#avatar {
			display: flex;
			justify-content: center;
			max-width: 280px;
			max-height: 280px;
			object-fit: contain;
			border-radius: 5%;
		}
		#output {
			display: flex;
			justify-content: center;
			max-width: 280px;
			max-height: 280px;
			object-fit: contain;
			border-radius: 5%;
		}
		&__btn{
			display: flex;
			justify-content: center;
		}
	}
	&__log{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: stretch;
		width: 100%;
		&__identity, &__change{
			border: 1px solid;
			min-width: 320px;
			& > p{
				margin: 20px;
			}
		}
	}
}

.flex-row {
	margin: 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	& >label{
			margin: 10px;
	}
}

</style>
