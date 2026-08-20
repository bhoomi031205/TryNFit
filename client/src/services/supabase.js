import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Converts a URL (data URL, blob URL, or external URL) to a Blob/File for storage upload
 */
export const urlToBlob = async (url) => {
  if (!url) return null;
  if (url instanceof Blob || url instanceof File) return url;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.blob();
  } catch (err) {
    console.warn('Could not convert URL to blob:', url, err);
    return null;
  }
};

/**
 * Uploads an image to Supabase Storage 'wardrobe-images' under users/{userId}/{fileName}
 */
export const uploadWardrobeImage = async (fileOrUrl, fileName, userId) => {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const blob = await urlToBlob(fileOrUrl);
    if (!blob) return typeof fileOrUrl === 'string' ? fileOrUrl : null;

    const sanitizedName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `users/${userId}/${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from('wardrobe-images')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: blob.type || 'image/jpeg',
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return typeof fileOrUrl === 'string' ? fileOrUrl : null;
    }

    const { data: publicData } = supabase.storage
      .from('wardrobe-images')
      .getPublicUrl(data.path);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Upload wardrobe image failed:', err);
    return typeof fileOrUrl === 'string' ? fileOrUrl : null;
  }
};

/**
 * Automatically saves a generated try-on to Supabase tryon_history table
 */
export const saveGeneratedTryOnToSupabase = async (userId, data) => {
  if (!isSupabaseConfigured || !supabase || !userId || !data?.resultUrl) {
    return null;
  }

  try {
    const historyId = data.id || `tryon_${Date.now()}`;
    const { data: record, error } = await supabase
      .from('tryon_history')
      .upsert({
        id: historyId,
        user_id: userId,
        title: data.title || 'Virtual Try-On',
        result_url: data.resultUrl,
        person_image_url: data.personPreview || data.personImage || null,
        garment_image_url: data.garmentPreview || data.garmentImage || null,
        category: data.category || 'apparel',
        model: data.model || 'wearfits/tryon-clothing',
        credits_used: data.credits || 1,
        execution_time: data.executionTime || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return record;
  } catch (err) {
    console.warn('saveGeneratedTryOnToSupabase warning:', err.message);
    return null;
  }
};

/**
 * Explicitly saves a look to Supabase Database (wardrobe_items & tryon_history)
 */
export const saveLookToSupabase = async (userId, lookData) => {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return null;
  }

  try {
    const [savedResultUrl, savedPersonUrl, savedGarmentUrl] = await Promise.all([
      uploadWardrobeImage(lookData.resultUrl, 'result.jpg', userId),
      lookData.personImage ? uploadWardrobeImage(lookData.personImage, 'person.jpg', userId) : null,
      lookData.garmentImage ? uploadWardrobeImage(lookData.garmentImage, 'garment.jpg', userId) : null,
    ]);

    const finalResultUrl = savedResultUrl || lookData.resultUrl;
    const finalPersonUrl = savedPersonUrl || lookData.personImage;
    const finalGarmentUrl = savedGarmentUrl || lookData.garmentImage;

    const { data: wardrobeItem, error: wardrobeErr } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: userId,
        title: lookData.title || 'My Saved Look',
        result_url: finalResultUrl,
        person_image_url: finalPersonUrl,
        garment_image_url: finalGarmentUrl,
        category: lookData.category || 'apparel',
        tags: Array.isArray(lookData.tags) && lookData.tags.length > 0 ? lookData.tags : ['Favorites'],
        notes: lookData.notes || null,
      })
      .select()
      .single();

    if (wardrobeErr) {
      console.error('Failed to insert into wardrobe_items:', wardrobeErr);
      throw wardrobeErr;
    }

    // Also update tryon_history
    const historyId = lookData.id || `tryon_${Date.now()}`;
    await supabase
      .from('tryon_history')
      .upsert({
        id: historyId,
        user_id: userId,
        title: lookData.title || 'Virtual Try-On',
        result_url: finalResultUrl,
        person_image_url: finalPersonUrl,
        garment_image_url: finalGarmentUrl,
        category: lookData.category || 'apparel',
        model: lookData.model || 'wearfits/tryon-clothing',
        credits_used: 1,
        execution_time: lookData.executionTime || null,
        created_at: new Date().toISOString(),
      });

    return {
      ...wardrobeItem,
      personPreview: finalPersonUrl,
      garmentPreview: finalGarmentUrl,
      resultUrl: finalResultUrl,
    };
  } catch (err) {
    console.error('saveLookToSupabase exception:', err);
    throw err;
  }
};

/**
 * Fetches user's saved wardrobe items and tryon history from Supabase DB (enforced by RLS)
 */
export const fetchUserWardrobe = async (userId) => {
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  try {
    const [wardrobeRes, historyRes] = await Promise.all([
      supabase.from('wardrobe_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('tryon_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const wardrobeList = (wardrobeRes.data || []).map((item) => ({
      id: item.id,
      title: item.title,
      resultUrl: item.result_url,
      personPreview: item.person_image_url,
      garmentPreview: item.garment_image_url,
      category: item.category,
      tags: item.tags || ['Favorites'],
      date: item.created_at,
      createdAt: item.created_at,
      isWardrobeItem: true,
    }));

    const historyList = (historyRes.data || []).map((item) => ({
      id: item.id,
      title: item.title,
      resultUrl: item.result_url,
      personPreview: item.person_image_url,
      garmentPreview: item.garment_image_url,
      category: item.category,
      model: item.model,
      credits: item.credits_used,
      executionTime: item.execution_time,
      tags: ['History'],
      date: item.created_at,
      createdAt: item.created_at,
      isHistoryItem: true,
    }));

    // Merge without duplicates by resultUrl / id
    const combined = [...wardrobeList];
    for (const h of historyList) {
      if (!combined.some((item) => item.id === h.id || item.resultUrl === h.resultUrl)) {
        combined.push(h);
      }
    }

    combined.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    return combined;
  } catch (err) {
    console.error('fetchUserWardrobe error:', err);
    return [];
  }
};

/**
 * Deletes a single wardrobe / history item from Supabase DB (enforced by RLS)
 */
export const deleteWardrobeItem = async (itemId, userId) => {
  if (!isSupabaseConfigured || !supabase || !userId) return true;

  try {
    await Promise.all([
      supabase.from('wardrobe_items').delete().eq('id', itemId).eq('user_id', userId),
      supabase.from('tryon_history').delete().eq('id', itemId).eq('user_id', userId),
    ]);
    return true;
  } catch (err) {
    console.error('deleteWardrobeItem error:', err);
    throw err;
  }
};

/**
 * Clears all wardrobe items and history for the authenticated user (enforced by RLS)
 */
export const clearUserWardrobe = async (userId) => {
  if (!isSupabaseConfigured || !supabase || !userId) return true;

  try {
    await Promise.all([
      supabase.from('wardrobe_items').delete().eq('user_id', userId),
      supabase.from('tryon_history').delete().eq('user_id', userId),
    ]);
    return true;
  } catch (err) {
    console.error('clearUserWardrobe error:', err);
    throw err;
  }
};
