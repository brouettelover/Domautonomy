<template>
 <form class="form-signin"  @submit.prevent="registerUser">
  <div class="imgcontainer">
    <img src="@/assets/img/logo.png" alt="Logo" class="logo">
  </div>

  <div class="container">
        <label for="uname"><b>Nom de compte*</b></label>
        <input type="text" placeholder="Entrez votre nom de compte" name="username" pattern="(?=[a-z]).{4,}" v-model="register.username" required>
        <label for="psw"><b>Mail*</b></label>
        <input type="email" placeholder="Entrez votre adresse Mail" name="email" v-model="register.email" pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$" required>
        <label for="psw"><b>Mot de passe*</b></label>
        <input type="password" placeholder="Entrez votre mot de passe" name="password" id="password" v-model="register.password" required>
        <label for="psw"><b>Confirmation du Mot de passe*</b></label>
        <input type="password" placeholder="Entrez à nouveau votre mot de passe" name="password_confirm" id="password_confirm"  required>
        <button type="submit" class="button_sub">s'enregistrer</button>
        <span class="acceuil"><a href="/">Retour à l'acceuil</a></span>
    </div>
</form>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      register: {
        username: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async registerUser () {
      try {
        axios.post('https://domautonomy.one:3100/api/register', {
          name: this.register.username,
          email: this.register.email,
          password: this.register.password
        })
          .then(response => {
            const token = response.data.token
            if (token) {
              localStorage.setItem('jwt', token)
              this.$router.push('/')
              this.$swal('Success', 'Enregistrement complet', 'success')
            } else {
              this.$swal('Error', 'Something Went Wrong', 'error')
            }
          })
          .catch(e => {
            this.$swal('Error', e, 'error')
            console.log(e)
            this.$swal('Error', 'Problème d\'Enregistrement', 'error')
          })
      } catch (err) {
        const error = err.response
        if (error.status === 409) {
          this.$swal('Error', error.data.message, 'error')
        } else {
          this.$swal('Error', error.data.err.message, 'error')
        }
      }
    }
  }
}
</script>
