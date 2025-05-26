# 🧑‍🎨 Real-Time Collaborative Whiteboard

A full-stack real-time collaborative whiteboard platform that enables multiple users to draw and collaborate simultaneously with low-latency updates and persistent session support.

## 🔥 Features

- ✏️ Real-time multi-user drawing with **Socket.IO**
- 🔒 Secure authentication with **JWT**
- 🧠 Persistent whiteboard sessions using **MongoDB** 
- ⚙️ RESTful API for whiteboard management 
- 📊 30% improvement in response times via optimized MongoDB queries and indexing 
- 🎨 Clean and intuitive UI with **React** + **TailwindCSS** 

--- 

## 🧰 Tech Stack 

### Frontend 
- React 18 
- Vite 
- TailwindCSS 
- Socket.IO Client 

### Backend 
- Node.js + Express 
- MongoDB (with Mongoose) 
- JWT Authentication 
- Socket.IO 

### DevOps 
- Docker & Docker Compose 
- Environment variables for easy config 

--- 

## 🚀 Local Setup Instructions 

### 1️⃣ Manual Setup 

#### Clone the Repo 
```bash 
git clone https://github.com/Ravi3727/White-Board-Web-Application.git  
cd white-Board-Web-Application   
``` 

##### Backend Setup   
``` 
cd backend  
npm install  
npm run dev
```  

##### Frontend Setup 
In a new terminal: 

``` 
cd frontend 
npm install 
npm run dev 
``` 
Frontend: http://localhost:5173  
Backend: http://localhost:3000  

#### Docker Setup (One Command) 
Ensure Docker and Docker Compose are installed. 

Build & Run the App  
``` 
docker-compose up --build
``` 
🎯 Frontend will be live at: http://localhost  
🔙 Backend at: http://localhost:3000  

##### 📁 Folder Structure  
``` 
whiteboard/  
│ 
├── frontend/        # React + Vite frontend  
├── backend/         # Express backend 
├── docker-compose.yml 
└── README.md 
```

##### 🔐 Environment Variables 
Backend .env (auto-provided in docker-compose) 
```
PORT=3000 
MONGODB_URI=your-mongodb-uri 
ACCESS_TOKEN_SECRET=your-access-token-secret 
REFRESH_TOKEN_SECRET=your-refresh-token-secret 
```

##### Frontend (via Docker ARG)  
``` 
VITE_BACKENDURL=http://localhost:3000/api/v1 
```

#### 🙋‍♂️ Author  
Ravikant 
B.Tech in Mathematics & Computing, Delhi Technological University 

https://www.linkedin.com/in/ravi-kant2705 

