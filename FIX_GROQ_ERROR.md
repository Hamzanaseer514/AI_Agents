# Fix for Groq Client Error

## Error Message
```
Error: Client.__init__() got an unexpected keyword argument 'proxies'
```

## Solution

This error occurs when the `groq` library version is outdated or incompatible. Here's how to fix it:

### Step 1: Update the groq library

```bash
pip install --upgrade groq
```

Or if you're using a virtual environment:

```bash
# Activate your virtual environment first
pip install --upgrade groq
```

### Step 2: Verify the installation

```bash
pip show groq
```

You should see version 0.9.0 or higher.

### Step 3: Restart your Django server

```bash
# Stop the server (Ctrl+C)
# Then restart
python manage.py runserver
```

### Step 4: Test again

Go to the AI Agents test page and try asking a question again.

---

## Alternative: Reinstall from requirements

If updating doesn't work, try:

```bash
pip uninstall groq
pip install groq>=0.9.0
```

---

## Why this happens

The error occurs because:
1. Older versions of the `groq` library (like 0.4.1) have a different API
2. The library might be trying to pass `proxies` argument that newer versions don't accept
3. There might be a version mismatch between what's installed and what the code expects

---

## Verification

After updating, you can verify it works by:

1. Opening Python shell:
   ```bash
   python manage.py shell
   ```

2. Testing the import:
   ```python
   from groq import Groq
   from django.conf import settings
   client = Groq(api_key=settings.GROQ_API_KEY)
   print("Groq client initialized successfully!")
   ```

If this works without errors, the fix is successful!

---

## Still having issues?

If you're still getting errors after updating:

1. **Check your Python version**: Groq requires Python 3.8+
   ```bash
   python --version
   ```

2. **Check for conflicting packages**:
   ```bash
   pip list | grep groq
   ```

3. **Try a clean install**:
   ```bash
   pip uninstall groq
   pip install groq
   ```

4. **Check the error logs**: Look at your Django server console for detailed error messages

---

## Updated Code

The code has been updated to:
- Better handle version incompatibilities
- Provide clearer error messages
- Guide you to the solution

The fix is already in `core/ai_agents/base_agent.py` - you just need to update the library!

