import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client helper
function getSupabaseClient(serviceRole = false) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = serviceRole 
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    : Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Middleware to verify user authentication
async function verifyAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'No authorization token provided' }, 401);
  }
  
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
  
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
}

// Health check endpoint
app.get("/make-server-92855c06/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTH ROUTES =====

// Sign up new user
app.post("/make-server-92855c06/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    const supabase = getSupabaseClient(true); // Use service role key
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: { name },
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ 
      user: data.user,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// ===== PROFILE ROUTES =====

// Get user profile
app.get("/make-server-92855c06/profile", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ profile: null });
    }
    
    return c.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Save user profile
app.post("/make-server-92855c06/profile", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const profile = await c.req.json();
    
    await kv.set(`profile:${userId}`, profile);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Save profile error:', error);
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

// ===== MESSAGES ROUTES =====

// Get user messages
app.get("/make-server-92855c06/messages", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const messages = await kv.get(`messages:${userId}`);
    
    return c.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// Save user messages
app.post("/make-server-92855c06/messages", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { messages } = await c.req.json();
    
    await kv.set(`messages:${userId}`, messages);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Save messages error:', error);
    return c.json({ error: 'Failed to save messages' }, 500);
  }
});

// ===== FEEDBACK ROUTES =====

// Submit feedback
app.post("/make-server-92855c06/feedback", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const feedback = await c.req.json();
    
    const feedbackId = `feedback:${Date.now()}:${userId}`;
    const feedbackData = {
      ...feedback,
      userId,
      userEmail,
      submittedAt: new Date().toISOString(),
    };
    
    await kv.set(feedbackId, feedbackData);
    
    return c.json({ 
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    return c.json({ error: 'Failed to submit feedback' }, 500);
  }
});

// Get all feedback (admin only - for demo, checks if user submitted any)
app.get("/make-server-92855c06/feedback", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const allFeedback = await kv.getByPrefix('feedback:');
    
    // Filter to only show user's own feedback
    const userFeedback = allFeedback.filter((item: any) => 
      item.value?.userId === userId
    );
    
    return c.json({ 
      feedback: userFeedback.map((item: any) => item.value)
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return c.json({ error: 'Failed to fetch feedback' }, 500);
  }
});

// ===== SYNC ROUTE =====

// Full sync endpoint - get all user data
app.get("/make-server-92855c06/sync", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    const [profile, messages] = await Promise.all([
      kv.get(`profile:${userId}`),
      kv.get(`messages:${userId}`),
    ]);
    
    return c.json({
      profile: profile || null,
      messages: messages || [],
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return c.json({ error: 'Failed to sync data' }, 500);
  }
});

// Full sync endpoint - save all user data
app.post("/make-server-92855c06/sync", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { profile, messages } = await c.req.json();
    
    const promises = [];
    
    if (profile) {
      promises.push(kv.set(`profile:${userId}`, profile));
    }
    
    if (messages) {
      promises.push(kv.set(`messages:${userId}`, messages));
    }
    
    await Promise.all(promises);
    
    return c.json({ 
      success: true,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return c.json({ error: 'Failed to sync data' }, 500);
  }
});

// Delete all user data
app.delete("/make-server-92855c06/user-data", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    await Promise.all([
      kv.del(`profile:${userId}`),
      kv.del(`messages:${userId}`),
    ]);
    
    return c.json({ 
      success: true,
      message: 'All user data deleted'
    });
  } catch (error) {
    console.error('Delete data error:', error);
    return c.json({ error: 'Failed to delete data' }, 500);
  }
});

Deno.serve(app.fetch);
