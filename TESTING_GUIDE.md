# 🧪 AI Agents Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Environment
Make sure your `.env` file exists in the project root with:



### 3. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create a Superuser (Optional, for Admin)
```bash
python manage.py createsuperuser
```

### 5. Run the Server
```bash
python manage.py runserver
```

---

## Testing the AI Agents

### Step 1: Access the Testing Interface

1. **Start the server**: `python manage.py runserver`
2. **Open your browser**: Go to `http://127.0.0.1:8000/`
3. **Login or Sign Up**: Create an account or login
4. **Go to Dashboard**: You'll be redirected to the dashboard
5. **Click "🤖 Test AI Agents"** button or navigate to `http://127.0.0.1:8000/ai-agents/`

### Step 2: Create Test Data (via Admin)

Before testing, you need some projects and tasks:

1. **Go to Admin Panel**: `http://127.0.0.1:8000/admin/`
2. **Login** with your superuser account
3. **Create a Project**:
   - Click "Projects" → "Add Project"
   - Fill in:
     - Name: "Website Redesign"
     - Description: "Redesign company website"
     - Owner: Select your user
     - Status: "Active"
     - Priority: "High"
   - Save

4. **Create Tasks**:
   - Click "Tasks" → "Add Task"
   - Create multiple tasks:
     - Task 1: "Design Homepage" (High priority, Due: Tomorrow)
     - Task 2: "Create Logo" (Medium priority, Due: Next week)
     - Task 3: "Write Content" (Low priority, Due: Next month)
   - Assign them to your project
   - Save

### Step 3: Test Task & Prioritization Agent

#### Test 1: Prioritize Tasks
1. Select a project (or leave "All Projects")
2. Click **"Prioritize Tasks"** button
3. **Expected Result**: You'll see tasks with AI-assigned priorities and reasoning

#### Test 2: Suggest Task Order
1. Click **"Suggest Order"** button
2. **Expected Result**: Tasks ordered by optimal execution sequence

#### Test 3: Find Bottlenecks
1. Click **"Find Bottlenecks"** button
2. **Expected Result**: Analysis of bottlenecks, overloaded resources, and recommendations

#### Test 4: Suggest Delegation
1. Create some unassigned tasks first (tasks without assignee)
2. Click **"Suggest Delegation"** button
3. **Expected Result**: Suggestions for which team member should handle each task

### Step 4: Test Knowledge Q&A Agent

#### Test Questions to Try:
1. **"What tasks are overdue?"**
2. **"What's the status of my project?"**
3. **"How many tasks do I have?"**
4. **"What should I work on next?"**
5. **"Tell me about my active projects"**

**Steps:**
1. Select a project (optional) or leave "General Questions"
2. Type your question in the text area
3. Click **"Ask AI"** button
4. **Expected Result**: AI-powered answer based on your project data

---

## Testing via API (Advanced)

You can also test agents directly via API calls:

### Task Prioritization API
```bash
curl -X POST http://127.0.0.1:8000/api/ai/task-prioritization/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=YOUR_SESSION_ID" \
  -d '{
    "action": "prioritize",
    "project_id": 1
  }'
```

### Knowledge Q&A API
```bash
curl -X POST http://127.0.0.1:8000/api/ai/knowledge-qa/ \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionid=YOUR_SESSION_ID" \
  -d '{
    "question": "What tasks are overdue?",
    "project_id": 1
  }'
```

---

## Expected Behaviors

### Task Prioritization Agent
- ✅ Analyzes tasks and assigns priorities (high/medium/low)
- ✅ Provides reasoning for priority assignments
- ✅ Suggests optimal task execution order
- ✅ Identifies bottlenecks and overloaded team members
- ✅ Suggests task delegation strategies

### Knowledge Q&A Agent
- ✅ Answers questions about projects and tasks
- ✅ Provides context-aware responses
- ✅ Handles natural language queries
- ✅ Uses project data to give accurate answers

---

## Troubleshooting

### Issue: "GROQ_API_KEY not found"
**Solution**: Make sure `.env` file exists in project root with `GROQ_API_KEY=your_key`

### Issue: "No tasks found"
**Solution**: Create some tasks via admin panel first

### Issue: "CSRF token missing"
**Solution**: Make sure you're logged in and the page loaded correctly

### Issue: Agent returns errors
**Solution**: 
- Check that Groq API key is valid
- Check server logs for detailed error messages
- Make sure you have internet connection (Groq API requires internet)

### Issue: Slow responses
**Solution**: 
- Groq API calls take a few seconds
- This is normal - wait for the response
- Check your internet connection

---

## Next Steps

After testing these two agents, you can:
1. Implement the remaining 5 agents (Analytics, Timeline, Calendar, Meeting, Workflow)
2. Add more features to existing agents
3. Integrate agents into the main dashboard
4. Add more sophisticated UI components

---

## Agent Status

- ✅ **Task & Prioritization Agent** - Fully implemented and testable
- ✅ **Knowledge Q&A Agent** - Fully implemented and testable
- ⏳ **Analytics & Dashboard Agent** - Structure ready, needs implementation
- ⏳ **Project Timeline / Gantt Agent** - Structure ready, needs implementation
- ⏳ **Calendar Auto-planner Agent** - Structure ready, needs implementation
- ⏳ **Meeting Notetaker Agent** - Structure ready, needs implementation
- ⏳ **Workflow / SOP Runner Agent** - Structure ready, needs implementation

---

## Tips for Best Results

1. **Create diverse test data**: Mix of high/medium/low priority tasks, different due dates
2. **Test with multiple projects**: See how agents handle different contexts
3. **Try various questions**: Test the Q&A agent with different question types
4. **Check the results**: Review AI reasoning and suggestions
5. **Iterate**: Adjust your data and test again to see different results

Happy Testing! 🚀

