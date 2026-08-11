const Spinner = ({ size = 1.6, subtle = false, thickness = 2, ariaLabel = 'Loading' }) => {
  const dimension = typeof size === 'number' ? `${size}rem` : size;
  return (
    <span role="status" aria-live="polite" aria-label={ariaLabel} style={{ display: 'inline-grid', placeItems: 'center' }}>
      <span className="is-spinning" aria-hidden="true" style={{ width: dimension, height: dimension, borderRadius: '50%', border: `${thickness}px solid ${subtle ? 'var(--color-text-faint)' : 'var(--color-primary)'}`, borderTopColor: 'transparent' }} />
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
};

export default Spinner;
