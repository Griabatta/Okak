// utils/auth.ts
'use client';

export const preloadAuth = () => {
  void fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: 'include',
  });
};
