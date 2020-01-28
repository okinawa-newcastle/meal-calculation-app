import Vue from 'vue'
// import App from './App.vue'
// import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// new Vue({
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')

// new Vue({
//   el: '#app3',
//   vuetify  
// })

new Vue({
  el: '#app2',
  // vuetify,
  // render: h => h(App),
  data: () => ({
    message2 : 'hoge piko',
    message : 'hoge piko',
    purpose : null, //目的
    btnBasalMetabolicRate : '計算',
    caloriesInOneKilogram : 7200,
    basalMetabolicRate : '',
    estimatedCalories : {},
    inputWeight : null,
    inputBodyfat : null,
    inputErrorAlertMessage : '',
    inputActivityLevel : null,
    inputPace : null,
    weightLossMethod : null
  }),
  methods: {
    setBasalMetabolicRate: function() {
      this.inputWeight =72
      this.inputBodyfat = 15
      let inputErrors = []
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
        // this.estimatedCalories.maintain  = this.basalMetabolicRate * this.inputActivityLevel
        this.$set(this.estimatedCalories, 'maintain', (this.basalMetabolicRate * this.inputActivityLevel))
        // this.estimatedCalories.targetIntake = this.calculateCaloriesPerDay(this.purpose,this.inputPace)
        this.$set(this.estimatedCalories, 'targetIntake', (this.calculateCaloriesPerDay(this.purpose,this.inputPace)) )


        let leanBodyWeight = this.inputWeight - (this.inputWeight * (this.inputBodyfat / 100))
        let protein = {} , fat = {} , carbohydrate = {}

        protein.gram = leanBodyWeight * 2.5 //除脂肪体重 * 2.5
        protein.kcal = protein.gram * 4
        this.estimatedCalories.protein = protein
        if(this.purpose === 'weightGain'){
          //増量
          fat.gram = this.inputWeight * 1 // 体重
          fat.kcal = fat.gram * 9
        }else{
          //減量
          fat.kcal = this.estimatedCalories.targetIntake * 0.1 // 体重
          fat.gram = fat.kcal / 9
        }
        this.estimatedCalories.fat = fat
        carbohydrate.kcal = this.estimatedCalories.targetIntake - (protein.kcal + fat.kcal)
        carbohydrate.gram = carbohydrate.kcal / 4
        this.estimatedCalories.carbohydrate = carbohydrate     
      }
    },
    calculateMacrosInCarbohydrateRestriction: function(){
      //糖質制限での減量
      let inputErrors = []
      // check input weight
      if(!this.inputWeight ){
        inputErrors.push("体重")
      }
      // check input errors
      if(inputErrors.length > 0){
        this.inputErrorAlertMessage = inputErrors.join('・')
        this.basalMetabolicRate = null
      }else{
        this.btnBasalMetabolicRate = '再計算'
        this.$set(this.estimatedCalories, 'targetIntake', (this.inputWeight * 36) )
        let protein = {} , fat = {} , carbohydrate = {}
        //タンパク質の必要量
        protein.kcal = this.estimatedCalories.targetIntake * 0.3
        protein.gram = protein.kcal / 4
        this.estimatedCalories.protein = protein
        //脂質の必要量
        fat.kcal = this.estimatedCalories.targetIntake * 0.6
        fat.gram = fat.kcal / 9
        this.estimatedCalories.fat = fat
        //糖質の必要量
        carbohydrate.kcal = this.estimatedCalories.targetIntake * 0.1
        carbohydrate.gram = carbohydrate.kcal / 4
        this.estimatedCalories.carbohydrate = carbohydrate
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
}).$mount('#app')