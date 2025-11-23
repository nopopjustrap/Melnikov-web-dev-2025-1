// Ожидаем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Сортируем блюда в алфавитном порядке по названию
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main_course: sortedDishes.filter(dish => dish.category === 'main_course'),
        drink: sortedDishes.filter(dish => dish.category === 'drink')
    };
    
    // Отображаем блюда по категориям в соответствующих контейнерах
    displayDishesByCategory('soup', dishesByCategory.soup, '.bluda');
    displayDishesByCategory('main_course', dishesByCategory.main_course, '.mainbluda');
    displayDishesByCategory('drink', dishesByCategory.drink, '.drinks');
    
    initializeDishSelection();
});

// Функция для отображения блюд определенной категории в указанном контейнере
function displayDishesByCategory(category, dishesArray, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
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
    
    dishDiv.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">        
        <p class="price">${dish.price}Р</p>                 
        <p class="name">${dish.name}</p>                    
        <p class="count">${dish.count}</p>                  
        <button class="add-btn">Добавить</button>           
    `;
    
    return dishDiv;
}