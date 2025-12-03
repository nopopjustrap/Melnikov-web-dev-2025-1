// Функция для загрузки данных о блюдах с сервера
function loadDishes() {
    const apiKey = 'f2ac6844-59ac-4e10-a4ae-037da63f40e9';
    const apiUrl = `https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${apiKey}`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }
            return response.json();
        })
        .then(apiDishes => {
            console.log('Данные загружены с сервера:', apiDishes);
            return transformApiData(apiDishes);
        })
        .catch(error => {
            console.error('Ошибка при загрузке блюд:', error);
            showNotification('Ошибка загрузки меню. Пожалуйста, обновите страницу.');
            return getLocalDishes();
        });
}

// Функция для преобразования данных API в формат вашего приложения
function transformApiData(apiDishes) {
    return apiDishes.map(dish => {
        let category = dish.category;
        if (category === 'main-course') {
            category = 'main_course';
        }
        
        return {
            id: dish.id,
            keyword: dish.keyword,
            name: dish.name,
            price: dish.price,
            category: category,
            count: dish.count,
            image: dish.image,
            kind: dish.kind
        };
    });
}

// Локальные данные как fallback (обновлены по данным из API)
function getLocalDishes() {
    return [
        // Супы
        {
            id: 1,
            keyword: "gaspacho",
            name: "Гаспачо",
            price: 195,
            category: "soup",
            count: "350 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/gazpacho",
            kind: "veg"
        },
        {
            id: 2,
            keyword: "gribnoy",
            name: "Грибной суп-пюре",
            price: 185,
            category: "soup",
            count: "330 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/mushroom_soup",
            kind: "veg"
        },
        {
            id: 3,
            keyword: "norvezhskiy",
            name: "Норвежский суп",
            price: 270,
            category: "soup",
            count: "330 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/norwegian_soup",
            kind: "fish"
        },
        {
            id: 4,
            keyword: "ramen",
            name: "Рамен",
            price: 375,
            category: "soup",
            count: "425 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/ramen",
            kind: "meat"
        },
        {
            id: 5,
            keyword: "tomyum",
            name: "Том ям с креветками",
            price: 650,
            category: "soup",
            count: "500 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/tomyum",
            kind: "fish"
        },
        {
            id: 6,
            keyword: "chicken",
            name: "Куриный суп",
            price: 330,
            category: "soup",
            count: "350 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/soups/chicken",
            kind: "meat"
        },

        // Главные блюда
        {
            id: 7,
            keyword: "zharenaya-kartoshka",
            name: "Жареная картошка с грибами",
            price: 150,
            category: "main_course",
            count: "250 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/friedpotatoeswithmushrooms1",
            kind: "veg"
        },
        {
            id: 8,
            keyword: "lazanya",
            name: "Лазанья",
            price: 385,
            category: "main_course",
            count: "310 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/lasagna",
            kind: "meat"
        },
        {
            id: 9,
            keyword: "kotlety-s-pyure",
            name: "Котлеты из курицы с картофельным пюре",
            price: 225,
            category: "main_course",
            count: "280 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/chickencutletsandmashedpotatoes",
            kind: "meat"
        },
        {
            id: 10,
            keyword: "fishrice",
            name: "Рыбная котлета с рисом и спаржей",
            price: 320,
            category: "main_course",
            count: "270 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/fishrice",
            kind: "fish"
        },
        {
            id: 11,
            keyword: "pizza",
            name: "Пицца Маргарита",
            price: 450,
            category: "main_course",
            count: "470 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/pizza",
            kind: "veg"
        },
        {
            id: 12,
            keyword: "shrimppasta",
            name: "Паста с креветками",
            price: 340,
            category: "main_course",
            count: "280 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/main_course/shrimppasta",
            kind: "fish"
        },

        // Салаты
        {
            id: 13,
            keyword: "saladwithegg",
            name: "Корейский салат с овощами и яйцом",
            price: 330,
            category: "salad",
            count: "250 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/saladwithegg",
            kind: "veg"
        },
        {
            id: 14,
            keyword: "caesar",
            name: "Цезарь с цыпленком",
            price: 370,
            category: "salad",
            count: "220 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/caesar",
            kind: "meat"
        },
        {
            id: 15,
            keyword: "caprese",
            name: "Капрезе",
            price: 290,
            category: "salad",
            count: "235 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/caprese",
            kind: "veg"
        },
        {
            id: 16,
            keyword: "grecheskiy",
            name: "Греческий салат",
            price: 310,
            category: "salad",
            count: "280 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/grecheskiy",
            kind: "veg"
        },
        {
            id: 17,
            keyword: "tsezar-s-krevetkami",
            name: "Цезарь с креветками",
            price: 420,
            category: "salad",
            count: "230 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/tsezar-s-krevetkami",
            kind: "fish"
        },
        {
            id: 18,
            keyword: "ovoshchnoy",
            name: "Овощной салат",
            price: 240,
            category: "salad",
            count: "270 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/salads_starters/ovoshchnoy",
            kind: "veg"
        },

        // Напитки (предположительные данные - нужно уточнить из API)
        {
            id: 19,
            keyword: "orange-juice",
            name: "Апельсиновый сок",
            price: 120,
            category: "drink",
            count: "300 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/orangejuice",
            kind: "cold"
        },
        {
            id: 20,
            keyword: "apple-juice",
            name: "Яблочный сок",
            price: 90,
            category: "drink",
            count: "300 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/applejuice",
            kind: "cold"
        },
        {
            id: 21,
            keyword: "coffee",
            name: "Кофе",
            price: 150,
            category: "drink",
            count: "250 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/coffee",
            kind: "hot"
        },
        {
            id: 22,
            keyword: "tea",
            name: "Чай",
            price: 100,
            category: "drink",
            count: "300 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/tea",
            kind: "hot"
        },
        {
            id: 23,
            keyword: "cola",
            name: "Кола",
            price: 110,
            category: "drink",
            count: "330 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/cola",
            kind: "cold"
        },
        {
            id: 24,
            keyword: "mineral-water",
            name: "Минеральная вода",
            price: 80,
            category: "drink",
            count: "500 мл",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/drinks/water",
            kind: "cold"
        },

        // Десерты (предположительные данные - нужно уточнить из API)
        {
            id: 25,
            keyword: "chocolate-cake",
            name: "Шоколадный торт",
            price: 210,
            category: "dessert",
            count: "150 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/chocolate_cake",
            kind: "small"
        },
        {
            id: 26,
            keyword: "cheesecake",
            name: "Чизкейк",
            price: 240,
            category: "dessert",
            count: "180 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/cheesecake",
            kind: "small"
        },
        {
            id: 27,
            keyword: "ice-cream",
            name: "Мороженое",
            price: 130,
            category: "dessert",
            count: "120 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/ice_cream",
            kind: "small"
        },
        {
            id: 28,
            keyword: "apple-pie",
            name: "Яблочный пирог",
            price: 190,
            category: "dessert",
            count: "200 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/apple_pie",
            kind: "medium"
        },
        {
            id: 29,
            keyword: "pancakes",
            name: "Блины с вареньем",
            price: 170,
            category: "dessert",
            count: "220 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/pancakes",
            kind: "medium"
        },
        {
            id: 30,
            keyword: "big-cake",
            name: "Большой торт",
            price: 350,
            category: "dessert",
            count: "300 г",
            image: "https://edu.std-900.ist.mospolytech.ru/labs/api/images/desserts/big_cake",
            kind: "large"
        }
    ];
}

