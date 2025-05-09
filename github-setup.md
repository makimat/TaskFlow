# Pushing Your Code to GitHub

Since we can't directly push from Replit to GitHub, follow these steps to get your code into your GitHub organization:

## Step 1: Download the Code

1. Download the archive file from Replit:
   - Right-click on Files in the left sidebar
   - Navigate to `/tmp/taskshare.tar.gz`
   - Click "Download" to save it to your local machine

## Step 2: Extract the Code

1. Extract the downloaded tar.gz file:
   ```bash
   # On macOS/Linux
   tar -xzvf taskshare.tar.gz -C taskshare
   
   # On Windows (using 7-Zip or similar)
   # Right-click and extract to a folder named "taskshare"
   ```

## Step 3: Create a GitHub Repository

1. Go to your GitHub organization
2. Click "New repository"
3. Name it "taskshare" (or your preferred name)
4. Choose "Private" or "Public" as needed
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Push to GitHub

1. Open a terminal/command prompt and navigate to your extracted code:
   ```bash
   cd path/to/extracted/taskshare
   ```

2. Initialize a new Git repository:
   ```bash
   git init
   ```

3. Add all files:
   ```bash
   git add .
   ```

4. Commit the files:
   ```bash
   git commit -m "Initial commit"
   ```

5. Add the GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/your-organization/taskshare.git
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```
   (If you're on an older Git version, you might need to use `master` instead of `main`)

## Step 5: Verify and Configure

1. Go to your GitHub repository to verify the code was uploaded correctly
2. Configure repository settings as needed (access, branch protection, etc.)
3. Add collaborators from your organization

## Important Note About Secrets

Remember to set up the required environment variables in your production environment:
- `DATABASE_URL`: Your PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `SESSION_SECRET`: A strong random string for session encryption
- `APP_URL`: The URL where your application is hosted