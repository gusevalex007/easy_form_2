<template>
  <div class="app-container">
    <!-- Шапка в стиле MintTort -->
    <header class="header">
      <h1>🍰 Кондитерская "Mint"</h1>
      <p>Авторские торты на заказ</p>
    </header>

    <main class="main-content">
      <!-- Шаг 1: Выбор десертов -->
      <section v-if="currentStep === 1" class="step">
        <div class="order-summary" v-if="selectedItems.length > 0">
          <h3>Ваш заказ ({{ selectedItems.length }})</h3>
          <div class="order-items">
            <div v-for="item in orderedItems" :key="'order-'+item.id" class="order-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
              <span class="item-price">{{ item.price * item.quantity }} ₽</span>
              <button @click.stop="removeItem(item.id)" class="remove-item">×</button>
            </div>
          </div>
          <div class="order-total">
            <span>Итого:</span>
            <span>{{ totalPrice }} ₽</span>
          </div>
        </div>

        <h2>Выберите десерты</h2>
        <div class="menu-categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="activeCategory = category.id"
            :class="{ active: activeCategory === category.id }"
            class="category-tab"
          >
            {{ category.name }}
          </button>
        </div>
        
        <div class="menu-items">
          <div 
            v-for="item in filteredMenu" 
            :key="item.id" 
            class="menu-item"
            @click="addItem(item.id)"
            :class="{ selected: isItemSelected(item.id) }"
          >
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <span class="price">{{ item.price }} ₽</span>
            </div>
            <div class="item-controls" v-if="isItemSelected(item.id)">
              <button @click.stop="decreaseQuantity(item.id)" class="quantity-btn">-</button>
              <span class="item-quantity">{{ getItemQuantity(item.id) }}</span>
              <button @click.stop="increaseQuantity(item.id)" class="quantity-btn">+</button>
            </div>
          </div>
        </div>
        <button @click="nextStep" class="action-button" :disabled="selectedItems.length === 0">
          Далее ({{ totalPrice }} ₽)
        </button>
      </section>

      <!-- Шаг 2: Время доставки -->
      <section v-if="currentStep === 2" class="step">
        <div class="order-preview">
          <h3>Ваш заказ</h3>
          <div v-for="item in orderedItems" :key="'preview-'+item.id" class="preview-item">
            {{ item.name }} ×{{ item.quantity }} — {{ item.price * item.quantity }} ₽
          </div>
          <div class="preview-total">Итого: {{ totalPrice }} ₽</div>
        </div>

        <h2>Выберите время доставки</h2>
        <div class="time-options">
          <button 
            v-for="time in deliveryTimes" 
            :key="time.value" 
            @click="selectedTime = time.value"
            :class="{ selected: selectedTime === time.value }"
            class="time-option"
          >
            {{ time.label }}
          </button>
        </div>
        <div class="button-group">
          <button @click="prevStep" class="secondary-button">Назад</button>
          <button @click="nextStep" class="action-button">Далее</button>
        </div>
      </section>

      <!-- Шаг 3: Способ оплаты -->
      <section v-if="currentStep === 3" class="step">
        <div class="order-preview">
          <h3>Ваш заказ</h3>
          <div v-for="item in orderedItems" :key="'payment-'+item.id" class="preview-item">
            {{ item.name }} ×{{ item.quantity }} — {{ item.price * item.quantity }} ₽
          </div>
          <div class="preview-total">Итого: {{ totalPrice }} ₽</div>
          <div class="preview-time" v-if="selectedTime">
            Время доставки: {{ formatTime(selectedTime) }}
          </div>
        </div>

        <h2>Способ оплаты</h2>
        <div class="payment-options">
          <label 
            v-for="method in paymentMethods" 
            :key="method.value"
            class="payment-option"
            :class="{ selected: selectedPayment === method.value }"
          >
            <input 
              type="radio" 
              v-model="selectedPayment" 
              :value="method.value"
              class="radio-input"
            >
            <span class="radio-custom"></span>
            <span class="payment-label">{{ method.label }}</span>
            <span class="payment-icon">{{ method.icon }}</span>
          </label>
        </div>
        
        <!-- Поля для ввода данных карты -->
        <div v-if="selectedPayment === 'online'" class="card-details">
          <input type="text" v-model="cardNumber" placeholder="Номер карты" class="input-field">
          <div class="card-row">
            <input type="text" v-model="cardExpiry" placeholder="ММ/ГГ" class="input-field small">
            <input type="text" v-model="cardCvc" placeholder="CVC" class="input-field small">
          </div>
        </div>

        <div class="button-group">
          <button @click="prevStep" class="secondary-button">Назад</button>
          <button @click="processOrder" class="action-button">
            {{ selectedPayment === 'online' ? 'Оплатить' : 'Заказать' }} ({{ totalPrice }} ₽)
          </button>
        </div>
      </section>

      <!-- Шаг 4: Подтверждение заказа -->
      <section v-if="currentStep === 4" class="step confirmation">
        <div class="confirmation-icon">✓</div>
        <h2>Спасибо за заказ!</h2>
        <p>Ваш заказ №{{ orderNumber }} принят.</p>
        <p v-if="selectedTime">Доставка к {{ formatTime(selectedTime) }}</p>
        
        <div class="confirmation-items">
          <div v-for="item in orderedItems" :key="'confirm-'+item.id" class="confirmation-item">
            {{ item.name }} ×{{ item.quantity }} — {{ item.price * item.quantity }} ₽
          </div>
        </div>
        
        <p class="total-price">Сумма: {{ totalPrice }} ₽</p>
        <p>Способ оплаты: {{ getPaymentMethodLabel() }}</p>
        <p>Мы свяжемся с вами для подтверждения.</p>
        <button @click="resetOrder" class="action-button">Сделать новый заказ</button>
      </section>
    </main>

    <footer class="footer">
      <p>Кондитерская Mint · Доставка · 8 (800) 123-4567</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentStep: 1,
      activeCategory: 1,
      selectedItems: [],
      selectedTime: null,
      selectedPayment: 'cash',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      orderNumber: Math.floor(Math.random() * 10000),
      categories: [
        { id: 1, name: 'Торты' },
        { id: 2, name: 'Капкейки' },
        { id: 3, name: 'Пирожные' },
        { id: 4, name: 'Пироги' },
        { id: 5, name: 'Макаруны' },
        { id: 6, name: 'Десерты' },
        { id: 7, name: 'Напитки' }
      ],
      menu: [
  // Торты
  {
    id: 1,
    categoryId: 1,
    name: 'Торт "Мятная свежесть"',
    description: 'Нежный бисквит с мятным кремом и ягодной прослойкой',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Торт "Шоколадная мечта"',
    description: 'Шоколадный бисквит с карамельным кремом и орехами',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 3,
    categoryId: 1,
    name: 'Торт "Красный бархат"',
    description: 'Классический красный бархат с крем-чизом',
    price: 2700,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Капкейки
  {
    id: 4,
    categoryId: 2,
    name: 'Капкейк "Ванильная нежность"',
    description: 'Ванильный бисквит с крем-чизом',
    price: 350,
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 5,
    categoryId: 2,
    name: 'Капкейк "Шоколадный рай"',
    description: 'Шоколадный бисквит с ганашем',
    price: 380,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 6,
    categoryId: 2,
    name: 'Капкейк "Карамельное яблоко"',
    description: 'Пряный бисквит с карамельным кремом',
    price: 400,
    image: 'https://images.unsplash.com/photo-1596223575327-99a5be4faf1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Пирожные
  {
    id: 7,
    categoryId: 3,
    name: 'Эклер "Классический"',
    description: 'Заварное тесто с ванильным кремом',
    price: 280,
    image: 'https://images.unsplash.com/photo-1558317686-7f6d6a0a8b6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 8,
    categoryId: 3,
    name: 'Чизкейк "Нью-Йорк"',
    description: 'Классический чизкейк с ягодным топпингом',
    price: 420,
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Пироги
  {
    id: 9,
    categoryId: 4,
    name: 'Пирог "Яблочный"',
    description: 'Слоеное тесто с яблочной начинкой',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1562007908-17c67e878c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 10,
    categoryId: 4,
    name: 'Пирог "Вишневый"',
    description: 'Песочное тесто с вишневой начинкой',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Макаруны
  {
    id: 11,
    categoryId: 5,
    name: 'Макарун "Ванильный"',
    description: 'Нежное печенье с ванильным кремом',
    price: 180,
    image: 'https://images.unsplash.com/photo-151220107837-595f492a1a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 12,
    categoryId: 5,
    name: 'Макарун "Шоколадный"',
    description: 'Нежное печенье с шоколадным ганашем',
    price: 190,
    image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Десерты
  {
    id: 13,
    categoryId: 6,
    name: 'Тирамису',
    description: 'Классический итальянский десерт',
    price: 450,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 14,
    categoryId: 6,
    name: 'Крем-брюле',
    description: 'Нежный десерт с карамельной корочкой',
    price: 480,
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  // Напитки
  {
    id: 15,
    categoryId: 7,
    name: 'Латте',
    description: 'Кофе с молоком',
    price: 250,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 16,
    categoryId: 7,
    name: 'Какао',
    description: 'Горячий шоколадный напиток',
    price: 220,
    image: 'https://images.unsplash.com/photo-1572383672419-ab35444a6934?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 17,
    categoryId: 7,
    name: 'Мятный лимонад',
    description: 'Освежающий напиток с мятой',
    price: 200,
    image: 'https://images.unsplash.com/photo-1551751299-1b51cab2694c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
  }
],
      deliveryTimes: [
        { value: 'asap', label: 'Как можно скорее' },
        { value: '12:00', label: 'К 12:00' },
        { value: '13:00', label: 'К 13:00' },
        { value: '14:00', label: 'К 14:00' },
        { value: '15:00', label: 'К 15:00' },
        { value: '16:00', label: 'К 16:00' },
        { value: '17:00', label: 'К 17:00' },
        { value: '18:00', label: 'К 18:00' }
      ],
      paymentMethods: [
        { value: 'cash', label: 'Наличными при получении', icon: '💵' },
        { value: 'card', label: 'Картой при получении', icon: '💳' },
        { value: 'online', label: 'Онлайн оплата', icon: '📱' }
      ]
    }
  },
  computed: {
    totalPrice() {
      return this.selectedItems.reduce((total, item) => {
        const menuItem = this.menu.find(i => i.id === item.id);
        return total + (menuItem ? menuItem.price * item.quantity : 0);
      }, 0);
    },
    filteredMenu() {
      return this.menu.filter(item => item.categoryId === this.activeCategory);
    },
    orderedItems() {
      return this.selectedItems.map(item => {
        const menuItem = this.menu.find(i => i.id === item.id);
        return {
          ...menuItem,
          quantity: item.quantity
        };
      });
    }
  },
  methods: {
    isItemSelected(itemId) {
      return this.selectedItems.some(item => item.id === itemId);
    },
    getItemQuantity(itemId) {
      const item = this.selectedItems.find(item => item.id === itemId);
      return item ? item.quantity : 0;
    },
    addItem(itemId) {
      const existingItem = this.selectedItems.find(item => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.selectedItems.push({ id: itemId, quantity: 1 });
      }
    },
    removeItem(itemId) {
      this.selectedItems = this.selectedItems.filter(item => item.id !== itemId);
    },
    increaseQuantity(itemId) {
      const item = this.selectedItems.find(item => item.id === itemId);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(itemId) {
      const item = this.selectedItems.find(item => item.id === itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          this.removeItem(itemId);
        }
      }
    },
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    formatTime(time) {
      if (time === 'asap') return 'как можно скорее';
      return time;
    },
    getPaymentMethodLabel() {
      const method = this.paymentMethods.find(m => m.value === this.selectedPayment);
      return method ? method.label : '';
    },
    processOrder() {
      if (this.selectedPayment === 'online') {
        setTimeout(() => {
          this.currentStep++;
          this.orderNumber = Math.floor(Math.random() * 10000);
        }, 1000);
      } else {
        this.currentStep++;
        this.orderNumber = Math.floor(Math.random() * 10000);
      }
    },
    resetOrder() {
      this.currentStep = 1;
      this.selectedItems = [];
      this.selectedTime = null;
      this.selectedPayment = 'cash';
      this.cardNumber = '';
      this.cardExpiry = '';
      this.cardCvc = '';
      this.orderNumber = Math.floor(Math.random() * 10000);
    }
  }
}
</script>

<style>
/* Базовые стили */
body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', 'Arial', sans-serif;
  background-color: #f8f8f8;
  color: #333;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Шапка в стиле MintTort */
.header {
  background-color: #96D4C1;
  color: white;
  padding: 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header p {
  margin: 8px 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f8f8;
}

.step {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #4a4a4a;
  font-weight: 600;
}

/* Корзина заказа */
.order-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.order-summary h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #4a4a4a;
}

.order-items {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  font-size: 1rem;
}

.item-quantity {
  margin: 0 10px;
  font-size: 0.9rem;
  color: #666;
}

.item-price {
  font-weight: 600;
  margin-right: 15px;
  color: #96D4C1;
}

.remove-item {
  background: none;
  border: none;
  color: #f44336;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0 6px;
  line-height: 1;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 1.1rem;
}

/* Категории меню */
.menu-categories {
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 10px;
  gap: 10px;
}

.category-tab {
  background: white;
  border: none;
  padding: 10px 18px;
  border-radius: 25px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  color: #666;
}

.category-tab.active {
  background-color: #96D4C1;
  color: white;
}

/* Карточки меню */
.menu-items {
  display: grid;
  gap: 15px;
  margin-bottom: 25px;
}

.menu-item {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.menu-item.selected {
  border-left: 4px solid #96D4C1;
  background-color: #f9f9f9;
}

.menu-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.item-image {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.item-info p {
  margin: 0 0 6px;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.4;
}

.price {
  font-weight: bold;
  color: #96D4C1;
  font-size: 1.1rem;
}

.item-controls {
  display: flex;
  align-items: center;
  position: absolute;
  right: 15px;
  bottom: 15px;
}

.quantity-btn {
  background: #96D4C1;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.2s;
}

.quantity-btn:hover {
  background: #7cb342;
}

.item-quantity {
  margin: 0 10px;
  min-width: 22px;
  text-align: center;
  font-weight: 500;
}

/* Превью заказа */
.order-preview {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.05);
}

.order-preview h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #4a4a4a;
}

.preview-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
}

.preview-total {
  font-weight: bold;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 1.1rem;
}

.preview-time {
  font-size: 0.95rem;
  color: #666;
  margin-top: 10px;
}

/* Варианты времени */
.time-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.time-option {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.time-option.selected {
  background-color: #96D4C1;
  color: white;
  border-color: #96D4C1;
}

/* Способы оплаты */
.payment-options {
  display: grid;
  gap: 12px;
  margin-bottom: 25px;
}

.payment-option {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.radio-input {
  position: absolute;
  opacity: 0;
}

.radio-custom {
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 15px;
  position: relative;
  transition: border 0.2s;
}

.radio-input:checked + .radio-custom {
  border-color: #96D4C1;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  background: #96D4C1;
  border-radius: 50%;
}

.payment-label {
  flex: 1;
  font-size: 1rem;
}

.payment-icon {
  margin-left: 10px;
  font-size: 1.3rem;
}

.payment-option.selected {
  border-color: #96D4C1;
  background-color: #f1f8e9;
}

/* Данные карты */
.card-details {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.05);
}

.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 1rem;
  transition: border 0.2s;
}

.input-field:focus {
  border-color: #96D4C1;
  outline: none;
}

.input-field.small {
  width: calc(50% - 6px);
}

.card-row {
  display: flex;
  gap: 12px;
}

/* Кнопки */
.action-button {
  background-color: #96D4C1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  letter-spacing: 0.5px;
}

.action-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.action-button:not(:disabled):hover {
  background-color: #7cb342;
}

.secondary-button {
  background-color: white;
  color: #4a4a4a;
  border: 1px solid #96D4C1;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 1.1rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.secondary-button:hover {
  background-color: #f1f8e9;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Подтверждение заказа */
.confirmation {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 30px 20px;
  margin-top: 20px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.05);
}

.confirmation-icon {
  font-size: 4rem;
  color: #96D4C1;
  margin-bottom: 20px;
  line-height: 1;
}

.confirmation h2 {
  color: #4a4a4a;
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.confirmation-items {
  text-align: left;
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.confirmation-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
}

.confirmation-item:last-child {
  border-bottom: none;
}

.total-price {
  font-weight: bold;
  font-size: 1.3rem;
  color: #96D4C1;
  margin: 20px 0;
}

/* Подвал */
.footer {
  text-align: center;
  padding: 15px;
  font-size: 0.9rem;
  color: white;
  background-color: #96D4C1;
  margin-top: auto;
}

/* Адаптация для темной темы */
@media (prefers-color-scheme: dark) {
  .main-content {
    background-color: #121212 !important;
    color: #e0e0e0;
  }
  
  h2 {
    color: #e0e0e0;
  }
  
  .menu-item,
  .time-option,
  .payment-option,
  .card-details,
  .category-tab,
  .confirmation,
  .input-field,
  .order-summary,
  .order-preview,
  .confirmation-items {
    background-color: #242424 !important;
    color: #e0e0e0;
    border-color: #333 !important;
  }
  
  .item-info p,
  .preview-item,
  .confirmation-item {
    color: #aaa;
  }
  
  .category-tab.active {
    background-color: #96D4C1;
  }
  
  .time-option.selected {
    background-color: #96D4C1 !important;
    color: white !important;
  }
  
  .payment-option.selected,
  .confirmation-items {
    background-color: #333 !important;
  }
  
  .input-field {
    background-color: #333 !important;
    color: white;
  }
  
  .secondary-button {
    background-color: #333;
    color: white;
    border-color: #96D4C1;
  }
  
  .confirmation {
    background-color: #333 !important;
  }
  
  .order-summary,
  .order-preview {
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .price,
  .item-price,
  .total-price {
    color: #96D4C1;
  }
}
</style>