// Функции для страницы оформления заказа
const API_KEY = 'f2ac6844-59ac-4e10-a4ae-037da63f40e9';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';

// Загрузка и отображение выбранных блюд
function loadCheckoutDishes() {
    const container = document.getElementById('selected-dishes-checkout');
    const savedDishes = loadFromLocalStorage();
    
    const hasSelectedDishes = Object.values(savedDishes).some(dish => dish !== null && dish !== undefined);
    
    if (!hasSelectedDishes) {
        container.innerHTML = `
            <div class="no-selection-checkout">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="index.html">Собрать ланч</a>.</p>
            </div>
        `;
        updateOrderSummary();
        return;
    }
    
    displayCheckoutDishes(window.dishes, savedDishes);
    updateOrderSummary();
}

// Отображение блюд на странице оформления заказа
function displayCheckoutDishes(allDishes, savedDishes) {
    const container = document.getElementById('selected-dishes-checkout');
    container.innerHTML = '';
    
    const categories = [
        { key: 'soup', name: 'Суп' },
        { key: 'main_course', name: 'Главное блюдо' },
        { key: 'salad', name: 'Салат или стартер' },
        { key: 'drink', name: 'Напиток' },
        { key: 'dessert', name: 'Десерт' }
    ];
    
    let hasAnyDishes = false;
    
    categories.forEach(category => {
        const dishKeyword = savedDishes[category.key];
        if (dishKeyword) {
            const dish = allDishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                const dishElement = createCheckoutDishElement(dish, category.key);
                container.appendChild(dishElement);
                hasAnyDishes = true;
            }
        }
    });
    
    if (!hasAnyDishes) {
        container.innerHTML = `
            <div class="no-selection-checkout">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="index.html">Собрать ланч</a>.</p>
            </div>
        `;
    }
}

// Создание элемента блюда для страницы оформления
function createCheckoutDishElement(dish, category) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish-item checkout-dish';
    dishDiv.setAttribute('data-dish', dish.keyword);
    dishDiv.setAttribute('data-category', category);
    
    const imageUrl = dish.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    dishDiv.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">        
        <p class="price">${dish.price}Р</p>                 
        <p class="name">${dish.name}</p>                    
        <p class="count">${dish.count}</p>                  
        <button class="remove-btn" onclick="removeFromCheckout('${category}')">Удалить</button>           
    `;
    
    return dishDiv;
}

// Удаление блюда из заказа на странице оформления
function removeFromCheckout(category) {
    const savedDishes = loadFromLocalStorage();
    delete savedDishes[category];
    localStorage.setItem('selectedDishes', JSON.stringify(savedDishes));
    
    loadCheckoutDishes();
}

// Обновление сводки заказа в форме
function updateOrderSummary() {
    const summaryContainer = document.getElementById('order-summary');
    const savedDishes = loadFromLocalStorage();
    
    let html = '<div class="order-summary-content"><h4>Состав заказа</h4>';
    
    const categories = [
        { key: 'soup', name: 'Суп' },
        { key: 'main_course', name: 'Главное блюдо' },
        { key: 'salad', name: 'Салат или стартер' },
        { key: 'drink', name: 'Напиток' },
        { key: 'dessert', name: 'Десерт' }
    ];
    
    let totalPrice = 0;
    
    categories.forEach(category => {
        const dishKeyword = savedDishes[category.key];
        html += `<div class="summary-category">
                    <span class="category-name">${category.name}:</span>`;
        
        if (dishKeyword) {
            const dish = window.dishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                html += `<span class="dish-price">${dish.price}Р</span>`;
                totalPrice += dish.price;
            }
        } else {
            html += `<span class="not-selected">${getNotSelectedText(category.key)}</span>`;
        }
        
        html += '</div>';
    });
    
    html += `<div class="summary-total">
                <span class="total-name">Итого:</span>
                <span class="total-price">${totalPrice}Р</span>
            </div>
        </div>`;
    
    summaryContainer.innerHTML = html;
}

// Функция для проверки данных перед отправкой
function validateOrderData(orderData) {
    const requiredFields = ['full_name', 'email', 'phone', 'delivery_address', 'delivery_type'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!orderData[field] || orderData[field].toString().trim() === '') {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        return { isValid: false, message: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` };
    }
    
    // Проверяем email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
        return { isValid: false, message: 'Некорректный email адрес' };
    }
    
    // Проверяем телефон (простая проверка)
    if (orderData.phone.replace(/\D/g, '').length < 10) {
        return { isValid: false, message: 'Некорректный номер телефона' };
    }
    
    // Проверяем время доставки если выбран тип "ко времени"
    if (orderData.delivery_type === 'by_time' && (!orderData.delivery_time || orderData.delivery_time.trim() === '')) {
        return { isValid: false, message: 'Пожалуйста, укажите время доставки' };
    }
    
    return { isValid: true };
}

