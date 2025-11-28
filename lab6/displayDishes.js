
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем инициализацию...');
    
    // Сортируем блюда в алфавитном порядке по названию
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main_course: sortedDishes.filter(dish => dish.category === 'main_course'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    console.log('Блюда по категориям:', {
        soup: dishesByCategory.soup.length,
        main_course: dishesByCategory.main_course.length,
        salad: dishesByCategory.salad.length,
        drink: dishesByCategory.drink.length,
        dessert: dishesByCategory.dessert.length
    });
    
    // Отображаем блюда по категориям в соответствующих контейнерах
    displayDishesByCategory('soup', dishesByCategory.soup, '.bluda');
    displayDishesByCategory('main_course', dishesByCategory.main_course, '.mainbluda');
    displayDishesByCategory('salad', dishesByCategory.salad, '.salads');
    displayDishesByCategory('drink', dishesByCategory.drink, '.drinks');
    displayDishesByCategory('dessert', dishesByCategory.dessert, '.desserts');
    
    // Инициализируем функционал выбора блюд
    initializeDishSelection();
    
    // Инициализируем фильтры
    if (typeof initializeFilters === 'function') {
        initializeFilters();
    } else {
        console.error('Функция initializeFilters не найдена!');
    }
});

// Функция для отображения блюд определенной категории в указанном контейнере
function displayDishesByCategory(category, dishesArray, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Контейнер не найден:', containerSelector);
        return;
    }
    
    console.log(`Отображаем ${dishesArray.length} блюд в ${containerSelector}`);
    
    container.innerHTML = '';
    
    dishesArray.forEach(dish => {
        const dishElement = createDishElement(dish);
        container.appendChild(dishElement);
    });
}

// Функция для создания HTML-элемента блюда
function createDishElement(dish) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish-item';
    dishDiv.setAttribute('data-dish', dish.keyword);
    dishDiv.setAttribute('data-kind', dish.kind);
    
    dishDiv.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">        
        <p class="price">${dish.price}Р</p>                 
        <p class="name">${dish.name}</p>                    
        <p class="count">${dish.count}</p>                  
        <button class="add-btn">Добавить</button>           
    `;
    
    return dishDiv;
}

// Делаем функции доступными глобально
window.displayDishesByCategory = displayDishesByCategory;
window.createDishElement = createDishElement;