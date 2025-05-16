import React, { useState } from 'react';
import './AdminPanel.css';
import Card from './Card';

import jenkinsLogo from '../assets/jenkins.png';
import dynatraceLogo from '../assets/dynatrace.png';
import awsLogo from '../assets/aws.png';
import gitLogo from '../assets/git.png';

function AdminPanel() {
  const [env, setEnv] = useState('dev');
  const message = window._env_?.REACT_APP_MESSAGE || '';

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
      redirectUrl: envUrls[env]
    },
    {
      id: 2,
      title: "Monitoring",
      description: "Access Dynatrace for application monitoring",
      logoUrl: dynatraceLogo,
      redirectUrl: Dynatrace[env]
    },
    {
      id: 3,
      title: "Cloud Services",
      description: "Access AWS Console for cloud management",
      logoUrl: awsLogo,
      redirectUrl: "https://aws.amazon.com/console"
    },
    {
      id: 4,
      title: "DevOps Tools",
      description: "Access Git repositories and related tools",
      logoUrl: gitLogo,
      redirectUrl: "https://github.com/your-organization"
    }
  ];

  return (
    <div className="admin-panel">
      <h1 className="panel-title">Panel de Control para Administración</h1>

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
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;