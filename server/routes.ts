import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import session from "express-session";
import { insertTaskSchema, TaskStatus } from "@shared/schema";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";
import memorystore from "memorystore";

// Database session store setup
let sessionStore: session.Store;
if (process.env.DATABASE_URL) {
  const PgStore = connectPgSimple(session);
  sessionStore = new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  });
} else {
  const MemoryStore = memorystore(session);
  sessionStore = new MemoryStore({
    checkPeriod: 86400000, // Prune expired entries every 24h
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const passport = setupAuth();

  // Set up session middleware
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "TaskShare secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth routes
  app.get("/api/auth/google", passport.authenticate("google"));

  app.get(
    "/api/auth/google/callback",
    (req, res, next) => {
      // Log the callback URL for debugging
      console.log(`Handling callback at: ${req.originalUrl}`);
      
      // Custom callback to handle authentication result
      passport.authenticate("google", (err, user, info) => {
        if (err) {
          console.error("Authentication error:", err);
          return res.redirect("/login?error=auth_error");
        }
        
        if (!user) {
          console.error("Authentication failed, no user:", info);
          return res.redirect("/login?error=auth_failed");
        }
        
        // Log the user in
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("/login?error=login_error");
          }
          
          // Successful authentication
          return res.redirect("/");
        });
      })(req, res, next);
    }
  );

  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.json(req.user);
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tasks = await storage.getTasksByUserId(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  });

  app.get("/api/tasks/assigned", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tasks = await storage.getTasksAssignedByUser(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assigned tasks" });
    }
  });

  app.get("/api/tasks/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tasks = await storage.getCompletedTasksByUserId(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task history" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        createdById: req.user.id,
      });
      
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating task" });
    }
  });

  app.put("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Ensure the user is the creator or the assignee
      if (task.createdById !== req.user.id && task.assignedToId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this task" });
      }

      const updatedTask = await storage.updateTask(taskId, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Ensure the user is the creator
      if (task.createdById !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this task" });
      }

      await storage.deleteTask(taskId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
    }
  });

  // Team members route
  app.get("/api/team", isAuthenticated, async (req, res) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
