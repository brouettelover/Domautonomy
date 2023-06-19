<template>
<div id="arroseur_main">
  <h1>Arroseur</h1>
  <hr>
  <div class="input-group mb-3 flex">
      <div class="d-flex">
          <input type="text" class="form-control water_input" placeholder="t en sec" aria-label="t en sec" aria-describedby="basic-addon2" v-model="duree">
      </div>
      <div class="d-flex">
          <button class="water_btn btn btn-outline-secondary" type="button" v-on:click="ArroseurDuree">Envoie durée</button>
      </div>
  </div>
  <div class="input-group mb-3 flex">
      <div class="d-flex">
          <input type="text" class="form-control water_input" placeholder="Intervalle entre 2 envoies" aria-label="Intervalle entre 2 envoies" aria-describedby="basic-addon2" v-model="delai">
      </div>
      <div class="d-flex">
          <button class="water_btn btn btn-outline-secondary" type="button" v-on:click="ArroseurDelai">Envoie délai</button>
      </div>
  </div>
  <div class="input-group mb-3 flex">
      <div class="d-flex">
          <input type="text" class="form-control water_input" placeholder="Durée d'une activation de pompe" aria-label="Durée d'une activation de pompe" aria-describedby="basic-addon2" v-model="activation">
      </div>
      <div class="d-flex">
          <button class="water_btn btn btn-outline-secondary" type="button" v-on:click="ArroseurEnvoie">Envoie activation</button>
      </div>
  </div>
  <hr>
</div>
</template>
<style scoped>
  @import '@/assets/css/arroseur.css';
</style>
<script>
import axios from 'axios'
import SocketioService from '@/services/socketio.service.ts'

export default {
  name: 'FrigoComp',
  data () {
    return {
      activation: null,
      delai: null,
      duree: null
    }
  },
  methods: {
    async ArroseurEnvoie() {
      try {
        axios.post('https://domautonomy.one:3100/api/modules/arroseur/activation', {
          activation: this.activation
        })
          .then(response => {
            location.reload()
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    },
    async ArroseurDelai() {
      try {
        axios.post('https://domautonomy.one:3100/api/modules/arroseur/delai', {
          delai: this.delai
        })
          .then(response => {
            location.reload()
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    },
    async ArroseurDuree() {
      try {
        axios.post('https://domautonomy.one:3100/api/modules/arroseur/duree', {
          duree: this.duree
        })
          .then(response => {
            location.reload()
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    }
  }
}
</script>