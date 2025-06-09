import { useEffect, useRef, Dispatch, SetStateAction } from 'react';

interface useRecipientsProps {
  content: string;
  opPostNum: number | null | undefined;
  setRecipients?: Dispatch<SetStateAction<number[]>>;
  delay?: number;
}

/**
 * Go through post form content and check whether reply quotations are the correct format,
 * (e.g. ">>435 "). There should be a space or linebreak after post_num. If correct,
 * add quoted post to recipients, otherwise remove from them, with a debounce delay of 150ms
 */
export const useRecipients = ({
  content,
  opPostNum,
  setRecipients,
  delay = 150
}: useRecipientsProps) => {
  const timeoutRef = useRef<number | undefined>(undefined);

  // Skip if setRecipients is not provided e.g. when creating thread
  useEffect(() => {
    if (!setRecipients) return;

    timeoutRef.current && clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      const mentionedPostNums = Array.from(
        new Set(
          Array.from(content.matchAll(/>>(\d{1,10})/g), m => parseInt(m[1]))
        )
      ).filter((n) => !isNaN(n));

      if (opPostNum && !mentionedPostNums.includes(opPostNum)) {
        mentionedPostNums.unshift(opPostNum);
      }

      setRecipients(mentionedPostNums);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [content, opPostNum, setRecipients, delay]);
};