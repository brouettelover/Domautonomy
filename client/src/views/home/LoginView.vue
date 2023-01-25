-<template>
<form class="form-signin" @submit.prevent="loginUser">
  <div class="imgcontainer">
    <img src="@/assets/img/logo.png" alt="Logo" class="logo">
  </div>

  <div class="container">
    <label for="uname"><b>Email</b></label>
    <input type="text" placeholder="Entrez votre adresse mail" name="email" pattern="(?=[a-z]).{4,}"  v-model="email" required>

    <label for="psw"><b>Mot de passe</b></label>
    <input type="password" placeholder="Entrez votre mot de passe" name="password" v-model="password" required>
    <button type="submit" class="button_sub">Login</button>
    <span class="psw"><a href="/lost">Mot de passe oublié?</a></span>
    <span class="register"><a href="/register">S'enregistrer</a></span>
    <span class="devblog"><a href="https://arthurdraye.xyz">Blog</a></span>
  </div>

</form>
</template>
<style scoped>
  @import '@/assets/css/login.css';
</style>

<script>
import axios from 'axios'
import setAuthHeader from '@/utils/setAuthHeader'

export default {
  name: 'LoginView',
  data () {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async loginUser () {
      try {
        axios.post('https://domautonomy.one:3100/api/login', {
          email: this.email,
          password: this.password
        })
          .then(response => {
            const token = response.data.token
            localStorage.setItem('jwt', token)
            if (token) {
              setAuthHeader(response.data.token)
              this.$swal('Success', 'Login Successful', 'success')
              this.$router.push('/dashboard')
            }
          })
          .catch(e => {
            this.$swal('Error', 'Utilisateur/mot de passe incorrect', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    }
  }
}
</script>
