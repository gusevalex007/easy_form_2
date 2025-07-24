<template>
  <v-app>
    <v-app-bar app color="white" elevation="1">
      <v-img
        src="https://2-etazha.ru/assets/templates/mainnew/img8/logo.svg"
        max-height="40"
        max-width="120"
        contain
      ></v-img>
    </v-app-bar>

    <v-main style="background-color: #f8f8f8;">
      <v-container>
        <!-- Фильтры -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="villageFilter"
              :items="villageOptions"
              label="Коттеджный поселок"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="projectFilter"
              :items="projectOptions"
              label="Проект дома"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="areaFilter"
              :items="areaOptions"
              label="Площадь дома"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Статус"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

       <!-- Фильтр по цене -->
  <v-row class="mb-6">
    <v-col cols="12">
      <v-card class="pa-4" style="border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Диапазон цен:</span>
          <span style="font-weight: 600;">
            {{ formatPrice(priceRange[0]) }} ₽ - {{ formatPrice(priceRange[1]) }} ₽
          </span>
        </div>
        <v-range-slider
          v-model="priceRange"
          :min="minPrice"
          :max="maxPrice"
          :step="100000"
          hide-details
          color="#e65100"
          track-color="#e0e0e0"
          thumb-color="#e65100"
          
          :thumb-size="16"
          :thumb-label-size="24"
          :height="4"
          :thumb-label-formatter="formatPrice"
        ></v-range-slider>
      </v-card>
    </v-col>
  </v-row>

        <v-row>
          <v-col cols="12" v-for="(house, index) in filteredHouses" :key="index">
            <v-card style="border-radius: 12px; overflow: hidden;">
              <v-img
                :src="house.image"
                height="300px"
                cover
                gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)"
              >
                <v-chip 
                  style="position: absolute; top: 16px; right: 16px;"
                  :color="house.status === 'Свободен' ? '#4caf50' : '#ff9800'"
                  dark
                >
                  {{ house.status }}
                </v-chip>
              </v-img>

              <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #333;">
                {{ house.title }}
              </v-card-title>

              <v-card-text style="padding-top: 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #666;">Цена:</span>
                  <span style="font-weight: 700; color: #e65100;">{{ house.price }} ₽</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Площадь:</span>
                  <span style="font-weight: 600;">{{ house.area }} м²</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                  <span style="color: #666;">Поселок:</span>
                  <span style="font-weight: 500;">{{ house.village }}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Проект:</span>
                  <span style="font-weight: 500;">{{ house.project }}</span>
                </div>
              </v-card-text>

              <v-card-actions style="flex-direction: column; gap: 8px; padding: 16px;">
                <v-btn 
                  block
                  color="#e65100"
                  dark
                  style="text-transform: none; font-weight: 500;"
                  @click="openBookingDialog(house)"
                >
                  Заявка на бронирование
                </v-btn>
                <v-btn 
                  block
                  color="#333"
                  variant="outlined"
                  style="text-transform: none; font-weight: 500;"
                  @click="openViewingDialog(house)"
                >
                  Записаться на просмотр
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Диалог бронирования -->
    <v-dialog v-model="bookingDialog" max-width="500">
      <v-card style="border-radius: 12px;">
        <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600;">
          Заявка на бронирование
        </v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="bookingData.name" 
            label="Ваше имя"
            variant="outlined"
          ></v-text-field>
          <v-text-field 
            v-model="bookingData.phone" 
            label="Телефон"
            variant="outlined"
          ></v-text-field>
          <v-text-field 
            v-model="bookingData.email" 
            label="Email"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="#e65100"
            dark
            style="text-transform: none;"
            @click="submitBooking"
          >
            Отправить
          </v-btn>
          <v-btn 
            color="#333"
            variant="outlined"
            style="text-transform: none;"
            @click="bookingDialog = false"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог записи на просмотр -->
    <v-dialog v-model="viewingDialog" max-width="500">
      <v-card style="border-radius: 12px;">
        <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600;">
          Запись на просмотр
        </v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="viewingData.name" 
            label="Ваше имя"
            variant="outlined"
          ></v-text-field>
          <v-text-field 
            v-model="viewingData.phone" 
            label="Телефон"
            variant="outlined"
          ></v-text-field>
          <v-text-field 
            v-model="viewingData.date" 
            type="date" 
            label="Дата просмотра"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="#e65100"
            dark
            style="text-transform: none;"
            @click="submitViewing"
          >
            Отправить
          </v-btn>
          <v-btn 
            color="#333"
            variant="outlined"
            style="text-transform: none;"
            @click="viewingDialog = false"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';

