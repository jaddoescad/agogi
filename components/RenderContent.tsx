import React from 'react';
import Latex from 'react-latex';

export const RenderContent = ({ content }) => {
  // Regex patterns to match <codeblock>...</codeblock> and <inlinecode>...</inlinecode> tags with global flag
  const blockCodePattern = /<codeblock>([\s\S]*?)<\/codeblock>/g;
  const inlineCodePattern = /<inlinecode>(.*?)<\/inlinecode>/g;

  let segments = [];
  let lastIndex = 0;

  for (const match of content.matchAll(blockCodePattern)) {
    // Add text before block code to segments
    if (lastIndex !== match.index) {
      segments.push(content.slice(lastIndex, match.index));
    }

    // Add block code to segments
    segments.push(
      <pre className="code-block" key={match.index}>
        {match[1]}
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add the rest of the content after the last block code match (if any) to the segments
  if (lastIndex < content.length) {
    segments.push(content.slice(lastIndex));
  }

  // Convert the segments into React elements, processing inline code patterns
  const finalSegments = segments.flatMap((segment, index) => {
    if (typeof segment === 'string') {
      const parts = [];
      let lastIndex = 0;

      for (const match of segment.matchAll(inlineCodePattern)) {
        if (lastIndex !== match.index) {
          parts.push(
            <Latex key={'latex-' + index}>
              {segment.slice(lastIndex, match.index)}
            </Latex>
          );
        }

        parts.push(
          <span className="inline-code" key={match.index}>
            {match[1]}
          </span>
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < segment.length) {
        parts.push(
          <Latex key={'latex-end-' + index}>{segment.slice(lastIndex)}</Latex>
        );
      }

      return parts;
    } else {
      // This is already a JSX element (block code), so just return it
      return segment;
    }
  });

  return <span>{finalSegments}</span>;
};
