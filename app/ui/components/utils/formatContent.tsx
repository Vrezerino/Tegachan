'use client'

import { JSX } from 'react';

/**
 * @param {string} text Normal text
 * @returns {string} Text with every other character being uppercase, rest lowercase
 */
const applyWeirdCase = (text: string) => {
  return text
    .split('')
    .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
};

/**
 * Formats post content so that:
 * - '>>66' becomes a link to another post
 * - '>' is a quote with green text
 * - '>r>', '>b>' and e.g. '>#00FF00' color the text differently
 * - '>b>' bolds the text, '>i>' for italic, '>w>' for 'weird' text.
 * - These modifiers can be combined like so: '>b,p,w>'
 * @param {string} content Post content to process
 * @returns {(string | JSX.Element)[]} Processed content
 */
export const formatContent = (content: string) => {
  const lines = content.split('\n');
  const parts: (string | JSX.Element)[] = [];
  const linkRegex = />>(\d{1,10})(\s*)/g;
  let brCounter = 0;

  lines.forEach((line, lineIndex) => {
    let segments: (string | JSX.Element)[] = [];
    let match;
    let lastIndex = 0;

    // Extract post links first
    while ((match = linkRegex.exec(line)) !== null) {
      const [fullMatch, postNumber, trailingSpace] = match;
      if (match.index > lastIndex) {
        segments.push(line.slice(lastIndex, match.index));
      }

      segments.push(
        <a
          href={`#${postNumber}`}
          key={`link-${postNumber}-${match.index}`}
          className='font-bold underline'
        >
          {`>>${postNumber}`}
        </a>
      );

      if (trailingSpace) {
        segments.push(trailingSpace);
      }

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      segments.push(line.slice(lastIndex));
    }

    if (segments.length === 0) segments.push(line);

    // Format pattern: >tag1,tag2,...>
    const formatRegex = />((#[0-9a-fA-F]{3,6}|[a-zA-Z]+(?:,[a-zA-Z#0-9]+)*))>/g;

    const processed = segments.flatMap((segment, segIndex) => {
      if (typeof segment !== 'string') return [segment];

      let result: (string | JSX.Element)[] = [];
      let last = 0;
      let m;

      while ((m = formatRegex.exec(segment)) !== null) {
        const [fullMatch, tagGroup] = m;
        const startIdx = m.index;

        if (startIdx > last) {
          const before = segment.slice(last, startIdx);
          // Handle fallback: plain >green text
          if (before.includes('>')) {
            const idx = before.indexOf('>');
            result.push(before.slice(0, idx));
            result.push(
              <span
                key={`plain-${lineIndex}-${segIndex}-${idx}`}
                className='text-green-600'
              >
                {before.slice(idx)}
              </span>
            );
          } else {
            result.push(before);
          }
        }

        const contentStart = formatRegex.lastIndex;
        const nextMatch = segment.slice(contentStart).search(formatRegex);
        const contentEnd =
          nextMatch === -1 ? segment.length : contentStart + nextMatch;
        const innerText = segment.slice(contentStart, contentEnd);
        last = contentEnd;

        const tags = tagGroup.split(',').map((tag) => tag.trim().toLowerCase());
        const key = `fmt-${lineIndex}-${segIndex}-${startIdx}`;

        let classNames: string[] = [];
        let style: React.CSSProperties = {};
        let text = innerText;
        let applyWeird = false;

        // First gather all classNames and styles
        for (const tag of tags) {
          if (tag === 'r') classNames.push('text-red-600');
          else if (tag === 'bl') classNames.push('text-blue-600');
          else if (tag === 'y') classNames.push('text-yellow-500');
          else if (tag === 'p') classNames.push('text-pink-500');
          else if (tag === 'b') classNames.push('font-bold');
          else if (tag === 'i') classNames.push('italic');
          else if (tag === 'w') applyWeird = true; // flag weird for later
          else if (tag === '#') continue;
          else if (tag.startsWith('#')) style.color = tag;
        }

        // Apply weird case transformation last once
        if (applyWeird) {
          text = applyWeirdCase(text);
        }

        result.push(
          <span key={key} className={classNames.join(' ')} style={style}>
            {text}
          </span>
        );

        formatRegex.lastIndex = last;
      }

      // Remaining after last match
      if (last < segment.length) {
        const rest = segment.slice(last);
        const gtIndex = rest.indexOf('>');
        if (gtIndex !== -1 && !rest.startsWith('>>')) {
          result.push(rest.slice(0, gtIndex));
          result.push(
            <span
              key={`plain-${lineIndex}-${segIndex}-end`}
              className='text-green-600'
            >
              {rest.slice(gtIndex)}
            </span>
          );
        } else {
          result.push(rest);
        }
      }

      return result;
    });

    parts.push(...processed, <br key={`br-${brCounter++}`} />);
  });

  return parts;
};