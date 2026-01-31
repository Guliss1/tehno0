// Движок виртуальных испытаний
const TestEngine = (function() {
    // Приватные переменные
    let currentTest = null;
    let testInterval = null;
    let currentLoad = 0;
    let targetStrength = 0;
    let testDuration = 3000; // 3 секунды
    let cubeState = 0; // 0: целый, 1: трещины, 2: разрушенный

    // Приватные методы
    function updateCubeState(progress) {
        if (progress >= 100) {
            cubeState = 2; // Разрушенный
        } else if (progress >= 70) {
            cubeState = 1; // Трещины
        } else {
            cubeState = 0; // Целый
        }
        return cubeState;
    }

    function calculateTestResult(strength) {
        let result = {
            strength: strength,
            status: 'destroyed',
            message: `Образец разрушился при нагрузке ${strength.toFixed(1)} МПа`,
            comparisonData: null
        };

        // Определение категории результата
        if (strength < 20) {
            result.category = 'low';
            result.quality = 'Низкая прочность';
        } else if (strength < 35) {
            result.category = 'medium';
            result.quality = 'Средняя прочность';
        } else if (strength < 50) {
            result.category = 'high';
            result.quality = 'Высокая прочность';
        } else {
            result.category = 'very-high';
            result.quality = 'Очень высокая прочность';
        }

        return result;
    }

    // Публичные методы
    return {
        startTest: function(concreteClass, updateCallback, completeCallback) {
            if (currentTest) {
                this.stopTest();
            }

            currentTest = concreteClass;
            targetStrength = concreteClass.strength;
            currentLoad = 0;
            cubeState = 0;

            const steps = 100;
            const increment = targetStrength / steps;
            const intervalTime = testDuration / steps;
            let currentStep = 0;

            testInterval = setInterval(() => {
                currentStep++;
                currentLoad = Math.min(increment * currentStep, targetStrength);
                const progress = (currentLoad / targetStrength) * 100;

                // Обновляем состояние куба
                const newCubeState = updateCubeState(progress);

                // Вызываем callback для обновления UI
                if (updateCallback) {
                    updateCallback({
                        currentLoad: parseFloat(currentLoad.toFixed(1)),
                        progress: parseFloat(progress.toFixed(1)),
                        cubeState: newCubeState,
                        isTesting: true
                    });
                }

                // Завершаем тест
                if (currentStep >= steps) {
                    clearInterval(testInterval);
                    testInterval = null;

                    const result = calculateTestResult(targetStrength);

                    if (completeCallback) {
                        completeCallback({
                            concreteClass: concreteClass,
                            finalLoad: targetStrength,
                            result: result,
                            testDuration: testDuration
                        });
                    }
                }
            }, intervalTime);

            return {
                targetStrength: targetStrength,
                testDuration: testDuration
            };
        },

        stopTest: function() {
            if (testInterval) {
                clearInterval(testInterval);
                testInterval = null;
                currentLoad = 0;
                cubeState = 0;
            }
        },

        getCurrentState: function() {
            return {
                currentLoad: currentLoad,
                cubeState: cubeState,
                isTesting: !!testInterval,
                targetStrength: targetStrength
            };
        },

        setTestDuration: function(duration) {
            testDuration = duration;
        }
    };
})();