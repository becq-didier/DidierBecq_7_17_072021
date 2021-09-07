<template>
	<div class="Remark-update">
		<div class="remark__title">
			<label v-if="saveRemark" for="remark">Modifiez le commentaire </label>
			<button v-if="saveRemark" class='btn' @click="btnRemark()" type="button"><fa class="fa-times-circle" icon="times-circle"></fa></button>
			<button v-else class='btn' @click="btnRemark()" type="button"><fa class="fa-pencil-alt" icon="pencil-alt"></fa></button>
		</div>
		<div class="remark__text" v-if="saveRemark">
			<textarea v-model="remark.remark" type="text" name="remark" id="remark" rows="" cols=""></textarea>
			<button class="btn" @click="MAJ(this.IdRemark,this.IdUser,this.Token,this.IdMessage,this.remark)"><fa class="fa-save" icon="save"></fa></button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';

export default {
			
	name: "MessageTrash",
	data(){
		return{
			saveRemark:false,
			remark:	this.RemarkContent,

		}
	},
	props: ['IdRemark','IdUser','Token','IdMessage','RemarkContent'],

	methods:{
		btnRemark(){
			if(this.saveRemark){
				this.saveRemark=false;
			}else{
				this.saveRemark=true;
			}
		},
		MAJ(remarkId,userId,token,messageId,remark){
				var key = 'http://localhost:3000/api/remarks/userId/'+ userId +'/IdRemark/' + remarkId;
				
				
				axios
					.put(key,remark,{
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
.remark{
	&__text{
		display: flex;
		align-items: center;
		& textarea{
			width: 100%;
		}
	}
}

</style>