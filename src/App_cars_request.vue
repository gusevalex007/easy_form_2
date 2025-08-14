<template>
    <v-app>
        <app-bar></app-bar>

      <v-main style="background-color: #f8f8f8;">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card style="border-radius: 12px;" class="pa-4 mb-6">
                <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #333;">
                  Создать новый запрос
                </v-card-title>
                <v-card-text>
                  <p style="color: #666; margin-bottom: 20px;">
                    Заполните параметры поиска автомобиля. Мы уведомим вас, когда появится подходящий вариант.
                  </p>

                  <!-- Форма запроса -->
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="requestData.brand"
                        :items="brandOptions"
                        label="Бренд"
                        variant="outlined"
                        hide-details
                        @update:modelValue="updateStats"
                      ></v-select>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ brandStats }} авто в наличии
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="requestData.model"
                        :items="modelOptions"
                        label="Модель"
                        variant="outlined"
                        hide-details
                        :disabled="!requestData.brand"
                        @update:modelValue="updateStats"
                      ></v-select>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ modelStats }} авто в наличии
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="requestData.year"
                        :items="yearOptions"
                        label="Год выпуска"
                        variant="outlined"
                        hide-details
                        @update:modelValue="updateStats"
                      ></v-select>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ yearStats }} авто в наличии
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="requestData.maxMileage"
                        label="Максимальный пробег (км)"
                        variant="outlined"
                        type="number"
                        hide-details
                        @update:modelValue="updateStats"
                      ></v-text-field>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ mileageStats }} авто с пробегом до {{ requestData.maxMileage || '---' }} км
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="requestData.maxPrice"
                        label="Максимальный бюджет (₽)"
                        variant="outlined"
                        type="number"
                        hide-details
                        @update:modelValue="updateStats"
                      ></v-text-field>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ priceStats }} авто в вашем бюджете
                        <span v-if="priceRecommendation" style="color: #e65100;">{{ priceRecommendation }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="requestData.fuelType"
                        :items="fuelOptions"
                        label="Тип двигателя"
                        variant="outlined"
                        hide-details
                        @update:modelValue="updateStats"
                      ></v-select>
                      <div class="mt-2" style="font-size: 12px; color: #666;">
                        {{ fuelStats }} авто с выбранным двигателем
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="requestData.comments"
                        label="Дополнительные пожелания"
                        variant="outlined"
                        rows="2"
                        hide-details
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    color="#e65100"
                    dark
                    block
                    size="large"
                    style="text-transform: none; font-weight: 500;"
                    @click="submitRequest"
                  >
                    Создать запрос
                  </v-btn>
                </v-card-actions>
              </v-card>

              <!-- Статистика и рекомендации -->
              <v-card style="border-radius: 12px;" class="pa-4">
                <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #333; font-size: 16px;">
                  Статистика и рекомендации
                </v-card-title>
                <v-card-text>
                  <div v-if="totalMatches > 0" style="color: #4caf50; font-weight: 500;">
                    <v-icon color="#4caf50">mdi-check-circle</v-icon>
                    Найдено {{ totalMatches }} автомобилей по вашим параметрам
                  </div>
                  <div v-else style="color: #e65100; font-weight: 500;">
                    <v-icon color="#e65100">mdi-alert-circle</v-icon>
                    По текущим параметрам автомобили не найдены
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div style="color: #333;">
                    <div class="mb-2" v-if="recommendations.length > 0">
                      <div style="font-weight: 500; margin-bottom: 4px;">Рекомендации:</div>
                      <ul style="padding-left: 20px; margin: 0;">
                        <li v-for="(rec, index) in recommendations" :key="index">{{ rec }}</li>
                      </ul>
                    </div>
                    <div v-else style="color: #666;">
                      Продолжайте настраивать параметры поиска
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Диалог подтверждения -->
      <v-dialog v-model="confirmationDialog" max-width="500">
        <v-card style="border-radius: 12px;">
          <v-card-title style="font-family: 'Montserrat', sans-serif; font-weight: 600;">
            Подтверждение запроса
          </v-card-title>
          <v-card-text>
            <p>Вы уверены, что хотите создать запрос с указанными параметрами?</p>
            <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; margin-top: 12px;">
              <div v-if="requestData.brand"><strong>Бренд:</strong> {{ requestData.brand }}</div>
              <div v-if="requestData.model"><strong>Модель:</strong> {{ requestData.model }}</div>
              <div v-if="requestData.year"><strong>Год:</strong> {{ requestData.year }}</div>
              <div v-if="requestData.maxMileage"><strong>Макс. пробег:</strong> {{ requestData.maxMileage }} км</div>
              <div v-if="requestData.maxPrice"><strong>Бюджет:</strong> {{ formatPrice(requestData.maxPrice) }} ₽</div>
              <div v-if="requestData.fuelType"><strong>Двигатель:</strong> {{ requestData.fuelType }}</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#e65100"
              dark
              style="text-transform: none;"
              @click="confirmRequest"
            >
              Подтвердить
            </v-btn>
            <v-btn
              color="#333"
              variant="outlined"
              style="text-transform: none;"
              @click="confirmationDialog = false"
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
import { ref, computed, onMounted } from 'vue';
import carList from './assets/car_list.json';
import AppBar from './components/AppBar.vue';

// Данные автомобилей из JSON
const cars = ref([]);

// Загрузка данных из JSON
onMounted(() => {
  try {
    // Обработка данных
    cars.value = carList.map(car => {
      const cleanFuelType = car.fue ? car.fue.replace('·', '').trim() : '';
      const rawYear = car.yer ? car.yer.split('/')[0] : null;
      const year = rawYear ? parseInt(rawYear) + 2000 : null;
      const title = `${car.brand || ''} ${car.model || ''} ${car.dtl || ''}`.trim();
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

    // Инициализация данных запроса
    requestData.value.maxPrice = Math.max(...cars.value.map(car => car.priceValue)) / 2;
    requestData.value.maxMileage = 50000;

    // Первоначальное обновление статистики
    updateStats();
  } catch (error) {
    console.error('Ошибка обработки данных:', error);
  }
});

// Данные формы запроса
const requestData = ref({
  brand: null,
  model: null,
  year: null,
  maxMileage: null,
  maxPrice: null,
  fuelType: null,
  comments: ''
});

// Статистика
const brandStats = ref(0);
const modelStats = ref(0);
const yearStats = ref(0);
const mileageStats = ref(0);
const priceStats = ref(0);
const fuelStats = ref(0);
const totalMatches = ref(0);
const recommendations = ref([]);
const priceRecommendation = ref('');

// Опции для селектов
const brandOptions = computed(() => {
  const brands = new Set();
  cars.value.forEach(car => {
    if (car.brand) brands.add(car.brand);
  });
  return [...Array.from(brands).sort()];
});

const modelOptions = computed(() => {
  if (!requestData.value.brand) return [];
  const models = new Set();
  cars.value.forEach(car => {
    if (car.brand === requestData.value.brand && car.model) {
      models.add(car.model);
    }
  });
  return [...Array.from(models).sort()];
});

const yearOptions = computed(() => {
  const years = new Set();
  cars.value.forEach(car => {
    if (car.year) years.add(car.year);
  });
  return [...Array.from(years).sort((a,b) => b - a)];
});

const fuelOptions = computed(() => {
  const fuels = new Set();
  cars.value.forEach(car => {
    if (car.cleanFuelType) fuels.add(car.cleanFuelType);
  });
  return [...Array.from(fuels).sort()];
});

// Форматирование цены
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

// Обновление статистики
const updateStats = () => {
  // Фильтрация автомобилей по текущим параметрам
  const filtered = cars.value.filter(car => {
    return (!requestData.value.brand || car.brand === requestData.value.brand) &&
           (!requestData.value.model || car.model === requestData.value.model) &&
           (!requestData.value.year || car.year === requestData.value.year) &&
           (!requestData.value.maxMileage || (car.mileage && car.mileage <= requestData.value.maxMileage)) &&
           (!requestData.value.maxPrice || (car.priceValue && car.priceValue <= requestData.value.maxPrice)) &&
           (!requestData.value.fuelType || car.cleanFuelType === requestData.value.fuelType);
  });

  // Обновление статистики
  totalMatches.value = filtered.length;

  // Статистика по брендам
  brandStats.value = requestData.value.brand
    ? cars.value.filter(car => car.brand === requestData.value.brand).length
    : cars.value.length;

  // Статистика по моделям
  modelStats.value = requestData.value.model
    ? cars.value.filter(car => car.model === requestData.value.model).length
    : requestData.value.brand
      ? cars.value.filter(car => car.brand === requestData.value.brand).length
      : cars.value.length;

  // Статистика по годам
  yearStats.value = requestData.value.year
    ? cars.value.filter(car => car.year === requestData.value.year).length
    : cars.value.length;

  // Статистика по пробегу
  mileageStats.value = requestData.value.maxMileage
    ? cars.value.filter(car => car.mileage && car.mileage <= requestData.value.maxMileage).length
    : cars.value.length;

  // Статистика по цене
  priceStats.value = requestData.value.maxPrice
    ? cars.value.filter(car => car.priceValue && car.priceValue <= requestData.value.maxPrice).length
    : cars.value.length;

  // Статистика по типу двигателя
  fuelStats.value = requestData.value.fuelType
    ? cars.value.filter(car => car.cleanFuelType === requestData.value.fuelType).length
    : cars.value.length;

  // Генерация рекомендаций (для прототипа используем случайные данные)
  recommendations.value = [];

  if (totalMatches.value === 0) {
    recommendations.value.push("Попробуйте расширить диапазон цены или пробега");
    recommendations.value.push("Рассмотрите другие бренды или модели");
  } else if (totalMatches.value < 5) {
    recommendations.value.push("Расширьте диапазон года выпуска для большего выбора");
    recommendations.value.push("Попробуйте увеличить бюджет на 10-15%");
  }

  // Рекомендации по цене
  if (requestData.value.maxPrice) {
    const avgPrice = cars.value.reduce((sum, car) => sum + car.priceValue, 0) / cars.value.length;
    if (requestData.value.maxPrice < avgPrice * 0.7) {
      priceRecommendation.value = "Рекомендуем увеличить бюджет для лучшего выбора";
    } else if (requestData.value.maxPrice > avgPrice * 1.3) {
      priceRecommendation.value = "Вы можете найти отличные варианты с меньшим бюджетом";
    } else {
      priceRecommendation.value = "";
    }
  }
};

// Диалог подтверждения
const confirmationDialog = ref(false);
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Отправка запроса
const submitRequest = () => {
  confirmationDialog.value = true;
};

const confirmRequest = () => {
  console.log('Создан запрос:', requestData.value);
  confirmationDialog.value = false;
  showSnackbar('Запрос успешно создан! Мы уведомим вас о новых предложениях.', 'success');

  // Сброс формы (кроме бюджета и пробега)
  requestData.value = {
    ...requestData.value,
    brand: null,
    model: null,
    year: null,
    fuelType: null,
    comments: ''
  };
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
</style>
