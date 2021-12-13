import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Buefy from 'buefy'
import './assets/style.scss'
import Gravatar from 'vue-gravatar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
    faArrowUp, faAngleRight, faAngleLeft, faAngleDown, faPen, faTrash, faFileCsv,
    faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload, faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import VueApexCharts from 'vue-apexcharts'

library.add(faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
    faArrowUp, faAngleRight, faAngleLeft, faAngleDown, faPen, faTrash, faFileCsv, faArrowRight,
    faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload, faPlus)

Vue.component('apexchart', VueApexCharts)
Vue.component('vue-fontawesome', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
})
Vue.component('v-gravatar', Gravatar);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
