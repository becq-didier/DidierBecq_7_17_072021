<template>
	<div id="Messages" v-if="messages !== null">
		<div class="Messages__card" v-for="item in messages" :key="item.id">
			<div class="Messages__card__avatar">
				<Avatar :IdUser="item.User.id" :Avatar="item.User.avatar" :Pseudo="item.User.pseudo" :Email=" item.User.email"/>
			</div>
			<div class="Messages__card__message">
				<a :href="[`${url}`] + item.id">
					<div class="Messages__card__message__image">
						<img class="img-msg" :src="item.attachment" alt="image du message" />
					</div>
					<div class="Messages__card__message__title">
							<h3>{{ item.title }}</h3>
					</div>
					<div class="Messages__card__message__content">
							<p>{{ item.content }}</p>
					</div>
				</a>
			</div>
			<div class="Messages__card__like">
				<Likes :Token="auth.data.token" :IdMessage="item.id" :IdUser="auth.data.id" />
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import Likes from '@/components/Likes.vue'
import Avatar from '@/components/Avatar.vue'

export default {
	name: "Login",
	props: {
		msg: String,
	},
	data() {
		return {
			auth: {
				data: {
					id: null,
					token: null,
					isAdmin: null,
				},
			},
			messages: {},
			likes:"",
			url : window.location.protocol +  "/Publication?messageId=" ,
		};
	},
	components:{
		Likes,
		Avatar,
	},
	mounted() {
		if (localStorage.auth) {
			this.auth = JSON.parse(localStorage.auth);
			this.getAllMessages();
		}
	},
	watch: {
		auth(newAuth) {
			localStorage.auth = JSON.stringify(newAuth);
		},
	},
	methods: {
		getAllMessages() {
			var key = "http://localhost:3000/api/messages/all/" + this.auth.data.id;
			axios
				.get(key, {
					headers: { Authorization: "Bearer " + this.auth.data.token },
				})
				.then((response) => {
					this.messages = response.data;         
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
<style scoped lang="scss">
#Messages{
	display: flex;
	flex-direction:row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width:100%;
	overflow: hidden;
	& .Messages__card{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 320px;
		box-shadow: 0px 5px 20px #999;
		margin: 10px;
		&__avatar{
			position: absolute;
		}
		&__message{
			& > a{
				text-decoration: none;
				color: inherit;
			}
			&__image img{
				margin: 20px;
				width: 280px;
				&:hover {
					border: 1px ridge rgb(103, 208, 203);
				}
			}

			&__content p{
				display: block;
				overflow:hidden;
				text-overflow: ellipsis;
				width: 280px;
				white-space: nowrap;
				margin: 10px;
			}
		}
		&__like{
			background-color: lightgray;
			padding:  20px;
			width: 100%;
		}
	}
}
</style>
