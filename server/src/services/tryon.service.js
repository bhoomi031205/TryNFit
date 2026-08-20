import { runTryOnApiInference } from './tryonapi.service.js';

/**
 * Main service delegate for Virtual Try-On generation via tryon-api.com
 */
export const generateVirtualTryOn = async (params) => {
  return await runTryOnApiInference(params);
};
