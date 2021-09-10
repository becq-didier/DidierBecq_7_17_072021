<template>
<div v-if="auth.data.id" id="MessageWritting">
			<div >
			<div class="container2">
				<div class="card">
					<div class="card__message">
								<span id="info"></span>
								<div class="card__message__title">
									<label for="title">Titre: </label>
									<input @input="checkTitre" v-model="message.title" id="title" name="title" type="text">
								</div>
								<div class="card__message__content">
									<label for="content">Message:</label>
									<textarea @input="checkMessage" v-model="message.content" type="testarea" name="content" id="content" rows='' cols=""/>
								</div>
								<div class="card__message__image">
									<label for="attachment">Image de la publication:</label>
									<input :src="message.attachment" id="attachment" name="attachment" type="file"  @change="onFileSelected">
									<!-- <img v-if="!output.src" id="avatar" alt="Avatar" :src="message.attachment"/> -->
									<img id="output"/>
								</div>
								<div class="card__message__valid">
									<button class="card__message__btn btn" @click="createMessage()"  type='button'>Valider</button>
								</div>
					</div>
				</div>
			</div>
		</div>
</div> 
</template>


<script>

import axios from 'axios';

export default {
	data() {
		return {
			auth: {
				data: {
					id: null,
					token: null,
					isAdmin: null,
				},
			},

			message: {
				title:'',
				attachment:'',
				content:'',
			},
			output:null,
			errors:{
				valide_title:false,
				valide_message:false,
				valide_image:false,
			}
		};
	},
	mounted() {
		if (localStorage.auth) {
			this.auth = JSON.parse(localStorage.auth);
		}	
	},
	methods:{
		checkTitre(){
			console.log(this.message.title.length)
			if(this.message.title.length >=16){
				document.getElementById('title').classList='alert'
				document.getElementById('info').innerText="Titre superieur à 16 caractères!"
			}else{
				document.getElementById('title').classList.remove('alert')
				document.getElementById('info').innerText=""
			}
		},
		checkMessage(){
			if(this.message.content.length >=255){
				document.getElementById('content').classList='alert'
				document.getElementById('info').innerText="Message superieur à 255 caractères!"
			}else{
				document.getElementById('content').classList.remove('alert')
				document.getElementById('info').innerText=""
			}
		},
		onFileSelected(event) {
			this.selectedFile = event.target.files[0];
			this.output = document.getElementById('output');
			this.output.src = URL.createObjectURL(event.target.files[0]);
		},
		createMessage(){
		if(!this.selectedFile){
				this.errors.valide_image=false
				document.getElementById('info').innerText="Manque image!"
			}else{
					this.errors.valide_image=true
					document.getElementById('info').innerText=""
			var key = 'http://localhost:3000/api/messages/' + this.auth.data.id;

			const fileData =new FormData;

			fileData.append('title',this.message.title);
			fileData.append('content',this.message.content);
			
			fileData.append(
				'image',
				this.selectedFile,
				this.selectedFile.name
			);


			axios
				.post(key,fileData, {
					headers: {Authorization: 'Bearer ' + this.auth.data.token},
				})
				.then((response) => {
					window.location.href= document.location + '/?messageId=' +response.data.message.id;
					console.log("ok");
				})
				.catch((err) => console.log(err));
			}
		},
	}
}

</script>

<style scoped lang="scss">
.card{
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
		background-color: white;
	box-shadow: 0px 5px 20px #999;
	padding: 20px;
	width: 280px;
	&__message{
		&__title{
			margin: 10px 0;
			display: flex;
			flex-direction:row;
			justify-content:space-between
		}
		&__content{
			margin: 10px 0;
			display: flex;
			flex-direction:row;
			justify-content: space-between;
			width: 100%;
		}
		&__image{
			margin: 10px 0;
			display: flex;;
			flex-direction:column;
			justify-content: space-between;
			& > input{
				margin: 10px 0;
				padding: 0;
			display: flex;;
			flex-direction:column;
					justify-content: space-around;
			}
			& img{
				width: 100%;
			}
		}
		&__valid{
			display: flex;
			flex-direction:row;	
		}
	}
}

.alert{
	box-shadow: 0 0 10px 1px red;
}
</style>