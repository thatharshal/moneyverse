// utils.js

function formatINR(value) {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function addAiMessage(message, isTemp = false) {
    const aiChat = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-response p-3 ${isTemp ? 'opacity-75' : ''}`;
    messageDiv.innerHTML = message;
    aiChat.appendChild(messageDiv);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function addUserMessage(message) {
    const aiChat = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message user-query p-3';
    messageDiv.textContent = message;
    aiChat.appendChild(messageDiv);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function getFinancialInputs() {
    return {
        income: parseInt(document.getElementById("income").value) || 0,
        expenses: parseInt(document.getElementById("expenses").value) || 0,
        savings: parseInt(document.getElementById("savings").value) || 0,
        investments: parseInt(document.getElementById("investments").value) || 0,
        debt: parseInt(document.getElementById("debt").value) || 0,
        debtRate: parseFloat(document.getElementById("debtRate").value) || 0,
        investmentReturn: parseFloat(document.getElementById("investmentReturn").value) || 0,
        years: parseInt(document.getElementById("years").value) || 0
    };
}

function formatAsCards(text) {
    const emojis = ["💰", "📈", "📉", "🛡️", "⚠️"];

    const lines = text
        .split(/\d+\.\s+|[-•*]\s+/)  // supports "1. ", "- ", "* ", "• "
        .map(line => line.trim())
        .filter(line => line.length > 0);

    return `
        <div class="space-y-2">
            ${lines.map((line, idx) => `
                <div class="bg-gray-800 p-3 rounded border border-indigo-600 shadow-sm">
                    <div class="flex items-start gap-2">
                        <div class="text-xl">${emojis[idx % emojis.length]}</div>
                        <div class="text-sm text-gray-100 leading-snug">${line}</div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}