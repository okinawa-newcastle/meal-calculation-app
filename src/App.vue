<template>
  <v-app>
    <v-app-bar
      app
      color="cyan"
      dark
    >
      <div class="d-flex align-center">
        カロリー計算
      </div>

      
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-container fluidr>

        <v-row>
          <v-col cols="12" class="">
            <v-card class="mx-auto ma-3 pa-6" >
              <v-col cols="12" class="">
                <header>目的</header>
                <v-radio-group v-model="purpose" row >
                  <v-radio label="減量" value="weightLoss" ></v-radio>
                  <v-radio label="増量" value="weightGain" ></v-radio>
                </v-radio-group>

                <div v-if="purpose">
                  <div v-if="purpose === 'weightLoss'">
                    <!-- <h3 class="headline" >減量方法</h3> -->
                    <header>減量方法</header>
                    <v-radio-group v-model="weightLossMethod" row >
                      <v-radio label="糖質制限" value="carbohydrateRestriction" ></v-radio>
                      <v-radio label="脂質制限" value="fatRestriction" ></v-radio>
                    </v-radio-group>

                    <div v-if="weightLossMethod === 'carbohydrateRestriction'">
                      <!-- <h3 class="headline" >体重 (kg)</h3> -->
                      <header>体重 (kg)</header>
                      <!-- <v-col cols="8"> -->
                      <v-text-field
                        label="体重"
                        v-model="inputWeight" suffix="kg"
                      ></v-text-field>
                      <!-- </v-col> -->
                      <!-- <v-slider v-model="inputWeight" thumb-label="always" class="align-center"
                        :max="150" :min="0" hide-details >
                        <template v-slot:prepend>
                          <v-text-field v-model="inputWeight" class="mt-0 pt-0"
                            hide-details single-line type="number" style="" ></v-text-field> 
                        </template>
                      </v-slider> -->
                      <v-card-actions>
                        <v-btn :disabled="!inputWeight" color="success" @click="calculateMacrosInCarbohydrateRestriction" >
                        {{btnBasalMetabolicRate}}</v-btn>
                      </v-card-actions>
                      
                      <v-alert type="error" v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</v-alert>
                    </div>
                  </div>
                  <div v-if="purpose === 'weightGain' || weightLossMethod === 'fatRestriction'">
                    <!-- <label for='inputWeight'>体重</label>
                    <input defalut='72' type="number" min="0" v-model="inputWeight" id='inputWeight'>kg -->
                    <header>体重 (kg)</header>
                    <v-slider v-model="inputWeight" thumb-label="always" class="align-center"
                      :max="150" :min="0" hide-details >
                      <template v-slot:prepend>
                        <v-text-field v-model="inputWeight" class="mt-0 pt-0"
                          hide-details single-line type="number" style="" ></v-text-field> 
                      </template>
                    </v-slider>
                    <label for='inputBodyfat'>体脂肪率</label>
                    <input defalut='16' type="number" min="0" v-model="inputBodyfat" id='inputBodyfat'>％
                    <header>体脂肪率 (%)</header>
                    <v-slider v-model="inputBodyfat" thumb-label="always" class="align-center"
                      :max="100" :min="0" hide-details >
                      <template v-slot:prepend>
                        <v-text-field v-model="inputWeight" class="mt-0 pt-0"
                          hide-details single-line type="number" style="" ></v-text-field> 
                      </template>
                    </v-slider>
                    <label for='inputActivityLevel'>活動レベル</label>
                    <select v-model="inputActivityLevel" id='inputActivityLevel'>
                      <option>1.3</option>
                      <option>1.5</option>
                      <option>1.7</option>
                    </select>
                    <label for='inputPace'>ペース</label>
                    <select v-model="inputPace" id='inputPace'>
                      <option>0.25</option>
                      <option>0.5</option>
                      <option>1</option>
                    </select>
                    <button type="button" @click="setBasalMetabolicRate">{{btnBasalMetabolicRate}}</button>
                    <div v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" class="">
                <div v-if="basalMetabolicRate">
                  <p class="headline font-weight-black">基礎代謝は、{{ basalMetabolicRate | addComma }}kcalです</p>
                  <p class="headline font-weight-black">消費カロリーは、{{ estimatedCalories.maintain | addComma }}kcalです</p>
                </div>
                <div v-if="estimatedCalories.targetIntake">
                  <p class="headline font-weight-black">摂取カロリーは、{{ estimatedCalories.targetIntake | addComma }}kcalです</p>
                  <h3 class="headline font-weight-black" >目標</h3>
                  <v-col cols="12" class="font-weight-black">摂取カロリーは、{{ estimatedCalories.targetIntake | addComma }}kcalです
                  </v-col>
                  <v-simple-table :dense="dense" :fixed-header="fixedHeader" :height="height">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">栄養素</th>
                          <th class="text-left">グラム</th>
                          <th class="text-left">kcal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>タンパク質</td>
                          <td>{{ estimatedCalories.protein.gram }}</td>
                          <td>{{ estimatedCalories.protein.kcal }}</td>
                        </tr>
                        <tr>
                          <td>脂質</td>
                          <td>{{ estimatedCalories.fat.gram }}</td>
                          <td>{{ estimatedCalories.fat.kcal }}</td>
                        </tr>
                        <tr>
                          <td>糖質</td>
                          <td>{{ estimatedCalories.carbohydrate.gram }}</td>
                          <td>{{ estimatedCalories.carbohydrate.kcal }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-col>
             </v-card>
          </v-col>
        </v-row>

      <span>目的</span>
      <input type="radio" id="weightLoss" value="weightLoss" v-model="purpose">
        <label for="weightLoss">減量</label>
        <input type="radio" id="weightGain" value="weightGain" v-model="purpose">
        <label for="weightGain">増量</label>

      <div v-if="purpose">
        <div v-if="purpose === 'weightLoss'">
          <span>減量方法</span>
          <input type="radio" id="carbohydrateRestriction" value="carbohydrateRestriction" v-model="weightLossMethod">
          <label for="carbohydrateRestriction">糖質制限</label>
          <input type="radio" id="fatRestriction" value="fatRestriction" v-model="weightLossMethod">
          <label for="fatRestriction">脂質制限</label>
          {{weightLossMethod}} 
          <div v-if="weightLossMethod === 'carbohydrateRestriction'">
            <label for='inputWeight'>体重</label>
            <input type="number" min="0" v-model="inputWeight" id='inputWeight'>kg
            <button type="button" @click="calculateMacrosInCarbohydrateRestriction">{{btnBasalMetabolicRate}}</button>
            <v-alert type="error" v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</v-alert>
          </div>
        </div>
        <div v-if="purpose === 'weightGain' || weightLossMethod === 'fatRestriction'">
          <label for='inputWeight'>体重</label>
          <input defalut='72' type="number" min="0" v-model="inputWeight" id='inputWeight'>kg
          <label for='inputBodyfat'>体脂肪率</label>
          <input defalut='16' type="number" min="0" v-model="inputBodyfat" id='inputBodyfat'>％
          <label for='inputActivityLevel'>活動レベル</label>
          <select v-model="inputActivityLevel" id='inputActivityLevel'>
            <option>1.3</option>
            <option>1.5</option>
            <option>1.7</option>
          </select>
          <label for='inputPace'>ペース</label>
          <select v-model="inputPace" id='inputPace'>
            <option>0.25</option>
            <option>0.5</option>
            <option>1</option>
          </select>
          <button type="button" @click="setBasalMetabolicRate">{{btnBasalMetabolicRate}}</button>
          <div v-if="inputErrorAlertMessage">{{ inputErrorAlertMessage }}を入力して下さい</div>
        </div>
        <div v-if="basalMetabolicRate">
          <p>基礎代謝は{{ basalMetabolicRate | addComma }}kcalです</p>
          <p>消費カロリー{{ estimatedCalories.maintain | addComma }}kcalです</p>
        </div>
        <div v-if="estimatedCalories.targetIntake">
          <p>目標</p>
          <p>摂取カロリー{{ estimatedCalories.targetIntake | addComma }}kcalです</p>
          <p>タンパク質{{ estimatedCalories.protein.gram }}g / {{ estimatedCalories.protein.kcal }}kcal</p>
          <p>脂質{{ estimatedCalories.fat.gram }}g / {{ estimatedCalories.fat.kcal }}kcal</p>
          <p>糖質{{ estimatedCalories.carbohydrate.gram }}g / {{ estimatedCalories.carbohydrate.kcal }}kcal</p>
       </div>
      </div>
 
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

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
};
</script>
