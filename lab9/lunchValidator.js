// Возможные комбо ланча
const validCombos = [
    { soup: true, main_course: true, salad: true, drink: true },      
    { soup: true, main_course: true, drink: true },                   
    { soup: true, salad: true, drink: true },                         
    { main_course: true, salad: true, drink: true },                  
    { main_course: true, drink: true }                                
];

// Проверка комбо
function validateLunchCombo(selectedDishes) {
    const hasSoup = selectedDishes.soup !== null && selectedDishes.soup !== false;
    const hasMainCourse = selectedDishes.main_course !== null && selectedDishes.main_course !== false;
    const hasSalad = selectedDishes.salad !== null && selectedDishes.salad !== false;
    const hasDrink = selectedDishes.drink !== null && selectedDishes.drink !== false;
    const hasDessert = selectedDishes.dessert !== null && selectedDishes.dessert !== false;

    // Если вообще ничего не выбрано
    if (!hasSoup && !hasMainCourse && !hasSalad && !hasDrink && !hasDessert) {
        return { isValid: false, message: "Ничего не выбрано. Выберите блюда для заказа." };
    }

    const currentCombo = { soup: hasSoup, main_course: hasMainCourse, salad: hasSalad, drink: hasDrink };

    // Проверка соответствует ли набор хотя бы одному комбо
    const isValidCombo = validCombos.some(combo =>
        (!combo.soup || combo.soup === currentCombo.soup) &&
        (!combo.main_course || combo.main_course === currentCombo.main_course) &&
        (!combo.salad || combo.salad === currentCombo.salad) &&
        (!combo.drink || combo.drink === currentCombo.drink)
    );

    if (isValidCombo) {
        return { isValid: true };
    }

    // Логика ошибок
    if (!hasDrink && (hasSoup || hasMainCourse || hasSalad)) {
        return { isValid: false, message: "Выберите напиток." };
    }

    if (hasSoup && !hasMainCourse && !hasSalad) {
        return { isValid: false, message: "Выберите главное блюдо, салат или стартер." };
    }

    if (hasSalad && !hasSoup && !hasMainCourse) {
        return { isValid: false, message: "Выберите суп или главное блюдо." };
    }

    if ((hasDrink || hasDessert) && !hasSoup && !hasMainCourse && !hasSalad) {
        return { isValid: false, message: "Выберите главное блюдо." };
    }

    return { isValid: false, message: "Выбранные блюда не соответствуют ни одному варианту ланча." };
}

// Показ уведомления
function showNotification(message) {
    const overlay = document.getElementById("notification");
    const msg = document.querySelector(".notification-message");

    msg.textContent = message;
    overlay.classList.add("active");

    document.getElementById("notification-ok").onclick = () => {
        overlay.classList.remove("active");
    };
}

// Инициализация
function initializeLunchValidator() {
    const orderForm = document.querySelector(".order-form");

    if (!orderForm) return;

    orderForm.addEventListener("submit", function (event) {
        event.preventDefault(); // остановка отправки

        const validation = validateLunchCombo(selectedDishes);

        if (validation.isValid) {
            // Сохраняем перед отправкой
            saveToLocalStorage();
            orderForm.submit(); // отправка если всё ок
        } else {
            showNotification(validation.message);
        }
    });
}

// Запуск
document.addEventListener("DOMContentLoaded", initializeLunchValidator);