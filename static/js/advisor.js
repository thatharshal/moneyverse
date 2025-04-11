import { getFinancialInputs, formatAsCards } from './utils'; 

function generateOptimizedAdvice() {
    const { income, expenses, savings, investments, debt, debtRate } = getFinancialInputs();
    let advice = [];

    const savingsRate = ((income - expenses) / income) * 100;
    if (savingsRate < 20) {
        advice.push({
            icon: '💰',
            title: 'Increase Savings Rate',
            description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for 20–30% by cutting discretionary spending.`,
        });
    }

    if (savings < expenses * 6) {
        advice.push({
            icon: '🛡️',
            title: 'Build Emergency Fund',
            description: `You need ₹${((expenses * 6) - savings).toLocaleString('en-IN')} more to cover 6 months of expenses.`,
        });
    }

    if (debt > 0) {
        if (debtRate > 12) {
            advice.push({
                icon: '⚠️',
                title: 'High-Interest Debt',
                description: `Your debt interest rate is ${debtRate}%. Focus on repaying this quickly.`,
            });
        } else {
            advice.push({
                icon: '📉',
                title: 'Manage Debt Strategically',
                description: `Debt interest (${debtRate}%) is manageable. Make minimum payments while investing wisely.`,
            });
        }
    }

    if (investments === 0) {
        advice.push({
            icon: '📈',
            title: 'Start Investing',
            description: `You're not investing yet. Even small SIPs can grow over time.`,
        });
    } else {
        advice.push({
            icon: '🧠',
            title: 'Optimize Investments',
            description: `Consider diversifying to get better risk-adjusted returns.`,
        });
    }

    // Compose and display
    let html = `
        <div class="mb-4">
            <h3 class="font-medium mb-2">Your Financial Optimization Plan</h3>
            <p class="text-sm">Based on your current financial inputs, here’s what to improve:</p>
        </div>
        <div class="space-y-3">
            ${advice.map(item => `
                <div class="flex items-start p-3 bg-gray-700 rounded-lg">
                    <div class="text-xl mr-3 mt-1">${item.icon}</div>
                    <div>
                        <h4 class="font-medium">${item.title}</h4>
                        <p class="text-sm text-gray-300">${item.description}</p>
                        <button class="text-xs text-indigo-400 hover:text-indigo-300 mt-1">${item.action}</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mt-4 text-sm text-gray-400">
            <p>For personalized advice, consult a certified financial planner.</p>
        </div>
    `;

    addAiMessage(html);
}

function askAiQuestion() {
    const input = document.getElementById('aiQuery');
    const q = input.value.trim();
    if (!q) return;

    addUserMessage(q);
    input.value = '';
    addAiMessage('<i class="fas fa-circle-notch fa-spin"></i> Thinking...', true);

    fetch("/ask_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: q,
            inputs: getFinancialInputs()})
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('aiChat').lastChild.remove();
        if (data.response) {
            const formatted = formatAsCards(data.response);
            addAiMessage(formatted);
        } else {
            addAiMessage("⚠️ No response from AI.");
        }
    })    
    .catch(err => {
        document.getElementById('aiChat').lastChild.remove();
        addAiMessage("❌ Local AI error.");
        console.error(err);
    });
}

function displayQuickInsights() {
    const { income, expenses, savings, investments, debt } = getFinancialInputs();
    let insights = [];

    if (income - expenses < 0) insights.push("⚠️ You're spending more than you earn.");
    if (savings < expenses * 3) insights.push(`💡 Build an emergency fund of at least ₹${(expenses * 6).toLocaleString('en-IN')}`);
    if (debt > 0) insights.push("🔔 Pay off high-interest debt before investing.");
    if (investments === 0) insights.push("📈 Start investing! Even small SIPs can compound.");

    if (insights.length === 0) {
        insights.push("✅ Your financial base looks good! You can start optimizing now.");
    }

    setTimeout(() => {
        addAiMessage(`<ul class="list-disc pl-5">${insights.map(i => `<li>${i}</li>`).join('')}</ul>`);
    }, 1000);
}


function addPastDecision() {
    const text = document.getElementById('decisionText').value.trim();
    const year = parseInt(document.getElementById('decisionYear').value);
    const value = parseInt(document.getElementById('gainOrLoss').value);

    if (!text || isNaN(year) || isNaN(value)) {
        alert("Please fill all fields correctly.");
        return;

    }

    // Create card immediately
    const id = Date.now(); // simple unique ID
    const card = document.createElement("div");
    card.className = "bg-gray-800 p-3 rounded-md border border-gray-600";
    card.innerHTML = `
        <p class="text-indigo-300 font-medium">📝 ${text} (${year})</p>
        <p class="text-sm text-gray-300">Gain/Loss: ₹${value}</p>
        <p id="ai-response-${id}" class="text-xs italic text-gray-400 mt-2">Thinking...</p>
    `;
    document.getElementById("pastAnalysis").prepend(card);

    // Send to AI
    fetch("/analyze_decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, year, value })
    })
    .then(res => res.json())
    .then(data => {
        const aiLine = data.response || "No insight available.";
        document.getElementById(`ai-response-${id}`).innerText = `💡 ${aiLine}`;
    })
    .catch(err => {
        document.getElementById(`ai-response-${id}`).innerText = "⚠️ Error from AI.";
        console.error(err);
    });

    // Clear inputs
    document.getElementById('decisionText').value = '';
    document.getElementById('decisionYear').value = '';
    document.getElementById('gainOrLoss').value = '';
}

let decisionStack = [];

function addStackedDecision() {
    const text = document.getElementById("decisionText").value.trim();
    const type = document.getElementById("gainOrLoss").value;
    const amount = parseInt(document.getElementById("amount").value);
    const year = parseInt(document.getElementById("year").value);

    if (!text || !type || isNaN(amount) || isNaN(year)) {
        alert("Please fill out all fields.");
        return;
    }

    decisionStack.push({ text, type, amount, year });

    document.getElementById("stackedList").innerHTML = decisionStack.map((d, i) => `
        <div class="bg-gray-800 p-2 rounded border border-gray-600">
            <span class="text-indigo-400">#${i + 1}</span> ${d.text} (${d.type === "gain" ? "✅ Gain" : "❌ Loss"} ₹${d.amount}) in ${d.year}
        </div>
    `).join("");

    // Reset form
    document.getElementById("decisionText").value = "";
    document.getElementById("gainOrLoss").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("year").value = "";
}

function analyzeStackedDecisions() {
    if (decisionStack.length === 0) {
        alert("Please add at least one decision.");
        return;
    }

    fetch("/analyze_stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisions: decisionStack })
    })
    .then(res => res.json())
    .then(data => {
        const formatted = formatAsCards(data.response);
        document.getElementById("stackedImpact").innerHTML =
          `<div class="bg-gray-800 p-3 rounded border border-green-600">
              <p class="text-green-400 font-medium mb-2">💬 AI Insight:</p>
              ${formatted}
          </div>`;
    })
    .catch(err => {
        document.getElementById("stackedImpact").innerHTML = "⚠️ Error getting analysis.";
        console.error(err);
    });
}


function generateImpactSummary() {
    if (decisionStack.length === 0) {
        alert("Please add at least one decision first.");
        return;
    }

    fetch("/impact_summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisions: decisionStack })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("aiImpactSummary").innerText = `💡 ${data.response}`;
    })
    .catch(err => {
        document.getElementById("aiImpactSummary").innerText = "⚠️ Failed to get impact summary.";
        console.error(err);
    });
}


