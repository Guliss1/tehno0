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

    // Инициализация анимаций при загрузке
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    console.log('БетонТест успешно загружен!');
});