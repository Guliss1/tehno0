const ConcreteData = (function() {
    // Данные из вашей таблицы
    const concreteClasses = [
        { id: 1, class: 'B3,5', mark: 'M50', strength: 4.5, strengthKg: 45.8, equivalent: 'B3,5 (M50)' },
        { id: 2, class: 'B5', mark: 'M75', strength: 6.42, strengthKg: 65.5, equivalent: 'B5 (M75)' },
        { id: 3, class: 'B7,5', mark: 'M100', strength: 9.63, strengthKg: 98.1, equivalent: 'B7,5 (M100)' },
        { id: 4, class: 'B10', mark: 'M150', strength: 12.84, strengthKg: 130.9, equivalent: 'B10 (M150)' },
        { id: 5, class: 'B12,5', mark: 'M150', strength: 16.05, strengthKg: 163.7, equivalent: 'B12,5 (M150)' },
        { id: 6, class: 'B15', mark: 'M200', strength: 19.26, strengthKg: 196.4, equivalent: 'B15 (M200)' },
        { id: 7, class: 'B20', mark: 'M250', strength: 25.69, strengthKg: 261.8, equivalent: 'B20 (M250)' },
        { id: 8, class: 'B22,5', mark: 'M300', strength: 28.9, strengthKg: 294.6, equivalent: 'B22,5 (M300)' },
        { id: 9, class: 'B25', mark: 'M350', strength: 32.11, strengthKg: 327.3, equivalent: 'B25 (M350)' },
        { id: 10, class: 'B27,5', mark: 'M350', strength: 35.32, strengthKg: 360.0, equivalent: 'B27,5 (M350)' },
        { id: 11, class: 'B30', mark: 'M400', strength: 38.35, strengthKg: 392.8, equivalent: 'B30 (M400)' },
        { id: 12, class: 'B35', mark: 'M450', strength: 44.95, strengthKg: 458.2, equivalent: 'B35 (M450)' },
        { id: 13, class: 'B40', mark: 'M550', strength: 51.37, strengthKg: 523.7, equivalent: 'B40 (M550)' },
        { id: 14, class: 'B45', mark: 'M600', strength: 57.8, strengthKg: 589.2, equivalent: 'B45 (M600)' },
        { id: 15, class: 'B50', mark: 'M700', strength: 64.2, strengthKg: 654.6, equivalent: 'B50 (M700)' },
        { id: 16, class: 'B55', mark: 'M750', strength: 71.64, strengthKg: 720.1, equivalent: 'B55 (M750)' },
        { id: 17, class: 'B60', mark: 'M800', strength: 77.06, strengthKg: 785.5, equivalent: 'B60 (M800)' },
        { id: 18, class: 'B65', mark: 'M900', strength: 83.56, strengthKg: 851.3, equivalent: 'B65 (M900)' },
        { id: 19, class: 'B70', mark: 'M900', strength: 89.94, strengthKg: 916.3, equivalent: 'B70 (M900)' },
        { id: 20, class: 'B75', mark: 'M1000', strength: 96.42, strengthKg: 982.3, equivalent: 'B75 (M1000)' },
        { id: 21, class: 'B80', mark: 'M1000', strength: 102.84, strengthKg: 1047.7, equivalent: 'B80 (M1000)' }
    ];

    const comparisons = [
        { 
            id: 1, 
            name: 'легковых автомобиля', 
            description: 'Рассчитано на основе среднего веса автомобиля 1500 кг и площади ладони взрослого человека (80 см²).',
            calculation: 'F = m × g = 1500 кг × 9.8 м/с² = 14,700 Н\nS = 0.008 м²\nP = F/S = 14,700/0.008 = 1,837,500 Па = 1.84 МПа\nДля 32.11 МПа (B25): 32.11 / 1.84 ≈ 17.5 автомобилей'
        },
        { 
            id: 2, 
            name: 'давление на глубине моря', 
            description: 'Рассчитано по формуле гидростатического давления P = ρ × g × h, где ρ = 1025 кг/м³ для морской воды.',
            calculation: 'P = ρ × g × h\nh = P / (ρ × g)\nДля 32.11 МПа: h = 32.11×10⁶ / (1025 × 9.8) ≈ 3197 метров'
        },
        { 
            id: 3, 
            name: 'слона на площади стула', 
            description: 'Вес африканского слона ≈ 6000 кг, площадь ножек стула ≈ 0.0018 м².',
            calculation: 'F = 6000 кг × 9.8 м/с² = 58,800 Н\nS = 0.0018 м²\nP = 58,800/0.0018 = 32,666,667 Па = 32.67 МПа\nАналогично B25 (32.11 МПа)'
        },
        { 
            id: 4, 
            name: 'гирь на монете', 
            description: 'Сравнение с давлением, создаваемым гирями на площадь монеты 5 копеек (2.4 см²).',
            calculation: 'Для B25 (32.11 МПа):\nP = 32.11×10⁶ Па\nS = 0.00024 м²\nF = P × S = 32.11×10⁶ × 0.00024 = 7,706 Н\nm = F/g = 7,706/9.8 ≈ 786 кг'
        }
    ];

    // Применение бетона (расширенный список)
    const applications = {
        'B3,5-B10': 'Неответственные конструкции, подготовительные работы, дорожки',
        'B12,5-B20': 'Фундаменты малоэтажных зданий, дорожные плиты, отмостки',
        'B22,5-B30': 'Монолитные стены, перекрытия, колонны, балки',
        'B35-B45': 'Мостовые конструкции, гидротехнические сооружения, эстакады',
        'B50-B60': 'Высоконагруженные колонны, метро, тоннели, бункеры',
        'B65-B80': 'АЭС, военные объекты, уникальные инженерные сооружения'
    };

    // Публичные методы
    return {
        getAllClasses: function() {
            return concreteClasses;
        },

        getClassById: function(id) {
            return concreteClasses.find(c => c.id === id);
        },

        getAllComparisons: function() {
            return comparisons;
        },

        getComparisonById: function(id) {
            return comparisons.find(c => c.id === id);
        },

        getApplicationForClass: function(strength) {
            if (strength <= 10) return applications['B3,5-B10'];
            if (strength <= 20) return applications['B12,5-B20'];
            if (strength <= 30) return applications['B22,5-B30'];
            if (strength <= 45) return applications['B35-B45'];
            if (strength <= 60) return applications['B50-B60'];
            return applications['B65-B80'];
        },

        getStrengthColor: function(strength) {
            if (strength < 10) return '#4CAF50';      // Зеленый
            if (strength < 25) return '#8BC34A';      // Светло-зеленый
            if (strength < 40) return '#FFC107';      // Желтый
            if (strength < 60) return '#FF9800';      // Оранжевый
            if (strength < 80) return '#F44336';      // Красный
            return '#9C27B0';                        // Фиолетовый
        },

        // Новый метод для получения данных таблицы
        getTableData: function() {
            return concreteClasses.map(item => ({
                class: item.class,
                mark: item.mark,
                strength: item.strength,
                strengthKg: item.strengthKg,
                equivalent: item.equivalent
            }));
        }
    };
})();
