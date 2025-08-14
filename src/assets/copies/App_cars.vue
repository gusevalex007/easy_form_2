<template>
    <v-app>

        <v-app-bar
        color="teal-darken-4"
        image="https://avatars.mds.yandex.net/i?id=0e3d7631a395cf71528d05fcd129f05c_sr-10780847-images-thumbs&n=13"
      >
        <template v-slot:image>
          <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          ></v-img>
        </template>

        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>CARS.ON</v-app-bar-title>

        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

       <!-- Десктопное меню -->
        <v-tabs v-if="!mobile" centered class="d-none d-md-flex">
          <v-tab to="/available-cars" class="text-none">Available Cars</v-tab>
          <v-tab to="/car-requests" class="text-none">My Requests</v-tab>
          <v-tab to="/new-request" class="text-none">New Request</v-tab>
        </v-tabs>
        
        <v-btn icon class="d-md-none">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>


        
      </v-app-bar>

      <v-main style="background-color: #f8f8f8;">
        <v-container>
          <!-- Фильтры -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="brandFilter"
                :items="brandOptions"
                label="Бренд"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="yearFilter"
                :items="yearOptions"
                label="Год выпуска"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="mileageFilter"
                :items="mileageOptions"
                label="Пробег"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="fuelFilter"
                :items="fuelOptions"
                label="Тип двигателя"
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
            <v-col cols="12" v-for="(car, index) in filteredCars" :key="index">
              <v-card style="border-radius: 12px; overflow: hidden;">
                <v-img
                  :src="car.img"
                  cover
                  gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)"
                >
                  <v-chip 
                    style="position: absolute; top: 16px; right: 16px;"
                    color="#4caf50"
                    dark
                  >
                    В наличии
                  </v-chip>
                </v-img>
  
                <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #333;">
                  {{ car.title }}
                  <div style="font-size: 12px; font-weight: 400; color: #666;">
                    ID: 
                    <a 
                        :href="`https://fem.encar.com/cars/detail/${car.carid}`" 
                        style="color: #1976D2; text-decoration: underline; cursor: pointer;"
                        target="_blank"
                        @click.stop
                    >
                        {{ car.carid }}
                    </a>
                    </div>
                </v-card-title>
  
                <v-card-text style="padding-top: 0;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #666;">Цена:</span>
                    <span style="font-weight: 700; color: #e65100;">{{ car.formattedPrice }} ₽</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Год выпуска:</span>
                    <span style="font-weight: 600;">{{ car.year }}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                    <span style="color: #666;">Пробег:</span>
                    <span style="font-weight: 600;">
                        {{ car.mileage?.toLocaleString() ?? 'Пробег не указан' }} км
                    </span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Двигатель:</span>
                    <span style="font-weight: 500;">{{ car.cleanFuelType }}</span>
                  </div>
                </v-card-text>
  
                <v-card-actions style="flex-direction: column; gap: 8px; padding: 16px;">
                  <v-btn 
                    block
                    color="#e65100"
                    dark
                    style="text-transform: none; font-weight: 500;"
                    @click="openBookingDialog(car)"
                  >
                    Оставить заявку
                  </v-btn>
                  <v-btn 
                    block
                    color="#333"
                    variant="outlined"
                    style="text-transform: none; font-weight: 500;"
                    @click="openViewingDialog(car)"
                  >
                    Записаться на тест-драйв
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
            Заявка на автомобиль
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
            Запись на тест-драйв
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
              label="Дата тест-драйва"
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

     <!-- Мобильный футер -->
  <v-footer v-footer app color="black" padless v-if="mobile">
        <v-bottom-navigation grow color="white" background-color="black">
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
import { ref, computed, onMounted, watch } from 'vue';
import { useDisplay } from 'vuetify';
import carList from './assets/car_list.json';

// Данные для адаптивного меню
const drawer = ref(false);
const { mobile } = useDisplay();

const links = [
    'Каталог',
    'Запросы',
    'Трекинг'
  ]

// Наблюдатель за изменением mobile
watch(mobile, (newVal) => {
  if (!newVal) drawer.value = false;
});

// Данные автомобилей из JSON
const cars = ref([]);
  
