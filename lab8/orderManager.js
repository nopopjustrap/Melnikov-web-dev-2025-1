// Объект для хранения выбранных блюд по категориям
let selectedDishes = {
    soup: null,
    main_course: null,
    salad: null,
    drink: null,
    dessert: null
};

// Ключ для localStorage
const STORAGE_KEY = 'selectedDishes';

// Сохранение в localStorage
function saveToLocalStorage() {
    const dishesToSave = {};
    Object.keys(selectedDishes).forEach(category => {
        if (selectedDishes[category]) {
            dishesToSave[category] = selectedDishes[category].keyword;
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishesToSave));
    console.log('Сохранено в localStorage:', dishesToSave);
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const savedDishes = JSON.parse(saved);
            console.log('Загружено из localStorage:', savedDishes);
            return savedDishes;
        } catch (e) {
            console.error('Ошибка при загрузке из localStorage:', e);
            return {};
        }
    }
    return {};
}

// Восстановление выбранных блюд из localStorage
function restoreSelectedDishes() {
    const savedDishes = loadFromLocalStorage();
    
    Object.keys(savedDishes).forEach(category => {
        const dishKeyword = savedDishes[category];
        const dish = window.dishes.find(d => d.keyword === dishKeyword);
        if (dish) {
            selectedDishes[category] = dish;
            console.log('Восстановлено блюдо:', dish.name);
        }
    });
    
    updateOrderDisplay();
    highlightSelectedDishes();
}

// Подсветка выбранных блюд
function highlightSelectedDishes() {
    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            const dishElement = document.querySelector(`.dish-item[data-dish="${dish.keyword}"]`);
            if (dishElement) {
                dishElement.classList.add('selected');
            }
        }
    });
}

// Инициализация функционала выбора блюд
function initializeDishSelection() {
    console.log('Инициализация выбора блюд...');
    
    restoreSelectedDishes();
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            console.log('Нажата кнопка Добавить');
            const dishElement = e.target.closest('.dish-item');
            const dishKeyword = dishElement.getAttribute('data-dish');
            
            const dish = window.dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                console.log('Найдено блюдо:', dish.name);
                selectDish(dish);
            } else {
                console.error('Блюдо не найдено по keyword:', dishKeyword);
            }
        }
    });
    
    updateOrderDisplay();
}

// Функция выбора блюда
function selectDish(dish) {
    console.log('Выбрано блюдо:', dish.name);
    
    const categoryDishes = document.querySelectorAll('.dish-item');
    categoryDishes.forEach(item => {
        const itemDish = window.dishes.find(d => d.keyword === item.getAttribute('data-dish'));
        if (itemDish && itemDish.category === dish.category) {
            item.classList.remove('selected');
        }
    });
    
    const selectedElement = document.querySelector(`.dish-item[data-dish="${dish.keyword}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    selectedDishes[dish.category] = dish;
    
    saveToLocalStorage();
    
    updateOrderDisplay();
}

// Удаление блюда из заказа
function removeDish(category) {
    if (selectedDishes[category]) {
        console.log('Удалено блюдо:', selectedDishes[category].name);
        
        const dishElement = document.querySelector(`.dish-item[data-dish="${selectedDishes[category].keyword}"]`);
        if (dishElement) {
            dishElement.classList.remove('selected');
        }
        
        selectedDishes[category] = null;
        
        saveToLocalStorage();
        
        updateOrderDisplay();
    }
}

// Получить данные для отправки на сервер
function getOrderData() {
    const orderData = {};
    
    Object.keys(selectedDishes).forEach(category => {
        if (selectedDishes[category]) {
            let apiCategory = category;
            if (category === 'main_course') {
                apiCategory = 'main-course';
            }
            
            const dish = window.dishes.find(d => d.keyword === selectedDishes[category].keyword);
            if (dish && dish.id) {
                orderData[`${apiCategory}_id`] = dish.id;
            }
        }
    });
    
    return orderData;
}

// Очистка заказа
function clearOrder() {
    Object.keys(selectedDishes).forEach(category => {
        selectedDishes[category] = null;
    });
    localStorage.removeItem(STORAGE_KEY);
    updateOrderDisplay();
}

// Обновление отображения выбранных блюд
function updateOrderDisplay() {
    const orderSection = document.querySelector('.order-section');
    if (!orderSection) return;
    
    let selectedDishesContainer = document.querySelector('.selected-dishes-container');
    if (!selectedDishesContainer) {
        selectedDishesContainer = document.createElement('div');
        selectedDishesContainer.className = 'selected-dishes-container';
        orderSection.appendChild(selectedDishesContainer);
    }
    
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasSelectedDishes) {
        selectedDishesContainer.innerHTML = `
            <div class="no-selection">
                <p>Ничего не выбрано</p>
            </div>
        `;
        hideCheckoutPanel();
        return;
    }
    
    let html = '<div class="selected-dishes"><h3>Ваш выбор</h3>';
    
    const categories = [
        { key: 'soup', name: 'Суп' },
        { key: 'main_course', name: 'Главное блюдо' },
        { key: 'salad', name: 'Салат или стартер' },
        { key: 'drink', name: 'Напиток' },
        { key: 'dessert', name: 'Десерт' }
    ];
    
    categories.forEach(category => {
        const dish = selectedDishes[category.key];
        html += `<div class="selected-category">
                    <h4>${category.name}</h4>`;
        
        if (dish) {
            html += `<p>${dish.name} - ${dish.price}Р</p>`;
        } else {
            html += `<p class="not-selected">${getNotSelectedText(category.key)}</p>`;
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    selectedDishesContainer.innerHTML = html;
    
    showCheckoutPanel();
}

// Показ панели оформления заказа
function showCheckoutPanel() {
    let checkoutPanel = document.querySelector('.checkout-panel');
    if (!checkoutPanel) {
        checkoutPanel = document.createElement('div');
        checkoutPanel.className = 'checkout-panel';
        document.querySelector('.order-section').appendChild(checkoutPanel);
    }
    
    const totalPrice = calculateTotalPrice();
    const isValidCombo = window.validateLunchCombo ? window.validateLunchCombo(selectedDishes).isValid : true;
    
    checkoutPanel.innerHTML = `
        <div class="checkout-content">
            <div class="checkout-price">
                <h4>Стоимость заказа</h4>
                <p class="price">${totalPrice}Р</p>
            </div>
            <a href="checkout.html" class="checkout-btn ${isValidCombo ? '' : 'disabled'}">
                Перейти к оформлению
            </a>
        </div>
    `;
}

// Скрытие панели оформления заказа
function hideCheckoutPanel() {
    const checkoutPanel = document.querySelector('.checkout-panel');
    if (checkoutPanel) {
        checkoutPanel.remove();
    }
}

// Расчет общей стоимости заказа
function calculateTotalPrice() {
    return Object.values(selectedDishes)
        .filter(dish => dish !== null)
        .reduce((total, dish) => total + dish.price, 0);
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

// Делаем функции глобально доступными
window.initializeDishSelection = initializeDishSelection;
window.selectDish = selectDish;
window.updateOrderDisplay = updateOrderDisplay;
window.removeDish = removeDish;
window.getOrderData = getOrderData;
window.clearOrder = clearOrder;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.restoreSelectedDishes = restoreSelectedDishes;
window.calculateTotalPrice = calculateTotalPrice;