<template>
   <div id="frigo_main">
    <h1 class="display-4">Frigo</h1>
    <div id="metrics">
        Température : {{ temperature }} °
        <br />
        Humidité : {{ humidity }} %
    </div>
   <button class="btn btn-outline-warning" v-on:click="AddCard">Ajout carte RFID</button>
   <button class="btn btn-outline-danger" v-on:click="OpenTheBox">Ouverture à distance</button>
   <hr>
   <h3> Température alarme :</h3>
  <span class="input-group mb-3">
    <span class="input-group-prepend">
      <label class="input-group-text" for="inputGroupSelect01">Min</label>
    </span>
    <select class="custom-select" id="inputGroupSelect01" v-model="TempMin">
      <option selected>Choose...</option>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
    <span class="input-group-prepend">
      <label class="input-group-text" for="inputGroupSelect01">Max</label>
    </span>
    <select class="custom-select" id="inputGroupSelect01" v-model="TempMax">
      <option selected>Choose...</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
    <span class="input-group-prepend">
      <label class="input-group-text" for="inputGroupSelect01">Max Humidité</label>
    </span>
    <select class="custom-select" id="inputGroupSelect01" v-model="HumidityMax">
      <option selected>Choose...</option>
      <option value="60">60</option>
      <option value="80">80</option>
      <option value="90">90</option>
    </select>
   <button class="btn btn-outline-info" v-on:click="AddAlarm">Ajout Alarme</button>
  </span>
   <hr>
  <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Start</th>
        <th scope="col">End</th>
        <th scope="col">Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>0°</td>
        <td>7°</td>
        <td><button class="btn btn-outline-danger" v-on:click="removeAlarm">Remove</button></td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<style scoped>
  @import '@/assets/css/frigo.css';
</style>
<script>
import axios from 'axios'
import SocketioService from '@/services/socketio.service.ts'

export default {
  name: 'FrigoComp',
  data () {
    return {
      TempMax: null,
      TempMin: null,
      HumidityMax: null,
      temperature: 'NONE',
      humidity: 'NONE'
    }
  },
  created () {
    SocketioService.setupSocketConnection()
    this.socket = SocketioService.socket
    this.socket.on('temperature', (data) => {
      this.temperature = data
    })
    this.socket.on('humidity', (data) => {
      this.humidity = data
    })
  },
  beforeUnmount () {
    SocketioService.disconnect()
  },
  methods: {
    async OpenTheBox () {
      try {
        axios.get('https://domautonomy.one:3100/api/modules/frigo/open', {

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
        axios.get('https://domautonomy.one:3100/api/modules/frigo/addCard', {

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
        axios.post('https://domautonomy.one:3100/api/modules/frigo/AddAlarmTempHum', {
          TempMin: this.TempMin,
          TempMax: this.TempMax,
          HumidityMax: this.HumidityMax
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
