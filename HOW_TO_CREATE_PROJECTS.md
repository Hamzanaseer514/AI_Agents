# 📝 How to Create Projects

## Quick Guide

You now have **3 ways** to create projects in your Project Manager AI:

---

## Method 1: Via Web Interface (Recommended) ✨

### Step 1: Login
1. Go to `http://127.0.0.1:8000/`
2. Login with your account

### Step 2: Create Project
You have **3 options**:

**Option A: From Dashboard**
1. Click the **"+ Create Project"** button on the dashboard
2. Fill in the form:
   - Project Name (required)
   - Description (optional)
   - Status (Planning, Active, etc.)
   - Priority (Low, Medium, High)
   - Start Date & End Date (optional)
3. Click **"Create Project"**

**Option B: From Projects List**
1. Click **"Projects"** in navigation (or go to `/projects/`)
2. Click **"+ Create New Project"** button
3. Fill in the form and submit

**Option C: Direct URL**
- Go to: `http://127.0.0.1:8000/projects/create/`

---

## Method 2: Via Admin Panel

1. Go to `http://127.0.0.1:8000/admin/`
2. Login with superuser account
3. Click **"Projects"** → **"Add Project"**
4. Fill in the form and save

---

## Method 3: Via Django Shell

```bash
python manage.py shell
```

Then:
```python
from django.contrib.auth.models import User
from core.models import Project

# Get your user
user = User.objects.get(username='your_username')

# Create project
project = Project.objects.create(
    name='My New Project',
    description='Project description',
    owner=user,
    status='active',
    priority='high'
)

print(f"Created project: {project.name}")
```

---

## After Creating a Project

Once you create a project, you can:

1. **View Project Details**: Click on the project name or "View Details"
2. **Add Tasks**: Click "+ Add Task" button on project detail page
3. **Edit Project**: Click "Edit Project" button
4. **Test AI Agents**: Click "🤖 Test AI Agents" button (with project context)
5. **Delete Project**: Click "Delete Project" link (careful - this is permanent!)

---

## Project Fields Explained

- **Name**: Project title (required)
- **Description**: What the project is about
- **Status**: 
  - Planning - Just starting
  - Active - In progress
  - On Hold - Paused
  - Completed - Done
  - Cancelled - Cancelled
- **Priority**: Low, Medium, or High
- **Start Date**: When the project starts
- **End Date**: Project deadline

---

## Quick Tips

1. **Create projects first**, then add tasks to them
2. **Use descriptions** to provide context for AI agents
3. **Set priorities** to help AI agents prioritize tasks
4. **Add dates** for better timeline management
5. **Test AI agents** after creating projects and tasks!

---

## Navigation

- **Dashboard**: `/dashboard/` - Overview of all projects
- **Projects List**: `/projects/` - All your projects
- **Create Project**: `/projects/create/` - Create new project
- **Project Detail**: `/projects/<id>/` - View specific project

---

## Need Help?

- Check the dashboard for quick access
- Use the navigation menu
- All projects are user-specific (you only see your own)

Happy project managing! 🚀

