<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <h1 class="text-h3 font-weight-bold text-center mb-8">Портфолио Mini Apps</h1>
        
        <v-row>
          <v-col
            v-for="(project, index) in projects"
            :key="index"
            cols="12"
            sm="6"
            class="d-flex"
          >
            <v-card
              class="portfolio-card flex-grow-1"
              @click="openLink(project.link)"
            >
              <v-card-item>
                <template v-slot:prepend>
                    <v-avatar rounded="lg" size="80" class="mr-4">        
                    <v-img :src="project.image"></v-img>
                  </v-avatar>
                </template>
                
                <v-card-title class="text-h5 font-weight-bold">
                  {{ project.title }}
                </v-card-title>
                
                <v-card-subtitle class="text-subtitle-1">
                  {{ project.shortDesc }}
                </v-card-subtitle>
                
                <template v-slot:append>
                  <v-btn
                    icon
                    @click.stop="expanded[index] = !expanded[index]"
                    class="expand-btn"
                    :class="{ 'rotate-180': expanded[index] }"
                  >
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
              </v-card-item>
              
              <v-expand-transition>
                <div v-show="expanded[index]">
                  <v-divider class="my-2"></v-divider>
                  <v-card-text>
                    <div class="text-body-1 mb-2">{{ project.fullDesc }}</div>
                    <div class="text-body-2">
                      <strong>Технологии:</strong> {{ project.tech }}
                    </div>
                    <v-btn
                      color="primary"
                      class="mt-4"
                      @click.stop="openLink(project.link)"
                      block
                    >
                      Открыть приложение
                    </v-btn>
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const expanded = ref([]);

const projects = ref([
  {
    title: "Real estate",
    shortDesc: "Посмотр и бронирование домов",
    fullDesc: "Приложение помогает риэлторам находить детальную информацию о домах в продаже. А также отпаравлять заявки на просмотр и бронирование.",
    tech: "Vue 3, Vuetify, Битрикс24>",
    image: "https://placehold.co/600x400/9C27B0/FFFFFF?text=Homes",
    link: "https://t.me/tg_pay_1bot"
  },
  {
    title: "Language Learning",
    shortDesc: "Изучение языков",
    fullDesc: "Мини-приложение для изучения новых слов с системой повторений и произношением.",
    tech: "Vue 3, Web Audio API, Firebase",
    image: "https://placehold.co/600x400/9C27B0/FFFFFF?text=Language",
    link: "https://t.me/your_language_app"
  },
  {
    title: "Fitness Tracker",
    shortDesc: "Трекер тренировок",
    fullDesc: "Приложение для отслеживания физической активности и прогресса в тренировках.",
    tech: "Vue 3, Chart.js, IndexedDB",
    image: "https://placehold.co/600x400/4CAF50/FFFFFF?text=Fitness",
    link: "https://t.me/your_fitness_app"
  },
  {
    title: "Recipe Finder",
    shortDesc: "Поиск рецептов",
    fullDesc: "База рецептов с фильтрами по ингредиентам и времени приготовления.",
    tech: "Vue 3, Spoonacular API, Vuetify",
    image: "https://placehold.co/600x400/FF9800/FFFFFF?text=Recipes",
    link: "https://t.me/your_recipe_app"
  }
]);

// Инициализируем массив expanded
projects.value.forEach((_, index) => {
  expanded.value[index] = false;
});

const openLink = (url) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
.portfolio-card {
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.portfolio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.expand-btn {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Адаптация для маленьких экранов */
@media (max-width: 599px) {
  .v-avatar {
    width: 60px !important;
    height: 60px !important;
  }
  
  .v-card-title {
    font-size: 1.1rem !important;
  }
  
  .v-card-subtitle {
    font-size: 0.9rem !important;
  }
}
</style>