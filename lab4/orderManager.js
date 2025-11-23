
// Объект для хранения выбранных блюд по категориям
let selectedDishes = {
    soup: null,
    main_course: null,
    drink: null
};

// Инициализация функционала выбора блюд
function initializeDishSelection() {
    // Добавляем обработчики для кнопок "Добавить"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            const dishElement = e.target.closest('.dish-item');
            const dishKeyword = dishElement.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                selectDish(dish);
            }
        }
    });
    
    updateOrderDisplay();
}

// Функция выбора блюда
function selectDish(dish) {
    // Снимаем выделение со всех блюд в этой категории
    const categoryDishes = document.querySelectorAll('.dish-item');
    categoryDishes.forEach(item => {
        const itemDish = dishes.find(d => d.keyword === item.getAttribute('data-dish'));
        if (itemDish && itemDish.category === dish.category) {
            item.classList.remove('selected');
        }
    });
    
    // Выделяем выбранное блюдо
    const selectedElement = document.querySelector(`.dish-item[data-dish="${dish.keyword}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    selectedDishes[dish.category] = dish;
    
    updateOrderDisplay();
    updateFormSelects();
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
        { key: 'drink', name: 'Напиток' }
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
        drink: 'Напиток не выбран'
    };
    return texts[category] || 'Блюдо не выбрано';
}

// Обновление выпадающих списков в форме
function updateFormSelects() {
    if (selectedDishes.soup) {
        document.getElementById('soup').value = selectedDishes.soup.keyword;
    }
    if (selectedDishes.main_course) {
        document.getElementById('main_course').value = selectedDishes.main_course.keyword;
    }
    if (selectedDishes.drink) {
        document.getElementById('drink').value = selectedDishes.drink.keyword;
    }
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