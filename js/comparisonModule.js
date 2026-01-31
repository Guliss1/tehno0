// Модуль сравнений
const ComparisonModule = (function() {
    // Приватные переменные
    let selectedComparison = null;
    let currentStrength = 0;

    // Приватные методы
    function generateComparisonData(strength) {
        const comparisons = ConcreteData.getAllComparisons();

        return comparisons.map(comparison => {
            return {
                ...comparison,
                relativeStrength: (strength / 32.9).toFixed(1) // Относительно B25
            };
        });
    }

    function createVisualization(comparison, strength) {
        let visualization = '';

        switch(comparison.id) {
            case 1: // Автомобили
                const carsCount = Math.floor(strength / 32.9 * 3);
                visualization = `<div class="car-visualization">
                    <div class="cars-container">
                        ${'🚗'.repeat(Math.min(carsCount, 10))}
                        ${carsCount > 10 ? `<span class="more-count">+${carsCount-10}</span>` : ''}
                    </div>
                    <div class="visual-label">${carsCount} автомобилей на ладони</div>
                </div>`;
                break;

            case 2: // Давление в море
                const depth = Math.round((strength / 32.9) * 3290);
                visualization = `<div class="sea-visualization">
                    <div class="depth-indicator">
                        <div class="depth-value">${depth} м</div>
                        <div class="depth-bar" style="height: ${Math.min(depth / 50, 100)}%"></div>
                    </div>
                    <div class="visual-label">Глубина моря</div>
                </div>`;
                break;

            case 3: // Слон
                const elephantSize = Math.min((strength / 32.9) * 100, 200);
                visualization = `<div class="elephant-visualization">
                    <div class="elephant-icon" style="font-size: ${elephantSize}%">🐘</div>
                    <div class="visual-label">${elephantSize > 100 ? 'Усиленный ' : ''}Слон на стуле</div>
                </div>`;
                break;

            case 4: // Болид
                visualization = `<div class="car-visualization">
                    <div class="formula-car">🏎️💨</div>
                    <div class="visual-label">Болид Формулы-1 на монете</div>
                </div>`;
                break;
        }

        return visualization;
    }

    // Публичные методы
    return {
        init: function(strength) {
            currentStrength = strength;
            return generateComparisonData(strength);
        },

        selectComparison: function(comparisonId) {
            const comparison = ConcreteData.getComparisonById(comparisonId);
            if (comparison) {
                selectedComparison = {
                    ...comparison,
                    visualization: createVisualization(comparison, currentStrength)
                };
                return selectedComparison;
            }
            return null;
        },

        getSelectedComparison: function() {
            return selectedComparison;
        },

        getComparisonsForStrength: function(strength) {
            currentStrength = strength;
            return generateComparisonData(strength);
        },

        createComparisonHTML: function(comparison) {
            if (!comparison) return '';

            return `
                <div class="comparison-details animate-fadeIn">
                    <div class="details-header">
                        <i class="fas fa-balance-scale-left"></i>
                        <h4>${comparison.title}</h4>
                    </div>
                    <div class="comparison-content">
                        <div class="comparison-text">
                            <p>${comparison.description}</p>
                            <div class="strength-ratio">
                                <strong>Относительная прочность:</strong>
                                В ${comparison.relativeStrength} раз прочнее бетона B25
                            </div>
                        </div>
                        <div class="comparison-visual">
                            ${comparison.visualization || ''}
                        </div>
                    </div>
                    <div class="comparison-calculation">
                        <h5>Расчет:</h5>
                        <code>${comparison.calculation}</code>
                    </div>
                </div>
            `;
        },

        reset: function() {
            selectedComparison = null;
        }
    };
})();