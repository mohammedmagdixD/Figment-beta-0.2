import { useEffect } from 'react';

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    body.classList.add('scroll-locked');

    return () => {
      body.classList.remove('scroll-locked');
    };
  }, [isLocked]);
}
