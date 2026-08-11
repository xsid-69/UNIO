import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, description, action, back = false, eyebrow }) => {
  const navigate = useNavigate();
  return (
    <header className="page-header" data-reveal>
      <div className="page-header__lead">
        {back && (
          <button type="button" onClick={() => navigate(-1)} className="icon-button" aria-label="Go back">
            <ArrowLeft size={20} weight="regular" />
          </button>
        )}
        <div>
          {eyebrow && <p className="context-label">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      {action}
    </header>
  );
};

export default PageHeader;
