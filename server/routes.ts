import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertHomeSchema, insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Home routes
  app.post('/api/homes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const homeData = insertHomeSchema.parse({ ...req.body, createdBy: userId });
      const home = await storage.createHome(homeData);
      res.json({ home, message: "Home successfully created!" });
    } catch (error) {
      console.error("Error creating home:", error);
      res.status(400).json({ message: "Failed to create home" });
    }
  });

  app.get('/api/homes/:id', isAuthenticated, async (req, res) => {
    try {
      const homeId = req.params.id;
      const home = await storage.getHomeWithMembers(homeId);
      if (!home) {
        return res.status(404).json({ message: "Home not found" });
      }
      res.json(home);
    } catch (error) {
      console.error("Error fetching home:", error);
      res.status(500).json({ message: "Failed to fetch home" });
    }
  });

  app.post('/api/homes/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const homeId = req.params.id;
      
      const home = await storage.getHome(homeId);
      if (!home) {
        return res.status(404).json({ message: "Home not found" });
      }

      await storage.joinHome(userId, homeId);
      res.json({ message: "User added to your home!" });
    } catch (error) {
      console.error("Error joining home:", error);
      res.status(400).json({ message: "Failed to join home" });
    }
  });

  app.get('/api/homes/:id/ranking', isAuthenticated, async (req, res) => {
    try {
      const homeId = req.params.id;
      const ranking = await storage.getHomeRanking(homeId);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching ranking:", error);
      res.status(500).json({ message: "Failed to fetch ranking" });
    }
  });

  // Task routes
  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.homeId) {
        return res.status(400).json({ message: "You must be part of a home to create tasks" });
      }

      const taskData = insertTaskSchema.parse({ 
        ...req.body, 
        createdBy: userId,
        homeId: user.homeId,
      });
      
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.homeId) {
        return res.status(400).json({ message: "You must be part of a home to view tasks" });
      }

      const tasks = await storage.getTasks(user.homeId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get('/api/tasks/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getUserTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      res.status(500).json({ message: "Failed to fetch user tasks" });
    }
  });

  app.patch('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const updates = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(taskId, updates);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.post('/api/tasks/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = parseInt(req.params.id);
      
      const task = await storage.completeTask(taskId, userId);
      res.json({ task, message: "Task completed successfully! Points awarded!" });
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(400).json({ message: "Failed to complete task" });
    }
  });

  // User routes
  app.get('/api/users/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
