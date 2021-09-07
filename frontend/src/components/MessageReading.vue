<template>
<div id="MessageReading">
	<button v-if="modePublication" @click="changeMode()" type="button" class="btn"><fa class="fa-pencil-alt" icon="pencil-alt"></fa></button>
	<button v-else @click="changeMode()" type="button" class="btn"><fa class="fa-eye" icon="eye"></fa></button>
		<div v-if="message!=null" >
			<div class="container">
				<div class="card" v-if="modePublication">
					<div class="card__message">
						<div class="card__message__user">
							<a class="card__message__user__avatar">	
								<img 	:src="message.User.avatar" alt="Avatar user" />
								<!-- <img v-else	id="avatar-default"	alt="Avatar par default" src="@/assets/avatar.png"/> -->
							</a>
							<div class="card__message__user__pseudo">
								<p v-if='!message.User.pseudo'>{{ message.User.pseudo }}</p>
								<p v-else>{{ message.User.email }}</p>
							</div>
						</div>
						<MessageTrash class="card__message__delete" v-if="auth.data.userId == $route.query.id ||	auth.data.isAdmin"  :Token="auth.data.token" :IdUser="auth.data.id" :IdUserMessage="message.User.id" :IdMessage="message.id"  />
						<h3 class="card__message__title">{{ message.title }}</h3>
						<div id="card-image" class="card__message__image" @click="fullScreen()">
							<img  :src="message.attachment" alt="image du message"/>
						</div>
						<Likes class="card__message__like" :Token="auth.data.token" :IdMessage="message.id"  :IdUser="auth.data.id" />
					</div>
					<div class="card__remark">
						<div  class="card__remark__content">
							<p>{{ message.content }}</p>
						</div>
						<Remark :Token="auth.data.token" :IdUser="auth.data.id" :IdMessage="message.id" />
						<div class="card__remark__items" v-for="item in remark" :key="item">
							<p v-if="item.user.pseudo!='null' ">{{ item.user.pseudo }}:</p>
							<p v-else>{{  item.user.email }}:</p>
							<p>"{{ item.remark }}"</p>
							<RemarkUpdate class="unvisible" v-if="auth.data.id==item.user.id||	auth.data.isAdmin" :IdRemark="item.id" :IdUser="auth.data.id" :Token="auth.data.token" :IdMessage="item.message.id" :RemarkContent="item"/>
							<RemarkTrash class="unvisible" v-if="auth.data.id==item.user.id||	auth.data.isAdmin" :IdRemark="item.id" :Token="auth.data.token" :IdUser="item.user.id" :IdMessage="item.message.id" />
						</div>
					</div>
				</div>
				<div v-else class="card-modify" >
					<div  class="card-modify__image">
						<div class="card-modify__image__input">
							<label for="newAttachmentt">Choissez une nouvelle image</label>
							<input  id='newAttachmentt' v-if="auth.data.userId == $route.query.id ||	auth.data.isAdmin" type="file" @change="onFileSelected"/>
						</div>
						<div class="card-modify__image__img">
							<div class="card-modify__image__img__attachment">
								<input  :src="message.attachment" id="attachment" name="attachment" type="image">
								<span  class="current">image actuelle</span>
							</div>
							<img :src="message.attachment" id="output"/>
						</div>
					</div>
					<div class="card-modify__message">
						<div class="card-modify__message__title">
							<label for="title">Changer le titre: </label>
							<input v-model="message.title" id="title" name="title" type="text">
						</div>
						<div class="card-modify__message__content">
							<label for="title">Changer le contenu: </label>
							<textarea v-model="message.content" name="content" id="content" cols="" rows=""></textarea>
						</div>
						<div>
							<button class='btn' @click="modifyMessage(message.id)" type="button">Valider les modifications</button>
						</div>
					</div>
				</div>
			</div>
		</div>
</div>
</template>

