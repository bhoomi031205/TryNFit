import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatFileSize, validateImageFile } from '../utils/fileValidation';

export const ImageUploader = ({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  accept = 'image/jpeg,image/png,image/webp',
  file,
  previewUrl,
  onFileSelect,
  onClear,
  tip,
  required = true,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openGallery = (e) => {
    e.stopPropagation();
    if (!disabled) fileInputRef.current?.click();
  };

  const openCamera = (e) => {
    e.stopPropagation();
    if (!disabled) cameraInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[#FDE8EF] text-[#FF407D] border border-[#F8BBD0] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#FF407D]" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-[#1E1B1D] flex items-center gap-1 font-outfit">
              {title}
              {required && <span className="text-[#FF407D]">*</span>}
            </h3>
            <p className="text-[11px] text-[#6F626A]">{subtitle}</p>
          </div>
        </div>
        {badgeText && (
          <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#FDE8EF] text-[#FF407D] font-outfit">
            {badgeText}
          </span>
        )}
      </div>

      {/* Upload Zone or Preview */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[290px] rounded-3xl overflow-hidden">
        {previewUrl ? (
          /* Image Preview Mode */
          <div className="relative w-full h-full min-h-[260px] sm:min-h-[290px] rounded-3xl bg-white border border-[#F3DCE4] p-2.5 flex flex-col group shadow-sm">
            {/* Image Preview Container */}
            <div className="relative flex-1 w-full h-full min-h-[200px] rounded-2xl overflow-hidden bg-[#FAF8F5] flex items-center justify-center border border-[#F3DCE4]">
              <img
                src={previewUrl}
                alt={title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Ready Indicator */}
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-300 text-emerald-600 text-[11px] font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </div>

              {/* Remove / Change Action Button */}
              <button
                type="button"
                onClick={onClear}
                disabled={disabled}
                aria-label={`Remove ${title}`}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#FDE8EF] hover:bg-[#F8BBD0] text-[#FF407D] border border-[#F8BBD0] transition-all shadow-sm active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File Info Footer */}
            <div className="mt-2 px-2 py-1 flex items-center justify-between text-[11px] text-[#6F626A]">
              <span className="truncate max-w-[170px] font-mono text-[#1E1B1D] font-medium">
                {file?.name || 'Selected Asset'}
              </span>
              <span className="text-[#FF407D] shrink-0 font-semibold">
                {file?.size ? formatFileSize(file.size) : 'Ready'}
              </span>
            </div>
          </div>
        ) : (
          /* Dropzone Upload Mode */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`w-full h-full min-h-[260px] sm:min-h-[290px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#FF407D] bg-[#FFF0F5] scale-[0.99] shadow-sm'
                : 'border-[#F8BBD0] bg-white/80 hover:bg-[#FFF0F5]/50 hover:border-[#FF407D]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* Upload Icon Container in Soft Pink */}
            <div className="w-13 h-13 rounded-2xl bg-[#FFF0F5] border border-[#F8BBD0] flex items-center justify-center mb-3.5 text-[#FF407D] shadow-sm group-hover:scale-110 group-hover:bg-[#FDE8EF] transition-all">
              <Upload className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-[#1E1B1D] mb-1 font-outfit">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-[#6F626A] max-w-[220px] mb-3.5">
              Supports JPG, PNG, WebP (Max 5MB)
            </p>

            {/* Quick Action Pills in Light Pink */}
            <div className="flex items-center space-x-2.5 text-xs font-bold">
              <button
                type="button"
                onClick={openGallery}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-[#FF407D] border border-[#F8BBD0] hover:bg-[#FDE8EF] transition-colors shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#FF407D]" />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                onClick={openCamera}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-[#FF407D] border border-[#F8BBD0] hover:bg-[#FDE8EF] transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#FF407D]" />
                <span>Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input for Gallery / Local Files */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Hidden File Input for Camera Capture */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Tip & Validation Error */}
      <div className="mt-3 min-h-[20px]">
        {validationError ? (
          <div className="flex items-center space-x-1.5 text-rose-600 text-xs animate-shake font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        ) : (
          tip && (
            <p className="text-xs text-[#6F626A]">
              💡 {tip}
            </p>
          )
        )}
      </div>
    </div>
  );
};
