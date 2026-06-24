# Developer Portfolio (v2.6)

An immersive, premium developer portfolio and administrative dashboard designed for **Gaurav Kumar**, Software Engineer. Built using a modern full-stack architecture with React 19, Vite, Tailwind CSS v4, and Node.js with MongoDB.

---

## 🚀 Key Features

* **Glassmorphic Bento Grid UI**: A visually striking, futuristic dark-theme interface utilizing curated color palettes, gradients, and micro-interactions.
* **Administrative Operations Terminal**: A secure control console (`#admin-portal`) protected by JWT authentication that enables real-time CRUD operations to manage biography, projects, skills, professional experience, and contact inquiries.
* **On-Demand PDF CV Generation**: Integrates `jsPDF` to dynamically render and download a beautifully formatted resume (`Gaurav_Kumar_Resume.pdf`) directly from the browser.
* **Full Mobile Responsiveness (320px+)**: Tailored mobile-first layouts with locked viewport dimensions to eliminate horizontal scrolling or layout scaling issues on small screen sizes (e.g., iPhone SE).
* **Automated Inquiry Mailer**: Interactive contact form connected to an Express backend SMTP route for dispatching user queries.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Motion, Lucide React Icons.
* **Backend & API**: Node.js, Express, tsx (TypeScript Execute).
* **Database**: MongoDB & Mongoose.
* **Services**: Nodemailer (SMTP mailer dispatching), JSON Web Tokens (JWT).
* **Libraries**: jsPDF (dynamic resume PDF export).

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root directory and define the following variables:

```env
# MongoDB Connection URI
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio"

# JWT Authentication secret key
JWT_SECRET="your_jwt_secret_key"

# Administrative console credentials
ADMIN_USERNAME="your-email-id"
ADMIN_PASSWORD="YourPasswordHere"

# SMTP Mail Server Credentials (e.g., Gmail App Passwords)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18+ recommended)
* **npm** (v9+)
* **MongoDB** (Local instance or MongoDB Atlas cluster)

### Installation Steps

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   cd Professional-CS-Portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Duplicate the `.env.example` or create a `.env` file following the schema described above.

4. **Launch Development Server**:
   Runs the Node.js API server and compiles Vite assets in watch mode:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Type Checking & Linting**:
   ```bash
   npm run lint
   ```

6. **Build for Production**:
   Compiles Vite client assets and bundles the Express API server:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
├── data/                    # JSON local database backup records
├── server/                  # Backend code
│   ├── db.ts                # Mongoose schema definitions and database seed
│   └── controllers/         # Route controllers for APIs
├── src/                     # React frontend source
│   ├── components/          # Layout sections & modals
│   │   ├── About.tsx        # Profile summary & education timeline
│   │   ├── AdminDashboard.tsx # Secure admin console UI & CRUD forms
│   │   ├── Contact.tsx      # Contact hub & SMTP form
│   │   ├── Experience.tsx   # Professional milestones timeline
│   │   ├── Hero.tsx         # Welcome banner, typed skills, & metrics widget
│   │   ├── Navbar.tsx       # Glassmorphic header & PDF download controller
│   │   └── Skills.tsx       # Tech skills grid with category filters
│   ├── App.tsx              # Application layout root & routing logic
│   ├── index.css            # Custom CSS styles & Tailwind v4 theme definitions
│   └── main.tsx             # React DOM injection entrypoint
├── package.json             # Build script config and dependencies
└── tsconfig.json            # TypeScript compile configurations
```
