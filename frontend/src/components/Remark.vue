<template>
	<div class="remark">
		<div class="remark__title">
			<label v-if="addRemark" for="remark">Postez votre commentaire </label>
			<button v-if="addRemark" class='btn' @click="btnRemark()" type="button"><fa class="fa-times-circle" icon="times-circle"></fa></button>
			<button v-else class='btn' @click="btnRemark()" type="button">Ajouter commentaire</button>
		</div>
		<div class="remark__text" v-if="addRemark">
			<textarea v-model='remark.remark' type="text" name="remark" id="remark" rows="" cols=""></textarea>
			<button class="btn" @click="saveRemark(IdMessage,IdUser,Token)" type="button"><fa  class="fa-save" icon="save"/></button>
		</div>
	</div>
</template>

<script>

import axios from "axios";

export default {
	data(){
		return{

			addRemark:false,
			remark:{
				remark:null,

			}
		}
	},
props: ['IdMessage','IdUser','Token'],
methods:{
	btnRemark(){
		if(!this.addRemark){
			this.addRemark=true;
		}else{
			this.addRemark=false;
		}
	},
	mounted() {
		if (localStorage.auth) {
			this.auth = JSON.parse(localStorage.auth);
		}	
	},
	saveRemark(messageId,userId,token){
		var key = 'http://localhost:3000/api/remarks/IdMessage/'+messageId;
		console.log(key);
		console.log(messageId);
		console.log(userId);
		axios
			.post(key,this.remark, {
				headers: {Authorization: 'Bearer ' + token},
			})
			.then((response) => {
				window.location.href = document.location.origin + '/Publication?messageId=' + messageId ;
				console.log("ok",response);
			})
			.catch((err) => console.log(err));
	},
}
}
</script>


<style scoped lang="scss">

.remark{
	&__title, label{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		& label{
			height: 50px;
			display: flex;
			align-items: center
		}
	}
	&__text{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		& textarea{

			padding: 10px;
			width: 100%;
			line-height: 1.5;
			border-radius: 5px;
			border: 1px solid #ccc;
			box-shadow: 1px 1px 1px #999;
		}
	}

}
</style>