import { BookOpenText } from '@phosphor-icons/react';

const BrandMark = ({ compact = false }) => (
  <span className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="UNIO study workspace">
    <span className="brand-mark__symbol" aria-hidden="true"><BookOpenText size={21} weight="fill" /></span>
    {!compact && <span className="brand-mark__copy"><strong>UNIO</strong><small>Study workspace</small></span>}
  </span>
);

export default BrandMark;
