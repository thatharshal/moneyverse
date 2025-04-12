# 💸 MoneyVerse: Multiverse of Finance

> **Dive into alternate financial realities, explore better outcomes, and optimize your future.**
> Explore alternate financial timelines using AI-driven insights that helps you explore, analyze, and optimize your past and future financial decisions.  
> Rethink your choices. Rebuild your finances. Rewrite your story.

---
### 🔗 Link to deployed website: https://moneyverse.onrender.com/
---
## 📘 Project Overview

**MoneyVerse** is a smart financial assistant that helps users analyze past financial decisions, simulate future scenarios, and receive actionable optimization advice — all inside a sleek,  UI powered by AI.

> It empowers users to understand the impact of their money moves across time like a time machine for your wallet.

> Designed with a modern **glassmorphic UI** and powered by **Together.ai**, this tool makes financial planning engaging and smart just like a multiverse for your wallet.

---

## ⚙️ Key Features & Technologies

### ✨ Features

- 🔮 **Scenario-Based Future Projections** — Customize income, savings, and simulate outcomes.
- 🎬 **"What if" scenarios** — For career changes, investments, and major purchases.
- 🤖 **AI Advisor** — Get cost-effective suggestions based onbehavior analytics. (Powered by Together.ai)
- 📊 **Impact Summary** — Stack multiple decisions and generate an  insight.
- 🎬 **"What if" scenarios** — For career changes, investments, and major purchases.
- 🔁 **Stack Past Decisions** — Enter your past financial moves and get AI insights.
- 🧊 **Glassmorphism UI** — Clean, responsive design using Tailwind CSS.


### 🧰 Tech Stack
| Category    | Tools                            |
|-------------|----------------------------------|
| Frontend    | Tailwind CSS, JavaScript         |
| Backend     | Flask (Python), flask-cors       |
| AI Engine   | Together.ai API                  |
| Hosting     | Render                           |

---

## 🚀 Setup Instructions (Local)

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/your-username/moneyverse.git
cd financial-time-machine
```

### 🔐 2. Create a Virtual Environment (Optional)
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 📊 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 📦 4. Set Up .env File
Create a file named ```.env ``` in the root directory with your **Together.ai API key** :
```bash
TOGETHER_API_KEY=sk-your-api-key-here
```

### ▶️ 5. Run the App
```bash
python app.py
```
Open http://localhost:5000 in your browser.

---

## 🚀 Live Deployment (Render)
**1. Push this project to a GitHub repo**

**2. Go to Render.com → New → Web Service**

**3. Link your GitHub repo**

**4. Add:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`

**5. Add environment variable:**
```bash
TOGETHER_API_KEY=sk-your-api-key
```
**6. Deploy and you're live 🎉**

---
## 📸 Screenshot:

>Landing Page:
![image](https://github.com/user-attachments/assets/960c53dc-de16-48e3-946c-eb8cacb4ca8d)

>Financial settings, "What if" Scenarios and projection:

![image](https://github.com/user-attachments/assets/7fc0e84f-9047-4e9f-a42a-907f10bcce66)

>Past descision and impact insights:

![image](https://github.com/user-attachments/assets/0b782735-8b40-4d32-9c73-1ba0d7df9cb5)

>AI Advisor:

![image](https://github.com/user-attachments/assets/535e0db1-c35a-44e1-9bdc-2779b9c1fd9b)

>Sample video:
https://github.com/user-attachments/assets/06f911d9-ba84-44cd-89a1-24875828e658

---

## 🙌 Credits:
>Built with love for learning, experimentation, and financial empowerment.

>Created by Harshal Chaudhari for **xto10x Hackathon (Edition 3)- April 2025 🚀**
