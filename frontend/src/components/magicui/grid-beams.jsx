import { cn } from '../../lib/utils';

export const GridBeams = ({ children, className, ...props }) => (
  <div className={cn('relative overflow-hidden bg-[var(--color-background)]', className)} {...props}>
    <div className="grid-background pointer-events-none absolute inset-0" aria-hidden="true" />
    <div className="pointer-events-none absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[var(--color-primary-light)] blur-[120px]" aria-hidden="true" />
    <div className="relative z-10">{children}</div>
  </div>
);
