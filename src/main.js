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
    purpose : null, //目的
    btnBasalMetabolicRate : '計算',
    caloriesInOneKilogram : 7200,
    basalMetabolicRate : '',
    estimatedCalories : {},
    inputWeight : null,
    inputBodyfat : null,
    inputErrorAlertMessage : '',
    inputActivityLevel : null,
    inputPace : null
  }),
  methods: {
    setBasalMetabolicRate: function() {
      this.inputWeight =72
      this.inputBodyfat = 15
      var inputErrors = []
      // check input weight
      if(!this.inputWeight ){
        inputErrors.push("体重")
      }
      // check input body fat
      if(!this.inputBodyfat ){
        inputErrors.push("体脂肪")
      }
      // check input body 活動レベル
      if(!this.inputActivityLevel ){
        inputErrors.push("活動レベル")
      }
      // check input body ペース
      if(!this.inputPace ){
        inputErrors.push("ペース")
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
        this.estimatedCalories.targetIntake = this.calculateCaloriesPerDay(this.purpose,this.inputPace)
        this.estimatedCalories.easyWeightLoss = this.calculateCaloriesPerDay('weightLoss',0.25)
        this.estimatedCalories.mediumWeightLoss = this.calculateCaloriesPerDay('weightLoss',0.5)
        this.estimatedCalories.hardWeightLoss = this.calculateCaloriesPerDay('weightLoss',1)
        this.estimatedCalories.easyWeightGain = this.calculateCaloriesPerDay('weightGain',0.25)
        this.estimatedCalories.mediumWeightGain = this.calculateCaloriesPerDay('weightGain',0.5)
        this.estimatedCalories.hardWeightGain = this.calculateCaloriesPerDay('weightGain',1)
        let leanBodyWeight = this.inputWeight - (this.inputWeight * (this.inputBodyfat / 100))
        let protein = {} , fat = {} , carbohydrate = {}
        protein.gram = leanBodyWeight * 2.5 //除脂肪体重 * 2.5
        protein.kcal = protein.gram * 4
        this.estimatedCalories.protein = protein
        fat.gram = this.inputWeight * 1 // 体重
        fat.kcal = fat.gram * 9
        this.estimatedCalories.fat = fat
        carbohydrate.kcal = this.estimatedCalories.targetIntake - (protein.kcal + fat.kcal)
        carbohydrate.gram = carbohydrate.kcal / 4
        this.estimatedCalories.carbohydrate = carbohydrate
        console.log('test')
      }

    },
    calculateCaloriesPerDay: function(type,pace) {
      if(type === 'weightLoss'){
        return Math.round(this.estimatedCalories.maintain - ((this.caloriesInOneKilogram * pace)  / 7))
      }else if(type === 'weightGain') {
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