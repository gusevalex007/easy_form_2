<template>
  <v-container fluid class="bg-surface-variant fill-height" style="min-height: 100vh;">
    <v-row  no-gutters style="min-height: 100vh;width: 100vw; margin: 0;">
      <v-col
        v-for="stage in stages"
        :key="stage.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <v-card>
          <v-card-title class="text-center primary white--text">
            {{ stage.title }}
          </v-card-title>
          <v-card-text>
            <v-list
              dense
              class="py-0"
            >
              <v-list-item>
                  <v-list-item-subtitle>
                    {{ getOrdersCount(stage.id) }} заказов
                  </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <v-divider></v-divider>
            
            <draggable
              :list="getOrdersByStage(stage.id)"
              group="orders"
              @change="onDragChange($event, stage.id)"
              class="pa-2"
            >
              <v-card
                v-for="order in getOrdersByStage(stage.id)"
                :key="order.id"
                class="mb-2"
                outlined
              >
                <v-card-text>
                  <div class="d-flex justify-space-between">
                    <div class="font-weight-bold">#{{ order.carID }}</div>
                    <div class="primary--text">{{ order.sum }} ₽</div>
                  </div>
                  <div class="text-subtitle-1">
                    {{ order.brand }} {{ order.model }} ({{ order.year }})
                  </div>
                  <div class="text-caption mt-1">
                    Клиент: {{ order.client }}
                  </div>
                </v-card-text>
              </v-card>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
  data() {
    return {
      stages: [
        { id: 1, title: 'Выкуплен' },
        { id: 2, title: 'Прибыл на таможню' },
        { id: 3, title: 'Таможня' },
        { id: 4, title: 'В пути' },
        { id: 5, title: 'Подготовка к выдаче' },
        { id: 6, title: 'Выдан' }
      ],
      orders: [
        {
          id: 1,
          carID: 'A123BC',
          brand: 'Toyota',
          model: 'Camry',
          year: 2020,
          client: 'Иванов И.И.',
          sum: 2500000,
          stage: 1
        },
        {
          id: 2,
          carID: 'B456DE',
          brand: 'BMW',
          model: 'X5',
          year: 2019,
          client: 'Петров П.П.',
          sum: 3500000,
          stage: 2
        },
        {
          id: 3,
          carID: 'C789FG',
          brand: 'Mercedes',
          model: 'E-Class',
          year: 2021,
          client: 'Сидоров С.С.',
          sum: 4200000,
          stage: 3
        },
        {
          id: 4,
          carID: 'D012HI',
          brand: 'Audi',
          model: 'A6',
          year: 2018,
          client: 'Кузнецов К.К.',
          sum: 2800000,
          stage: 4
        },
        {
          id: 5,
          carID: 'E345JK',
          brand: 'Lexus',
          model: 'RX',
          year: 2020,
          client: 'Смирнов С.С.',
          sum: 3800000,
          stage: 5
        },
        {
          id: 6,
          carID: 'F678LM',
          brand: 'Volkswagen',
          model: 'Tiguan',
          year: 2021,
          client: 'Федоров Ф.Ф.',
          sum: 2200000,
          stage: 6
        }
      ]
    }
  },
  methods: {
    getOrdersByStage(stageId) {
      return this.orders.filter(order => order.stage === stageId)
    },
    getOrdersCount(stageId) {
      return this.getOrdersByStage(stageId).length
    },
    onDragChange(event, newStage) {
      if (event.added) {
        const orderId = event.added.element.id
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.stage = newStage
        }
      }
    }
  }
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>