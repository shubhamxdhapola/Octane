# ⛽ Octane — Petrol Pump Management & AI Platform

An **AI-powered, multi-tenant SaaS platform** for modern petrol pump management and retail station operations. Octane allows multiple petrol pump owners to register and manage their fuel retail business with complete data isolation, intelligent shift workflows, automated fuel pricing with live Indian market syncing, and a context-aware **AI assistant powered by Google Gemini**.

---

## ✨ Features

### 🏢 Multi-Tenant SaaS Architecture
- **Tenant Data Isolation:** Strict query-level tenant isolation ensuring Owner A never accesses Owner B's data (tanks, machines, nozzles, shifts, employees, refills, reports, or AI insights).
- **Owner Self-Registration:** Streamlined onboarding flow allowing new station owners to register their organization, location, and credentials in seconds.
- **Petrol Pump Profile Management:** Update station address, city, state, and pincode dynamically.

### 🔐 Shared / Core Features
- **Secure Authentication:** JWT-based authentication with HTTP-Only cookie storage to prevent XSS.
- **Protected Routes:** Strict role-based client-side routing and backend middleware enforcement (`admin`/owner and `employee`).

### 👨‍💼 Owner / Admin Features
- **Dashboard & Analytics:** Real-time summary cards, low stock alerts, and interactive charts tracking sales metrics scoped to the owner's pump.
- **Employee Management:** CRUD interface for station staff credentials, activation toggle, and performance analytics.
- **Tank Management:** Add storage tanks, monitor live stock levels, and set safety alerts.
- **Dispenser & Nozzle Configuration:** Connect machines to multiple nozzles, map them to fuel tanks, and track readings with cross-tenant validation.
- **Fuel Price Management & Live Sync:** Set active price per litre manually or sync live daily Indian market prices (via RapidAPI / Indian fuel price APIs) with location awareness and automated local caching.
- **Tank Refill Management:** Log bulk supplier fuel refills to automatically increment tank capacity balances.
- **Shift Auditing:** Monitor ongoing/completed worker shifts and review calculated discrepancies.
- **Report Generation:** Compile daily sales/refill audits and export as formatted Excel spreadsheets.
- **Tenant-Aware AI Assistant:** Conversational AI querying (powered by Google Gemini) strictly scoped to the authenticated owner's station data:
  - *"What is today's revenue?"*
  - *"Show today's sales report."*
  - *"Show performance for employee [Name]."*
  - *"Which tanks are running low?"*
  - The AI understands user intent, queries tenant-scoped database collections through backend services, and generates context-aware markdown replies.

### 🧑‍🔧 Employee Features
- **Shift Lifecycle Management:** Self-start shifts by machine/nozzles selection belonging to their station.
- **Sales Readings Entry:** Opening reading is pulled from the system and input final closing readings.
- **Profile & Credentials:** View personal user profile and securely update passwords.

---

## 🏗️ System Architecture

```
React Frontend (Octane UI)
       │
       ▼ (JWT HTTP-Only Cookie)
Express Backend (Tenant Scoped: req.user.petrolPumpId)
       │
       ▼
Controllers & Tenant Validation
       │
       ▼
Business Services (Scoped to petrolPumpId)
       │
       ▼
MongoDB Database (Multi-Tenant Collections & Compound Indexes)
       │
       ▼
Gemini AI (Filtered Context Payload)
```

The AI never accesses the database directly or cross-tenant data. All queries and aggregations are scoped to the authenticated user's `petrolPumpId`.

---

## 📂 Project Structure

