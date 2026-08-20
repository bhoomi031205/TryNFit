import React from 'react';
import { AlertTriangle, X, RefreshCw, HelpCircle } from 'lucide-react';

export const ErrorAlert = ({ error, onDismiss, onRetry }) => {
  if (!error) return null;

  const extractMessage = (err) => {
    if (!err) return 'An error occurred.';
    if (typeof err === 'string') return err;
    if (typeof err.message === 'string') return err.message;
    if (err.message && typeof err.message === 'object') {
      return err.message.message || JSON.stringify(err.message);
    }
    if (typeof err.error === 'string') return err.error;
    if (err.error && typeof err.error === 'object') {
      return err.error.message || JSON.stringify(err.error);
    }
    return JSON.stringify(err);
  };

  const errorMessage = extractMessage(error);
  const errorCode = error?.code || 'SERVICE_ERROR';

  // Helpful contextual recovery suggestion based on error code
  let suggestion = 'Please verify your uploads and try again.';
  if (errorCode === 'FILE_TOO_LARGE') {
    suggestion = 'Compress your image using an online compressor or upload an image under 5MB.';
  } else if (errorCode === 'INVALID_FILE_TYPE') {
    suggestion = 'Ensure your files are in JPG, PNG, or WebP format.';
  } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
    suggestion = 'The rate limit has been reached. Please wait a bit before retrying.';
  } else if (errorCode === 'MISSING_API_KEY' || errorCode === 'INVALID_API_KEY') {
    suggestion = 'Please verify your TRYON_API_KEY in server/.env and check your key status on tryon-api.com.';
  } else if (errorCode === 'INSUFFICIENT_CREDITS') {
    suggestion = 'Account credit balance is insufficient. Please top up your credits on tryon-api.com.';
  } else if (errorCode === 'SERVICE_UNAVAILABLE' || errorMessage.includes('502') || errorMessage.includes('unavailable') || errorMessage.includes('busy')) {
    suggestion = 'The selected AI try-on model is temporarily busy. TryNFit will automatically use another available model when possible.';
  } else if (errorCode === 'POSE_TRANSFER_FAILED' || errorMessage.includes('Multiple people')) {
    suggestion = 'Please upload a photo showing a single person without other people in the background.';
  } else if (errorCode === 'NETWORK_ERROR') {
    suggestion = 'Check if your TryNFit backend server is running on port 5001.';
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5 border border-rose-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2 font-outfit">
              <span>Try-On Generation Issue</span>
              {errorCode !== 'UNKNOWN_ERROR' && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700">
                  {errorCode}
                </span>
              )}
            </h4>
            <p className="text-xs text-rose-800 mt-1 font-medium leading-relaxed">
              {errorMessage}
            </p>
            <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-rose-700">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{suggestion}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg bg-rose-100/60 hover:bg-rose-200 text-rose-600 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
