# SQL Server Migration Guide

This guide will help you migrate your Django project from SQLite to SQL Server (SSMS).

## Prerequisites

1. **SQL Server installed and running** (SQL Server Express or full version)
2. **ODBC Driver installed** on your machine:
   - Download from: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
   - Install either "ODBC Driver 17 for SQL Server" or "ODBC Driver 18 for SQL Server"
3. **Database created** in SQL Server (you can create it via SSMS)

## Step 1: Install Required Packages

Install the new package and update existing ones:

```bash
pip install mssql-django
pip install -r requirements.txt
```

**Note**: The `mssql-django` package is maintained by Microsoft and supports Django 3.2+ (including Django 5.0) and all SQL Server versions including SQL Server 2022. It provides the `mssql` engine which is configured in `settings.py`. This package uses `pyodbc` (which is already in your requirements).

## Step 2: Create Database in SQL Server

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Create a new database (e.g., `project_manager_db`):
   ```sql
   CREATE DATABASE project_manager_db;
   ```

## Step 3: Configure Environment Variables

Add the following variables to your `.env` file in the `project_manager_ai` directory:

### Option A: Windows Authentication (Integrated Security) - Recommended for Local Development

```env
# Enable SQL Server (set to True to use SQL Server, False for SQLite)
USE_SQL_SERVER=True

# Use Windows Authentication (Integrated Security)
USE_WINDOWS_AUTH=True

# SQL Server Connection Details
DB_NAME=project_manager_db
DB_HOST=localhost
DB_PORT=1433
DB_DRIVER=ODBC Driver 17 for SQL Server
```

### Option B: SQL Server Authentication (Username/Password)

```env
# Enable SQL Server (set to True to use SQL Server, False for SQLite)
USE_SQL_SERVER=True

# Use SQL Server Authentication (set to False)
USE_WINDOWS_AUTH=False

# SQL Server Connection Details
DB_NAME=project_manager_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=1433
DB_DRIVER=ODBC Driver 17 for SQL Server
```

**Important Notes:**
- **Windows Authentication** (Option A): Uses your Windows login credentials. No username/password needed.
- **SQL Server Authentication** (Option B): Requires username and password. Make sure SQL Server Authentication is enabled in SQL Server.
- `DB_HOST` can be `localhost`, `127.0.0.1`, or your server name (e.g., `SERVERNAME\SQLEXPRESS`)
- Default port is `1433` for SQL Server
- `DB_DRIVER` should match your installed ODBC driver version (17 or 18)

## Step 4: Check ODBC Driver Name

The settings file uses `ODBC Driver 17 for SQL Server` by default. If you have a different version installed, you need to:

1. Check installed ODBC drivers:
   - Windows: Open "ODBC Data Source Administrator" (64-bit) from Start Menu
   - Look under the "Drivers" tab
   - Note the exact driver name

2. If you have "ODBC Driver 18 for SQL Server", update `settings.py`:
   ```python
   'driver': 'ODBC Driver 18 for SQL Server',
   ```

## Step 5: Run Migrations

Once everything is configured:

```bash
# Navigate to project directory
cd project_manager_ai

# Create migrations (if any new changes)
python manage.py makemigrations

# Apply migrations to SQL Server
python manage.py migrate
```

This will create all the necessary tables in your SQL Server database.

## Step 6: Create Superuser (if needed)

```bash
python manage.py createsuperuser
```

## Troubleshooting

### Issue: "ODBC Driver not found"
- **Solution**: Install the correct ODBC Driver from Microsoft's website
- Make sure you install the 64-bit version if you're using 64-bit Python

### Issue: "Login failed for user"
- **Solution**: 
  - Verify username and password in `.env` file
  - Check if SQL Server Authentication is enabled (not just Windows Authentication)
  - In SSMS: Right-click server → Properties → Security → Enable "SQL Server and Windows Authentication mode"

### Issue: "Cannot open database"
- **Solution**: 
  - Verify the database name exists in SQL Server
  - Check that the user has permissions to access the database
  - Grant necessary permissions:
    ```sql
    USE project_manager_db;
    CREATE USER [your_username] FOR LOGIN [your_username];
    ALTER ROLE db_owner ADD MEMBER [your_username];
    ```

### Issue: Connection timeout
- **Solution**: 
  - Check if SQL Server is running
  - Verify firewall settings allow connections on port 1433
  - Try using server name instead of localhost (e.g., `SERVERNAME\SQLEXPRESS`)

### Issue: "TrustServerCertificate" error
- **Solution**: The current settings include `TrustServerCertificate=yes` for development. For production, remove this and configure proper SSL certificates.

## Switching Back to SQLite

If you want to switch back to SQLite for development:

1. In `.env` file, set:
   ```env
   USE_SQL_SERVER=False
   ```

2. The application will automatically use SQLite again.

## Windows Authentication Notes

Windows Authentication is now fully integrated into the settings. Simply set `USE_WINDOWS_AUTH=True` in your `.env` file (see Step 3, Option A above). No code changes are needed - the settings will automatically configure `Trusted_Connection=yes` when Windows Authentication is enabled.

## Verification

After migration, verify the connection:

```bash
python manage.py dbshell
```

This should open a connection to your SQL Server database. Type `exit` to leave.

You can also check tables in SSMS:
- Expand your database
- Expand "Tables" folder
- You should see all Django tables (auth_user, core_userprofile, etc.)

