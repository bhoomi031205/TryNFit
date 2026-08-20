# TryNFit — AI Virtual Try-On Platform 👗✨

TryNFit is an AI-powered virtual try-on web application designed for fashion enthusiasts, online shoppers, and digital stylists. Users upload a portrait photo of themselves and a screenshot of any clothing item found online (Zara, ASOS, Pinterest, etc.). The app leverages generative AI to render a realistic visualization showing how the garment drapes and fits on the person.

---

## 🌟 Key Features & Architecture

### 1. 5-Page Application Experience
1. **Home (`/`)**: Value proposition, interactive Before/After showcase slider, feature highlights, live metrics, curated style previews, and FAQ accordion.
2. **AI Try-On Studio (`/studio`)**: Interactive virtual fitting room with dual-slot upload, presets, category/mode options, generation loader, interactive Before/After comparison slider, download tools, and **"Save to Wardrobe"** action.
3. **Explore & Style Gallery (`/explore`)**: Curated trending fashion styles (Streetwear, Luxury & Evening, Casual Chic, Summer Vibes, Tailored Workwear) with 1-click **"Try This Look"** buttons that automatically load the outfit into the Studio.
4. **Digital Wardrobe & Saved Looks (`/wardrobe`)**: Cloud lookbook powered by Supabase PostgreSQL and Storage where users can save generated try-ons, organize by tags ("Work", "Weekend", "Vacation"), compare saved looks with an interactive slider, and export them.
5. **How It Works & AI Technology (`/how-it-works`)**: Technical deep-dive into generative AI virtual try-on, neural texture transfer, pose estimation, diffusion architecture, and zero-storage privacy assurance.
6. **Authentication (`/login`, `/signup`)**: Supabase Auth with Email/Password, Google/GitHub OAuth, and 1-click Instant Demo login.

---

## 🔒 Privacy-First Data & Storage Architecture

TryNFit implements an **Ephemeral-by-Default with Explicit Save** storage model:

```
[User Uploads Portrait & Garment]
            │
            ▼
[In-Memory Stream to AI Neural Model] (Zero disk or cloud DB writes)
            │
            ▼
[Live Preview in Browser Session] (Ephemeral result rendered)
            │
    ┌───────┴────────────────────────────────────────┐
    │                                                │
[User Closes or Tries Another Outfit]    [User Clicks "Confirm & Save Look"]
    │                                                │
    ▼                                                ▼
(No files or database rows stored)       1. Uploads images to Supabase Storage:
                                            `wardrobe-images/users/{user_id}/...`
                                         2. Inserts row into Supabase PostgreSQL:
                                            `wardrobe_items` & `tryon_history`
```

1. **Zero Auto-Save During Generation**: When a user generates a try-on, the images are processed in-memory. **Nothing is written to the database or cloud storage** during generation.
2. **Explicit Save Action**: Only when the user explicitly clicks **"Confirm & Save Look"** in the Save modal or **"Save to Wardrobe"**, the images are saved to the user's private folder in Supabase Storage (`wardrobe-images/users/{user_id}/...`) and metadata is saved to their `wardrobe_items` table.
3. **Row Level Security (RLS)**: Strict database-level isolation ensures that every user can only read, write, modify, or delete their own data.

---

## ⚡ Supabase Setup Guide (Live Production Deployment)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"**, enter a project name (e.g. `trynfit-app`), choose your region, and set a database password.

### 2. Run the Database & Storage Schema
1. In your Supabase project dashboard, navigate to the **SQL Editor** tab (on the left menu).
2. Click **"New query"**.
3. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql) and paste it into the editor.
4. Click **"Run"** (or `Cmd+Enter`).
5. This automatically:
   - Creates the `profiles`, `wardrobe_items`, and `tryon_history` tables.
   - Sets up the `on_auth_user_created` trigger for automatic user profile initialization.
   - Enables **Row Level Security (RLS)** on all tables.
   - Sets up the `wardrobe-images` storage bucket and configures user-scoped storage policies.

### 3. Copy API Keys to `.env`
In your Supabase project dashboard, go to **Project Settings** → **API**:
1. Copy **Project URL** (`https://<project-ref>.supabase.co`).
2. Copy **Project API keys** (`anon` `public` key and `service_role` secret key).

Update `client/.env`:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Update `server/.env`:
```env
TRYON_API_KEY=tryon_943aaadf3acb1cd7c404bda70f67ab85951b43e2c7a9e66a
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 4. (Optional) Set up OAuth Providers (Google & GitHub)
In your Supabase Dashboard:
1. Go to **Authentication** → **Providers**.
2. **Google**: Enable Google, paste your Google Cloud OAuth Client ID and Client Secret, and set Authorized redirect URIs in Google Cloud Console to `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. **GitHub**: Enable GitHub, create an OAuth app in GitHub Developer Settings with callback URL `https://<your-project-ref>.supabase.co/auth/v1/callback`, and paste the Client ID and Secret.

---

## 🛡️ Row Level Security (RLS) Policy Reference

| Table / Storage | Operation | Rule |
| :--- | :--- | :--- |
| `profiles` | SELECT / UPDATE / DELETE | `auth.uid() = id` (User can only access their own profile row) |
| `wardrobe_items` | ALL (SELECT / INSERT / UPDATE / DELETE) | `auth.uid() = user_id` (User can only read/write their own looks) |
| `tryon_history` | ALL (SELECT / INSERT / UPDATE / DELETE) | `auth.uid() = user_id` (User can only access their own history) |
| `wardrobe-images` (Bucket) | ALL | `(storage.foldername(name))[2] = auth.uid()::text` (Files restricted to `users/{auth.uid()}/*`) |

---

## 🚀 Running Locally

```bash
# 1. Install all dependencies
npm run install:all

# 2. Run both Backend (port 5001) and Frontend (port 5173) concurrently
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001](http://localhost:5001)
- **Health Check:** `GET http://localhost:5001/api/health`
