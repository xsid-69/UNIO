import React from 'react';

/**
 * Minimal, reusable spinner component.
 * Uses Tailwind classes so no extra CSS file is required.
 */
const Spinner = ({ size = 1.6, subtle = false, thickness = 2, speed = 500, ariaLabel = 'Loading' }) => {
  // size can be number (rem) or string (e.g., '16px')
  const dimension = typeof size === 'number' ? `${size}` : size;
  const borderClass = `rounded-full border-${thickness}`; // tailwind class fallback; inline style used for thickness
  const colorClass = subtle ? 'border-gray-500' : 'border-teal-400';
  const inlineStyle = {
    width: typeof size === 'number' ? `${dimension}rem` : dimension,
    height: typeof size === 'number' ? `${dimension}rem` : dimension,
    borderWidth: `${thickness}px`,
    borderTopColor: 'transparent',
    animation: `spin ${speed}ms linear infinite`
  };

  return (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className="flex items-center justify-center">
      <div className={`${borderClass} ${colorClass}`} style={inlineStyle} />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Add keyframes for spin animation when Tailwind not used for custom speed
const styleEl = document.createElement('style');
styleEl.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
if (!document.head.querySelector('#spinner-keyframes')) {
  styleEl.id = 'spinner-keyframes';
  document.head.appendChild(styleEl);
}

export default Spinner;
