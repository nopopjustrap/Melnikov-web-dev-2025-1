// Обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (!validateContactForm()) {
                return;
            }
            
            // Сбор данных формы
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                subscribe: document.getElementById('subscribe').checked
            };
            
            // Здесь обычно отправка на сервер
            // Для демонстрации просто показываем сообщение
            showNotification('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Сброс формы
            this.reset();
        });
    }
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация отслеживания скролла
    initScrollTracking();
});

// Валидация формы контактов
function validateContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) {
        showNotification('Пожалуйста, введите ваше имя', 'error');
        return false;
    }
    
    if (!email.trim()) {
        showNotification('Пожалуйста, введите ваш email', 'error');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showNotification('Пожалуйста, введите корректный email адрес', 'error');
        return false;
    }
    
    return true;
}

// Плавная прокрутка к якорям
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Учитываем высоту фиксированной навигации
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                    navbarToggler.click();
                }
            }
        });
    });
}

// Отслеживание скролла для навигации
function initScrollTracking() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('shadow');
        }
        
        // Подсветка активного пункта меню
        highlightActiveNavItem();
    });
}

// Подсветка активного пункта меню при скролле
function highlightActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.scrollY >= (sectionTop - navHeight - 100) && 
            window.scrollY < (sectionTop + sectionHeight - navHeight - 100)) {
            currentSectionId = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Анимация появления элементов при скролле
function initScrollAnimation() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.feature-card, .contact-info').forEach(el => {
        observer.observe(el);
    });
}

// Инициализация анимации при загрузке
window.addEventListener('load', function() {
    initScrollAnimation();
});

// Обработка изменения типа доставки в форме контактов (если будет)
function initDeliveryTypeToggle() {
    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const deliveryTimeInput = document.getElementById('edit-delivery_time');
    
    if (deliveryTypeRadios.length > 0 && deliveryTimeInput) {
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'by_time') {
                    deliveryTimeInput.disabled = false;
                    deliveryTimeInput.required = true;
                } else {
                    deliveryTimeInput.disabled = true;
                    deliveryTimeInput.required = false;
                    deliveryTimeInput.value = '';
                }
            });
        });
    }
}

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    initDeliveryTypeToggle();
});