import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
  position: 'center'
}
const app = createApp(App)

app.use(router)
app.use(VueSweetalert2, options)
app.mount('#app')
