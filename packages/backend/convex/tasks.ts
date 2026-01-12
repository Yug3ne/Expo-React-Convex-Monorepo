import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get all tasks
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

// Query to get tasks by completion status
export const listByStatus = query({
  args: { isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_completed", (q) => q.eq("isCompleted", args.isCompleted))
      .collect();
  },
});

// Mutation to create a new task
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

// Mutation to toggle task completion
export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

// Mutation to delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
