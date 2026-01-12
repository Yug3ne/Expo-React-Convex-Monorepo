import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Example: Tasks table
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  }).index("by_completed", ["isCompleted"]),

  // Example: Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Example: Messages for real-time chat
  messages: defineTable({
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
