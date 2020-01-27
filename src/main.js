import Vue from 'vue'
// import App from './App.vue'
// import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// new Vue({
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')

new Vue({
  el: '#app2',
  data: () => ({
    message2 : 'hoge piko',
    btnBasalMetabolicRate : '計算',
    basalMetabolicRate : '',
    estimatedCalories : {},
    inputWeight : null,
    inputBodyfat : null,
    inputErrorAlert : '',
    inputActivityLevel : null
  }),
  methods: {
    setBasalMetabolicRate: function() {
      var inputErrors = []
      // check input weight
      if(!this.inputWeight ){
        inputErrors.push("体重")
      }
      // check input body fat
      if(!this.inputBodyfat ){
        inputErrors.push("体脂肪")
      }
      // check input body fat
      if(!this.inputActivityLevel ){
        inputErrors.push("活動レベル")
      }
      // check input errors
      if(inputErrors.length > 0){
        this.inputErrorAlert = inputErrors.join('・')
        this.basalMetabolicRate = null
      }else{
        this.btnBasalMetabolicRate = '再計算'
        // JISS方式
        this.basalMetabolicRate = 28.5 * (this.inputWeight - (this.inputWeight * (this.inputBodyfat/100)))
        this.basalMetabolicRate = Math.round(this.basalMetabolicRate)
        let estimatedCalorieMaintain  = this.basalMetabolicRate * this.inputActivityLevel
        this.estimatedCalories.maintain = estimatedCalorieMaintain
        this.estimatedCalories.mildWeightLoss = estimatedCalorieMaintain
        console.log('test')
      }

    }
  },
  filters: {
    addComma: function (value) {
      value = Math.round(value)
      return value.toLocaleString()
    }
  }
})