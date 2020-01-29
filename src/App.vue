<template>
  <v-app>
    <v-app-bar
      app
      color="cyan"
      dark
    >
      <div class="d-flex align-center font-weight-black">
        栄養素計算 
      </div>
      
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-container fluidr>
        <v-row>
          <v-col cols="12" class="">
            <v-card class="mx-auto ma-3 pa-3" >
              <v-row>
                <v-col cols="12"  sm=6 class="">
                  <header>目的</header>
                  <v-radio-group v-model="purpose" row v-on:change="reset(['purpose'])">
                    <v-radio label="減量" value="weightLoss" ></v-radio>
                    <v-radio label="増量" value="weightGain" ></v-radio>
                  </v-radio-group>

                  <div v-if="purpose">
                    <div v-if="purpose === 'weightLoss'">
                      <header>減量方法</header>
                      <v-radio-group v-model="weightLossMethod" row  v-on:change="reset(['purpose' , 'weightLossMethod'])">
                        <v-radio label="糖質制限" value="carbohydrateRestriction" ></v-radio>
                        <v-radio label="脂質制限" value="fatRestriction" ></v-radio>
                      </v-radio-group>

                      <div v-if="weightLossMethod === 'carbohydrateRestriction'">
                        <v-text-field
                          label="体重"
                          v-model="inputWeight" suffix="kg"
                          type="number"
                          min=0
                          :rules="[rules.required,rules.r_min]"
                        ></v-text-field>
                        <v-card-actions>
                          <v-btn :disabled="!inputWeight" color="success" @click="calculateMacrosInCarbohydrateRestriction" >
                          {{btnBasalMetabolicRate}}</v-btn>
                        </v-card-actions>
                        
                        <v-alert type="error" v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</v-alert>
                      </div>
                    </div>
                    <div v-if="purpose === 'weightGain' || weightLossMethod === 'fatRestriction'">
                      <v-text-field
                          label="体重"
                          v-model="inputWeight" suffix="kg"
                          type="number"
                          min=0
                          :rules="[rules.required,rules.r_min]"
                        ></v-text-field>
                      
                      <v-text-field
                          label="体脂肪率"
                          v-model="inputBodyfat" suffix="%" :max="100"
                          type="number"
                          min=0
                          :rules="[rules.required,rules.r_min]"
                        ></v-text-field>

                      <header>活動レベル</header>
                      <v-radio-group v-model="inputActivityLevel">
                        <v-radio label="ほぼ座っていて、運動もなし" value="1.3" ></v-radio>
                        <v-radio label="適度な運動" value="1.5" ></v-radio>
                        <v-radio label="移動の多い仕事。激しい運動" value="1.7" ></v-radio>
                      </v-radio-group>
                      
                      <header>ペース 週/kg</header>
                      <v-radio-group v-model="inputPace" row>
                        <v-radio label="0.25" value="0.25" ></v-radio>
                        <v-radio label="0.5" value="0.5" ></v-radio>
                        <v-radio label="1" value="1" ></v-radio>
                      </v-radio-group>

                      <v-card-actions>
                        <v-btn :disabled="!inputWeight || !inputBodyfat || !inputActivityLevel || !inputPace" color="success" @click="setBasalMetabolicRate" >
                        {{btnBasalMetabolicRate}}</v-btn>
                      </v-card-actions>
                        
                        <v-alert type="error" v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</v-alert>
                    </div>
                  </div>
                </v-col>
              
                <v-col id='calculationResult' cols="12"  sm=6 class="" v-if="basalMetabolicRate || targetIntakeCalorie" transition="fade-transition">
                  <div v-if="basalMetabolicRate">
                    <!-- <v-col cols="12" class="" > -->
                      <h3 class="headline font-weight-black" >現状</h3>
                      <v-col cols="12" class="font-weight-black">基礎代謝：{{ basalMetabolicRate | addComma }}kcal
                      </v-col>
                      <v-col cols="12" class="font-weight-black">消費カロリー：{{ maintainCalorie | addComma }}kcal</v-col>
                    <!-- </v-col> -->
                  </div>
                  <div v-if="targetIntakeCalorie">
                    <!-- <v-col cols="12" class="" > -->
                      <h3 class="headline font-weight-black" >目標</h3>
                      <v-col cols="12" class="font-weight-black">摂取カロリー：{{ targetIntakeCalorie | addComma }}kcal
                      </v-col>
                      <v-simple-table >
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">栄養素</th>
                              <th class="text-left">kcal</th>
                              <th class="text-left">グラム</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>タンパク質</td>
                              <td>{{ nutrients.protein.kcal | addComma}}</td>
                              <td>{{ nutrients.protein.gram | addComma}}</td>
                            </tr>
                            <tr>
                              <td>脂質</td>
                              <td>{{ nutrients.fat.kcal | addComma}}</td>
                              <td>{{ nutrients.fat.gram | addComma}}</td>
                            </tr>
                            <tr>
                              <td>糖質</td>
                              <td>{{ nutrients.carbohydrate.kcal | addComma}}</td>
                              <td>{{ nutrients.carbohydrate.gram | addComma}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    <!-- </v-col> -->
                  </div>
                </v-col>
              </v-row>
             </v-card>
          </v-col>
        </v-row>
 
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

let initial = {
    purpose : null, //目的
    btnBasalMetabolicRate : '計算', 
    basalMetabolicRate : '',
    maintainCalorie : null,
    targetIntakeCalorie : null,
    nutrients : {},
    inputWeight : null,
    inputBodyfat : null,
    inputErrorAlertMessage : '',
    inputActivityLevel : null,
    inputPace : null,
    weightLossMethod : null
}
export default {
  name: 'App',
  
  components: {

  },

  data: () => ( Object.assign( Object.assign({},initial), {
    caloriesInOneKilogram : 7200,
    rules: {
          required: v => !!v || '必須です.',
          r_min: v => v >= 0 || '正しく入力してください'
        }
  })),
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
        this.maintainCalorie = (this.basalMetabolicRate * this.inputActivityLevel)
        this.targetIntakeCalorie = this.calculateCaloriesPerDay(this.purpose,this.inputPace)

        let leanBodyWeight = this.inputWeight - (this.inputWeight * (this.inputBodyfat / 100))
        let protein = {} , fat = {} , carbohydrate = {}

        protein.gram = leanBodyWeight * 2.5 //除脂肪体重 * 2.5
        protein.kcal = protein.gram * 4
        this.nutrients.protein = protein
        if(this.purpose === 'weightGain'){
          //増量
          fat.gram = this.inputWeight * 1 // 体重
          fat.kcal = fat.gram * 9
        }else{
          //減量
          fat.kcal = this.targetIntakeCalorie * 0.1 // 体重
          fat.gram = fat.kcal / 9
        }
        this.nutrients.fat = fat
        carbohydrate.kcal = this.targetIntakeCalorie - (protein.kcal + fat.kcal)
        carbohydrate.gram = carbohydrate.kcal / 4
        this.nutrients.carbohydrate = carbohydrate   
        this.scrollToResult()
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
        // this.$set(this.nutrients, 'targetIntake', (this.inputWeight * 36) )
        this.targetIntakeCalorie = (this.inputWeight * 36)
        let protein = {} , fat = {} , carbohydrate = {}
        //タンパク質の必要量
        protein.kcal = this.targetIntakeCalorie * 0.3
        protein.gram = protein.kcal / 4
        this.nutrients.protein = protein
        //脂質の必要量
        fat.kcal = this.targetIntakeCalorie * 0.6
        fat.gram = fat.kcal / 9
        this.nutrients.fat = fat
        //糖質の必要量
        carbohydrate.kcal = this.targetIntakeCalorie * 0.1
        carbohydrate.gram = carbohydrate.kcal / 4
        this.nutrients.carbohydrate = carbohydrate
        this.scrollToResult()
        
      }
    },
    scrollToResult : function(){
      this.$nextTick(() => {
        // this.$vuetify.goTo(this.target, this.options)
        this.$vuetify.goTo("#calculationResult")
      })
    },
    reset: function(notApplicableKeys) {
      let resetObjests =  Object.assign({}, initial);
      for(let key of notApplicableKeys){
        delete resetObjests[key]
      }
      Object.assign(this.$data, resetObjests);
    },
    calculateCaloriesPerDay: function(type,pace) {
      if(type === 'weightLoss'){
        return Math.round(this.maintainCalorie - ((this.caloriesInOneKilogram * pace)  / 7))
      }else if(type === 'weightGain') {
        return Math.round(this.maintainCalorie + ((this.caloriesInOneKilogram * pace)  / 7))
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
};
</script>

