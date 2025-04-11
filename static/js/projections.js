// projections.js

let financialChart;
let baseScenario = null;
let currentScenario = null;
let scenarios = [];

function calculateProjections(scenario = null) {
    const {
        income, expenses, savings,
        investments, debt, debtRate,
        investmentReturn, years
    } = getFinancialInputs();

    const monthlySavings = income - expenses;
    const monthlyDebtRate = debtRate / 100 / 12;
    const monthlyDebtPayment = debt > 0
        ? (debt * monthlyDebtRate) / (1 - Math.pow(1 + monthlyDebtRate, -60))
        : 0;

    let projections = {
        years: Array.from({ length: years + 1 }, (_, i) => i),
        savings: [savings],
        investments: [investments],
        debt: [debt],
        netWorth: [savings + investments - debt]
    };

    let msavings = monthlySavings;
    let investReturn = investmentReturn / 100;

    for (let y = 1; y <= years; y++) {
        let s = projections.savings[y - 1];
        let i = projections.investments[y - 1];
        let d = projections.debt[y - 1];

        // Scenario Logic (light, handled in `scenarios.js`)
        if (scenario?.type === 'career' && y >= scenario.yearsUntilChange) {
            msavings = (scenario.newSalary / 12) - expenses;
        }

        if (scenario?.type === 'investment') {
            i += scenario.monthlyInvestment * 12;
            investReturn = scenario.newReturnRate / 100;
        }

        if (scenario?.type === 'purchase' && y === scenario.yearsUntilPurchase) {
            if (scenario.paymentMethod === 'cash') s -= scenario.purchaseAmount;
            else d += scenario.purchaseAmount;
        }

        let newS = s + (msavings * 12) - (d > 0 ? monthlyDebtPayment * 12 : 0);
        let newI = i * (1 + investReturn);
        let newD = Math.max(0, d - (monthlyDebtPayment * 12));

        projections.savings.push(newS);
        projections.investments.push(newI);
        projections.debt.push(newD);
        projections.netWorth.push(newS + newI - newD);
    }

    currentScenario = {
        projections,
        type: scenario?.type || 'base',
        name: scenario?.type ? document.getElementById('scenarioName').textContent : 'Base Scenario'
    };

    if (!scenario) baseScenario = currentScenario;

    updateChart(projections);
    updateFinancialMetrics(projections);
}

function updateChart(proj) {
    if (financialChart) financialChart.destroy();

    const ctx = document.getElementById('financialChart').getContext('2d');
    financialChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: proj.years,
            datasets: [
                { label: 'Net Worth', data: proj.netWorth, borderColor: '#6366f1', fill: true },
                { label: 'Investments', data: proj.investments, borderColor: '#10b981' },
                { label: 'Savings', data: proj.savings, borderColor: '#8b5cf6' },
                { label: 'Debt', data: proj.debt, borderColor: '#ef4444' }
            ].map(ds => ({ ...ds, borderWidth: 2, tension: 0.3 }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#e5e7eb' } },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${formatINR(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: { ticks: { color: '#9ca3af' }, grid: { color: '#4b5563' } },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        callback: val => formatINR(val)
                    },
                    beginAtZero: true,
                    grid: { color: '#4b5563' }
                }
            }
        }
    });
}

function updateFinancialMetrics(proj) {
    const last = proj.years.length - 1;

    const netWorth = proj.netWorth[last];
    const netChange = ((netWorth - proj.netWorth[0]) / proj.netWorth[0]) * 100;

    document.getElementById('netWorth').textContent = formatINR(netWorth);
    document.getElementById('netWorthChange').textContent = `${netChange >= 0 ? '+' : ''}${netChange.toFixed(1)}% from start`;
    document.getElementById('netWorthChange').className = `mt-2 text-sm ${netChange >= 0 ? 'text-indigo-300' : 'text-red-400'}`;

    const invGrowth = proj.investments[last] - proj.investments[0];
    const invChange = (invGrowth / proj.investments[0]) * 100;

    document.getElementById('investmentGrowth').textContent = formatINR(invGrowth);
    document.getElementById('investmentChange').textContent = `${invChange >= 0 ? '+' : ''}${invChange.toFixed(1)}% growth`;
    document.getElementById('investmentChange').className = `mt-2 text-sm ${invChange >= 0 ? 'text-green-300' : 'text-red-400'}`;

    const debtRem = proj.debt[last];
    const debtChange = proj.debt[0] === 0 ? 0 : ((debtRem - proj.debt[0]) / proj.debt[0]) * 100;

    document.getElementById('debtRemaining').textContent = formatINR(debtRem);
    document.getElementById('debtChange').textContent = proj.debt[0] === 0 ? 'No initial debt' : `${debtChange.toFixed(1)}% change`;
    document.getElementById('debtChange').className = `mt-2 text-sm ${debtChange <= 0 ? 'text-purple-300' : 'text-red-400'}`;
}
