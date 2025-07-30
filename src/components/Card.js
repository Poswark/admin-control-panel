import React from 'react';
import { FileText } from 'lucide-react';
import './Card.css';

function Card({ title, description, logoUrl, redirectUrl, docUrl }) {
  const handleCardClick = () => {
    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDocClick = (e) => {
    e.stopPropagation(); // Evita que se active el click de la tarjeta
    if (docUrl) {
      window.open(docUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-header">
        <button 
          className="card-docs-icon"
          onClick={handleDocClick}
          title={`Documentación de ${title}`}
          aria-label={`Abrir documentación de ${title}`}
        >
          <FileText size={16} />
        </button>
      </div>
      
      <div className="card-content">
        <div className="card-logo">
          <img src={logoUrl} alt={`${title} logo`} />
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default Card;