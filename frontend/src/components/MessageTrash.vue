<template>
	<div class="app">
<i class="fi fi-ro-user"></i>
		<button class="btn" @click="deleteMessage(this.IdMessage,this.IdUser,this.IdUserMessage,this.Token)">	<fa class="fa-trash" icon="trash"/></button>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
			
		name: "MessageTrash",
		props: ['IdMessage','IdUser','IdUserMessage','Token'],
		methods:{
			deleteMessage(messageId,userId,MessageUserId,token){
					// console.log("messageId",messageId,"userId",userId,"MessageUserId",MessageUserId,token);
					var key = 'http://localhost:3000/api/messages/user/' + MessageUserId + '/message/' + messageId;
					axios
						.delete(key, {
								headers: {Authorization: 'Bearer ' + token},
						})
						.then((response) => {
					console.log(response);
					window.location.href = document.location.origin;
				})
					.catch((err) => {	console.log(err);});
			}
		},
		
	}
</script>

<style scoped  lang="scss">
.card{
	position: relative;
}
div .delete {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top:0;
	right: 0;
}
</style>