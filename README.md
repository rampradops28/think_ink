# ShareSketch 🎨

**Modern Collaborative Drawing & Idea Sharing Platform**
 

A feature-rich, real-time collaborative drawing platform built with **MERN Stack** and **Socket.IO**. Experience seamless creativity with modern UI design, real-time collaboration, and intuitive drawing tools.

## ✨ Features

### 🎨 **Drawing & Collaboration**
- **Real-time Drawing**: Pencil, rectangles, circles, lines with instant sync
- **Multi-user Canvas**: Collaborate with unlimited users simultaneously
- **Undo/Redo**: Smooth correction of drawing mistakes
- **Color Picker**: Full color palette with transparency support
- **Line Width Control**: Adjustable stroke thickness

### 💬 **Communication**
- **Real-time Chat**: Instant messaging with user indicators
- **User Presence**: See who's online and active
- **Guest Access**: Join without registration for quick collaboration

### 🎯 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful backdrop blur effects
- **Responsive Layout**: Perfect on desktop, tablet, and mobile
- **Dark/Light Themes**: Toggle between themes seamlessly
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: WCAG compliant design system

### 👤 **User Management**
- **Profile Customization**: Upload images, edit name & bio
- **JWT Authentication**: Secure login with token-based auth
- **Room Management**: Create, join, and share drawing rooms
- **User Status**: Real-time online/offline indicators

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone & Setup**
   ```bash
   git clone https://github.com/aslezar/ShareSketch.git
   cd ShareSketch
   ```

2. **Server Setup**
   ```bash
   cd server
   cp example.env .env
   # Edit .env with your MongoDB URL and JWT secret
   npm install
   npm start
   ```

3. **Client Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:5173
   ```

## 🎨 Design System

ShareSketch features a **modern design system** with:

- **CSS Custom Properties**: Dynamic theming and consistent styling
- **Responsive Breakpoints**: Mobile-first responsive design
- **Component Library**: Reusable UI components with variants
- **Animation System**: Smooth transitions and micro-interactions
- **Typography Scale**: Consistent font hierarchy and spacing
- **Color Palette**: Professional blue gradient theme with semantic colors

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **SCSS Modules** - Scoped styling with design system
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Real-time Features
- **Canvas Synchronization** - Instant drawing updates
- **Chat Broadcasting** - Real-time messaging
- **User Presence** - Live user status updates
- **Room Management** - Dynamic room creation/joining

## 📱 Responsive Design

ShareSketch is **fully responsive** with:
- **Mobile-First**: Optimized for touch devices
- **Tablet Support**: Perfect middle-ground experience
- **Desktop Enhanced**: Full feature set with larger canvas
- **Adaptive Layout**: Components adjust to screen size

## 🎯 Use Cases

- **Remote Teams**: Collaborative brainstorming sessions
- **Education**: Interactive teaching and learning
- **Design Reviews**: Real-time feedback and iteration
- **Creative Workshops**: Group ideation and sketching
- **Prototyping**: Quick wireframe collaboration

## 🔧 Environment Variables

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/sharesketch
JWT_SECRET=your-super-secret-jwt-key
JWT_LIFETIME=7d
```


*Built with ❤️ using modern web technologies*
