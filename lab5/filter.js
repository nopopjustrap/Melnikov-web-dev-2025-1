// filters.js

function initializeFilters() {
    console.log('Инициализация фильтров...');
    
    // Добавляем обработчики для всех кнопок фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Найдено кнопок фильтров:', filterButtons.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Клик по фильтру:', this.textContent);
            
            const filterContainer = this.closest('.filters');
            const category = getCategoryFromFilters(filterContainer);
            const kind = this.getAttribute('data-kind');
            
            console.log('Категория:', category, 'Тип:', kind);
            
            // Переключаем активное состояние
            if (this.classList.contains('active')) {
                // Если фильтр уже активен, снимаем фильтр
                this.classList.remove('active');
                showAllDishes(category);
                console.log('Фильтр снят');
            } else {
                // Деактивируем все кнопки в этой группе фильтров
                const allButtons = filterContainer.querySelectorAll('.filter-btn');
                allButtons.forEach(btn => btn.classList.remove('active'));
                
                // Активируем текущую кнопку
                this.classList.add('active');
                
                // Применяем фильтр
                filterDishesByKind(category, kind);
                console.log('Фильтр применен:', kind);
            }
        });
    });
}

function getCategoryFromFilters(filterContainer) {
    if (!filterContainer) return '';
    
    const containerId = filterContainer.id;
    console.log('ID контейнера фильтров:', containerId);
    
    switch(containerId) {
        case 'soup-filters': return 'soup';
        case 'main-course-filters': return 'main_course';
        case 'salad-filters': return 'salad';
        case 'drink-filters': return 'drink';
        case 'dessert-filters': return 'dessert';
        default: return '';
    }
}

function filterDishesByKind(category, kind) {
    console.log('Фильтрация:', category, kind);
    
    let containerSelector;
    
    // Определяем селектор контейнера для категории
    switch(category) {
        case 'soup': containerSelector = '.bluda'; break;
        case 'main_course': containerSelector = '.mainbluda'; break;
        case 'salad': containerSelector = '.salads'; break;
        case 'drink': containerSelector = '.drinks'; break;
        case 'dessert': containerSelector = '.desserts'; break;
        default: 
            console.log('Неизвестная категория:', category);
            return;
    }
    
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.log('Контейнер не найден:', containerSelector);
        return;
    }
    
    const allDishes = container.querySelectorAll('.dish-item');
    console.log('Всего блюд в категории:', allDishes.length);
    
    // Скрываем все блюда
    allDishes.forEach(dish => {
        dish.style.display = 'none';
    });
    
    // Показываем только блюда с нужным kind
    const filteredDishes = container.querySelectorAll(`.dish-item[data-kind="${kind}"]`);
    console.log('Найдено отфильтрованных блюд:', filteredDishes.length);
    
    filteredDishes.forEach(dish => {
        dish.style.display = 'flex';
    });
}

function showAllDishes(category) {
    console.log('Показ всех блюд для категории:', category);
    
    let containerSelector;
    
    switch(category) {
        case 'soup': containerSelector = '.bluda'; break;
        case 'main_course': containerSelector = '.mainbluda'; break;
        case 'salad': containerSelector = '.salads'; break;
        case 'drink': containerSelector = '.drinks'; break;
        case 'dessert': containerSelector = '.desserts'; break;
        default: return;
    }
    
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const allDishes = container.querySelectorAll('.dish-item');
    console.log('Показываем все', allDishes.length, 'блюд');
    
    // Показываем все блюда
    allDishes.forEach(dish => {
        dish.style.display = 'flex';
    });
}

// Делаем функцию доступной глобально
window.initializeFilters = initializeFilters;