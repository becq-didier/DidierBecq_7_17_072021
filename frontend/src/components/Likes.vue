<template>
	<div id="card-like">
		<fa  v-bind:id="['up' +  IdMessage]" class="fa-thumbs-up" icon="thumbs-up" @click="putLike(IdUser,IdMessage,Token)"/>
		<span v-bind:id="['like' + IdMessage]" >0 </span>
		<fa  v-bind:id="['down' +  IdMessage]" class="fa-thumbs-down" icon="thumbs-down" @click="putDislike(IdUser,IdMessage,Token)"/>
		<span v-bind:id="['dislike' +IdMessage]">0 </span>
		
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data(){
			return{
			}
		},
		props: ['IdMessage','IdUser','IdUserMessage','Token'],
		mounted(){
			//count
			this.getLikes(this.IdMessage,this.Token);
			this.getDislikes(this.IdMessage,this.Token)
			//display color thumb
			this.getLikeDislike(this.IdUser,this.IdMessage,this.Token);
		},
		methods:{
			getLikes(messageId,token) {
				var key = 'http://localhost:3000/api/Likes/idMessages/' + messageId + '/like';
				axios
					.get(key, {
						headers: {Authorization: 'Bearer ' + token},
					})
					.then((response) => {
						if(response.data.rows[0]){
							console.log(response.data);
							document.getElementById(`like${ response.data.rows[0].messageId}`).textContent = response.data.count ;
							return response.data.count;
						}else{
							return 0;
						}
					})
					.catch((err) => {console.log(err);});
			},
			getDislikes(messageId,token) {
				var key ='http://localhost:3000/api/likes/idMessages/' + messageId + '/dislike';
				axios
					.get(key, {
						headers: {Authorization: 'Bearer ' + token},
					})
					.then((response) => {
						if(response.data.rows[0]){
							document.getElementById(`dislike${ response.data.rows[0].messageId}`).textContent = response.data.count ;
						return response.data.count;
						}else{
							return 0;
						}
					})
					.catch((err) => console.log(err));
			},
			getLikeDislike(userId,messageId,token) {
				var key = 'http://localhost:3000/api/Likes/IdUser/' +userId + '/IdMessages/' + messageId + '/viewLikeDislike';
				axios
					.get(key, {
						headers: {Authorization: 'Bearer ' + token},
					})
					.then((response) => {
						if (response.data.isLike==1){
							document.getElementById(`up${messageId}`).classList.toggle('up');
						}
						if (response.data.isLike==-1){
							document.getElementById(`down${messageId}`).classList.toggle('down');
						}
						return response.data.isLike;
					})
					.catch((err) => {console.log(err);});
			},
			putLike(userId,messageId,token) {
					var key = 'http://localhost:3000/api/Likes/IdMessages/'+ messageId +'/IdUser/'+userId +'/like';
					console.log(token)
				axios
					.post(key,  {Accept: 'application/json'},{
						'Content-Type': 'application/json',
						headers: {Authorization: 'Bearer ' + token},
					})
					.then((response) => {
							window.location.href=document.location.href//+"/Publication?messageId="+messageId	
						// document.getElementById(`up${messageId}`).classList.toggle('up');
						return response.data;
					})
					.catch((err) => {console.log(err);});
			},	
			putDislike(userId,messageId,token) {
					var key = 'http://localhost:3000/api/Likes/IdMessages/'+ messageId +'/IdUser/'+userId +'/dislike';
					console.log(token)
				axios
					.post(key,  {Accept: 'application/json'},{
						'Content-Type': 'application/json',
						headers: {Authorization: 'Bearer ' + token},
					})
					.then((response) => {
					window.location.href=document.location.href//origin+"/Publication?messageId="+messageId	
						return response.data;
					})
					.catch((err) => {console.log(err);});
			}
		}
	}
</script>

<style scoped lang="scss">
.up{
	margin: 0 10px;
	color: green;
}
.down{
	margin: 0 10px;
	color: red;
}
</style>