// Данные домов с реальными фото с сайта 2-etazha.ru
const houses = ref([
  {
    id: 1,
    title: 'Дом 1 - "Комфорт"',
    image: 'https://2-etazha.ru/assets/cache/images/one_61%283%29-1020x680-0f1b3acb.jpg',
    price: '5 200 000',
    priceValue: 5200000,
    area: 120,
    status: 'Свободен',
    village: 'Зеленый Бор',
    project: 'Комфорт-2023'
  },
  {
    id: 2,
    title: 'Дом 2 - "Премиум"',
    image: 'https://2-etazha.ru/assets/cache/images/one_73-3-1020x680-3cbb4362.jpg',
    price: '6 500 000',
    priceValue: 6500000,
    area: 150,
    status: 'Забронирован',
    village: 'Сосновый Рай',
    project: 'Премиум-2024'
  },
  {
    id: 3,
    title: 'Дом 3 - "Элит"',
    image: 'https://2-etazha.ru/assets/cache/images/1-3-1%282%29-1020x680-e50c78dc.jpg',
    price: '7 800 000',
    priceValue: 7800000,
    area: 180,
    status: 'Свободен',
    village: 'Зеленый Бор',
    project: 'Элит-2024'
  },
  {
    id: 4,
    title: 'Дом 4 - "Стандарт"',
    image: 'https://2-etazha.ru/assets/cache/images/prodazha/barn-111-botanika/111-barn_1-photo-1020x680-019ffb69.jpg',
    price: '4 900 000',
    priceValue: 4900000,
    area: 98,
    status: 'Свободен',
    village: 'Березовая Роща',
    project: 'Стандарт-2023'
  },
]);

// Фильтры
const villageFilter = ref('Все');
const projectFilter = ref('Все');
const areaFilter = ref('Все');
const statusFilter = ref('Все');

// Фильтр по цене
const minPrice = computed(() => {
  return Math.min(...houses.value.map(house => house.priceValue));
});

const maxPrice = computed(() => {
  return Math.max(...houses.value.map(house => house.priceValue));
});

const priceRange = ref([minPrice.value, maxPrice.value]);

const villageOptions = [
  { title: 'Все', value: 'Все' },
  { title: 'Зеленый Бор', value: 'Зеленый Бор' },
  { title: 'Сосновый Рай', value: 'Сосновый Рай' },
  { title: 'Березовая Роща', value: 'Березовая Роща' }
];

const projectOptions = [
  { title: 'Все', value: 'Все' },
  { title: 'Комфорт-2023', value: 'Комфорт-2023' },
  { title: 'Премиум-2024', value: 'Премиум-2024' },
  { title: 'Элит-2024', value: 'Элит-2024' },
  { title: 'Стандарт-2023', value: 'Стандарт-2023' }
];

const areaOptions = [
  { title: 'Все', value: 'Все' },
  { title: 'До 100 м²', value: 'До 100' },
  { title: 'Более 100 м²', value: 'Более 100' }
];

const statusOptions = [
  { title: 'Все', value: 'Все' },
  { title: 'Свободен', value: 'Свободен' },
  { title: 'Забронирован', value: 'Забронирован' }
];

// Форматирование цены для отображения
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

// Фильтрация домов
const filteredHouses = computed(() => {
  return houses.value.filter(house => {
    // Фильтр по поселку
    const villageMatch = 
      villageFilter.value === 'Все' ||
      house.village === villageFilter.value;
    
    // Фильтр по проекту
    const projectMatch = 
      projectFilter.value === 'Все' ||
      house.project === projectFilter.value;
    
    // Фильтр по площади
    const areaMatch = 
      areaFilter.value === 'Все' ||
      (areaFilter.value === 'До 100' && house.area <= 100) ||
      (areaFilter.value === 'Более 100' && house.area > 100);
    
    // Фильтр по статусу
    const statusMatch = 
      statusFilter.value === 'Все' ||
      house.status === statusFilter.value;
    
    // Фильтр по цене
    const priceMatch = 
      house.priceValue >= priceRange.value[0] && 
      house.priceValue <= priceRange.value[1];
    
    return villageMatch && projectMatch && areaMatch && statusMatch && priceMatch;
  });
});

// Данные для диалогов
const bookingDialog = ref(false);
const viewingDialog = ref(false);
const currentHouse = ref(null);

const bookingData = ref({
  name: '',
  phone: '',
  email: ''
});

const viewingData = ref({
  name: '',
  phone: '',
  date: ''
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Методы
const openBookingDialog = (house) => {
  currentHouse.value = house;
  bookingData.value = { name: '', phone: '', email: '' };
  bookingDialog.value = true;
};

const openViewingDialog = (house) => {
  currentHouse.value = house;
  viewingData.value = { name: '', phone: '', date: '' };
  viewingDialog.value = true;
};

const submitBooking = () => {
  console.log('Бронирование:', currentHouse.value, bookingData.value);
  bookingDialog.value = false;
  showSnackbar('Заявка на бронирование отправлена', 'success');
};

const submitViewing = () => {
  console.log('Просмотр:', currentHouse.value, viewingData.value);
  viewingDialog.value = false;
  showSnackbar('Заявка на просмотр отправлена', 'success');
};

const showSnackbar = (message, color) => {
  snackbar.value = { show: true, message, color };
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

* {
  font-family: 'Montserrat', sans-serif;
}

.v-card {
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.v-btn {
  letter-spacing: normal;
  height: 48px !important;
}

.v-text-field .v-field {
  border-radius: 8px !important;
}

/* Добавляем новые стили для ползунка */
.v-slider-thumb {
  width: 16px !important;
  height: 16px !important;
}

.v-slider-thumb__label {
  width: 24px !important;
  height: 24px !important;
  font-size: 10px !important;
  transform: translateY(-20px) translateX(-4px) !important;
}

.v-slider--horizontal {
  min-height: 4px !important;
}

.v-slider-track__background {
  height: 4px !important;
}

.v-slider-track__fill {
  height: 4px !important;
}
</style>