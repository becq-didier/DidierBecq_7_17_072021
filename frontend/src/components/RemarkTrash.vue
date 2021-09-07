<template>
	<div class="Remark-trash">
		<button class="btn" @click="deleteRemark(this.IdRemark,this.IdUser,this.Token,this.IdMessage)">	<fa class="fa-trash" icon="trash"/></button>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
			
			name: "MessageTrash",
			props: ['IdRemark','IdUser','Token','IdMessage'],

			methods:{

				deleteRemark(remarkId,userId,token,messageId){
						
						var key = 'http://localhost:3000/api/remarks/userId/'+ userId +'/IdRemark/' + remarkId;
						axios
							.delete(key, {
								headers: {Authorization: 'Bearer ' + token},
							})
							.then((response) => {
								console.log(response);
								window.location.href = document.location.origin + '/Publication?messageId=' + messageId ;
							})
							.catch((err) => {	console.log(err);});
				}
			},
	}
</script>

<style scoped lang="scss">
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