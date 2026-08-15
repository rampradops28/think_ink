# ThinkInk 🎨

**Think it. Ink it. Share it.**

A real-time collaborative whiteboard built on the MERN stack and Socket.IO. Sketch,
brainstorm and chat with your team on a shared canvas — no reloads, no waiting.

---

## ✨ Features

### 🎨 Drawing & Collaboration
- **Real-time drawing** — pencil, rectangles, circles and lines sync instantly
- **Multi-user canvas** — everyone in a room draws on the same surface
- **Undo / redo** — step back through your own changes
- **Colour picker** — full RGBA palette with transparency
- **Adjustable stroke width**

### 💬 Communication
- **Real-time chat** scoped to each room
- **Live presence** — see who is online right now
- **Guest access** — join a room without an account

### 🎯 Interface
- **Light & dark themes** that follow your OS by default and remember your choice
- **Responsive layout** from phone to desktop
- **Reduced-motion support** for users who ask the OS to limit animation
- **Keyboard-visible focus rings** rather than outlines on every mouse click

### 👤 Accounts
- **JWT authentication**
- **Profile customisation** — image upload, name and bio
- **Room management** — create, join, share and leave rooms

---

## 🚀 Quick start

### Prerequisites
- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Clone

```bash
git clone https://github.com/rampradops28/think_ink.git
cd think_ink
```

### 2. Server

```bash
cd Backend
cp example.env .env      # then fill in MONGO_URL and JWT_SECRET
npm install
npm run dev              # nodemon; use `npm start` for a plain node process
```

The API listens on <http://localhost:8000>. `GET /api/health` returns `{ success: true }`
once it is up.

### 3. Client

```bash
cd ../Frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

---

## 🔧 Environment variables

### Backend (`Backend/.env`)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONGO_URL` | yes | — | MongoDB connection string |
| `JWT_SECRET` | yes | — | Secret used to sign tokens; use a long random string |
| `JWT_LIFETIME` | no | `7d` | Token validity (`7d`, `24h`, `30m`, …) |
| `PORT` | no | `8000` | Port the HTTP + Socket.IO server binds to |
| `CLIENT_URL` | no | `http://localhost:5173` | Origin permitted by CORS and Socket.IO |
| `NODE_ENV` | no | `development` | `production` enables CSP and disables the Socket.IO admin UI |

### Frontend (`Frontend/.env`, all optional)

| Variable | Default (dev) | Default (prod) | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` | `/api` | REST base URL |
| `VITE_SOCKET_URL` | `http://localhost:8000` | current origin | Socket.IO URL |
| `VITE_SERVER_URL` | `http://localhost:8000` | — | Target for the dev proxy |

---

## 🛠️ Tech stack

### Frontend
- **React 19** with lazy-loaded routes
- **Vite 8** (Rolldown) for builds and dev server
- **SCSS modules** on a CSS custom-property design system
- **Socket.IO client** for real-time sync
- **React Router 7**
- **react-colorful** for colour selection

### Backend
- **Express 5** — native async error handling
- **Socket.IO** for canvas, chat and presence
- **MongoDB + Mongoose 9**
- **JWT** authentication, **bcryptjs** password hashing
- **Multer 2** for profile-image uploads
- **Helmet**, CORS, rate limiting and a custom input sanitizer

---

## 📁 Project structure

```
think_ink/
├── Backend/
│   ├── controllers/         # REST handlers (auth, room, user)
│   ├── controller-socket/   # Socket.IO handlers (canvas, chat, room)
│   ├── db/                  # Connection + migration
│   ├── errors/              # Typed API errors
│   ├── middleware/          # auth, error-handler, sanitize
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Route definitions
│   └── server.js
└── Frontend/
    ├── public/              # Static assets served as-is
    ├── src/
    │   ├── api/             # Axios client
    │   ├── assets/
    │   ├── components/
    │   ├── context/         # Global state
    │   ├── Pages/
    │   ├── socket/
    │   ├── styles/          # theme.scss — all design tokens
    │   └── utils/
    ├── _variables.scss      # Shared Sass mixins (emits no CSS)
    └── vite.config.js
```

---

## 🎨 Design system

All design tokens live in `Frontend/src/styles/theme.scss` as CSS custom properties.
Theming works by flipping a single `data-theme` attribute on `<html>`; the neutral
ramp inverts under the dark theme so shared mixins stay correct in both modes
without per-component overrides.

Sass files consume the shared mixins with `@use 'variables' as *`. `_variables.scss`
deliberately emits no CSS of its own, so importing it from 20+ modules costs nothing
in output size.

---

## 📦 Production build

```bash
cd Frontend && npm run build      # emits Frontend/dist
cd ../Backend && NODE_ENV=production npm start
```

The server serves `Frontend/dist` as static files and falls back to `index.html` for
client-side routes, so a single process can host both.

---

## 📄 License

MIT