// Функция для показа уведомления
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const messageElement = notification.querySelector('.notification-message');
    messageElement.textContent = message;
    notification.classList.add('active');
    
    const okButton = document.getElementById('notification-ok');
    if (okButton) {
        okButton.onclick = function() {
            notification.classList.remove('active');
        };
    }
}

// Глобальная переменная для хранения блюд
let dishes = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем загрузку данных с API...');
    
    loadDishes().then(loadedDishes => {
        if (loadedDishes && loadedDishes.length > 0) {
            window.dishes = loadedDishes;
            console.log('Данные успешно загружены и преобразованы:', window.dishes);
            initializeApp();
        } else {
            console.error('Не удалось загрузить данные с сервера');
        }
    });
});

function initializeApp() {
    const sortedDishes = [...window.dishes].sort((a, b) => a.name.localeCompare(b.name));
    
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
    
    if (typeof displayDishesByCategory === 'function') {
        displayDishesByCategory('soup', dishesByCategory.soup, '.bluda');
        displayDishesByCategory('main_course', dishesByCategory.main_course, '.mainbluda');
        displayDishesByCategory('salad', dishesByCategory.salad, '.salads');
        displayDishesByCategory('drink', dishesByCategory.drink, '.drinks');
        displayDishesByCategory('dessert', dishesByCategory.dessert, '.desserts');
    } else {
        console.error('Функция displayDishesByCategory не найдена!');
    }
    
    setTimeout(() => {
        if (typeof initializeDishSelection === 'function') {
            console.log('Инициализируем выбор блюд...');
            initializeDishSelection();
        } else {
            console.error('Функция initializeDishSelection не найдена!');
        }
    }, 100);
    
    setTimeout(() => {
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        } else {
            console.error('Функция initializeFilters не найдена!');
        }
    }, 100);
}