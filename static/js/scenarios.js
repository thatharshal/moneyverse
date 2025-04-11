// scenarios.js

document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const scenario = btn.dataset.scenario;
        document.getElementById('scenarioDetails').classList.remove('hidden');

        document.querySelectorAll('.scenario-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        document.getElementById(`${scenario}Scenario`).classList.remove('hidden');
        addAiMessage(`You're exploring a ${scenario.replace(/([A-Z])/g, ' $1').toLowerCase()} scenario.`);
    });
});

document.querySelectorAll('.apply-scenario').forEach(btn => {
    btn.addEventListener('click', () => {
        const scenarioPanel = btn.closest('.scenario-panel');
        const type = scenarioPanel.id.replace('Scenario', '');
        let scenarioParams = {};

        if (type === 'career') {
            scenarioParams = {
                type,
                newSalary: parseFloat(document.getElementById('newSalary').value),
                yearsUntilChange: parseFloat(document.getElementById('yearsUntilChange').value)
            };
            document.getElementById('scenarioName').textContent = 'Career Change Scenario';
        } else if (type === 'investment') {
            scenarioParams = {
                type,
                newReturnRate: parseFloat(document.getElementById('newReturnRate').value),
                monthlyInvestment: parseFloat(document.getElementById('monthlyInvestment').value),
                investmentType: document.getElementById('investmentType').value
            };
            document.getElementById('scenarioName').textContent = 'Investment Strategy Scenario';
        } else if (type === 'purchase') {
            scenarioParams = {
                type,
                purchaseAmount: parseFloat(document.getElementById('purchaseAmount').value),
                yearsUntilPurchase: parseFloat(document.getElementById('yearsUntilPurchase').value),
                purchaseType: document.getElementById('purchaseType').value,
                paymentMethod: document.getElementById('paymentMethod').value
            };
            document.getElementById('scenarioName').textContent = `${scenarioParams.purchaseType} Purchase Scenario`;
        }

        calculateProjections(scenarioParams);
        addAiMessage(`Scenario applied: ${type}`);
    });
});