// Загрузка данных из JSON
onMounted(() => {
  try {
    // Обработка данных
    cars.value = carList.map(car => {
      // Удаляем лишние символы из типа топлива
      const cleanFuelType = car.fue ? car.fue.replace('·', '').trim() : '';
      
      // Получаем год из поля yer (первые 2 символа)
      const rawYear = car.yer ? car.yer.split('/')[0] : null;
      const year = rawYear ? parseInt(rawYear) + 2000 : null;
      
      // Формируем заголовок
      const title = `${car.brand || ''} ${car.model || ''} ${car.dtl || ''}`.trim();
      
      // Рассчитываем цену в рублях (умножаем на 600)
      const priceInRub = car.price ? car.price * 600 : 0;
      
      return {
        ...car,
        title,
        year,
        cleanFuelType,
        priceValue: priceInRub,
        formattedPrice: formatPrice(priceInRub)
      };
    });
  } catch (error) {
    console.error('Ошибка обработки данных:', error);
  }
});

// Остальной код остается без изменений
// Фильтры
const brandFilter = ref('Все');
const yearFilter = ref('Все');
const mileageFilter = ref('Все');
const fuelFilter = ref('Все');

// Фильтр по цене
const minPrice = computed(() => {
  if (cars.value.length === 0) return 0;
  return Math.min(...cars.value.map(car => car.priceValue));
});

const maxPrice = computed(() => {
  if (cars.value.length === 0) return 10000000;
  return Math.max(...cars.value.map(car => car.priceValue));
});

const priceRange = ref([minPrice.value, maxPrice.value]);

// Опции для фильтров
const brandOptions = computed(() => {
  const brands = new Set();
  cars.value.forEach(car => {
    if (car.brand) brands.add(car.brand);
  });
  return ['Все', ...Array.from(brands).sort()];
});

const yearOptions = computed(() => {
  const years = new Set();
  cars.value.forEach(car => {
    if (car.year) years.add(car.year);
  });
  return ['Все', ...Array.from(years).sort((a,b) => b - a)];
});

const mileageOptions = [
  { title: 'Все', value: 'Все' },
  { title: 'До 10 000 км', value: 'До 10000' },
  { title: '10 000 - 30 000 км', value: '10000-30000' },
  { title: 'Более 30 000 км', value: 'Более 30000' }
];

const fuelOptions = computed(() => {
  const fuels = new Set();
  cars.value.forEach(car => {
    if (car.cleanFuelType) fuels.add(car.cleanFuelType);
  });
  return ['Все', ...Array.from(fuels).sort()];
});

// Форматирование цены для отображения
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

// Фильтрация автомобилей
const filteredCars = computed(() => {
  return cars.value.filter(car => {
    // Фильтр по бренду
    const brandMatch = 
      brandFilter.value === 'Все' ||
      car.brand === brandFilter.value;
    
    // Фильтр по году
    const yearMatch = 
      yearFilter.value === 'Все' ||
      car.year === yearFilter.value;
    
    // Фильтр по пробегу
    const mileageMatch = 
      mileageFilter.value === 'Все' ||
      (mileageFilter.value === 'До 10000' && car.mileage <= 10000) ||
      (mileageFilter.value === '10000-30000' && car.mileage > 10000 && car.mileage <= 30000) ||
      (mileageFilter.value === 'Более 30000' && car.mileage > 30000);
    
    // Фильтр по типу двигателя
    const fuelMatch = 
      fuelFilter.value === 'Все' ||
      car.cleanFuelType === fuelFilter.value;
    
    // Фильтр по цене
    const priceMatch = 
      car.priceValue >= priceRange.value[0] && 
      car.priceValue <= priceRange.value[1];
    
    return brandMatch && yearMatch && mileageMatch && fuelMatch && priceMatch;
  });
});

// Данные для диалогов
const bookingDialog = ref(false);
const viewingDialog = ref(false);
const currentCar = ref(null);

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
const openBookingDialog = (car) => {
  currentCar.value = car;
  bookingData.value = { name: '', phone: '', email: '' };
  bookingDialog.value = true;
};

const openViewingDialog = (car) => {
  currentCar.value = car;
  viewingData.value = { name: '', phone: '', date: '' };
  viewingDialog.value = true;
};

const submitBooking = () => {
  console.log('Заявка на автомобиль:', currentCar.value, bookingData.value);
  bookingDialog.value = false;
  showSnackbar('Заявка на автомобиль отправлена', 'success');
};

const submitViewing = () => {
  console.log('Тест-драйв:', currentCar.value, viewingData.value);
  viewingDialog.value = false;
  showSnackbar('Заявка на тест-драйв отправлена', 'success');
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