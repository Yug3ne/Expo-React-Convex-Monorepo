import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get recent messages (real-time)
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
    
    // Reverse to show oldest first
    return messages.reverse();
  },
});

// Mutation to send a message
export const send = mutation({
  args: { 
    userId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      userId: args.userId,
      text: args.text,
      createdAt: Date.now(),
    });
    return messageId;
  },
});

// Mutation to delete a message
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
