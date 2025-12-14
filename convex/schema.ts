/**
 * Convex Database Schema
 * 
 * Defines the database schema for the TodoApp following strict type safety
 * and security-first principles.
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    // Core fields
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    
    // Optional due date (stored as Unix timestamp in milliseconds)
    dueDate: v.optional(v.number()),
    
    // Timestamps (stored as Unix timestamp in milliseconds)
    createdAt: v.number(),
    updatedAt: v.number(),
    
    // User isolation - userId identifies the owner
    // For now, this will be a string. In Phase 2, we'll integrate with auth
    userId: v.string(),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"])
  .index("by_user_and_priority", ["userId", "priority"]),
  
  // Schema validation enabled by default
  // Strict table name types enabled by default
});
