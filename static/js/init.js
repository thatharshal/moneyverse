// init.js
if (typeof generateOptimizedAdvice === "function") {
    document.getElementById('optimizeBtn').addEventListener('click', generateOptimizedAdvice);
  } else {
    console.error("generateOptimizedAdvice is not defined");
  }
  
document.addEventListener('DOMContentLoaded', () => {
    const yearsInput = document.getElementById('years');
    const yearsValue = document.getElementById('yearsValue');

    // Live update of range input label
    yearsInput.addEventListener('input', () => {
        yearsValue.textContent = `${yearsInput.value} years`;
    });

    // Calculate button
    document.getElementById('calculate').addEventListener('click', () => {
        calculateProjections();
        addAiMessage("I've calculated your financial projections. Here's what I notice about your current situation:");
        displayQuickInsights();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        calculateProjections();
        document.getElementById('scenarioName').textContent = 'Base Scenario';
        addAiMessage("Reset to base financial scenario");
    });

    // Ask AI
    document.getElementById('askAiBtn').addEventListener('click', askAiQuestion);
    document.getElementById('aiQuery').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askAiQuestion();
    });

    // Optimize finances
    document.getElementById('optimizeBtn').addEventListener('click', generateOptimizedAdvice);

    // Scenario buttons (event delegation now handled in scenarios.js)

    // Initialize with base projections
    calculateProjections();
});
