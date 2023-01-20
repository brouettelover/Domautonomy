<template>
   <div id="frigo_main">
    <h1>Frigo</h1>
    <div id="metrics">
        Température : {{ temperature }} °
        <br />
        Humidité : {{ humidity }} %
    </div>
   <button class="frigo_button" >Ajout carte RFID</button>
   <button class="frigo_button" v-on:click="OpenTheBox">Ouverture à distance</button>
   <br>
   <!-- <label for="Temperature-Minimal"  class="temp">Temperature-Minimal:</label>
   <select name="Temperature-Minimal" v-model="TempMin" class="temp">
    <option value="0">0</option>
    <option value="2">2</option>
    <option value="4">4</option>
   </select>
   <label for="Temperature-Maximal" class="temp">Temperature-Maximal:</label>
   <select name="Temperature Maximal" v-model="TempMax" class="temp">
    <option value="7">7</option>
    <option value="10">10</option>
    <option value="12">12</option>
   </select>
   <button class="frigo_button" v-on:click="AddAlarm">Ajout Alarme</button>
   <button class="frigo_button" v-on:click="removeAlarm">Supprimer Alarmes</button> -->
   <hr>
  </div>
</template>
<style scoped>
  @import '@/assets/css/frigo.css';
</style>
<script>
import axios from 'axios'
// import io from 'socket.io-client'

export default {
  name: 'FrigoComp',
  data () {
    return {
      temperature: 'NONE',
      humidity: 'NONE'
    }
  },
  mounted () {
    // this.socketInstance = io('https://domautonomy.one:3100/socket.io')
  },
  methods: {
    async OpenTheBox () {
      try {
        axios.get('/api/modules/frigo/open', {

        })
          .then(response => {
            this.$swal(response)
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    },
    async AddCard () {
      try {
        axios.get('/api/modules/frigo/addCard', {

        })
          .then(response => {
            this.$swal(response)
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    },
    async AddAlarm () {
      try {
        axios.post('/api/modules/frigo/addAlarm', {
          TempMin: this.TempMin,
          tempMax: this.TempMax
        })
          .then(response => {
            this.$swal('Success', 'Alarm Ajouté', 'Success')
          })
          .catch(e => {
            this.$swal('Error', 'Something Went Wrong', 'error')
          })
      } catch (err) {
        this.$swal('Error', 'Something Went Wrong', 'error')
        console.log(err.response)
      }
    },
    async removeAlarm () {
      try {
        axios.post('/api/modules/frigo/removeAlarm', {
        })
          .then(response => {
            this.$swal('Success', 'Alarm Supprimé', 'Success')
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
