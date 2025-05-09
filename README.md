# TaskShare - Task Management Web Application

A collaborative task management web application with Google Workspace authentication and task assignment capabilities.

## Features

- **Google Workspace Authentication**: Securely sign in with your Google account
- **Task Management**: Create, update, and delete tasks
- **Task Assignment**: Assign tasks to team members
- **Task Filtering**: Filter tasks by status (pending, in progress, completed)
- **Task History**: View all completed tasks
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth 2.0
- **Deployment**: Compatible with both Replit and Google Cloud Run

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/taskshare.git
   cd taskshare
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/taskshare
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   APP_URL=http://localhost:5000
   ```

4. Set up the database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### Replit Deployment

1. Create a new Repl from the GitHub repository
2. Add the environment secrets in the Replit Secrets tab
3. Run the application with the Start button or by typing `npm run dev`

### Google Cloud Run Deployment

1. Build the Docker image:
   ```
   gcloud builds submit --tag gcr.io/your-project-id/taskshare
   ```

2. Deploy to Cloud Run:
   ```
   gcloud run deploy taskshare --image gcr.io/your-project-id/taskshare --platform managed
   ```

## License

[MIT License](LICENSE)