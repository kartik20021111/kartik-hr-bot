# PeopleBot — AI-Powered HR Assistant
### by Kartik Corp.

> An intelligent HR chatbot concept built for modern teams. Employees get instant answers to HR policy questions. Admins manage onboarding, check-ins, and the policy knowledge base — all from one clean interface.

---

## 🔗 Live Demo
**[kartik-hr-bot-bn4l.vercel.app](https://kartik-hr-bot-bn4l.vercel.app)**

> The live demo runs the full UI. The AI chat requires a local Ollama instance to be connected — see the Local Setup section below to run it fully.

---

## 📸 Screenshots

| Login | Admin Dashboard | Employee Chat |
|-------|----------------|---------------|
| Role-based entry | Full HR command center | AI-powered policy answers |

---

## 💡 What is PeopleBot?

PeopleBot is a concept HR AI assistant I designed and built to solve a real problem — employees waste time chasing HR for answers that are already written in policy documents. PeopleBot puts those answers one message away.

The system has two sides:

**HR Admin** — Upload and manage HR policy documents, add or remove employees, track onboarding progress with a 15/30/60/90-day check-in scheduler, and send automated check-in emails directly from the dashboard.

**Employee** — Chat with PeopleBot in natural language. Ask about leave policies, benefits, onboarding steps, bereavement leave, flexible work options — anything in the company's policy documents. PeopleBot answers from the actual documents, not from general knowledge.

---

## ✨ Features

- **Dual-view system** — Separate HR Admin and Employee interfaces from a single login screen
- **AI Chat** — Powered by Ollama (local AI, no API keys, no data sent to the cloud)
- **Policy Knowledge Base** — Paste policy text directly into the admin panel; the bot reads and answers from it
- **Persistent Storage** — Policies saved to a local JSON file, survive restarts and page refreshes
- **30/60/90-Day Check-in Scheduler** — Auto-calculates check-in dates from joining date; sends email reminders
- **Add / Remove Employees** — New employees added in admin appear instantly in the employee login list
- **Email Reminders** — Pre-written Day 15, 30, 60, 90 check-in emails with pulse survey forms, sent directly from Gmail
- **Stitch Design System** — UI designed in Google Stitch, built in React with Lumina HR dark theme and PeopleBot light theme
- **Fully Private** — All AI processing happens locally on your machine via Ollama. No data leaves your network.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Create React App) |
| Backend | Node.js + Express |
| AI Model | Ollama — tinyllama / qwen2 (local) |
| Deployment | Vercel (frontend) |
| Design | Google Stitch + custom React |
| Storage | JSON file (docs.json) |
| Email | mailto: links → Gmail |

---

## 🚀 Run Locally (Full AI Chat)

### Prerequisites
- Node.js (nodejs.org)
- Ollama (ollama.com)

### Step 1 — Clone the repo
```bash
git clone https://github.com/kartik20021111/kartik-hr-bot.git
cd kartik-hr-bot
```

### Step 2 — Download the AI model
```bash
ollama pull qwen2:1.5b
```

### Step 3 — Install backend dependencies
```bash
npm install
```

### Step 4 — Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 5 — Run everything (3 terminals)

**Terminal 1 — Ollama**
```bash
ollama serve
```

**Terminal 2 — Backend**
```bash
cd server
node index.js
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 How to Use

**As HR Admin:**
1. Log in as HR Admin
2. Go to **Policies** → click **Add Policy** → paste your HR policy text (keep under 1200 words per policy)
3. Go to **Staff** → add employees with their real email addresses
4. Go to **Scheduler** → send Day 15/30/60/90 check-in emails to employees
5. Go to **Home** → see dashboard with live stats

**As Employee:**
1. Log in as Employee → select your profile
2. Ask PeopleBot anything — "How many casual leave days do I get?" or "What is the bereavement leave policy?"
3. PeopleBot answers only from the policy documents uploaded by your HR admin

---

## 🎨 Design

The UI was designed in **Google Stitch** using two custom design systems:

- **Lumina HR** — Dark navy theme for the Admin view. Deep navy (#051424) background with cyan (#22DCDC) primary and coral (#FF5757) accent. Glassmorphism cards and SVG icon navigation.
- **PeopleBot Light** — Clean white theme for the Employee chat. Teal (#006A6A) primary with soft blue (#F0F7FF) background. Inspired by modern messaging apps.

---

## 📁 Project Structure

```
kartik-hr-bot/
├── frontend/          # React app (Vercel deployment)
│   └── src/
│       └── App.jsx    # Full UI — Login, Admin, Employee views
├── server/
│   └── index.js       # Express backend — Ollama chat + doc storage
├── package.json       # Backend dependencies
└── README.md
```

---

## 🔮 Future Scope

- **Real database** (PostgreSQL or MongoDB) instead of JSON file
- **Authentication** — actual login with passwords per employee
- **Larger AI models** — Mistral or Llama 3 on a proper server for better accuracy
- **WhatsApp / Slack integration** — send check-ins directly via messaging apps
- **Analytics dashboard** — track which policies employees ask about most
- **Mobile app** — React Native version for phone-first access

---

## 👨‍💻 Built By

**Kartik** — designed, built, and deployed end to end as a concept product for modern HR teams.

- GitHub: [github.com/kartik20021111](https://github.com/kartik20021111)
- Email: kartik111102@gmail.com

---

## 📄 License

MIT — free to use, modify, and build on.
