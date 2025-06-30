import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  points: integer("points").default(0).notNull(),
  homeId: varchar("home_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Household/Family groups ("Lar")
export const homes = pgTable("homes", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  deadline: timestamp("deadline"),
  priority: varchar("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  status: varchar("status", { enum: ["pending", "completed"] }).default("pending"),
  points: integer("points").default(5).notNull(),
  createdBy: varchar("created_by").notNull(),
  assignedTo: varchar("assigned_to").notNull(),
  homeId: varchar("home_id").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  home: one(homes, {
    fields: [users.homeId],
    references: [homes.id],
  }),
  createdTasks: many(tasks, { relationName: "createdTasks" }),
  assignedTasks: many(tasks, { relationName: "assignedTasks" }),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  creator: one(users, {
    fields: [homes.createdBy],
    references: [users.id],
  }),
  members: many(users),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "createdTasks",
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "assignedTasks",
  }),
  home: one(homes, {
    fields: [tasks.homeId],
    references: [homes.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertHomeSchema = createInsertSchema(homes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
}).extend({
  deadline: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export const updateTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHome = z.infer<typeof insertHomeSchema>;
export type Home = typeof homes.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Extended types with relations
export type UserWithHome = User & { home?: Home };
export type TaskWithRelations = Task & {
  creator: User;
  assignee: User;
  home: Home;
};
export type HomeWithMembers = Home & {
  members: User[];
  creator: User;
};
