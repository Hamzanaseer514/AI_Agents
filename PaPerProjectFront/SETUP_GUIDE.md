# PayPerProject - Complete Setup Guide

This guide will help you set up and run the PayPerProject application, including database configuration.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **SQL Server 2019+** or **SQL Server Express** installed and running
- **npm** (comes with Node.js)

---

## 🗄️ Part 1: Database Setup

### Step 1: Install SQL Server (if not already installed)

If you don't have SQL Server installed:
1. Download **SQL Server Express** (free) from Microsoft
2. During installation, choose **Mixed Mode Authentication** (SQL Server + Windows Authentication)
3. Set a password for the `sa` (system administrator) account
4. Note your **SQL Server instance name** (e.g., `SQLEXPRESS2022` or `MSSQLSERVER`)

### Step 2: Enable SQL Server Browser Service (for named instances)

If you're using a **named instance** (like `SQLEXPRESS2022`), you need to enable SQL Server Browser:

1. Open **Services** (Windows Key + R, type `services.msc`)
2. Find **SQL Server Browser**
3. Right-click → **Properties** → Set **Startup type** to **Automatic**
4. Click **Start** if it's not running
5. Click **OK**

### Step 3: Configure Database Connection

The database configuration is in `serverAPI/config/config.js`. You can either:

**Option A: Edit the config file directly**

Open `serverAPI/config/config.js` and update these values:

```javascript
database: {
  server: 'YOUR_COMPUTER_NAME\\YOUR_INSTANCE_NAME',  // e.g., 'DESKTOP-C1TLRI4\\SQLEXPRESS2022'
  user: 'sa',                                         // or your SQL Server username
  password: 'YOUR_PASSWORD',                          // your SQL Server password
  database: 'payPerProject',                          // database name (will be created)
  port: undefined,                                    // Leave undefined for named instances
  encrypt: false,                                     // Set to true for production
  trustCert: true,                                    // Set to false for production
}
```

**Option B: Use environment variables**

Create a `.env` file in the `serverAPI` folder:

```env
PORT=5000
NODE_ENV=development
DB_SERVER=YOUR_COMPUTER_NAME\YOUR_INSTANCE_NAME
DB_USER=sa
DB_PASSWORD=YOUR_PASSWORD
DB_DATABASE=payPerProject
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

**Important Notes:**
- For **named instances** (like `SQLEXPRESS2022`), use format: `COMPUTER_NAME\INSTANCE_NAME`
- The backslash must be **escaped** in JavaScript: `\\`
- For **default instance** (MSSQLSERVER), use just: `COMPUTER_NAME` or `localhost`
- **Don't specify a port** for named instances - SQL Server Browser handles it

### Step 4: Test Database Connection

Navigate to the `serverAPI` folder and test the connection:

```bash
cd serverAPI
npm run test-connection
```

This will test different connection configurations and show you which one works.

### Step 5: Create the Database

If the database doesn't exist, create it:

```bash
npm run create-db
```

This will create the `payPerProject` database in SQL Server.

### Step 6: Initialize Database Tables

Create all required tables:

```bash
npm run init-db
```

This creates 40+ tables with the `ppp_` prefix (e.g., `ppp_users`, `ppp_projects`, etc.).

**Verify tables were created:**
```bash
npm run list-tables
```

---

## 🚀 Part 2: Running the Project

This project has two parts:
1. **Frontend** (React/Vite) - runs on port 3000
2. **Backend API** (Node.js/Express) - runs on port 5000

### Step 1: Install Frontend Dependencies

Open a terminal in the **project root** directory:

```bash
npm install
```

### Step 2: Install Backend Dependencies

Open a terminal and navigate to the `serverAPI` folder:

```bash
cd serverAPI
npm install
```

### Step 3: Start the Backend Server

In the `serverAPI` terminal, start the server:

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

You should see:
```
✅ Connected to SQL Server database
🚀 Server running on port 5000
```

**Test the backend:**
- Health check: http://localhost:5000/health
- API docs (Swagger): http://localhost:5000/api-docs

### Step 4: Start the Frontend

Open a **new terminal** in the **project root** directory:

```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

**Open your browser** and visit: http://localhost:3000

---

## ✅ Verification Checklist

- [ ] SQL Server is installed and running
- [ ] SQL Server Browser service is running (for named instances)
- [ ] Database connection tested successfully (`npm run test-connection`)
- [ ] Database created (`npm run create-db`)
- [ ] Tables initialized (`npm run init-db`)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000 in browser
- [ ] Can access http://localhost:5000/health

---

## 🔧 Troubleshooting

### Database Connection Issues

**Problem: Connection timeout**
- ✅ Check SQL Server service is running
- ✅ Check SQL Server Browser service is running (for named instances)
- ✅ Check firewall settings (allow SQL Server ports)
- ✅ Verify server name format is correct

**Problem: Login failed**
- ✅ Verify SQL Server Authentication is enabled
- ✅ Check username and password are correct
- ✅ Enable SA account: Run in SQL Server Management Studio:
  ```sql
  ALTER LOGIN sa ENABLE;
  ALTER LOGIN sa WITH PASSWORD = 'YourPassword';
  ```

**Problem: Database not found**
- ✅ Run `npm run create-db` to create the database
- ✅ Or create manually in SQL Server Management Studio

**Problem: Instance not found**
- ✅ Verify instance name is correct
- ✅ Check SQL Server Browser is running
- ✅ Try using just the computer name for default instance

### Port Already in Use

**Backend (port 5000):**
Edit `serverAPI/config/config.js`:
```javascript
port: 5001  // or any other available port
```

**Frontend (port 3000):**
Edit `vite.config.js` or use:
```bash
npm run dev -- --port 3001
```

### Frontend Can't Connect to Backend

- ✅ Make sure backend is running on port 5000
- ✅ Check CORS settings in `serverAPI/config/config.js`
- ✅ Verify API base URL in frontend code points to `http://localhost:5000`

---

## 📚 Additional Resources

- **API Documentation**: http://localhost:5000/api-docs (Swagger UI)
- **Backend README**: `serverAPI/README.md`
- **Setup Instructions**: `serverAPI/SETUP_INSTRUCTIONS.md`
- **Troubleshooting Guide**: `serverAPI/TROUBLESHOOTING.md`

---

## 🎯 Quick Start Commands Summary

```bash
# 1. Install dependencies
cd serverAPI && npm install
cd .. && npm install

# 2. Test database connection
cd serverAPI && npm run test-connection

# 3. Create database
cd serverAPI && npm run create-db

# 4. Initialize tables
cd serverAPI && npm run init-db

# 5. Start backend (in serverAPI folder)
cd serverAPI && npm run dev

# 6. Start frontend (in project root)
npm run dev
```

---

## 📝 Notes

- The backend API runs on **port 5000**
- The frontend runs on **port 3000**
- Database name: `payPerProject`
- All database tables are prefixed with `ppp_`
- Swagger API documentation is available at http://localhost:5000/api-docs

---

**Need help?** Check the troubleshooting section or refer to the detailed guides in the `serverAPI` folder.











