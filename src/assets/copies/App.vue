<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer v-if="mobile" app color="black" padless>
      <v-bottom-navigation grow background-color="black">
        <v-btn to="/available-cars" value="cars">
          Каталог
          <v-icon>mdi-car</v-icon>
        </v-btn>

        <v-btn to="/new-request" value="new">
          Запросы
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>

        <v-btn to="/car-requests" value="requests">
          Отслеживание
          <v-icon>mdi-clipboard-list</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-footer>
  </v-app>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const drawer = ref(false);
const { mobile } = useDisplay();

watch(mobile, (newVal) => {
  if (!newVal) drawer.value = false;
});
</script>
