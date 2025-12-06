// Конфигурация
const API_KEY = 'f2ac6844-59ac-4e10-a4ae-037da63f40e9';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';

// Глобальные переменные
let allDishes = [];
let allOrders = [];

// Загрузка всех необходимых данных
async function loadAllData() {
    try {
        // Загружаем блюда
        const dishesResponse = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!dishesResponse.ok) throw new Error('Ошибка загрузки блюд');
        allDishes = await dishesResponse.json();
        
        // Загружаем заказы
        const ordersResponse = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        if (!ordersResponse.ok) throw new Error('Ошибка загрузки заказов');
        allOrders = await ordersResponse.json();
        
        // Сортируем заказы по дате (новые первые)
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return { dishes: allDishes, orders: allOrders };
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showNotification(`Ошибка загрузки данных: ${error.message}`);
        throw error;
    }
}

// Получение названия блюда по ID
function getDishNameById(dishId) {
    const dish = allDishes.find(d => d.id === dishId);
    return dish ? dish.name : 'Неизвестное блюдо';
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Форматирование времени доставки
function formatDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time.slice(0, 5); // HH:MM
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

// Расчет стоимости заказа
function calculateOrderPrice(order) {
    let total = 0;
    
    if (order.soup_id) {
        const dish = allDishes.find(d => d.id === order.soup_id);
        if (dish) total += dish.price;
    }
    
    if (order.main_course_id) {
        const dish = allDishes.find(d => d.id === order.main_course_id);
        if (dish) total += dish.price;
    }
    
    if (order.salad_id) {
        const dish = allDishes.find(d => d.id === order.salad_id);
        if (dish) total += dish.price;
    }
    
    if (order.drink_id) {
        const dish = allDishes.find(d => d.id === order.drink_id);
        if (dish) total += dish.price;
    }
    
    if (order.dessert_id) {
        const dish = allDishes.find(d => d.id === order.dessert_id);
        if (dish) total += dish.price;
    }
    
    return total;
}

// Получение состава заказа
function getOrderComposition(order) {
    const dishes = [];
    
    if (order.soup_id) dishes.push(getDishNameById(order.soup_id));
    if (order.main_course_id) dishes.push(getDishNameById(order.main_course_id));
    if (order.salad_id) dishes.push(getDishNameById(order.salad_id));
    if (order.drink_id) dishes.push(getDishNameById(order.drink_id));
    if (order.dessert_id) dishes.push(getDishNameById(order.dessert_id));
    
    return dishes.join(', ');
}

// Отображение списка заказов
function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    const statsContainer = document.getElementById('orders-stats');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="bi bi-cart-x" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>Заказов нет</h3>
                <p>Вы еще не оформляли заказов.</p>
                <a href="index.html" class="btn-primary">Собрать ланч</a>
            </div>
        `;
        
        statsContainer.innerHTML = '<p>Всего заказов: 0</p>';
        return;
    }
    
    // Обновляем статистику
    const totalPrice = orders.reduce((sum, order) => sum + calculateOrderPrice(order), 0);
    statsContainer.innerHTML = `
        <p>Всего заказов: ${orders.length}</p>
        <p>Общая стоимость: ${totalPrice}Р</p>
    `;
    
    // Отображаем заказы
    let html = '<div class="orders-grid">';
    
    orders.forEach((order, index) => {
        const orderPrice = calculateOrderPrice(order);
        const composition = getOrderComposition(order);
        const deliveryTime = formatDeliveryTime(order);
        
        html += `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <span class="order-number">#${index + 1}</span>
                    <span class="order-date">${formatDate(order.created_at)}</span>
                </div>
                <div class="order-body">
                    <div class="order-info">
                        <p><strong>Состав:</strong> ${composition}</p>
                        <p><strong>Стоимость:</strong> ${orderPrice}Р</p>
                        <p><strong>Время доставки:</strong> ${deliveryTime}</p>
                        <p><strong>Статус:</strong> ${order.delivery_type === 'now' ? 'В обработке' : 'Запланирован'}</p>
                    </div>
                    <div class="order-actions">
                        <button class="btn-details" onclick="showOrderDetails(${order.id})" title="Подробнее">
                            <i class="bi bi-info-circle"></i>
                        </button>
                        <button class="btn-edit" onclick="showEditModal(${order.id})" title="Редактировать">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-delete" onclick="showDeleteModal(${order.id})" title="Удалить">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Показать детали заказа
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказа');
        
        const order = await response.json();
        const orderPrice = calculateOrderPrice(order);
        const deliveryTime = formatDeliveryTime(order);
        
        let dishesHtml = '<ul class="dishes-list">';
        
        if (order.soup_id) {
            const dish = allDishes.find(d => d.id === order.soup_id);
            dishesHtml += `<li>${dish?.name || 'Неизвестный суп'}</li>`;
        }
        
        if (order.main_course_id) {
            const dish = allDishes.find(d => d.id === order.main_course_id);
            dishesHtml += `<li>${dish?.name || 'Неизвестное главное блюдо'}</li>`;
        }
        
        if (order.salad_id) {
            const dish = allDishes.find(d => d.id === order.salad_id);
            dishesHtml += `<li>${dish?.name || 'Неизвестный салат'}</li>`;
        }
        
        if (order.drink_id) {
            const dish = allDishes.find(d => d.id === order.drink_id);
            dishesHtml += `<li>${dish?.name || 'Неизвестный напиток'}</li>`;
        }
        
        if (order.dessert_id) {
            const dish = allDishes.find(d => d.id === order.dessert_id);
            dishesHtml += `<li>${dish?.name || 'Неизвестный десерт'}</li>`;
        }
        
        dishesHtml += '</ul>';
        
        const content = `
            <div class="order-details">
                <div class="detail-row">
                    <strong>Номер заказа:</strong> ${order.id}
                </div>
                <div class="detail-row">
                    <strong>Дата оформления:</strong> ${formatDate(order.created_at)}
                </div>
                <div class="detail-row">
                    <strong>Имя:</strong> ${order.full_name}
                </div>
                <div class="detail-row">
                    <strong>Email:</strong> ${order.email}
                </div>
                <div class="detail-row">
                    <strong>Телефон:</strong> ${order.phone}
                </div>
                <div class="detail-row">
                    <strong>Адрес доставки:</strong> ${order.delivery_address}
                </div>
                <div class="detail-row">
                    <strong>Тип доставки:</strong> ${order.delivery_type === 'now' ? 'Как можно скорее' : 'К указанному времени'}
                </div>
                ${order.delivery_time ? `
                <div class="detail-row">
                    <strong>Время доставки:</strong> ${order.delivery_time.slice(0, 5)}
                </div>
                ` : ''}
                ${order.comment ? `
                <div class="detail-row">
                    <strong>Комментарий:</strong> ${order.comment}
                </div>
                ` : ''}
                <div class="detail-row">
                    <strong>Стоимость:</strong> ${orderPrice}Р
                </div>
                <div class="detail-row">
                    <strong>Состав заказа:</strong>
                    ${dishesHtml}
                </div>
                <div class="detail-row">
                    <strong>Student ID:</strong> ${order.student_id}
                </div>
            </div>
        `;
        
        document.getElementById('details-content').innerHTML = content;
        openModal('details-modal');
        
    } catch (error) {
        console.error('Ошибка при загрузке деталей заказа:', error);
        showNotification(`Ошибка: ${error.message}`);
    }
}

