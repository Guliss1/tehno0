// Контроллер пользовательского интерфейса
const UIController = (function() {
    // Приватные переменные
    let selectedConcreteClass = null;
    let currentTest = null;

    // DOM элементы
    const elements = {
        concreteGrid: document.getElementById('concreteGrid'),
        testPanel: document.getElementById('testPanel'),
        comparisonContainer: document.getElementById('comparisonContainer'),
        detailModal: document.getElementById('detailModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.getElementById('modalClose')
    };

    // Приватные методы
    function createConcreteCard(concrete) {
        const strengthColor = ConcreteData.getStrengthColor(concrete.strength);

        return `
            <div class="concrete-card" data-id="${concrete.id}">
                <div class="class-header" style="background: ${concrete.color || strengthColor}">
                    <div class="class-name">${concrete.class}</div>
                    <div class="class-strength">${concrete.strength} МПа</div>
                </div>
                <div class="class-info">
                    <h3>${concrete.application}</h3>
                    <p>${concrete.composition}</p>
                    <div class="class-property">
                        <span class="property-label">Класс прочности:</span>
                        <span class="property-value">${concrete.class}</span>
                    </div>
                    <div class="class-property">
                        <span class="property-label">Марка цемента:</span>
                        <span class="property-value">${concrete.composition.split(',')[0].split(':')[1]}</span>
                    </div>
                </div>
                <div class="class-actions">
                    <button class="select-btn" data-id="${concrete.id}">
                        <i class="fas fa-flask"></i> Выбрать для испытаний
                    </button>
                </div>
            </div>
        `;
    }

    function createTestPanel(concrete) {
        return `
            <div class="test-header">
                <h3><i class="fas fa-hard-hat"></i> Испытание бетона ${concrete.class}</h3>
                <div class="test-stats">
                    <div class="stat-item">
                        <div class="stat-value">${concrete.strength}</div>
                        <div class="stat-label">Целевая прочность, МПа</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${concrete.class}</div>
                        <div class="stat-label">Класс бетона</div>
                    </div>
                </div>
            </div>

            <div class="test-visualization">
                <div class="cube-container">
                    <div class="cube" id="testCube">
                        <div class="cube-face front"><i class="fas fa-cube"></i></div>
                        <div class="cube-face back"><i class="fas fa-cube"></i></div>
                        <div class="cube-face left"><i class="fas fa-cube"></i></div>
                        <div class="cube-face right"><i class="fas fa-cube"></i></div>
                        <div class="cube-face top"><i class="fas fa-cube"></i></div>
                        <div class="cube-face bottom"><i class="fas fa-cube"></i></div>
                    </div>
                    <div class="cube-state" id="cubeState">Целый образец</div>
                </div>

                <div class="progress-container">
                    <div class="progress-header">
                        <div class="current-load" id="currentLoad">0.0</div>
                        <div class="target-load">Цель: ${concrete.strength} МПа</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                    <div class="progress-labels">
                        <span>0 МПа</span>
                        <span>${concrete.strength} МПа</span>
                    </div>
                </div>
            </div>

            <div class="test-controls">
                <button class="test-btn primary" id="startTestBtn">
                    <i class="fas fa-play"></i> Начать испытание
                </button>
                <button class="test-btn secondary" id="resetTestBtn" disabled>
                    <i class="fas fa-redo"></i> Сбросить
                </button>
            </div>

            <div class="test-result" id="testResult" style="display: none;">
                <div class="result-message" id="resultMessage"></div>
            </div>
        `;
    }

    function updateTestUI(data) {
        const currentLoadEl = document.getElementById('currentLoad');
        const progressBarEl = document.getElementById('progressBar');
        const testCubeEl = document.getElementById('testCube');
        const cubeStateEl = document.getElementById('cubeState');

        if (currentLoadEl) currentLoadEl.textContent = data.currentLoad;
        if (progressBarEl) progressBarEl.style.width = `${data.progress}%`;

        // Обновление состояния куба
        if (testCubeEl) {
            testCubeEl.className = 'cube';
            if (data.cubeState === 1) {
                testCubeEl.classList.add('cracked');
                if (cubeStateEl) cubeStateEl.textContent = 'Трещинообразование';
            } else if (data.cubeState === 2) {
                testCubeEl.classList.add('destroyed');
                if (cubeStateEl) cubeStateEl.textContent = 'Разрушение образца';
            }
        }
    }

    function showTestResult(result) {
        const testResultEl = document.getElementById('testResult');
        const resultMessageEl = document.getElementById('resultMessage');
        const startBtn = document.getElementById('startTestBtn');
        const resetBtn = document.getElementById('resetTestBtn');

        if (testResultEl) {
            testResultEl.style.display = 'block';
            if (resultMessageEl) {
                resultMessageEl.textContent = result.message;
            }
        }

        if (startBtn) startBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = false;

        // Показать сравнения
        showComparisons(result.concreteClass.strength);
    }

    function showComparisons(strength) {
        const comparisons = ComparisonModule.init(strength);

        let html = `
            <div class="comparison-buttons">
                ${comparisons.map(comp => `
                    <button class="comparison-btn" data-id="${comp.id}">
                        <i class="fas fa-${comp.icon || 'balance-scale'}"></i>
                        ${strength.toFixed(1)} МПа = ${comp.title}
                    </button>
                `).join('')}
            </div>
            <div id="comparisonDetails"></div>
        `;

        elements.comparisonContainer.innerHTML = html;

        // Добавить обработчики для кнопок сравнений
        document.querySelectorAll('.comparison-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const comparison = ComparisonModule.selectComparison(id);

                if (comparison) {
                    const detailsEl = document.getElementById('comparisonDetails');
                    if (detailsEl) {
                        detailsEl.innerHTML = ComparisonModule.createComparisonHTML(comparison);
                    }
                }
            });
        });
    }

    // Публичные методы
    return {
        init: function() {
            this.renderConcreteGrid();
            this.setupEventListeners();
        },

        renderConcreteGrid: function() {
            const concreteClasses = ConcreteData.getAllClasses();
            elements.concreteGrid.innerHTML = concreteClasses.map(createConcreteCard).join('');
        },

        selectConcreteClass: function(id) {
            selectedConcreteClass = ConcreteData.getClassById(id);

            if (selectedConcreteClass) {
                // Обновить выбранную карточку
                document.querySelectorAll('.concrete-card').forEach(card => {
                    card.classList.remove('selected');
                    if (parseInt(card.dataset.id) === id) {
                        card.classList.add('selected');
                    }
                });

                // Показать панель испытаний
                elements.testPanel.innerHTML = createTestPanel(selectedConcreteClass);

                // Настроить обработчики для панели испытаний
                this.setupTestPanelEvents();

                // Прокрутить к панели испытаний
                document.getElementById('testing').scrollIntoView({ behavior: 'smooth' });
            }
        },

        setupTestPanelEvents: function() {
            const startBtn = document.getElementById('startTestBtn');
            const resetBtn = document.getElementById('resetTestBtn');

            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    if (!selectedConcreteClass) return;

                    startBtn.disabled = true;
                    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Испытание...';

                    currentTest = TestEngine.startTest(
                        selectedConcreteClass,
                        updateTestUI,
                        (result) => {
                            showTestResult(result);
                            startBtn.innerHTML = '<i class="fas fa-check"></i> Испытание завершено';
                            startBtn.disabled = false;
                        }
                    );
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    TestEngine.stopTest();
                    this.selectConcreteClass(selectedConcreteClass.id);
                });
            }
        },

        setupEventListeners: function() {
            // Обработчики для карточек бетона
            elements.concreteGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.concrete-card');
                const selectBtn = e.target.closest('.select-btn');

                if (card) {
                    const id = parseInt(card.dataset.id);
                    this.selectConcreteClass(id);
                }

                if (selectBtn) {
                    const id = parseInt(selectBtn.dataset.id);
                    this.selectConcreteClass(id);
                }
            });

            // Навигация
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        // Обновить активную ссылку
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');

                        // Прокрутить к секции
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Мобильное меню
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', () => {
                    const nav = document.querySelector('.main-nav');
                    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                });
            }

            // Модальное окно
            if (elements.modalClose) {
                elements.modalClose.addEventListener('click', () => {
                    elements.detailModal.style.display = 'none';
                });
            }

            window.addEventListener('click', (e) => {
                if (e.target === elements.detailModal) {
                    elements.detailModal.style.display = 'none';
                }
            });
        },

        showDetailModal: function(concrete) {
            elements.modalTitle.textContent = `Детали класса ${concrete.class}`;
            elements.modalBody.innerHTML = `
                <div class="modal-details">
                    <div class="detail-item">
                        <strong>Класс прочности:</strong> ${concrete.class}
                    </div>
                    <div class="detail-item">
                        <strong>Прочность на сжатие:</strong> ${concrete.strength} МПа
                    </div>
                    <div class="detail-item">
                        <strong>Основное применение:</strong> ${concrete.application}
                    </div>
                    <div class="detail-item">
                        <strong>Примерный состав на 1м³:</strong> ${concrete.composition}
                    </div>
                    <div class="detail-item">
                        <strong>Водоцементное отношение:</strong> ${concrete.composition.split(',')[1].split(':')[1]}
                    </div>
                </div>
            `;
            elements.detailModal.style.display = 'flex';
        },

        getSelectedClass: function() {
            return selectedConcreteClass;
        }
    };
})();