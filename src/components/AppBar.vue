<template>
  <div>
    <v-app-bar
      color="teal-darken-4"
      image="https://avatars.mds.yandex.net/i?id=0e3d7631a395cf71528d05fcd129f05c_sr-10780847-images-thumbs&n=13"
      height="88"
      class="app-bar-safe"    
      >
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <!-- <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      </template> -->

      <v-app-bar-title class="align-end text-center mx-auto mt-auto">CARS.ON</v-app-bar-title>

      <!-- Десктопное меню -->
      <!-- <v-tabs v-if="!mobile" centered class="d-none d-md-flex">
        <v-tab to="/available-cars" class="text-none">Available Cars</v-tab>
        <v-tab to="/car-requests" class="text-none">My Requests</v-tab>
        <v-tab to="/new-request" class="text-none">New Request</v-tab>
      </v-tabs>

      <v-btn icon class="d-md-none">
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
        <v-list>
            <v-list-item to="/available-cars">
                <v-list-item-title>Available Cars</v-list-item-title>
            </v-list-item>
            <v-list-item to="/car-requests">
                <v-list-item-title>My Requests</v-list-item-title>
            </v-list-item>
            <v-list-item to="/new-request">
                <v-list-item-title>New Request</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
  </div>
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

<style>
.v-bottom-navigation .v-btn {
  color: #9E9E9E !important;
}

.app-bar-safe {
  padding-top: constant(safe-area-inset-top); /* iOS 11.0 */
  padding-top: env(safe-area-inset-top); /* iOS 11.2+ */
}
</style>