// Показать модальное окно редактирования
async function showEditModal(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказа');
        
        const order = await response.json();
        
        // Заполняем форму данными заказа
        document.getElementById('edit-order-id').value = order.id;
        document.getElementById('edit-full_name').value = order.full_name;
        document.getElementById('edit-email').value = order.email;
        document.getElementById('edit-phone').value = order.phone;
        document.getElementById('edit-delivery_address').value = order.delivery_address;
        document.getElementById('edit-comment').value = order.comment || '';
        
        // Устанавливаем тип доставки
        if (order.delivery_type === 'now') {
            document.getElementById('edit-time_now').checked = true;
            document.getElementById('edit-delivery_time').disabled = true;
        } else {
            document.getElementById('edit-time_specified').checked = true;
            document.getElementById('edit-delivery_time').disabled = false;
            document.getElementById('edit-delivery_time').value = order.delivery_time?.slice(0, 5) || '';
        }
        
        // Настраиваем обработчики изменения типа доставки
        document.getElementById('edit-time_now').addEventListener('change', function() {
            document.getElementById('edit-delivery_time').disabled = true;
            document.getElementById('edit-delivery_time').value = '';
        });
        
        document.getElementById('edit-time_specified').addEventListener('change', function() {
            document.getElementById('edit-delivery_time').disabled = false;
            document.getElementById('edit-delivery_time').required = true;
        });
        
        openModal('edit-modal');
        
    } catch (error) {
        console.error('Ошибка при загрузке заказа для редактирования:', error);
        showNotification(`Ошибка: ${error.message}`);
    }
}

