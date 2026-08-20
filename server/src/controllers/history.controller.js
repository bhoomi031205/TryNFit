import {
  getHistoryRecords,
  addHistoryRecord,
  deleteHistoryRecord,
  clearAllHistoryRecords,
} from '../services/history.service.js';

export const handleGetHistory = async (req, res, next) => {
  try {
    const userId = req.userId || null;
    const history = await getHistoryRecords(userId);
    return res.status(200).json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    next(error);
  }
};

export const handleAddHistory = async (req, res, next) => {
  try {
    const { resultUrl, model, id, credits, executionTime, category, personPreview, garmentPreview, title } = req.body;
    const userId = req.userId || null;

    if (!resultUrl) {
      const err = new Error('resultUrl is required to save a try-on record.');
      err.status = 400;
      throw err;
    }

    const newRecord = await addHistoryRecord({
      resultUrl,
      model,
      id,
      credits,
      executionTime,
      category,
      personPreview,
      garmentPreview,
      title,
      userId,
    });

    return res.status(201).json({
      success: true,
      data: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId || null;
    const updatedHistory = await deleteHistoryRecord(id, userId);
    return res.status(200).json({
      success: true,
      data: updatedHistory,
      count: updatedHistory.length,
    });
  } catch (error) {
    next(error);
  }
};

export const handleClearAllHistory = async (req, res, next) => {
  try {
    const userId = req.userId || null;
    await clearAllHistoryRecords(userId);
    return res.status(200).json({
      success: true,
      data: [],
      count: 0,
      message: 'All try-on history cleared.',
    });
  } catch (error) {
    next(error);
  }
};
