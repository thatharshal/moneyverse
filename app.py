from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env 
load_dotenv()

app = Flask(__name__)

# Get your Together.ai API key
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "your-together-api-key-here")


@app.route("/")
def index():
    return render_template("index.html")


# 🔹 Route for AI Financial Advisor Chat
@app.route("/ask_ai", methods=["POST"])
def ask_ai():
    data = request.get_json()
    user_query = data.get("query", "")
    user_inputs = data.get("inputs", {})

    financial_summary = f"""
Income: ₹{user_inputs.get('income')}
Expenses: ₹{user_inputs.get('expenses')}
Savings: ₹{user_inputs.get('savings')}
Investments: ₹{user_inputs.get('investments')}
Debt: ₹{user_inputs.get('debt')} at {user_inputs.get('debtRate')}%
Investment Return: {user_inputs.get('investmentReturn')}%
Time Horizon: {user_inputs.get('years')} years
"""

    prompt = f"""You are an Indian financial advisor. Based on the user's financial state and their question, suggest Behavior-based analytics that account for your spending patterns 4–5 short improvements in bullet points only.

Financial Info:
{financial_summary}

Question:
{user_query}
"""

    try:
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {TOGETHER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/Mistral-7B-Instruct-v0.1",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 300,
                "temperature": 0.7
            }
        )

        result = response.json()
        print("Together AI /ask_ai result:", result)

        if "choices" not in result:
            error_message = result.get("error", {}).get("message", "Unknown error from Together.ai")
            return jsonify({"error": error_message}), 500

        answer = result["choices"][0]["message"]["content"]
        return jsonify({"response": answer})

    except Exception as e:
        print("❌ Together.ai /ask_ai error:", e)
        return jsonify({"error": str(e)}), 500


# 🔹 Route to Analyze Stacked Past Decisions
@app.route("/analyze_stack", methods=["POST"])
def analyze_stack():
    data = request.get_json()
    decisions = data.get("decisions", [])

    if not decisions:
        return jsonify({"error": "No decisions provided"}), 400

    # Format decisions for prompt
    history_text = "\n".join([
        f"{i+1}. {d['text']} — {d['type']} of ₹{d['amount']} in {d['year']}"
        for i, d in enumerate(decisions)
    ])

    prompt = f"""
You are a financial advisor. A user made the following decisions over time:

{history_text}

Summarize the impact of these decisions in just 3–4 short bullet points.
Avoid repeating the original decisions. Focus on the financial impact (gain/loss/stability/behavior).
Do not write a paragraph. Only give short, insightful bullet points.
"""


    try:
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {TOGETHER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/Mistral-7B-Instruct-v0.1",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 300,
                "temperature": 0.7
            }
        )

        result = response.json()
        print("Together AI /analyze_stack result:", result)

        if "choices" not in result:
            error_message = result.get("error", {}).get("message", "Unknown error from Together.ai")
            return jsonify({"error": error_message}), 500

        ai_reply = result["choices"][0]["message"]["content"]
        return jsonify({"response": ai_reply})

    except Exception as e:
        print("❌ Together.ai /analyze_stack error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)
