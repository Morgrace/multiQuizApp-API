# multiQuizApp-API

A RESTful Quiz API supporting both multiple-choice and true/false question types. This project is still **in progress**, and this README will be updated as it approaches MVP.

## 🚀 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Dev Tools:** Nodemon, ESLint, Morgan, dotenv

## 📁 Folder Structure

```
multiQuizApp-API/
├── app.js               # Express app setup
├── server.js            # Main server entry point
├── config.env           # Environment variables
├── /controllers         # Route handler functions
├── /models              # Mongoose schemas
├── /routes              # API route definitions
├── /middleware          # Custom middleware (e.g. error handlers)
├── /utils               # Utility functions (e.g. catchAsync, AppError)
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

1. **Clone the repo:**

```bash
git clone https://github.com/Morgrace/multiQuizApp-API.git
cd multiQuizApp-API
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure your environment:**
   Create a `.env` file and set the following:

```env
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-password>
PORT=3000
NODE_ENV=development
```

4. **Run the server:**

```bash
npm run dev
```

## 🔗 API Endpoints (Work in Progress)

### Multiple Choice Questions

- `GET /api/v1/questions` – Get all questions
- `POST /api/v1/questions` – Create a new question
- `GET /api/v1/questions/:id` – Get question by ID
- `PATCH /api/v1/questions/:id` – Update question
- `DELETE /api/v1/questions/:id` – Delete question

### True/False Questions

- `GET /api/v1/truefalse` – Get all true/false questions
- `POST /api/v1/truefalse` – Create true/false question

## 📌 Roadmap

- [x] Question models and validations
- [x] CRUD API for both types
- [ ] User authentication (planned)
- [ ] Scoring and game logic
- [ ] Frontend integration

## 🪪 License

MIT © Morgrace

---

> **Note:** Structure and logic are subject to change as development continues. Check back soon for MVP details.
