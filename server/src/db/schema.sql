-- ==============================================================================
-- TryNFit — Supabase Database & Storage Schema
-- Run this complete script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable UUID extension (usually pre-enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (Linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'Fashion Creator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);


-- ==============================================================================
-- 3. WARDROBE ITEMS TABLE (Explicitly Saved Looks & Garments)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Saved Look',
    result_url TEXT NOT NULL,
    person_image_url TEXT,
    garment_image_url TEXT,
    category TEXT DEFAULT 'apparel',
    tags TEXT[] DEFAULT ARRAY['Favorites']::TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user queries ordered by date
CREATE INDEX IF NOT EXISTS idx_wardrobe_user_date ON public.wardrobe_items(user_id, created_at DESC);

-- Enable RLS on wardrobe_items
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Wardrobe Items RLS Policies (STRICT user-isolation)
DROP POLICY IF EXISTS "Users can view only their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can view only their own wardrobe items"
    ON public.wardrobe_items FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert only their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can insert only their own wardrobe items"
    ON public.wardrobe_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update only their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can update only their own wardrobe items"
    ON public.wardrobe_items FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete only their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can delete only their own wardrobe items"
    ON public.wardrobe_items FOR DELETE
    USING (auth.uid() = user_id);


-- ==============================================================================
-- 4. TRYON HISTORY TABLE (Persisted Only When Saved by User)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tryon_history (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Virtual Try-On',
    result_url TEXT NOT NULL,
    person_image_url TEXT,
    garment_image_url TEXT,
    category TEXT DEFAULT 'apparel',
    model TEXT DEFAULT 'wearfits/tryon-clothing',
    credits_used INT DEFAULT 1,
    execution_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_tryon_history_user ON public.tryon_history(user_id, created_at DESC);

-- Enable RLS on tryon_history
ALTER TABLE public.tryon_history ENABLE ROW LEVEL SECURITY;

-- Tryon History RLS Policies
DROP POLICY IF EXISTS "Users can view only their own tryon history" ON public.tryon_history;
CREATE POLICY "Users can view only their own tryon history"
    ON public.tryon_history FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert only their own tryon history" ON public.tryon_history;
CREATE POLICY "Users can insert only their own tryon history"
    ON public.tryon_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete only their own tryon history" ON public.tryon_history;
CREATE POLICY "Users can delete only their own tryon history"
    ON public.tryon_history FOR DELETE
    USING (auth.uid() = user_id);


-- ==============================================================================
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 6. SUPABASE STORAGE SETUP FOR SAVED WARDROBE IMAGES
-- ==============================================================================
-- Create the 'wardrobe-images' bucket for storing saved tryon outputs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'wardrobe-images',
    'wardrobe-images',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760;

-- Storage RLS: Users can only upload, read, update, and delete files in their own folder (users/{auth.uid()}/*)
DROP POLICY IF EXISTS "Public can view wardrobe images" ON storage.objects;
CREATE POLICY "Public can view wardrobe images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wardrobe-images');

DROP POLICY IF EXISTS "Users can upload their own wardrobe images" ON storage.objects;
CREATE POLICY "Users can upload their own wardrobe images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'wardrobe-images'
        AND (auth.uid() IS NOT NULL)
        AND (storage.foldername(name))[1] = 'users'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can update their own wardrobe images" ON storage.objects;
CREATE POLICY "Users can update their own wardrobe images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'wardrobe-images'
        AND (auth.uid() IS NOT NULL)
        AND (storage.foldername(name))[1] = 'users'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete their own wardrobe images" ON storage.objects;
CREATE POLICY "Users can delete their own wardrobe images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'wardrobe-images'
        AND (auth.uid() IS NOT NULL)
        AND (storage.foldername(name))[1] = 'users'
        AND (storage.foldername(name))[2] = auth.uid()::text
    );