```
backend/
├── configs/
│   ├── connectDB.js
│   └── gemini.js
├── controllers/
│   ├── ai.controller.js
│   ├── auth.controller.js
│   ├── dashboard.controller.js
│   ├── fuel.price.controller.js
│   ├── machine.controller.js
│   ├── nozzle.controller.js
│   ├── report.controller.js
│   ├── shift.controller.js
│   ├── tank.controller.js
│   ├── tank.refill.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── authenticate.middleware.js
│   └── validate.middleware.js
├── models/
│   ├── fuel.price.model.js
│   ├── machine.model.js
│   ├── nozzle.model.js
│   ├── shift.model.js
│   ├── tank.model.js
│   ├── tank.refill.model.js
│   └── user.model.js
├── routes/
│   ├── ai.routes.js
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── fuel.price.route.js
│   ├── machine.routes.js
│   ├── nozzle.routes.js
│   ├── report.routes.js
│   ├── shift.routes.js
│   ├── tank.refill.routes.js
│   ├── tank.routes.js
│   └── user.routes.js
├── services/
│   ├── ai.service.js
│   ├── dashboard.service.js
│   ├── employee.service.js
│   ├── fuel.price.service.js
│   ├── machine.service.js
│   ├── report.service.js
│   ├── shift.service.js
│   ├── tank.refill.service.js
│   └── tank.service.js
├── utils/
│   ├── buildPrompt.js
│   ├── detectIntent.js
│   ├── getDateRange.js
│   └── getCurrentFuelPrices.js
└── index.js

frontend/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── FuelPrices.jsx
│   │   │   ├── MachineDetails.jsx
│   │   │   ├── Machines.jsx
│   │   │   ├── Refills.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Shifts.jsx
│   │   │   └── Tanks.jsx
│   │   ├── employee/
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── EmployeeShifts.jsx
│   │   │   └── Profile.jsx
│   │   └── Login.jsx
│   ├── redux/
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── router.jsx
│   ├── utils/
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Tech Stack

### Frontend
- **React (v18)** with **Vite**
- **Tailwind CSS** & **PostCSS** (for modern styling)
- **Redux Toolkit** (for client state management)
- **React Router (v7)** (role-based protected routes)
- **Axios** (HTTP client requests)
- **Recharts** (data charts rendering)
- **Framer Motion** (micro-animations)
- **React Markdown** (rendering AI responses)

### Backend
- **Node.js** (ES Modules syntax)
- **Express.js (v5)** (REST APIs routing framework)
- **JWT Authentication** (session verification)
- **ExcelJS** (building server-side Excel files)
- **Zod** (validation schemas)

### AI
- **Google Gemini API** (using `@google/genai` client SDK)

### Database
- **MongoDB Atlas** with **Mongoose ODM**

---

## 🔄 Workflow

### Initial Setup
1. Admin logs into the dashboard.
2. Registers fuel storage tanks.
3. Registers fuel dispenser machines.
4. Configures nozzles and attaches them to machines and tanks.
5. Registers pump employee credentials.
6. Sets active fuel prices.

---

### Daily Operations
1. Pump employee logs in and starts a shift.
2. Initial nozzle opening meter readings are automatically pulled.
3. Shift ends: employee logs closing nozzle readings.
4. Sold fuel quantity and sales revenue are computed automatically.
5. Storage tank inventory balances are reduced.
6. Dashboard charts and inventory warnings refresh automatically.

---

### Tank Refill
1. Fuel delivery truck replenishment arrives.
2. Admin logs supplier refill transaction (litres, price per litre, date).
3. Selected storage tank level increments.
4. Dashboard shows replenished volumes.

---

### AI Workflow
```
User Question
      │
      ▼
Intent Detection (Gemini Classifier)
      │
      ▼
Business Service Lookup
      │
      ▼
MongoDB Queries & Data Formatting
      │
      ▼
Gemini Response Synthesis (using context payload)
      │
      ▼
Natural Language Markdown Response
```

---

## 🚀 Installation

### Clone Repository
```bash
git clone https://github.com/shubhamxdhapola/Sai-Petrol-Pump.git
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Project

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
DATABASE_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001
```

---

## 📈 Future Improvements
- Multi-petrol pump site support
- Automated daily email summaries to manager accounts
- Voice-enabled AI queries (Speech-to-Text inputs)
- Predictive inventory algorithms forecasting fuel demand curves
- Advanced employee scheduling charts
- Customizable visual notification alerts

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to your branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shubham Dhapola**  
MERN Stack Developer  

*If you found this project useful, consider giving it a ⭐ on GitHub!*
