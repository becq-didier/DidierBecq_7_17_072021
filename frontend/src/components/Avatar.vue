<template>
	<div class="user">
		<div class="user__avatar">
			{{Avatar}}
			<!-- {{$store.state.auth}} -->
			<a :href="['/Profile?id='] +IdUser">
			<img :src="Avatar" alt="Avatar user" />
			</a>
		</div>
		<div class="user__pseudo">
			<p v-if='Pseudo == "null"'>{{ Email }}</p>
			<p v-else>{{ Pseudo }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "User",
	props: ['IdUser','Avatar','Pseudo','Email'],
	data() {
		return {
			auth: {
				data: {
					id: null,
					token: null,
					isAdmin: null,
				},
			}
		}
	},
	mounted() {
			if (localStorage.auth) {
				this.auth = JSON.parse(localStorage.auth);			}
	}
}


</script>

<style scoped lang="scss">
.user {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	&__avatar{
		align-items: flex-end;
		img {
			margin: 5px;
			overflow: hidden;
			object-fit: cover;
			border-radius: 50%;
			border: 8px ridge rgb(127, 168, 255);
			width: 50px;
			height: 50px;
			&:hover {
				border: 8px ridge  rgb(103, 208, 203);
			}
		}
	}
	&__pseudo {
		justify-content: flex-end;
			& p{
				padding: 0  10px ;
				background-color: white;
				border-radius:50px ;
			}
	}
}
</style>