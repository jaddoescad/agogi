import React, { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'types/types_db';
import { supabase } from './supabase-client';

export const uploadImage = async (
  file: File,
  quizId: string,
  userId: string
) => {
  // check if file is empty
  if (!file) {
    throw new Error('No file selected');
  }

  if (quizId === '' || quizId === undefined || quizId === null) {
    throw new Error('No quiz id');
  }

  // check if file is an image
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    throw new Error('File is not an image');
  }

  // check if file size is greater than 2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    throw new Error('Image must smaller than 2MB!');
  }

  const currentDateTime = new Date().toISOString();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/quiz-thumbnail-image/${quizId}.${fileExt}?${currentDateTime}`;
  const filePath = `${fileName}`;

  let { error: uploadError, data } = await supabase.storage
    .from('quiz-thumbnails')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (uploadError) {
    throw uploadError;
  }

  const { data: imageData } = await supabase.storage
    .from('quiz-thumbnails')
    .getPublicUrl(
      `${userId}/quiz-thumbnail-image/${quizId}.${fileExt}?${currentDateTime}`
    );

  return imageData.publicUrl;
};
