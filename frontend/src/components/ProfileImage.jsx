import { useEffect, useState } from 'react';
import { User } from '@phosphor-icons/react';

const sizes = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-20 h-20', xl: 'w-28 h-28' };

const ProfileImage = ({ src, className = '', size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <span className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[35%] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] ${sizes[size] || sizes.md} ${className}`}>
      {src && !failed ? <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} /> : <User size="48%" weight="duotone" aria-hidden="true" />}
    </span>
  );
};

export default ProfileImage;
