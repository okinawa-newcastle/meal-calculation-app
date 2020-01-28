<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        カロリー計算
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-content>
      <input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
      {{ message }}
      {{ message2 }}
      <input v-model='message2'>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    message : 'hoge piko',
    message2 : ''
  }),
};
</script>
