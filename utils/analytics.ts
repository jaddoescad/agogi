import va from '@vercel/analytics';

export const trackVercel = (tag: string, params?: any) => {
  if (params) {
    va.track(tag, params);
    return;
  }

  va.track(tag);
};