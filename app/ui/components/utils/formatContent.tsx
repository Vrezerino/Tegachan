'use client'

import { JSX, useCallback, useState } from 'react';

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
 * @param {boolean} renderLinks Whether to make post links (not needed
 * and messy in latest posts view)
 * @param {boolean} renderLinebreaks Whether to render any linebreaks
 * (linebreaks are messy in latest posts view)
 * @returns {(string | JSX.Element)[]} Processed content
 */
const FormatContent = ({
  content,
  renderLinks,
  renderLinebreaks
}: {
  content: string;
  renderLinks: boolean;
  renderLinebreaks: boolean;
}) => {
  const [expandedEmbeds, setExpandedEmbeds] = useState<Set<string>>(new Set());

  const toggleEmbed = useCallback((videoId: string) => {
    setExpandedEmbeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      return newSet;
    });
  }, []);

  const lines = content.split('\n');
  const parts: (string | JSX.Element)[] = [];
  const linkRegex = />>(\d{1,10})(\s*)/g;
  const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(\?[^\s]*)?/g;
  let brCounter = 0;
  let linkCounter = 0;

  lines.forEach((line, lineIndex) => {
    let segments: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    if (renderLinks) {
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        // >>123, 123, space
        const [fullMatch, postNumber, trailingSpace] = match;
        if (match.index > lastIndex) segments.push(line.slice(lastIndex, match.index));

        segments.push(
          <a
            href={`#${postNumber}`}
            key={`link-${postNumber}-${match.index}-${linkCounter}`}
            className='font-bold underline'
          >
            {`>>${postNumber}`}
          </a>
        );

        if (trailingSpace) segments.push(trailingSpace);
        lastIndex = linkRegex.lastIndex;
        linkCounter++;
      }

      // YouTube links
      let ytMatch;
      while ((ytMatch = youtubeRegex.exec(line)) !== null) {
        const [fullMatch, , , , videoId] = ytMatch;
        const url = typeof fullMatch === 'string' ? fullMatch.trim() : '';

        if (ytMatch.index > lastIndex) {
          segments.push(line.slice(lastIndex, ytMatch.index));
        }

        const isExpanded = expandedEmbeds.has(videoId);

        segments.push(
          <span key={`yt-${videoId}-${ytMatch.index}`}>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='underline'
            >
              {fullMatch}
            </a>{' '}
            <button
              onClick={() => toggleEmbed(videoId)}
              className='text-sm text-gray-500 ml-1'
            >
              {isExpanded ? '[▲]' : '[▼]'}
            </button>
            {isExpanded && (
              <div className='mt-2 w-[95.8%] max-w-[560px]'>
                <div className='relative pb-[56.25%] h-0 overflow-hidden'>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube video ${videoId}`}
                    className='absolute top-0 left-0 w-full h-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </span>
        );

        lastIndex = youtubeRegex.lastIndex;
      }
    }

    if (lastIndex < line.length) {
      const remaining = line.slice(lastIndex);
      if (remaining) segments.push(remaining);
    }

    if (segments.length === 0) segments.push(line);

    // Format tag parsing
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
          const idx = before.indexOf('>');
          if (idx !== -1) {
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
        const contentEnd = nextMatch === -1 ? segment.length : contentStart + nextMatch;
        const innerText = segment.slice(contentStart, contentEnd);
        last = contentEnd;

        const tags = typeof tagGroup === 'string'
          ? tagGroup.split(',').map(tag => tag.trim().toLowerCase())
          : [];

        const key = `fmt-${lineIndex}-${segIndex}-${startIdx}`;
        let classNames: string[] = [];
        let style: React.CSSProperties = {};
        let text = innerText;
        let applyWeird = false;

        for (const tag of tags) {
          if (tag === 'r') classNames.push('text-red-600');
          else if (tag === 'bl') classNames.push('text-blue-600');
          else if (tag === 'y') classNames.push('text-yellow-500');
          else if (tag === 'p') classNames.push('text-pink-500');
          else if (tag === 'b') classNames.push('font-bold');
          else if (tag === 'i') classNames.push('italic');
          else if (tag === 'w') applyWeird = true;
          else if (tag.startsWith('#')) style.color = tag;
        }

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

    parts.push(...processed, renderLinebreaks ? <br key={`br-${brCounter++}`} /> : ' ');
  });

  return parts;
};

export default FormatContent;