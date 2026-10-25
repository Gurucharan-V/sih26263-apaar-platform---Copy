import { useState } from 'react';
import apiClient from '../api/client';

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, programmeId: string) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('programmeId', programmeId);

    try {
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      return response.data;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, progress, isUploading };
}
