<template>
  <div class="app-container">
    <!-- Шапка в стиле TGIFridays -->
    <header class="header">
      <h1>🍔 Кафе "Вкусно"</h1>
      <p>Доставка еды</p>
    </header>

    <main class="main-content">
      <!-- Шаг 1: Выбор блюд -->
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

        <h2>Выберите блюда</h2>
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
      <p>Кафе "Вкусно" · Доставка · 8 (800) 123-45-67</p>
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
      selectedItems: [], // Массив объектов {id, quantity}
      selectedTime: null,
      selectedPayment: 'cash',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      orderNumber: Math.floor(Math.random() * 10000),
      categories: [
        { id: 1, name: 'Бургеры' },
        { id: 2, name: 'Пицца' },
        { id: 3, name: 'Паста' },
        { id: 4, name: 'Салаты' },
        { id: 5, name: 'Закуски' },
        { id: 6, name: 'Десерты' },
        { id: 7, name: 'Напитки' }
      ],
      menu: [
        // Бургеры
        {
          id: 1,
          categoryId: 1,
          name: 'Классический бургер',
          description: 'Говяжья котлета, сыр, салат, соус',
          price: 350,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 2,
          categoryId: 1,
          name: 'Чизбургер',
          description: 'Двойная котлета, сыр чеддер, бекон',
          price: 420,
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 3,
          categoryId: 1,
          name: 'Чикенбургер',
          description: 'Куриная котлета, салат, соус',
          price: 380,
          image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Пицца
        {
          id: 4,
          categoryId: 2,
          name: 'Пицца Маргарита',
          description: 'Томаты, сыр моцарелла, базилик',
          price: 450,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 5,
          categoryId: 2,
          name: 'Пицца Пепперони',
          description: 'Острая колбаса, сыр, томатный соус',
          price: 490,
          image: 'https://images.unsplash.com/photo-1620374645498-af6bd681a0bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 6,
          categoryId: 2,
          name: 'Пицца 4 сыра',
          description: 'Моцарелла, горгонзола, пармезан, чеддер',
          price: 520,
          image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Паста
        {
          id: 7,
          categoryId: 3,
          name: 'Карбонара',
          description: 'Спагетти, бекон, сливочный соус, яйцо',
          price: 420,
          image: 'https://images.unsplash.com/photo-1611270633750-8e1d069b5e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 8,
          categoryId: 3,
          name: 'Болоньезе',
          description: 'Спагетти, мясной соус, пармезан',
          price: 440,
          image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Салаты
        {
          id: 9,
          categoryId: 4,
          name: 'Салат Цезарь',
          description: 'Курица, салат, сухарики, соус',
          price: 280,
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 10,
          categoryId: 4,
          name: 'Греческий салат',
          description: 'Овощи, сыр фета, оливки',
          price: 320,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Закуски
        {
          id: 11,
          categoryId: 5,
          name: 'Картофель фри',
          description: 'Свежий картофель с соусом',
          price: 180,
          image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 12,
          categoryId: 5,
          name: 'Куриные крылья',
          description: 'Хрустящие крылья в соусе',
          price: 290,
          image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Десерты
        {
          id: 13,
          categoryId: 6,
          name: 'Тирамису',
          description: 'Классический итальянский десерт',
          price: 320,
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 14,
          categoryId: 6,
          name: 'Чизкейк',
          description: 'Нежный десерт с ягодным соусом',
          price: 340,
          image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        // Напитки
        {
          id: 15,
          categoryId: 7,
          name: 'Кофе латте',
          description: 'Эспрессо с молоком',
          price: 180,
          image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 16,
          categoryId: 7,
          name: 'Лимонад',
          description: 'Домашний лимонад с мятой',
          price: 150,
          image: 'https://images.unsplash.com/photo-1551751299-1b51cab2694c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 17,
          categoryId: 7,
          name: 'Кола',
          description: '0.33л',
          price: 120,
          image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
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
        // Здесь должна быть логика обработки платежа
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
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Шапка в стиле TGIFridays */
.header {
  background-color: #1a1a1a;
  color: white;
  padding: 16px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header p {
  margin: 4px 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.main-content {
  flex: 1;
  padding: 16px;
  background-color: #f5f5f5;
}

.step {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.3rem;
  color: #1a1a1a;
}

/* Корзина заказа */
.order-summary {
  background: white;
  border-radius: 0;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-summary h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.order-items {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  font-size: 0.9rem;
}

.item-quantity {
  margin: 0 8px;
  font-size: 0.9rem;
  color: #666;
}

.item-price {
  font-weight: 500;
  margin-right: 12px;
}

.remove-item {
  background: none;
  border: none;
  color: #e21a1a;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

/* Категории меню */
.menu-categories {
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  margin-bottom: 16px;
  padding-bottom: 8px;
  gap: 8px;
}

.category-tab {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab.active {
  background-color: #e21a1a;
  color: white;
}

/* Карточки меню */
.menu-items {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  background: white;
  border-radius: 0;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid transparent;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
}

.menu-item.selected {
  border-left-color: #e21a1a;
  background-color: #f9f9f9;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 500;
}

.item-info p {
  margin: 0 0 4px;
  font-size: 0.9rem;
  color: #666;
}

.price {
  font-weight: bold;
  color: #e21a1a;
}

.item-controls {
  display: flex;
  align-items: center;
  position: absolute;
  right: 12px;
  bottom: 12px;
}

.quantity-btn {
  background: #e21a1a;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
}

.item-quantity {
  margin: 0 8px;
  min-width: 20px;
  text-align: center;
}

/* Превью заказа */
.order-preview {
  background: white;
  border-radius: 0;
  padding: 16px;
  margin-bottom: 20px;
}

.order-preview h3 {
  margin-top: 0;
  margin-bottom: 12px;
}

.preview-item {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.preview-total {
  font-weight: bold;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #eee;
}

.preview-time {
  font-size: 0.9rem;
  color: #666;
  margin-top: 8px;
}

/* Варианты времени */
.time-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.time-option {
  background: white;
  border: 1px solid #ddd;
  border-radius: 0;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.time-option.selected {
  background-color: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}

/* Способы оплаты */
.payment-options {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
}

.payment-option {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0;
  padding: 12px;
  cursor: pointer;
  position: relative;
  border-left: 4px solid transparent;
}

.radio-input {
  position: absolute;
  opacity: 0;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 12px;
  position: relative;
}

.radio-input:checked + .radio-custom {
  border-color: #e21a1a;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  background: #e21a1a;
  border-radius: 50%;
}

.payment-label {
  flex: 1;
  font-size: 0.9rem;
}

.payment-icon {
  margin-left: 8px;
  font-size: 1.2rem;
}

.payment-option.selected {
  border-left-color: #e21a1a;
  background-color: #f9f9f9;
}

/* Данные карты */
.card-details {
  background: white;
  border-radius: 0;
  padding: 16px;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 0;
  margin-bottom: 12px;
  font-size: 1rem;
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
  background-color: #e21a1a;
  color: white;
  border: none;
  border-radius: 0;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button:not(:disabled):hover {
  background-color: #c01010;
}

.secondary-button {
  background-color: white;
  color: #1a1a1a;
  border: 1px solid #1a1a1a;
  border-radius: 0;
  padding: 14px 24px;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #f0f0f0;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Подтверждение заказа */
.confirmation {
  text-align: center;
  background: white;
  border-radius: 0;
  padding: 24px;
  margin-top: 20px;
}

.confirmation-icon {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 16px;
}

.confirmation h2 {
  color: #1a1a1a;
  font-size: 1.5rem;
}

.confirmation-items {
  text-align: left;
  margin: 16px 0;
  padding: 16px;
  background: #f9f9f9;
}

.confirmation-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.confirmation-item:last-child {
  border-bottom: none;
}

.total-price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #e21a1a;
  margin: 16px 0;
}

/* Подвал */
.footer {
  text-align: center;
  padding: 12px;
  font-size: 0.8rem;
  color: white;
  background-color: #1a1a1a;
}

/* Адаптация для темной темы Telegram */
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
    background-color: #e21a1a;
  }
  
  .time-option.selected {
    background-color: #e21a1a !important;
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
    border-color: #555;
  }
  
  .confirmation {
    background-color: #333 !important;
  }
  
  .order-summary,
  .order-preview {
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
}
</style>