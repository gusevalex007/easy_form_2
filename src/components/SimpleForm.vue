<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12"
    max-width="374"
    elevation="10"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      cover
    ></v-img>

    <v-card-item>
      <v-card-title>Cafe Mint</v-card-title>

      <v-card-subtitle>
        <span class="me-1">Местная кондитерская</span>

        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating
          :model-value="4.8"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">4.8 (413)</div>
      </v-row>

      <div class="my-4 text-subtitle-1">$ • Торты, кофе</div>

      <div>
        Меренговый рулет на индючьем молоке с лепестками из чешуи бангладешской
        барабульки.
      </div>
      <div class="my-4 text-subtitle-1">Вес 2.5 кг</div>
      <div class="my-2 text-subtitle-1">Цена 3600 руб.</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Время доставки</v-card-title>

    <div class="px-4 mb-2">
      <v-chip-group
        v-model="selection"
        selected-class="bg-deep-purple-lighten-2"
      >
        <v-chip>5:30PM</v-chip>

        <v-chip>7:30PM</v-chip>

        <v-chip>8:00PM</v-chip>

        <v-chip>9:00PM</v-chip>
      </v-chip-group>
    </div>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Заказать "
        block
        border
        @click="reserve"
      ></v-btn>
    </v-card-actions>

 
    <v-dialog transition="dialog-top-transition" width="auto">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              text="Transition from Top"
              block
            ></v-btn>
          </template>
          <template v-slot:default="{ isActive}">
            <v-card>
              <v-toolbar class="pa-4" title="Вы сделали свой первый заказ!"></v-toolbar>
              <v-card-text class="text-h4 pa-12"> Спасибо! </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>


  </v-card>
</template>



<script>
  export default {
    data: () => ({
      loading: false,
      selection: 1,
    }),

    methods: {
      reserve() {
        this.loading = true

        setTimeout(() => (this.loading = false), 500)

      },
    },
  }
</script>
