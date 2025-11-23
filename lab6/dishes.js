const dishes = [
    // Супы (6 блюд)
    {
        keyword: "gazpacho",
        name: "Гаспачо",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "images/gazpacho.jpg",
        kind: "veg" // вегетарианский
    },
    {
        keyword: "mushroom_soup",
        name: "Грибной суп-пюре",
        price: 365,
        category: "soup",
        count: "330 г",
        image: "images/mushroom_soup.jpg",
        kind: "veg" // вегетарианский
    },
    {
        keyword: "norwegian_soup",
        name: "Норвежский суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "images/norwegian_soup.jpg",
        kind: "fish" // рыбный
    },
    {
        keyword: "salmon_soup",
        name: "Суп с лососем",
        price: 320,
        category: "soup",
        count: "350 г",
        image: "images/salmon_soup.jpeg",
        kind: "fish" // рыбный
    },
    {
        keyword: "chicken_soup",
        name: "Куриный суп",
        price: 240, 
        category: "soup",
        count: "350 г",
        image: "images/chicken_soup.jpeg",
        kind: "meat" // мясной
    },
    {
        keyword: "beef_soup",
        name: "Говяжий суп",
        price: 280,
        category: "soup",
        count: "350 г",
        image: "images/beef_soup.jpeg",
        kind: "meat" // мясной
    },

    // Главные блюда (6 блюд)
    {
        keyword: "fried_potatoes",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main_course",
        count: "250 г",
        image: "images/friedpotatoeswithmushrooms1.jpg",
        kind: "veg" // вегетарианское
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main_course",
        count: "310 г",
        image: "images/lasagna.jpg",
        kind: "meat" // мясное
    },
    {
        keyword: "chicken_cutlets",
        name: "Котлеты из курицы с картофельным пюре",
        price: 225,
        category: "main_course",
        count: "280 г",
        image: "images/chickencutletsandmashedpotatoes.jpg",
        kind: "meat" // мясное
    },
    {
        keyword: "grilled_salmon",
        name: "Лосось на гриле",
        price: 420,
        category: "main_course",
        count: "300 г",
        image: "images/grilled_salmon.jpeg",
        kind: "fish" // рыбное
    },
    {
        keyword: "vegetable_stew",
        name: "Овощное рагу",
        price: 180,
        category: "main_course",
        count: "300 г",
        image: "images/vegetable_stew.jpeg",
        kind: "veg" // вегетарианское
    },
    {
        keyword: "fried_fish",
        name: "Жареная рыба с овощами",
        price: 350,
        category: "main_course",
        count: "320 г",
        image: "images/fried_fish.jpeg",
        kind: "fish" // рыбное
    },

    // Салаты и стартеры (6 блюд)
    {
        keyword: "caesar_salad",
        name: "Салат Цезарь",
        price: 290,
        category: "salad",
        count: "250 г",
        image: "images/caesar_salad.jpg",
        kind: "meat" // мясной
    },
    {
        keyword: "shrimp_salad",
        name: "Салат с креветками",
        price: 380,
        category: "salad",
        count: "230 г",
        image: "images/shrimp_salad.jpeg",
        kind: "fish" // рыбный
    },
    {
        keyword: "greek_salad",
        name: "Греческий салат",
        price: 220,
        category: "salad",
        count: "280 г",
        image: "images/greek_salad.jpg",
        kind: "veg" // вегетарианский
    },
    {
        keyword: "vegetable_salad",
        name: "Овощной салат",
        price: 180,
        category: "salad",
        count: "270 г",
        image: "images/vegetable_salad.jpg",
        kind: "veg" // вегетарианский
    },
    {
        keyword: "fruit_salad",
        name: "Фруктовый салат",
        price: 160,
        category: "salad",
        count: "250 г",
        image: "images/fruit_salad.jpeg",
        kind: "veg" // вегетарианский
    },
    {
        keyword: "cheese_plate",
        name: "Сырная тарелка",
        price: 320,
        category: "salad",
        count: "200 г",
        image: "images/cheese_plate.jpg",
        kind: "veg" // вегетарианский
    },

    // Напитки (6 блюд)
    {
        keyword: "orange_juice",
        name: "Апельсиновый сок",
        price: 120,
        category: "drink",
        count: "300 мл",
        image: "images/orangejuice.jpg",
        kind: "cold" // холодный
    },
    {
        keyword: "apple_juice",
        name: "Яблочный сок",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "images/applejuice.jpg",
        kind: "cold" // холодный
    },
    {
        keyword: "carrot_juice",
        name: "Морковный сок",
        price: 110,
        category: "drink",
        count: "300 мл",
        image: "images/carrotjuice.jpg",
        kind: "cold" // холодный
    },
    {
        keyword: "coffee",
        name: "Кофе",
        price: 150,
        category: "drink",
        count: "250 мл",
        image: "images/coffee.jpg",
        kind: "hot" // горячий
    },
    {
        keyword: "tea",
        name: "Чай",
        price: 100,
        category: "drink",
        count: "300 мл",
        image: "images/tea.jpg",
        kind: "hot" // горячий
    },
    {
        keyword: "hot_chocolate",
        name: "Горячий шоколад",
        price: 180,
        category: "drink",
        count: "250 мл",
        image: "images/hot_chocolate.jpg",
        kind: "hot" // горячий
    },

    // Десерты (6 блюд)
    {
        keyword: "chocolate_cake",
        name: "Шоколадный торт",
        price: 210,
        category: "dessert",
        count: "150 г",
        image: "images/chocolate_cake.jpeg",
        kind: "small" // маленькая порция
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк",
        price: 240,
        category: "dessert",
        count: "180 г",
        image: "images/cheesecake.jpeg",
        kind: "small" // маленькая порция
    },
    {
        keyword: "ice_cream",
        name: "Мороженое",
        price: 130,
        category: "dessert",
        count: "120 г",
        image: "images/ice_cream.jpeg",
        kind: "small" // маленькая порция
    },
    {
        keyword: "apple_pie",
        name: "Яблочный пирог",
        price: 190,
        category: "dessert",
        count: "200 г",
        image: "images/apple_pie.jpeg",
        kind: "medium" // средняя порция
    },
    {
        keyword: "pancakes",
        name: "Блины с вареньем",
        price: 170,
        category: "dessert",
        count: "220 г",
        image: "images/pancakes.jpg",
        kind: "medium" // средняя порция
    },
    {
        keyword: "big_cake",
        name: "Большой торт",
        price: 350,
        category: "dessert",
        count: "300 г",
        image: "images/big_cake.jpeg",
        kind: "large" // большая порция
    }
];