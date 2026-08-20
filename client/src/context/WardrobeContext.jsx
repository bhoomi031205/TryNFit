import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  isSupabaseConfigured,
  saveLookToSupabase,
  saveGeneratedTryOnToSupabase,
  fetchUserWardrobe,
  deleteWardrobeItem,
  clearUserWardrobe,
} from '../services/supabase';
import { fetchHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

const WardrobeContext = createContext();

const LOCAL_WARDROBE_KEY = 'trynfit_local_wardrobe_v1';

export const WardrobeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [savedLooks, setSavedLooks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSavingLook, setIsSavingLook] = useState(false);

  // Load wardrobe items & try-on history on auth or mount
  const refreshHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      if (isAuthenticated && user?.isSupabaseUser && user?.id && isSupabaseConfigured) {
        const cloudLooks = await fetchUserWardrobe(user.id);
        setSavedLooks(cloudLooks);
      } else {
        const localData = localStorage.getItem(LOCAL_WARDROBE_KEY);
        if (localData) {
          try {
            setSavedLooks(JSON.parse(localData));
          } catch {
            const apiRecords = await fetchHistory();
            setSavedLooks(apiRecords);
          }
        } else {
          const apiRecords = await fetchHistory();
          setSavedLooks(apiRecords);
        }
      }
    } catch (err) {
      console.error('Failed to load try-on history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  /**
   * Explicitly saves a newly generated look to Wardrobe & Storage
   * (With custom tags, title, and uploaded storage assets)
   */
  const saveLook = async (lookData) => {
    if (!lookData || !lookData.resultUrl) return false;
    setIsSavingLook(true);

    try {
      let savedRecord = null;

      if (isAuthenticated && user?.isSupabaseUser && user?.id && isSupabaseConfigured) {
        savedRecord = await saveLookToSupabase(user.id, lookData);
      }

      const finalLook = savedRecord || {
        id: lookData.id || `look_${Date.now()}`,
        title: lookData.title || 'My Saved Look',
        resultUrl: lookData.resultUrl,
        personPreview: lookData.personImage || lookData.personPreview,
        garmentPreview: lookData.garmentImage || lookData.garmentPreview,
        category: lookData.category || 'apparel',
        tags: lookData.tags || ['Favorites'],
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      setSavedLooks((prev) => {
        const filtered = prev.filter((item) => item.id !== finalLook.id && item.resultUrl !== finalLook.resultUrl);
        const updated = [finalLook, ...filtered];
        if (!user?.isSupabaseUser) {
          localStorage.setItem(LOCAL_WARDROBE_KEY, JSON.stringify(updated));
        }
        return updated;
      });

      return finalLook;
    } catch (err) {
      console.error('Failed to save look to wardrobe:', err);
      throw err;
    } finally {
      setIsSavingLook(false);
    }
  };

  /**
   * Automatically saves a newly generated try-on to History immediately upon generation
   */
  const addSavedLook = async (lookData) => {
    if (!lookData || !lookData.resultUrl) return;

    const finalLook = {
      id: lookData.id || `tryon_${Date.now()}`,
      title: lookData.title || `Try-On #${savedLooks.length + 1}`,
      resultUrl: lookData.resultUrl,
      personPreview: lookData.personImage || lookData.personPreview,
      garmentPreview: lookData.garmentImage || lookData.garmentPreview,
      category: lookData.category || 'apparel',
      model: lookData.model || 'wearfits/tryon-clothing',
      credits: lookData.credits || 1,
      executionTime: lookData.executionTime || null,
      tags: lookData.tags || ['History'],
      date: lookData.date || new Date().toISOString(),
      createdAt: lookData.createdAt || new Date().toISOString(),
    };

    setSavedLooks((prev) => {
      const exists = prev.some((item) => item.id === finalLook.id || item.resultUrl === finalLook.resultUrl);
      if (exists) return prev;
      const updated = [finalLook, ...prev];
      if (!user?.isSupabaseUser) {
        localStorage.setItem(LOCAL_WARDROBE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    if (isAuthenticated && user?.isSupabaseUser && user?.id && isSupabaseConfigured) {
      try {
        await saveGeneratedTryOnToSupabase(user.id, finalLook);
      } catch (err) {
        console.warn('Auto-save to Supabase history notice:', err.message);
      }
    }
  };

  /**
   * Deletes a single history / wardrobe item
   */
  const deleteLook = async (id) => {
    setSavedLooks((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (!user?.isSupabaseUser) {
        localStorage.setItem(LOCAL_WARDROBE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      if (isAuthenticated && user?.isSupabaseUser && user?.id && isSupabaseConfigured) {
        await deleteWardrobeItem(id, user.id);
      } else {
        await deleteHistoryItem(id);
      }
    } catch (err) {
      console.error('Failed to delete history item on server:', err);
      refreshHistory();
    }
  };

  /**
   * Clears all saved looks for this user
   */
  const clearWardrobe = async () => {
    setSavedLooks([]);
    if (!user?.isSupabaseUser) {
      localStorage.removeItem(LOCAL_WARDROBE_KEY);
    }

    try {
      if (isAuthenticated && user?.isSupabaseUser && user?.id && isSupabaseConfigured) {
        await clearUserWardrobe(user.id);
      } else {
        await clearAllHistory();
      }
    } catch (err) {
      console.error('Failed to clear history on server:', err);
      refreshHistory();
    }
  };

  return (
    <WardrobeContext.Provider
      value={{
        savedLooks,
        saveLook,
        addSavedLook,
        deleteLook,
        clearWardrobe,
        refreshHistory,
        isLoadingHistory,
        isSavingLook,
        savedCount: savedLooks.length,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};
