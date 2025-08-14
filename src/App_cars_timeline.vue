<template>
  <v-app>
    <app-bar></app-bar>

    <v-card flat class="order-tracking-container">
      <v-card-title class="primary white--text">
        <span>Заказ № {{ orderData.orderNumber }}</span>
        <v-spacer></v-spacer>
        <v-chip color="white" text-color="primary">
          {{ getOrderStatus }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-img
              :src="orderData.carImage || 'https://ci.encar.com/carpicture/carpicture07/pic4007/40075608_001.jpg?impolicy=heightRate&rh=384&cw=640&ch=384&cg=Center'"
              aspect-ratio="1.7"
              class="elevation-2"
            ></v-img>
          </v-col>

          <v-col cols="12" md="8">
            <v-list dense>
              <v-list-item>
                <v-list-item-title class="text-h6">
                  {{ orderData.carMake }} {{ orderData.carModel }} {{ orderData.carYear }}
                </v-list-item-title>
                <v-list-item-subtitle>VIN: {{ orderData.carVIN }}</v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title class="font-weight-bold">Стоимость</v-list-item-title>
                <v-table dense>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td>Цена авто:</td>
                        <td class="text-right">{{ formatPrice(orderData.priceCar) }}</td>
                      </tr>
                      <tr>
                        <td>Доставка:</td>
                        <td class="text-right">{{ formatPrice(orderData.priceDelivery) }}</td>
                      </tr>
                      <tr>
                        <td>Таможня:</td>
                        <td class="text-right">{{ formatPrice(orderData.priceCustoms) }}</td>
                      </tr>
                      <tr class="font-weight-bold">
                        <td>Итого:</td>
                        <td class="text-right">{{ formatPrice(orderData.priceTotal) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-timeline dense align-top class="mt-6" side="end">
              <v-timeline-item
                v-for="stage in stages"
                :key="stage.key"
                :dot-color="getStageColor(stage.key)"
              >
                <template v-slot:icon>
                  <v-icon size="22" class="timeline-icon">
                    {{ getStageIcon(stage.key) }}
                  </v-icon>
                </template>

                <v-card :color="getStageColor(stage.key, true)" dark elevation="2">
                  <v-card-title class="text-h6" style="display: flex; justify-content: space-between">
                    {{ stage.label }}
                    <v-chip v-if="isStageDelayed(stage.key)" small class="ml-2">
                      Просрочено
                    </v-chip>
                  </v-card-title>

                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <div class="font-weight-bold">Начало:</div>
                        <div>{{ getStageDate(stage.key, 'startDate') || '—' }}</div>
                      </v-col>
                      <v-col cols="6">
                        <div class="font-weight-bold">План:</div>
                        <div>{{ getStageDate(stage.key, 'plannedDate') || '—' }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';

export default {
  name: 'OrderTrackingVuetify',
  components: {
    AppBar,
  },
  props: {
    orderData: {
      type: Object,
      required: false,
      default: () => ({
        orderNumber: 'CR-ON-2745',
        carMake: 'BMW',
        carModel: '440i xDrive',
        carYear: '2022',
        carVIN: 'JT2BF22K1W0123456',
        carImage: '',
        priceCar: 4500000,
        priceDelivery: 150000,
        priceCustoms: 300000,
        priceTotal: 4950000,
        stages: {
          purchased: {
            startDate: '2025-05-10',
            plannedDate: '2025-05-15',
            completed: true
          },
          arrivedAtCustoms: {
            startDate: '2025-05-18',
            plannedDate: '2025-05-20',
            completed: true
          },
          customs: {
            startDate: '2025-05-21',
            plannedDate: '2025-05-25',
            completed: true
          },
          inTransit: {
            startDate: null,
            plannedDate: '2025-07-30',
            completed: false
          },
          preparingForDelivery: {
            startDate: null,
            plannedDate: '2025-08-05',
            completed: false
          },
          delivered: {
            startDate: null,
            plannedDate: '2025-08-10',
            completed: false
          }
        }
      })
    }
  },
  data() {
    return {
      stages: [
        { key: 'purchased', label: 'Выкуплен' },
        { key: 'arrivedAtCustoms', label: 'Прибыл на таможню' },
        { key: 'customs', label: 'Таможня' },
        { key: 'inTransit', label: 'В пути' },
        { key: 'preparingForDelivery', label: 'Подготовка к выдаче' },
        { key: 'delivered', label: 'Выдан' }
      ],
      stageIcons: {
        purchased: 'mdi-cash',
        arrivedAtCustoms: 'mdi-clock',
        customs: 'mdi-badge-account',
        inTransit: 'mdi-truck',
        preparingForDelivery: 'mdi-car-wash',
        delivered: 'mdi-emoticon-happy'
      },
    }
  },
  computed: {
    getOrderStatus() {
      if (this.orderData.stages.delivered.completed) return 'Завершен';
      const activeStage = this.stages.find(stage =>
        this.isStageActive(stage.key) ||
        (!this.isStageCompleted(stage.key) && this.orderData.stages[stage.key]?.startDate)
      );
      return activeStage ? activeStage.label : 'Ожидание';
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
      }).format(price);
    },
    getStageDate(stageKey, dateType) {
      if (!this.orderData.stages[stageKey]?.[dateType]) return null;
      return new Date(this.orderData.stages[stageKey][dateType]).toLocaleDateString('ru-RU');
    },
    isStageCompleted(stageKey) {
      return this.orderData.stages[stageKey]?.completed;
    },
    isStageActive(stageKey) {
      return this.orderData.stages[stageKey]?.startDate &&
             !this.orderData.stages[stageKey]?.completed;
    },
    isStageDelayed(stageKey) {
      const stage = this.orderData.stages[stageKey];
      if (!stage || !stage.plannedDate || stage.completed) return false;

      const plannedDate = new Date(stage.plannedDate);
      const today = new Date();

      return today > plannedDate;
    },
    getStageColor(stageKey, lighten = false) {
      if (this.isStageCompleted(stageKey)) return lighten ? 'success lighten-1' : 'success';
      if (this.isStageDelayed(stageKey)) return lighten ? 'error lighten-1' : 'error';
      if (this.isStageActive(stageKey)) return lighten ? 'primary lighten-1' : 'primary';
      return lighten ? 'grey lighten-2' : 'grey';
    },
    getStageIcon(stageKey) {
      return this.stageIcons[stageKey] || 'mdi-help-circle';
    }
  }
}
</script>

<style scoped>
.order-tracking-container {
  max-width: 100%;
}

.v-timeline::before {
  top: 12px;
  height: calc(100% - 24px);
}

.v-timeline-item {
  min-height: 100px;
  padding-bottom: 24px;
}

.v-card__title.text-h6 {
  word-break: break-word;
}

.timeline-icon {
  background: transparent !important;
  box-shadow: none !important;
}

.v-timeline-item__dot {
  box-shadow: none !important;
  background: transparent !important;
}

@media (max-width: 600px) {
  .v-timeline-item__body {
    width: 200px;
  }

  .v-card__title, .v-card__text {
    padding: 12px !important;
  }
}
</style>
