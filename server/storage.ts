import {
  users,
  homes,
  tasks,
  type User,
  type UpsertUser,
  type InsertHome,
  type Home,
  type InsertTask,
  type UpdateTask,
  type Task,
  type UserWithHome,
  type TaskWithRelations,
  type HomeWithMembers,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Home operations
  createHome(home: InsertHome): Promise<Home>;
  getHome(id: string): Promise<Home | undefined>;
  getHomeWithMembers(id: string): Promise<HomeWithMembers | undefined>;
  joinHome(userId: string, homeId: string): Promise<void>;
  getHomeMembers(homeId: string): Promise<User[]>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasks(homeId: string): Promise<TaskWithRelations[]>;
  getTask(id: number): Promise<TaskWithRelations | undefined>;
  updateTask(id: number, updates: UpdateTask): Promise<Task>;
  completeTask(id: number, userId: string): Promise<Task>;
  getUserTasks(userId: string): Promise<TaskWithRelations[]>;
  
  // Points and ranking
  updateUserPoints(userId: string, points: number): Promise<User>;
  getHomeRanking(homeId: string): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Home operations
  async createHome(homeData: InsertHome): Promise<Home> {
    const homeId = nanoid();
    const [home] = await db
      .insert(homes)
      .values({ ...homeData, id: homeId })
      .returning();
    
    // Update user's homeId
    await db
      .update(users)
      .set({ homeId, updatedAt: new Date() })
      .where(eq(users.id, homeData.createdBy));
    
    return home;
  }

  async getHome(id: string): Promise<Home | undefined> {
    const [home] = await db.select().from(homes).where(eq(homes.id, id));
    return home;
  }

  async getHomeWithMembers(id: string): Promise<HomeWithMembers | undefined> {
    const [home] = await db.select().from(homes).where(eq(homes.id, id));
    if (!home) return undefined;

    const members = await db.select().from(users).where(eq(users.homeId, id));
    const [creator] = await db.select().from(users).where(eq(users.id, home.createdBy));

    return { ...home, members, creator };
  }

  async joinHome(userId: string, homeId: string): Promise<void> {
    await db
      .update(users)
      .set({ homeId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getHomeMembers(homeId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.homeId, homeId));
  }

  // Task operations
  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async getTasks(homeId: string): Promise<TaskWithRelations[]> {
    const result = await db
      .select({
        task: tasks,
        creator: users,
        assignee: users,
        home: homes,
      })
      .from(tasks)
      .innerJoin(users, eq(tasks.createdBy, users.id))
      .innerJoin(users, eq(tasks.assignedTo, users.id))
      .innerJoin(homes, eq(tasks.homeId, homes.id))
      .where(eq(tasks.homeId, homeId))
      .orderBy(desc(tasks.createdAt));

    return result.map(({ task, creator, assignee, home }) => ({
      ...task,
      creator,
      assignee,
      home,
    }));
  }

  async getTask(id: number): Promise<TaskWithRelations | undefined> {
    const [result] = await db
      .select({
        task: tasks,
        creator: users,
        assignee: users,
        home: homes,
      })
      .from(tasks)
      .innerJoin(users, eq(tasks.createdBy, users.id))
      .innerJoin(users, eq(tasks.assignedTo, users.id))
      .innerJoin(homes, eq(tasks.homeId, homes.id))
      .where(eq(tasks.id, id));

    if (!result) return undefined;

    return {
      ...result.task,
      creator: result.creator,
      assignee: result.assignee,
      home: result.home,
    };
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async completeTask(id: number, userId: string): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ 
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.assignedTo, userId)))
      .returning();

    if (task) {
      // Award points to the user
      await this.updateUserPoints(userId, task.points);
    }

    return task;
  }

  async getUserTasks(userId: string): Promise<TaskWithRelations[]> {
    const result = await db
      .select({
        task: tasks,
        creator: users,
        assignee: users,
        home: homes,
      })
      .from(tasks)
      .innerJoin(users, eq(tasks.createdBy, users.id))
      .innerJoin(users, eq(tasks.assignedTo, users.id))
      .innerJoin(homes, eq(tasks.homeId, homes.id))
      .where(eq(tasks.assignedTo, userId))
      .orderBy(desc(tasks.createdAt));

    return result.map(({ task, creator, assignee, home }) => ({
      ...task,
      creator,
      assignee,
      home,
    }));
  }

  // Points and ranking
  async updateUserPoints(userId: string, pointsToAdd: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        points: db.raw(`points + ${pointsToAdd}`),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getHomeRanking(homeId: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.homeId, homeId))
      .orderBy(desc(users.points));
  }
}

export const storage = new DatabaseStorage();
