# WhatsApp Web Clone – Full Stack Developer Evaluation Task
## 📌 Overview
This is a WhatsApp Web–like chat interface that displays real-time WhatsApp conversations using webhook data.
It processes sample WhatsApp Business API webhook payloads, stores them in MongoDB, and shows them in a clean, responsive UI similar to WhatsApp Web.
You can also send messages (stored in DB only, not sent externally).

## 🚀 Features
Webhook Payload Processor – Reads sample payloads and stores messages in MongoDB

Status Updates – Handles sent, delivered, and read states for messages

WhatsApp Web–like UI – Responsive chat interface for mobile and desktop

Send Message Demo – Add new messages to a conversation (stored in DB only)

Real-Time Updates (Optional) – Supports WebSocket for live message display

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose ORM

Frontend

React.js (Vite/CRA)

Axios

Tailwind CSS / CSS Modules

Deployment

Backend: Render 

Frontend: Vercel 

Database: MongoDB Atlas

📂 Project Structure
```bash

root/
 ├── backend/
 │   ├── models/           # Mongoose schemas
 │   ├── routes/           # API endpoints
 │   ├── controllers/      # Business logic
 │   ├── utils/            # Payload parser
 │   ├── server.js         # Main server
 │
 ├── frontend/
 │   ├── src/
 │   │   ├── components/   # Chat UI components
 │   │   ├── pages/        # Main pages
 │   │   ├── services/     # API calls
 │   │   └── App.jsx
 │
 ├── README.md
 └── package.json
```
## ⚙️ Installation & Running Locally
### 1️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/R1SH4BH81/rapidquest
cd rapidquest
### 2️⃣ Setup Backend
```bash

cd backend
npm install
```

### Run backend:

```bash
npm start
```


### 3️⃣ Setup Frontend
```bash

cd ../frontend
npm install
npm run dev
```


##🌐 Deployment
Backend deployed on Render

Frontend deployed on Vercel

Database hosted on MongoDB Atlas

Live Demo: [https://your-live-demo-url.com](https://rapidquest-blue.vercel.app/)



## 📜 Assumptions
The provided sample payloads simulate WhatsApp Business API data

Messages are stored only, no real sending to WhatsApp API

The UI mimics WhatsApp Web's layout for familiarity

### 🏆 Bonus


Fully responsive design tested on desktop and mobile

📧 Contact
If you have any questions or feedback, feel free to connect.
