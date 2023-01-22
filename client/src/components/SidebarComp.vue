<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div id="navbar">
    <a href="#" class="menu-bars" id="show-menu">
      <i class="fas fa-bars" @click="toggleSidebar"></i>
    </a>
    <a href="/dashboard" class="dashboard">
      <div class="home">DASHBOARD</div>
    </a>
    <div class="nav-header">
      <span id="nav-title"></span>
      <details class="nav-user">
        <summary> {{ username }} <i class="fa fa-user"></i></summary>
        <ul class="user-item">
          <a href="/user/information"><li>configuration du compte</li></a>
          <a @click="logUserOut"><li>se déconnecter</li></a>
        </ul>
      </details>
    </div>
  </div>
    <nav id="nav-menu" v-if="sidebarVisible">
      <ul class="nav-menu-items">
        <div id="navbar-toggle"  @click="toggleSidebar">
            <i class="fas fa-bars nav-icon menu-bars"></i>
          <h1>Menu</h1>
        </div>
        <hr />
        <div class="nav-section">
          <details>
            <summary class="submenutitle">Gestion modules</summary>
            <ul class="submenu">
              <a href="/module/add"><li>Ajouter un module</li></a>
            </ul>
          </details>
        </div>
        <hr />
        <div class="nav-section">
          <a href="/dashboard"><ul class="submenutitle">Frigo</ul></a>
        </div>
        <hr>
      </ul>
    </nav>
</template>
<style scoped>
  @import '@/assets/css/menu.css';
</style>
<script>
import axios from 'axios'

export default {
  name: 'SidebarComp',
  data () {
    return {
      sidebarVisible: false,
      username: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    toggleSidebar () {
      this.sidebarVisible = !this.sidebarVisible
    },
    logUserOut () {
      localStorage.removeItem('jwt')
      this.$router.push('/')
    },
    async getUserInfo () {
      try {
        axios.get('https://domautonomy.one:3100/api/me', { timeout: 1000 })
          .then(response => {
            this.username = response.data.userDetails.name
            if (!this.username) {
              localStorage.removeItem('jwt')
              this.$router.push('/')
            }
          }).catch(e => {
            localStorage.removeItem('jwt')
            this.$router.push('/')
          })
      } catch (err) {
        localStorage.removeItem('jwt')
        this.$router.push('/')
        console.log(err.response)
      }
    }
  }
}
</script>
