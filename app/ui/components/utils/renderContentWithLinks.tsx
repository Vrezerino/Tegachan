'use client'

/**
 * If post contains quotes/mentions, render them as links
 * @param {string} content Post content to process
 * @returns {(string | JSX.Element)[]} Processed content
 */
export const renderContentWithLinks = (content: string) => {
  const regex = />>(\d{1,10})(\s*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let brCounter = 0; // necessary for unique elem keys

  while ((match = regex.exec(content)) !== null) {
    // >>500, 500, space
    const [fullMatch, postNumber, trailingSpace] = match;

    if (match.index > lastIndex) {
      const preceding = content.slice(lastIndex, match.index);
      parts.push(preceding);

      // Insert breaks if preceding text does not end in a newline
      if (!preceding.endsWith('<br />')) {
        parts.push(<br key={`br-${postNumber}-${brCounter++}`} />);
        parts.push(<br key={`br-${postNumber}-${brCounter++}`} />);
      }
    }

    parts.push(
      <a href={`#${postNumber}`} key={`link-${postNumber}-${match.index}`} className="font-bold underline">
        {`>>${postNumber}`}<br />
      </a>
    );

    if (trailingSpace) {
      parts.push(trailingSpace);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
};