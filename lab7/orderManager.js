
// Объект для хранения выбранных блюд по категориям
let selectedDishes = {
    soup: null,
    main_course: null,
    salad: null,
    drink: null,
    dessert: null
};

// Инициализация функционала выбора блюд
function initializeDishSelection() {
    console.log('Инициализация выбора блюд...');
    
    // Добавляем обработчики для кнопок "Добавить"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            console.log('Нажата кнопка Добавить');
            const dishElement = e.target.closest('.dish-item');
            const dishKeyword = dishElement.getAttribute('data-dish');
            
            // Используем window.dishes вместо dishes
            const dish = window.dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                console.log('Найдено блюдо:', dish.name);
                selectDish(dish);
            } else {
                console.error('Блюдо не найдено по keyword:', dishKeyword);
                console.log('Доступные блюда:', window.dishes);
            }
        }
    });
    
    // Инициализируем отображение заказа
    updateOrderDisplay();
}

// Функция выбора блюда
function selectDish(dish) {
    console.log('Выбрано блюдо:', dish.name);
    
    // Снимаем выделение со всех блюд в этой категории
    const categoryDishes = document.querySelectorAll('.dish-item');
    categoryDishes.forEach(item => {
        const itemDish = window.dishes.find(d => d.keyword === item.getAttribute('data-dish'));
        if (itemDish && itemDish.category === dish.category) {
            item.classList.remove('selected');
        }
    });
    
    // Выделяем выбранное блюдо
    const selectedElement = document.querySelector(`.dish-item[data-dish="${dish.keyword}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    // Сохраняем выбранное блюдо
    selectedDishes[dish.category] = dish;
    
    // Обновляем отображение заказа
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
        const form = orderSection.querySelector('.order-form');
        orderSection.insertBefore(selectedDishesContainer, form);
    }
    
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasSelectedDishes) {
        selectedDishesContainer.innerHTML = `
            <div class="no-selection">
                <p>Ничего не выбрано</p>
            </div>
        `;
        hidePriceBlock();
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
    
    showPriceBlock();
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

// Показ блока с общей стоимостью
function showPriceBlock() {
    let priceBlock = document.querySelector('.price-block');
    if (!priceBlock) {
        priceBlock = document.createElement('div');
        priceBlock.className = 'price-block';
        document.querySelector('.selected-dishes').appendChild(priceBlock);
    }
    
    const totalPrice = calculateTotalPrice();
    priceBlock.innerHTML = `
        <div class="total-price">
            <h4>Стоимость заказа</h4>
            <p class="price">${totalPrice}Р</p>
        </div>
    `;
}

// Скрытие блока с ценой
function hidePriceBlock() {
    const priceBlock = document.querySelector('.price-block');
    if (priceBlock) {
        priceBlock.remove();
    }
}

// Расчет общей стоимости заказа
function calculateTotalPrice() {
    return Object.values(selectedDishes)
        .filter(dish => dish !== null)
        .reduce((total, dish) => total + dish.price, 0);
}

// Делаем функции глобально доступными
window.initializeDishSelection = initializeDishSelection;
window.selectDish = selectDish;
window.updateOrderDisplay = updateOrderDisplay;