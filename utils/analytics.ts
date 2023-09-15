import va from '@vercel/analytics';

export const trackVercel = (tag: string, params?: any) => {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    if (params) {
        va.track(tag, params);
        return;
    }

    va.track(tag);
}