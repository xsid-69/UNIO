import { ArrowClockwise, BookOpenText, WarningCircle } from '@phosphor-icons/react';

const StatePanel = ({ type = 'empty', title, description, action, compact = false }) => {
  const Icon = type === 'error' ? WarningCircle : type === 'loading' ? ArrowClockwise : BookOpenText;
  return (
    <section className={`state-panel ${compact ? 'state-panel--compact' : ''}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className={`state-panel__icon ${type === 'loading' ? 'is-spinning' : ''}`} aria-hidden="true">
        <Icon size={26} weight="duotone" />
      </span>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </section>
  );
};

export default StatePanel;
