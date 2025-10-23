import React, { useState } from 'react';
import './AdminPanel.css';
import Card from './Card';
import { FileText } from 'lucide-react';

import jenkinsLogo from '../assets/jenkins.png';
import dynatraceLogo from '../assets/dynatrace.png';
import awsLogo from '../assets/aws.png';
import gitLogo from '../assets/git.png';

function AdminPanel() {
  const [env, setEnv] = useState('dev');
  const message = window._env_?.REACT_APP_MESSAGE || '';

  // URL de documentación - puedes cambiar esta URL por la que necesites
  /* The line `const documentationUrl = "https://altoariari.com";` is declaring a constant variable
  named `documentationUrl` and assigning it the value of the URL "https://altoariari.com". This URL
  is used as the link for documentation in the AdminPanel component. When the user clicks on the
  documentation button, it will open this URL in a new tab. */
  const documentationUrl = "https://altoariari.com";

  // URLs por ambiente para la carta 1 (CI/CD Pipeline)
  const envUrls = {
    dev: "https://jenkins.dev.yourdomain.com",
    uat: "https://jenkins.uat.yourdomain.com",
    prd: "https://jenkins.prd.yourdomain.com"
  };

  const Dynatrace = {
    dev: "https://jenkins.dev.yourdomain.com",
    uat: "https://jenkins.dev.yourdomain.com",
    prd: "https://jenkins.dev.yourdomain.com"
  };

  const services = [
    {
      id: 1,
      title: "CI/CD Pipeline",
      description: "Access Jenkins dashboard for build management",
      logoUrl: jenkinsLogo,
      redirectUrl: envUrls[env],
      docUrl: "https://wikipedia.com/wiki/Jenkins"
    },
    {
      id: 2,
      title: "Monitoring",
      description: "Access Dynatrace for application monitoring",
      logoUrl: dynatraceLogo,
      redirectUrl: Dynatrace[env],
      docUrl: "https://docs.yourdomain.com/dynatrace"
    },
    {
      id: 3,
      title: "Cloud Services",
      description: "Access AWS Console for cloud management",
      logoUrl: awsLogo,
      redirectUrl: "https://aws.amazon.com/console",
      docUrl: "https://docs.yourdomain.com/aws"
    },
    {
      id: 4,
      title: "DevOps inventario",
      description: "Access Git repositories and related tools",
      logoUrl: gitLogo,
      redirectUrl: "http://localhost:31180/api/inventario",
      docUrl: "http://localhost:31180/api/inventario"
    }
  ];

  const handleDocumentationClick = () => {
    window.open(documentationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h1 className="panel-title">Panel de Control para Administración</h1>
        <button 
          className="docs-icon-button"
          onClick={handleDocumentationClick}
          title="Documentación"
          aria-label="Abrir documentación"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </button>
      </div>

      {/* Muestra el mensaje de alerta solo si showAlert está activo y message tiene contenido */}
      {message && (
        <p className="alert-message">
          {message}
        </p>
      )}

      <div className="env-selector">
        <label htmlFor="environment">Selecciona el ambiente: </label>
        <select id="environment" value={env} onChange={(e) => setEnv(e.target.value)}>
          <option value="dev">Desarrollo</option>
          <option value="uat">Pruebas (UAT)</option>
          <option value="prd">Producción</option>
        </select>
      </div>

      <div className="cards-container">
        {services.map((service) => (
          <Card 
            key={service.id}
            title={service.title}
            description={service.description}
            logoUrl={service.logoUrl}
            redirectUrl={service.redirectUrl}
            docUrl={service.docUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;