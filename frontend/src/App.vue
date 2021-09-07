<template>
	<div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/Publication">Publication</router-link> |
		<router-link to="/Profile">Profile</router-link> |
		<router-link to="/about">About</router-link>
		<Login />
		<router-view />
	</div>
</template>
<script>
// @ is an alias to /src
import Login from '@/components/Login.vue';

export default {
	name: 'App',
	components: {
		Login,
	},
	data() {
		return {};
	},
	methods: {
	},
};
</script>
<style lang="scss">


*{
	box-sizing: border-box;
}

#nav {
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	position: relative;
	
	&>a {
			text-decoration: none;
			font-weight: bold;
			color: #2c3e50;
			margin: 0 5px;
			padding: 5px;
			border-radius: 50px;
			border: 1px solid transparent;
			&.router-link-exact-active {
				// background-color: rgb(231, 250, 216);
					color: rgb(67, 77, 255);
					// border: 1px solid rgb(127, 168, 255);
			}
			&:hover{
					background-color: rgb(231, 250, 216);
					color: rgb(67, 77, 255);
					border: 1px solid rgb(127, 168, 255);
				}
	}
}


.btn,
input[type='file' i] {
	color: rgb(127, 168, 255);;
	border-color: rgb(127, 168, 255);;
	border-radius:5px;
	padding: 6px 8px;
	margin: 8px;
	border: 1px solid transparent;
	cursor: pointer;
	width: auto;
}
.btn:hover {
	background-color: rgb(231, 250, 216);
	color: rgb(67, 77, 255);
	border: 1px solid rgb(127, 168, 255);
}




</style>
