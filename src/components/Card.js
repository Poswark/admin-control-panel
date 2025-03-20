// src/components/Card.js
import React from 'react';
import './Card.css';

function Card({ title, description, logoUrl, redirectUrl }) {
  const handleClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-logo">
        <img src={logoUrl} alt={title} />
      </div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default Card;