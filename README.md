# 📸 VibePic

**VibePic** is a full-stack social image-sharing web application inspired by platforms like Reddit and Instagram. Users can upload and explore images, upvote content and join themed groups.

---

## 🚀 Features

- 📷 Upload images
- ⬆️ Like (upvote) images
- 👥 Join groups like "Nature", "Animals", etc.
- 🌍 Multilingual support – currently available in English and Bulgarian
---
## 📸 Screenshots
### 🏠 Home Feed
<img width="1925" height="885" alt="screenshot1" src="https://github.com/user-attachments/assets/72bc1cb1-edfb-446c-b0a6-73b8c904a7bc" />

### 👥 Profile Page
<img width="1923" height="873" alt="screenshot2" src="https://github.com/user-attachments/assets/01d10cf5-5666-4be5-964a-abe493549a00" />



## 🧱 Tech Stack

| Layer     | Tech                                           |
|-----------|------------------------------------------------|
| Frontend  | React + TypeScript (hosted on Vercel)          |
| Backend   | NestJS + TypeORM (REST API)                    |
| Database  | MySQL (Clever Cloud)                           |
| Image CDN | Cloudinary                                     |
| ORM       | TypeORM                                        |
| Auth      | JWT                                             |
| Dev Tools | DBeaver, Postman, VSCode                        |

---

## 📦 Setup

### 🖥️ Backend

```bash
npm install
npm run start
```


### 🌐 Frontend

```bash
npm install
npm run start
```

Make sure .env in the frontend has your Vercel backend API URL

## 🔗 Live Demo

👉 [Live App](https://vibe-pic.vercel.app/home)

⚠️ Note: Please wait 1–2 minutes for the backend (hosted on Render) to wake up after being idle.
