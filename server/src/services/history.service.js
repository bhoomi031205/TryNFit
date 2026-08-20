import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSupabaseAdminClient, isSupabaseConfigured } from '../config/supabase.config.js';
import { fetchImageWithSafeRedirects } from '../utils/security.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE_PATH = path.join(__dirname, '../data/history.json');

/**
 * Ensures history.json file exists for local fallback
 */
const ensureHistoryFile = () => {
  const dir = path.dirname(HISTORY_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE_PATH)) {
    fs.writeFileSync(HISTORY_FILE_PATH, '[]', 'utf-8');
  }
};

/**
 * Reads all history records from Supabase DB (if user & Supabase configured) or local JSON file
 */
export const getHistoryRecords = async (userId = null) => {
  if (userId && isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tryon_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            title: item.title,
            resultUrl: item.result_url,
            personPreview: item.person_image_url,
            garmentPreview: item.garment_image_url,
            category: item.category,
            model: item.model,
            credits: item.credits_used,
            executionTime: item.execution_time,
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('Could not query Supabase tryon_history:', err.message);
      }
    }
  }

  ensureHistoryFile();
  try {
    const rawData = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
    return JSON.parse(rawData || '[]');
  } catch (error) {
    console.error('Error reading history.json:', error.message);
    return [];
  }
};

/**
 * Explicitly saves a try-on look to Supabase or local storage
 * (Only called when user explicitly triggers save)
 */
export const addHistoryRecord = async ({
  resultUrl,
  model = 'fal/fashn-tryon-v1-5',
  id,
  credits = 1,
  executionTime = '16.3s',
  category = 'apparel',
  personPreview = null,
  garmentPreview = null,
  userId = null,
  title = null,
}) => {
  const recordId = id || `tryon_${Date.now()}`;
  const displayTitle = title || 'Virtual Try-On';

  if (userId && isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tryon_history')
          .insert({
            id: recordId,
            user_id: userId,
            title: displayTitle,
            result_url: resultUrl,
            person_image_url: personPreview,
            garment_image_url: garmentPreview,
            category,
            model,
            credits_used: credits,
            execution_time: executionTime,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            resultUrl: data.result_url,
            personPreview: data.person_image_url,
            garmentPreview: data.garment_image_url,
            category: data.category,
            model: data.model,
            credits: data.credits_used,
            executionTime: data.execution_time,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn('Could not write to Supabase tryon_history:', err.message);
      }
    }
  }

  ensureHistoryFile();
  const history = await getHistoryRecords();
  const recordCount = history.length + 1;

  const newRecord = {
    id: recordId,
    title: displayTitle || `Try-On #${recordCount}`,
    resultUrl,
    model,
    credits,
    executionTime,
    category,
    createdAt: new Date().toISOString(),
    personPreview: personPreview || null,
    garmentPreview: garmentPreview || null,
  };

  history.unshift(newRecord);

  try {
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2), 'utf-8');
    console.log(`💾 [History Persisted] Saved '${newRecord.title}' (${newRecord.id})`);
  } catch (error) {
    console.error('Error saving history.json:', error.message);
  }

  return newRecord;
};

/**
 * Deletes a single history record by ID
 */
export const deleteHistoryRecord = async (id, userId = null) => {
  if (userId && isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase
          .from('tryon_history')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Could not delete from Supabase tryon_history:', err.message);
      }
    }
  }

  ensureHistoryFile();
  const history = await getHistoryRecords();
  const updatedHistory = history.filter((item) => item.id !== id);

  try {
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(updatedHistory, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error deleting item from history.json:', error.message);
  }

  return updatedHistory;
};

/**
 * Clears all history records
 */
export const clearAllHistoryRecords = async (userId = null) => {
  if (userId && isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        await supabase
          .from('tryon_history')
          .delete()
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Could not clear Supabase tryon_history:', err.message);
      }
    }
  }

  ensureHistoryFile();
  try {
    fs.writeFileSync(HISTORY_FILE_PATH, '[]', 'utf-8');
  } catch (error) {
    console.error('Error clearing history.json:', error.message);
  }
  return [];
};
