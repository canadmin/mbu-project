import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import Vue2Filters from 'vue2-filters'

Vue.use(BootstrapVue);

Vue.use(Vue2Filters);

new Vue({
  el: '#app',
  render: h => h(App)
})