<script>
import axios from 'axios';
import MessageTrash from '@/components/MessageTrash.vue'
import Remark from '@/components/Remark.vue'
import RemarkTrash from '@/components/RemarkTrash.vue'
import Likes from '@/components/Likes.vue'
import RemarkUpdate from './RemarkUpdate.vue';
export default {
//	name: 'MessageReading',
	data() {
		return {
			auth: {
				data: {
					id: null,
					token: null,
					isAdmin: null,
				},
			},

			message: null,
			remark: null,
			likes: '',
			modePublication:true,
			output:'',
		};
	},
		
	components:{
		MessageTrash,
		Remark,
		RemarkTrash,
		Likes,
		RemarkUpdate,
	},
	created() {
		// récupérer les données lorsque la vue est créée et
		// que les données sont déjà observées
		this.fetchData();
	},
	
	mounted() {

		//console.log("chemin",this.$route.query.messageId);
		if (localStorage.auth) {
			this.auth = JSON.parse(localStorage.auth);
			//console.log('messageId et userId',parseInt(this.$route.query.messageId),this.auth.data.id);
			this.getMessageId(parseInt(this.$route.query.messageId));
			this.getRemarkMessageIdUserId(this.$route.query.messageId,this.auth.data.id)
		}

	
		
	},
	watch: {
			// call again the method if the route changes
			'$route': 'fetchData'
  },
	methods: {
		fetchData() {
		const fetchedId = this.$route.params.id;
		console.log(fetchedId);
	},
		changeMode() {
			console.log(this.modePublication)
			if (this.modePublication==true){
				this.modePublication=false;
		} else {
				this.modePublication=true;
		}
	},
		getMessageId(messageId) {
			//console.log(messageId, this.auth.data.id);
			var key = 'http://localhost:3000/api/messages/IdMessage/' + messageId + '/user/' + this.auth.data.id;
			//console.log(key + '\n ' + this.auth.data.token);
			axios
				.get(key, {
					headers: {Authorization: 'Bearer ' + this.auth.data.token},
				})
				.then((response) => {
					//console.log('-----------', response.data);
					this.message = response.data;
					return response.data;
				})
				.catch((err) => console.log(err));
		},
		getRemarkMessageIdUserId(messageId, userId) {
			var key ='http://localhost:3000/api/remarks/IdMessage/' + messageId + '/IdUser/' + userId;
			axios
				.get(key, {
					headers: {Authorization: 'Bearer ' + this.auth.data.token},
				})
				.then((response) => {
					//console.log('json', response.data);
					this.remark=response.data
					return response.data
				})
				.catch((err) => console.log(err));
		},
			onFileSelected(event) {
			this.selectedFile = event.target.files[0];
			this.output = document.getElementById('output');
			this.output.src = URL.createObjectURL(event.target.files[0]);
		},
		modifyMessage(messageId) {
			console.log(this.auth.data);
			console.log("-----",this.message.title,this.message.content);

			const fileData = new FormData;
			fileData.append("title",this.message.title);
			fileData.append("content",this.message.content);
			try {
			fileData.append(
				'image',
				this.selectedFile,
				this.selectedFile.name
			);
			} catch {
				console.log('pas de file image');
			}
		

			for (var value of fileData.values()) {
				console.log(value);
			}
				
			var key="http://localhost:3000/api/messages/user/" + parseInt(this.message.User.id)  + "/message/" + parseInt(messageId)
			console.log(key);
			axios
				.put(key,fileData,
					{
						headers: {
							//"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${this.auth.data.token}`,
						},
					}
				)
				.then((response) => { () => {
					console.log(response)}
					window.location.href=document.location.origin+"/Publication?messageId="+messageId	
				})
				.catch((err) => console.log(err))
			},
			fullScreen(){
				document.getElementById('card-image').classList.toggle('overlay');
			
			},
	}
}

</script>
<style scoped lang="scss">
#MessageReading{
	position: relative;
	& >button{
		position: absolute;
		top:0;
		right: 50px;
		z-index: 100;
	}
}

.card {
	padding: 30px;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;

	background-color: white;
	box-shadow: 0px 5px 20px #999;
	width: 100%;
	&__message{
		&__user{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			overflow: hidden;

			& a img{
				border-radius: 50%;
				border: 8px ridge rgb(127, 168, 255);
				width: 100px;
				height: 100px;
				object-fit: contain;
			}	
		}
		&__delete{
			position: absolute;
			top:0;
			right: 10px;
		}
		&__title{
			text-align: center;
		}
		&__image img{
			width: 280px;
		}
		&__like{
			text-align: center;
			width: 100%;
			background-color: lightgray;
			padding: 10px;
			margin: 20px 0;
		}
	}
	&__remark{
		max-width: 100%;
		&__content{
			display: flex;
			justify-content: center;
			background-color: rgb(160, 189, 179);
			border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
			border:solid 2px rgb(75, 81, 95);
		}
		&__items{
			position: relative;
			padding:  5px;
			& p{
				word-break: break-word;
				white-space: normal;
				overflow: hidden;

				padding-right: 40px;
			}
			&:nth-child(2n+1){
				background-color: rgb(127, 168, 255);;
				border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
				border:solid 2px rgb(75, 81, 95);
			}
			&:nth-child(2n){
				background-color: rgb(127, 189, 255);
				border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
				border:solid 2px rgb(75, 81, 95);
			}
			& .Remark-trash{
				top:0;
				right: 5px;
				position: absolute;

			}	
			// &:hover > .unvisible{
			// 		display:block;
			// 	}
			// & .unvisible{
			// 	display: none;
			
			// }
		}
		

	}
}


.card-modify{
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	&__image{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		&__img input,img{
			width:250px;
		}
		&__img {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			&__attachment{
				position: relative;

			& > span{
				font-weight:900 ;
				opacity: 1;
				transform: rotate(45deg) scale(2);
				color: rgb(21, 63, 153);
				position: absolute;
				top:50%;
				left:25%;
				}
			}
		}
	}
}
.overlay {
	&#card-image{
		display: block;
		background: rgba(0, 0, 0, 0.679);
		text-align: center;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: auto;
		height: auto;
		margin: auto;
		z-index: 100;
		& img{
			width: auto;
			height: 100%;
		}
	
	}
}

</style>
