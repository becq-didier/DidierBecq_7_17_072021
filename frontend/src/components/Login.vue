<template>
  <div id="Login">
    <div v-if="auth.data.token == null" id="container">
      <form  @button="checkForm">
        <button id="btn-menu" @click="btnLoginRegister" type="button" class="btn" >
          <fa v-if=" btnTitle" class="fa-user-plus" icon="user-plus"></fa>
          <fa v-else class="fa-user-lock" icon="user-lock"></fa>
        </button>
        <h1>{{ msg }}</h1>

        <div class="email">
          <label for="email"><b>Email utilisateur</b></label>
          <input @input="validEmail(log.email)" v-model="log.email" id="email" type="email" placeholder="Entrer l'email utilisateur" name="email" required />
        </div>

        <div v-if="this.btnRegister" class="repeatEmail">
          <label for="repeatEmail"><b>Répétez email</b></label>
          <input @input="validRepeatEmail(log.repeatEmail)" v-model="log.repeatEmail" id="repeatEmail" type="email" placeholder="Entrer à nouveau l'email utilisateur" name="repeatEmail" required/>
        </div>
        <div class="password">
          <label for="password"><b>Mot de passe</b></label>
        
          <input @input="checkPassword(this.log.password)" v-model="log.password" id="password" type="password" placeholder="Entrer le mot de passe" name="password" required />
        </div>
        <div v-if="this.btnRegister" class="repeatPassword">
          <label for="repeatPassword"><b>Mot de passe</b></label>
          <input @input="checkRepeatPassword(this.log.repeatPassword)" v-model="log.repeatPassword" id="repeatPassword" type="password" placeholder="Entrer le mot de passe" name="repeatPassword" required />
        </div>
        <div v-if="this.btnRegister" class="checkPassword">
          <ul>
            <p v-if="!errors.valid_password">Password non valide</p>
            <li v-if="!errors.contains_eight_characters">Doit être compris entre 8 et 16 caractères</li>
            <li v-if="!errors.contains_number">Doit contenir un chiffre</li>
            <li v-if="!errors.contains_uppercase">Doit contenir une majuscule</li>
            <li v-if="!errors.contains_special_character">Doit contenir un caractere special</li>
            <li v-if="!errors.repeat_password">Les mots de passe doivent être indentiques</li>
          </ul>
        </div>
        <div class="flex-column">
          <button v-if="this.btnRegister == false" @click="connexion()" type="button" class="btn"><fa class="fa-sign-in-alt" icon="sign-in-alt"></fa></button>
          <button v-if="this.btnRegister == true" @click="userRegister()" type="button" class="btn" ><fa class="fa-share-square" icon="share-square"></fa></button>
        </div>
        <div id="info">{{ info }}</div>
      </form>
    </div>
    <div id='btn-off' v-if="auth.data.token !== null">
      <button id="connected" @click="deconnexion" type="button" class="btn-menu btn"><fa class="fa-user-times" icon="user-times"></fa></button>
    </div>
    <div  v-if="auth.data.token !== null" class="avatar">
      !!!{{auth.avatar}}
      <Avatar id="avatar-menu" :IdUser="auth.data.id" :Avatar="auth.data.avatar" :Pseudo="auth.data.pseudo" :Email=" auth.data.email"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Avatar from '@/components/Avatar.vue'

