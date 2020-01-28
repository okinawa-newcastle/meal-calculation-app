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
    caloriesInOneKilogram : 7200,
    basalMetabolicRate : '',
    estimatedCalories : {},
    inputWeight : null,
    inputBodyfat : null,
    inputErrorAlertMessage : '',
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
        this.inputErrorAlertMessage = inputErrors.join('・')
        this.basalMetabolicRate = null
      }else{
        this.btnBasalMetabolicRate = '再計算'
        // JISS方式
        this.basalMetabolicRate = 28.5 * (this.inputWeight - (this.inputWeight * (this.inputBodyfat/100)))
        this.basalMetabolicRate = Math.round(this.basalMetabolicRate)
        this.estimatedCalories.maintain  = this.basalMetabolicRate * this.inputActivityLevel
        this.estimatedCalories.easyWeightLoss = this.calculateCaloriesPerDay('loss',0.25)
        this.estimatedCalories.mediumWeightLoss = this.calculateCaloriesPerDay('loss',0.5)
        this.estimatedCalories.hardWeightLoss = this.calculateCaloriesPerDay('loss',1)
        this.estimatedCalories.easyWeightGain = this.calculateCaloriesPerDay('gain',0.25)
        this.estimatedCalories.mediumWeightGain = this.calculateCaloriesPerDay('gain',0.5)
        this.estimatedCalories.hardWeightGain = this.calculateCaloriesPerDay('gain',1)
        console.log('test')
      }

    },
    calculateCaloriesPerDay: function(type,pace) {
      if(type === 'loss'){
        return Math.round(this.estimatedCalories.maintain - ((this.caloriesInOneKilogram * pace)  / 7))
      }else if(type === 'gain') {
        return Math.round(this.estimatedCalories.maintain + ((this.caloriesInOneKilogram * pace)  / 7))
      } else {
        return 
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