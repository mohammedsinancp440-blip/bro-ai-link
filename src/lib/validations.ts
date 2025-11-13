import { z } from 'zod';

// Complaint validation schema
export const complaintSchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: z.enum(['mentor', 'hr', 'facility', 'payment', 'technical', 'other'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }),
  is_anonymous: z.boolean()
});

// Group chat message validation schema
export const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must not exceed 2000 characters')
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  batch: z.string()
    .trim()
    .max(50, 'Batch must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  department: z.string()
    .trim()
    .max(100, 'Department must not exceed 100 characters')
    .optional()
    .or(z.literal(''))
});

// AI chat validation schema
export const aiChatSchema = z.object({
  message: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must not exceed 1000 characters'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).max(50, 'History too large')
});

export type ComplaintInput = z.infer<typeof complaintSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AIChatInput = z.infer<typeof aiChatSchema>;
