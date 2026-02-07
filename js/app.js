// Основной файл приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('БетонТест загружается...');
    
    // Инициализация приложения
    UIController.init();
    
    // Обработка скролла для навигации
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Инициализация фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            UIController.filterConcreteClasses(filter);
        });
    });
    
    // Инициализация полной таблицы
    renderFullTable();
    
    // Инициализация анимаций при загрузке
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    console.log('БетонТест успешно загружен!');
});

// Функция для отрисовки полной таблицы
function renderFullTable() {
    const tableBody = document.getElementById('fullTableBody');
    if (!tableBody) return;
    
    const tableData = ConcreteData.getTableData();
    
    let html = '';
    tableData.forEach((item, index) => {
        const color = ConcreteData.getStrengthColor(item.strength);
        html += `
            <tr>
                <td><span class="class-badge" style="background-color: ${color}">${item.class}</span></td>
                <td>${item.mark}</td>
                <td><strong>${item.strength.toFixed(2)}</strong></td>
                <td>${item.strengthKg.toFixed(1)}</td>
                <td>${item.equivalent}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Функция для фильтрации классов бетона
function filterConcreteClasses(filter) {
    const allClasses = ConcreteData.getAllClasses();
    let filteredClasses = allClasses;
    
    switch(filter) {
        case 'low':
            filteredClasses = allClasses.filter(c => c.strength < 20);
            break;
        case 'medium':
            filteredClasses = allClasses.filter(c => c.strength >= 20 && c.strength <= 50);
            break;
        case 'high':
            filteredClasses = allClasses.filter(c => c.strength > 50);
            break;
        // 'all' - оставляем все
    }
    
    UIController.renderFilteredGrid(filteredClasses);
}
