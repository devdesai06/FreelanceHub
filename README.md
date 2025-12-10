🌐 FreelanceHub — MERN Freelancing Marketplace Platform

FreelanceHub is a full-stack freelancing marketplace inspired by Fiverr & Upwork.
It enables clients to post projects, freelancers to bid, and both parties to collaborate through a structured workflow.
Built using the MERN stack, this platform focuses on real-world functionality like secure authentication, OTP email verification, MongoDB transactions, and automated email notifications.

🚀 Live Demo

Frontend: https://freelance-hub-hmju.vercel.app/

Backend: Hosted on Render

🎯 Features
🔐 Authentication & Security

JWT + HTTP-only cookies

Secure login & registration

Email-based OTP verification (Brevo API)

Protected routes & middleware authentication

📩 Email System

OTP verification email

Bid acceptance notifications

Beautiful HTML templates

Uses Brevo HTTP API (no SMTP issues)

👤 Client Features

Post projects

View & manage bids

Accept a freelancer (auto-updates all bids)

Track assignment status

🧑‍💻 Freelancer Features

Browse available projects

Place bids with proposal + amount

Receive email when bid is accepted

Track assigned projects

📁 Project Management

Project workflow (open → in-progress)

MongoDB session transactions ensure safe state updates

Clean bid rejection + acceptance logic

🎨 UI & UX

Clean, modern UI

Responsive, smooth user experience

Inspired by Fiverr marketplace design patterns

🧠 What I Learned

Building FreelanceHub helped me dive deep into:

Authentication & JWT best practices

OTP workflows + email API integration

MongoDB transactions for safe updates

Production debugging (SMTP issues, CORS, deployments)

Deploying MERN apps on Vercel + Render

Writing scalable backend controllers

Designing clean, intuitive UI

🚧 Future Enhancements

Coming soon:

🔄 Pagination for projects & bids

💬 Real-time chat system between clients & freelancers

📊 Freelancer & client dashboards

🔔 Push notifications

⭐ Profile pages with ratings & reviews

🛠 Tech Stack

Frontend

React
Context API / Hooks
React Router
Axios
CSS (Responsive design)

Backend

Node.js
Express.js
MongoDB + Mongoose
JSON Web Tokens (JWT)
Brevo Email API
Render (Deployment)
Tools
Git & GitHub
Vercel
Render
Postman

🏗 Project Structure
FreelanceHub/
│
├── frontend/              # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── styles/
│
├── backend/
│   ├── controllers/       # User, Project, Bid controllers
│   ├── routes/            # API routes
│   ├── models/            # MongoDB schemas
│   ├── middlewares/       # Auth middleware
│   └── index.js           # Server entry
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repo
git clone <your-repo-url>
cd FreelanceHub

2️⃣ Install backend dependencies
cd backend
npm install

3️⃣ Install frontend dependencies
cd ../frontend
npm install

4️⃣ Environment Variables

Create a .env inside backend:

MONGO_URI=your_database_url
JWT_SECRET_KEY=your_jwt_secret
BREVO_API_KEY=your_brevo_key

5️⃣ Run backend
npm run dev

6️⃣ Run frontend
npm start

📡 API Highlights
POST /register

User signup

POST /sendOtp

Sends OTP email

POST /verifyEmail

Verifies email using OTP

POST /login

User login

POST /placeBid/:id

Freelancer places a bid

POST /acceptBid/:id

Client accepts a bid (email notification sent)



⭐ Support This Project

If you found this project helpful or inspiring, please consider giving it a ⭐ on GitHub!
It motivates me to keep building and improving.

👤 Author

Dev Desai
Full Stack Web Developer (MERN)
LinkedIn: https://www.linkedin.com/in/dev-desai-8bb22331b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