export default {
  name: 'Login',
  data() {
    return {
      log: {
        email: '',
        repeatEmail: '',
        password: '',
        repeatPassword: '',
      },
      auth: {
        data: {
          id: null,
          token: null,
          isAdmin: null,
          avatar:"",
          paseudo:"",
          email:"",
        },
      },
      AUTH_TOKEN: null,
      info: [],
      btnRegister: false,
      msg: 'Connexion',
      btnTitle: true,
      errors: {
        password: null,
        password_length: 0,
        contains_eight_characters: false,
        contains_number: false,
        contains_uppercase: false,
        contains_special_character: false,
        valid_password: false,
        repeat_password:false,
        valid_email:false,
        repeat_email:false,
      },
    };
  },
  components:{
    Avatar,
  },
  mounted() {
    if (localStorage.auth) this.auth = JSON.parse(localStorage.auth);
  },
  watch: {
    auth(newAuth) {
      localStorage.auth = JSON.stringify(newAuth);
      document.getElementById('nav').style.display="flex";
    },
  },

  methods: {
    checkPassword(password){
      this.errors.password_length = password.length;
      const format =/[#?!@$%^&*-]/;
      
      if (this.errors.password_length >= 8 && this.errors.password_length <=16) {
        this.errors.contains_eight_characters = true;
      } else {
        this.errors.contains_eight_characters = false;
      }
      
      this.errors.contains_number = /\d/.test(password);
      this.errors.contains_uppercase = /[A-Z]/.test(password);
      this.errors.contains_special_character = format.test(password);
      
      if (this.errors.contains_eight_characters === true &&
          this.errors.contains_special_character === true &&
          this.errors.contains_uppercase === true &&
          this.errors.contains_number === true){
            this.errors.valid_password = true;			
      } else {
        this.errors.valid_password = false;
      }
    },
    checkRepeatPassword(password){
      if (this.log.password==password){
        this.errors.repeat_password=true
      }else{
        this.errors.repeat_password=false
      }
    },
    validEmail(email){
      var valide = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!valide.test(email)){
        document.getElementById('email').classList.remove('valid')
        document.getElementById('email').classList='alert'
        this.errors.valid_email=false
      }else{
        document.getElementById('email').classList.remove('alert')
        document.getElementById('email').classList='valid'
        this.errors.valid_email=true
      }
      return valide.test(email);
    },
    validRepeatEmail(email){
      var valide = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!valide.test(email)){
        document.getElementById('repeatEmail').classList.remove('valid')
        document.getElementById('repeatEmail').classList='alert'
      } else if (this.log.email!=this.log.repeatEmail){
        document.getElementById('repeatEmail').classList.remove('valid')
        document.getElementById('repeatEmail').classList='alert'
        this.errors.repeat_email=false
      } else {
          document.getElementById('repeatEmail').classList.remove('alert')
          document.getElementById('repeatEmail').classList='valid'
          this.errors.repeat_email=true
      }
      return valide.test(email);
    },
    connexion() {

      axios
        .post('http://localhost:3000/api/users/login', this.log)
        .then((response) => {
          this.auth = response;

          //marche pas
          this.$store.state.auth.id=response.data.id;


          this.$store.state.auth.token=response.data.token
          this.$store.state.auth.isAdmin=response.data.isAdmin;
          const url =
            window.location.protocol + '//' + window.location.host;
          window.location.href = url;
        })
        .catch((err) => {
          document.getElementById('info').style.display = 'block';
          if	(!this.validEmail(this.log.email)){
            this.info ="Format d'email incorrect";
          }else{
            this.info ="Erreur d'identification"
          }
          console.log(err);
        });

      this.AUTH_TOKEN = this.auth.data.token;
    },
    deconnexion() {
      
      const url =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname;
      console.log(url);
      window.location.href = url;
      localStorage.removeItem('auth');
    },
    btnLoginRegister() {
      if (this.btnRegister) {
        this.btnRegister = false;
        this.btnTitle = true;
        this.msg = 'Connexion';
      } else {
        this.btnRegister = true;
        this.btnTitle = false;
        this.msg = 'Inscription';
      }
    },

    userRegister() {
      console.log(this.errors.valid_email , this.errors.repeat_email , this.errors.valid_password , this.errors.repeat_password)
      if (this.errors.valid_email &&
          this.errors.repeat_email &&
          this.errors.valid_password &&
          this.errors.repeat_password){

        const fileData = new FormData();
        fileData.append('email', this.log.email);
        fileData.append('password', this.log.password);
        fileData.append('isAdmin', false);

        fileData.append('image',"http://localhost:3000/images/avatar.png");
        // Request
        var key = 'http://localhost:3000/api/users/register';
        axios
          .post(key, fileData)
          .then((response) => {
            console.log(response);
            this.btnRegister = false;
            this.btnTitle = 'Enregistrez-vous';
            this.msg = 'Inscription';
            window.location.href= document.location.origin;
          })
          .catch((err) => {
            if(this.log.email!=this.log.repeatEmail){
              document.getElementById('info').style.display = 'block';
              this.info =	"Les emails sont différents";
            }
            console.log(err);
          });
      }else{
        document.getElementById('info').style.display = 'block';
        this.info =	"impossble de valider";
      }
    },
  },
};
</script>

<style scoped lang="scss">
#Login{
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  & .avatar{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:flex-start;
    width: 200px;
    height: auto;
    &> #avatar-menu{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content:center;
  } 
  }
}


#container{
  display: flex;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 4%;
  position: relative;
  & button#btn-menu {
    position: absolute;
      top: 10px;
      right: 10px;
  }
  }

form {
  padding: 30px;
  border: 1px solid #f1f1f1;
  background: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

#info {
  display: none;
  color: #fff;
  background: rgba(235, 103, 103, 0.75);
  padding: 10px;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  width: 300px;
  text-align: center;
  // position: absolute;
  z-index: 10;
  scale: (0);
}
.flex-column {
  display: flex;
  flex-direction: column;
  //width: 130px;
  align-items: center;
}

#btn-off{
  margin: 0 0px 0px 10px;
}

.avatar{
  width: 10px;
  height: 10px;
  &img{
    border: none;
    top:0;
  }
}

.alert{
  box-shadow: 0 0 10px 1px red;
}

.valid{
  box-shadow: 0 0 1px 1px rgb(0, 255, 115);
}
.checkPassword > ul> li, p{
  font-size: 0.8em;
}
</style>
