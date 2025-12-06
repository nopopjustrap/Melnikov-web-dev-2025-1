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

function createDishElement(dish) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish-item';
    dishDiv.setAttribute('data-dish', dish.keyword);
    dishDiv.setAttribute('data-kind', dish.kind);
    
    const imageUrl = dish.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    dishDiv.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">        
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