// Основная функция отправки заказа
async function submitOrder(orderData) {
    const url = `${API_URL}?api_key=${API_KEY}`;
    
    console.log('📤 Отправляем заказ на сервер...');
    console.log('URL:', url);
    console.log('Данные:', orderData);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('📨 Статус ответа:', response.status);
        console.log('URL запроса:', response.url);
        
        if (response.status === 200 || response.status === 201) {
            const result = await response.json();
            console.log('✅ Заказ успешно создан:', result);
            
            // Очищаем корзину
            localStorage.removeItem('selectedDishes');
            
            return { success: true, data: result };
        } else {
            const errorText = await response.text();
            console.error('❌ Ошибка сервера:', response.status, errorText);
            
            let errorMessage = `Ошибка ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.message || errorText;
            } catch (e) {
                errorMessage = errorText || 'Неизвестная ошибка сервера';
            }
            
            return { success: false, error: errorMessage };
        }
        
    } catch (error) {
        console.error('❌ Ошибка сети:', error);
        return { 
            success: false, 
            error: 'Ошибка сети: ' + (error.message || 'Не удалось подключиться к серверу') 
        };
    }
}

// Получение ID блюд для API
async function getDishesIds(savedDishes) {
    const dishesData = {};
    
    for (const category in savedDishes) {
        const dishKeyword = savedDishes[category];
        if (dishKeyword) {
            const dish = window.dishes.find(d => d.keyword === dishKeyword);
            if (dish && dish.id) {
                let apiCategory = category;
                if (category === 'main_course') {
                    apiCategory = 'main-course';
                }
                // Преобразуем ID в число
                dishesData[`${apiCategory}_id`] = parseInt(dish.id);
            }
        }
    }
    
    return dishesData;
}

// Валидация комбо из localStorage
function validateLunchComboFromStorage(savedDishes) {
    const comboState = {
        soup: !!savedDishes.soup,
        main_course: !!savedDishes.main_course,
        salad: !!savedDishes.salad,
        drink: !!savedDishes.drink,
        dessert: !!savedDishes.dessert
    };
    
    if (typeof window.validateLunchCombo === 'function') {
        return window.validateLunchCombo(comboState);
    }
    
    // Базовая валидация если функция не найдена
    if (!comboState.drink) {
        return { isValid: false, message: "Выберите напиток." };
    }
    
    if (!comboState.soup && !comboState.main_course && !comboState.salad) {
        return { isValid: false, message: "Выберите хотя бы одно основное блюдо." };
    }
    
    return { isValid: true };
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('selectedDishes');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Ошибка при загрузке из localStorage:', e);
            return {};
        }
    }
    return {};
}

// Получение текста для невыбранных блюд
function getNotSelectedText(category) {
    const texts = {
        soup: 'Суп не выбран',
        main_course: 'Главное блюдо не выбрано',
        salad: 'Салат или стартер не выбран',
        drink: 'Напиток не выбран',
        dessert: 'Десерт не выбран'
    };
    return texts[category] || 'Блюдо не выбрано';
}

// Показ уведомления
function showNotification(message) {
    const overlay = document.getElementById("notification");
    const msg = document.querySelector(".notification-message");

    if (!overlay || !msg) {
        alert(message);
        return;
    }

    msg.textContent = message;
    overlay.classList.add("active");

    const okButton = document.getElementById("notification-ok");
    if (okButton) {
        okButton.onclick = () => {
            overlay.classList.remove("active");
        };
    }
}

// Обработчик отправки формы
async function handleFormSubmit(event) {
    event.preventDefault();
    
    console.log('🔄 Начало обработки формы...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Преобразуем FormData в объект
    const orderData = {};
    for (let [key, value] of formData.entries()) {
        if (key === 'subscribe') {
            orderData[key] = value === '1' ? 1 : 0;
        } else if (key === 'delivery_time' && value === '' && orderData.delivery_type !== 'by_time') {
            // Пропускаем пустое время доставки если не выбран тип "ко времени"
            continue;
        } else {
            orderData[key] = value;
        }
    }
    
    console.log('📝 Данные формы:', orderData);
    
    // Добавляем данные о блюдах
    const savedDishes = loadFromLocalStorage();
    console.log('🍽️ Сохраненные блюда:', savedDishes);
    
    const dishesData = await getDishesIds(savedDishes);
    console.log('🔢 ID блюд для API:', dishesData);
    
    // Объединяем данные
    Object.assign(orderData, dishesData);
    
    console.log('📦 Итоговые данные для отправки:', orderData);
    
    // Валидация данных формы
    const formValidation = validateOrderData(orderData);
    if (!formValidation.isValid) {
        showNotification(formValidation.message);
        return;
    }
    
    // Валидация комбо
    const comboValidation = validateLunchComboFromStorage(savedDishes);
    if (!comboValidation.isValid) {
        showNotification(comboValidation.message);
        return;
    }
    
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    try {
        const result = await submitOrder(orderData);
        
        if (result.success) {
            showNotification('✅ Заказ успешно оформлен! Спасибо за ваш заказ!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showNotification(`❌ Ошибка при оформлении заказа: ${result.error}`);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    } catch (error) {
        console.error('💥 Неожиданная ошибка:', error);
        showNotification(`💥 Неожиданная ошибка: ${error.message}`);
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Инициализация страницы оформления заказа
function initializeCheckoutPage() {
    console.log('🚀 Инициализация страницы оформления заказа...');
    
    // Настраиваем обработчик времени доставки
    const timeRadio = document.querySelectorAll('input[name="delivery_type"]');
    const timeInput = document.getElementById('delivery_time_input');
    
    if (timeRadio && timeInput) {
        timeRadio.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'by_time') {
                    timeInput.disabled = false;
                    timeInput.required = true;
                } else {
                    timeInput.disabled = true;
                    timeInput.required = false;
                    timeInput.value = '';
                }
            });
        });
        
        // Изначально отключаем поле времени
        timeInput.disabled = true;
        timeInput.required = false;
    }
    
    // Настраиваем обработчик формы
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Добавляем обработчик сброса формы
        const resetButton = form.querySelector('.btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }
    }
    
    // Загружаем выбранные блюда
    loadCheckoutDishes();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Загружаем данные для страницы оформления заказа...');
    
    loadDishes().then(dishes => {
        window.dishes = dishes;
        console.log('✅ Блюда загружены:', dishes.length);
        initializeCheckoutPage();
    }).catch(error => {
        console.error('❌ Ошибка при загрузке блюд:', error);
        showNotification('❌ Ошибка при загрузке данных меню. Пожалуйста, обновите страницу.');
    });
});

// Делаем функции глобально доступными
window.removeFromCheckout = removeFromCheckout;
window.handleFormSubmit = handleFormSubmit;