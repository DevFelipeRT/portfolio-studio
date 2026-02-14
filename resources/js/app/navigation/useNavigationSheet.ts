import { useEffect, useState } from 'react';

export function useNavigationSheet(url: string) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [url]);

  return { isSheetOpen, setIsSheetOpen };
}
