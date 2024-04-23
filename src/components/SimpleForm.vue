<template>
  <div class="product-list">
    <v-card v-for="prod in products" :disabled="loading" :loading="loading" class="mx-auto my-12" max-width="374"
      elevation="10">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
      </template>
      <v-card-title>{{ prod }} {{ posts.title }}</v-card-title>
      <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" cover></v-img>

      <v-card-item>
        <v-card-title>Cafe Mint</v-card-title>

        <v-card-subtitle>
          <span class="me-1">Местная кондитерская</span>

          <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating :model-value="4.8" color="amber" density="compact" size="small" half-increments readonly></v-rating>

          <div class="text-grey ms-4">4.8 (413)</div>
        </v-row>

        <div class="my-4 text-subtitle-1">$ • Торты, кофе</div>

        <div>
          Меренговый рулет на индючьем молоке с лепестками из чешуи бангладешской барабульки.
        </div>
        <div class="my-4 text-subtitle-1">Вес 2.5 кг</div>
        <div class="my-2 text-subtitle-1">Цена 3600 руб.</div>
      </v-card-text>

      <v-divider class="mx-4 mb-1"></v-divider>

      <v-card-title>Время доставки</v-card-title>

      <div class="px-4 mb-2">
        <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2">
          <v-chip>5:30PM</v-chip>

          <v-chip>7:30PM</v-chip>

          <v-chip>8:00PM</v-chip>

          <v-chip>9:00PM</v-chip>
        </v-chip-group>
      </div>

      <v-card-actions>
        <v-btn color="deep-purple-lighten-2" text="Заказать" block border @click="reserve"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const loading = false
const selection = 1

function reserve() {
  document.write('hi')
  this.loading = true
  setTimeout(() => (this.loading = false), 2000)
  document.write('hi2')
}

const posts = ref([])
const info = ref([])
const products = ref([1])

axios.get('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
  posts.value = response.data
  info.value = response.data
})

const temp_var = fetch('https://fakestoreapi.com/products/1')
  .then(res => res.json())
  .then(json => console.log(json))

console.log(temp_var.id)


</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
}
</style>