// Сохранить изменения заказа
async function saveOrderChanges() {
    const orderId = document.getElementById('edit-order-id').value;
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    
    const orderData = {};
    for (let [key, value] of formData.entries()) {
        if (key === 'order_id') continue;
        if (key === 'delivery_time' && value === '' && orderData.delivery_type !== 'by_time') {
            continue;
        }
        orderData[key] = value;
    }
    
    // Преобразуем delivery_time в правильный формат
    if (orderData.delivery_time) {
        orderData.delivery_time = orderData.delivery_time + ':00';
    }
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ошибка при обновлении заказа');
        }
        
        const updatedOrder = await response.json();
        console.log('Заказ обновлен:', updatedOrder);
        
        // Обновляем локальный список заказов
        const index = allOrders.findIndex(o => o.id === parseInt(orderId));
        if (index !== -1) {
            allOrders[index] = { ...allOrders[index], ...orderData };
            // Обновляем отображение
            displayOrders(allOrders);
        }
        
        closeModal('edit-modal');
        showNotification('Заказ успешно обновлен!');
        
    } catch (error) {
        console.error('Ошибка при сохранении изменений:', error);
        showNotification(`Ошибка: ${error.message}`);
    }
}

// Показать модальное окно удаления
function showDeleteModal(orderId) {
    document.getElementById('delete-order-id').value = orderId;
    openModal('delete-modal');
}

// Подтвердить удаление заказа
async function confirmDeleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ошибка при удалении заказа');
        }
        
        const result = await response.json();
        console.log('Заказ удален:', result);
        
        // Удаляем заказ из локального списка
        allOrders = allOrders.filter(order => order.id !== parseInt(orderId));
        
        // Обновляем отображение
        displayOrders(allOrders);
        
        closeModal('delete-modal');
        showNotification('Заказ успешно удален!');
        
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showNotification(`Ошибка: ${error.message}`);
    }
}

// Управление модальными окнами
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Показ уведомлений
function showNotification(message) {
    const overlay = document.getElementById("notification");
    const msg = document.querySelector(".notification-message");

    msg.textContent = message;
    overlay.classList.add("active");

    document.getElementById("notification-ok").onclick = () => {
        overlay.classList.remove("active");
    };
}

// Обновление списка заказов
async function refreshOrders() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    try {
        await loadAllData();
        displayOrders(allOrders);
    } catch (error) {
        console.error('Ошибка при обновлении заказов:', error);
    } finally {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Инициализация страницы
async function initializeOrdersPage() {
    console.log('🚀 Инициализация страницы заказов...');
    
    // Настраиваем кнопку обновления
    const refreshBtn = document.getElementById('refresh-orders');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshOrders);
    }
    
    // Загружаем и отображаем данные
    await refreshOrders();
    
    // Закрытие модальных окон по клику вне окна
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeOrdersPage);