/**
 * Todo CRUD Operations
 * 
 * Implements queries and mutations for managing todos with:
 * - User isolation (all operations scoped to userId)
 * - Input validation (using Convex validators)
 * - Authentication checks (placeholder for Phase 2)
 * - Security-first approach (ownership verification)
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * PLACEHOLDER AUTHENTICATION HELPER
 * 
 * In Phase 2, this will be replaced with actual Microsoft Entra ID authentication.
 * For now, we use a fixed userId to enable development and testing.
 * 
 * @returns userId string
 */
async function getUserId(): Promise<string> {
  // Phase 2 TODO: Implement real authentication
  // const identity = await ctx.auth.getUserIdentity();
  // if (!identity) {
  //   throw new Error("Unauthorized: User not authenticated");
  // }
  // return identity.subject;
  
  // TEMPORARY: Fixed userId for development
  return "dev-user-123";
}

/**
 * List all todos for the authenticated user
 * 
 * Security: Only returns todos belonging to the authenticated user
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Query todos with user isolation
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    return todos;
  },
});

/**
 * Get a single todo by ID
 * 
 * Security: Verifies the todo belongs to the authenticated user
 */
export const get = query({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Get the todo
    const todo = await ctx.db.get(args.id);
    
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Authorization: Verify ownership
    if (todo.userId !== userId) {
      throw new Error("Forbidden: You can only access your own todos");
    }
    
    return todo;
  },
});

/**
 * Create a new todo
 * 
 * Validation: Title is required and must be non-empty
 * Security: Automatically associates with authenticated user
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Validate: Title must not be empty
    if (!args.title.trim()) {
      throw new Error("Validation error: Title cannot be empty");
    }
    
    // Create timestamp
    const now = Date.now();
    
    // Insert todo with user isolation
    const todoId = await ctx.db.insert("todos", {
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "active",
      priority: args.priority || "medium",
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
      userId,
    });
    
    return todoId;
  },
});

/**
 * Update an existing todo
 * 
 * Security: Verifies ownership before updating
 * Validation: Only allows updating specified fields
 */
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Get the todo
    const todo = await ctx.db.get(args.id);
    
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Authorization: Verify ownership
    if (todo.userId !== userId) {
      throw new Error("Forbidden: You can only update your own todos");
    }
    
    // Validate: Title must not be empty if provided
    if (args.title !== undefined && !args.title.trim()) {
      throw new Error("Validation error: Title cannot be empty");
    }
    
    // Build update object with only provided fields
    const updates: Record<string, string | number | undefined> = {
      updatedAt: Date.now(),
    };
    
    if (args.title !== undefined) {
      updates.title = args.title.trim();
    }
    if (args.description !== undefined) {
      updates.description = args.description.trim();
    }
    if (args.status !== undefined) {
      updates.status = args.status;
    }
    if (args.priority !== undefined) {
      updates.priority = args.priority;
    }
    if (args.dueDate !== undefined) {
      updates.dueDate = args.dueDate;
    }
    
    // Update the todo
    await ctx.db.patch(args.id, updates);
    
    return args.id;
  },
});

/**
 * Toggle todo completion status
 * 
 * Security: Verifies ownership before updating
 */
export const toggleComplete = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Get the todo
    const todo = await ctx.db.get(args.id);
    
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Authorization: Verify ownership
    if (todo.userId !== userId) {
      throw new Error("Forbidden: You can only update your own todos");
    }
    
    // Toggle status
    const newStatus = todo.status === "active" ? "completed" : "active";
    
    // Update the todo
    await ctx.db.patch(args.id, {
      status: newStatus,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

/**
 * Delete a todo
 * 
 * Security: Verifies ownership before deletion
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user ID
    const userId = await getUserId();
    
    // Get the todo
    const todo = await ctx.db.get(args.id);
    
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Authorization: Verify ownership
    if (todo.userId !== userId) {
      throw new Error("Forbidden: You can only delete your own todos");
    }
    
    // Delete the todo
    await ctx.db.delete(args.id);
    
    return args.id;
  },
});
