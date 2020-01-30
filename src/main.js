import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueAnalytics from './plugins/vue-analytics';

Vue.config.productionTip = false

new Vue({
  vuetify,
  VueAnalytics,
  render: h => h(App)
}).$mount('#app')

