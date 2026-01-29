import React, { useState, useEffect } from 'react';
import { FileText, MessageCircle, Activity } from 'lucide-react';

import ariesLogo from '../assets/aries.png';
import './AdminPanel.css';

// Simular logos (en tu proyecto real, importa las imágenes reales)
const jenkinsLogo = "https://cdn.worldvectorlogo.com/logos/jenkins-1.svg";
const dynatraceLogo = "https://www.vectorlogo.zone/logos/dynatrace/dynatrace-icon.svg";
const awsLogo = "https://cdn.worldvectorlogo.com/logos/aws-2.svg";
const gitLogo = "https://cdn.worldvectorlogo.com/logos/git-icon.svg";


function Card({ title, description, logoUrl, redirectUrl, docUrl }) {
  return (
    <div className="service-card">
      <button 
        className="card-docs-btn"
        onClick={() => window.open(docUrl, '_blank', 'noopener,noreferrer')}
        title="Ver documentación"
      >
        <FileText size={16} />
      </button>
      <img src={logoUrl} alt={title} className="card-logo" />
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <button 
        className="card-access-btn"
        onClick={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
      >
        Acceder
      </button>
    </div>
  );
}

function AdminPanel() {
  const [env, setEnv] = useState('dev');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [healthcheckTools, setHealthcheckTools] = useState([]);

  useEffect(() => {
    fetch('/api/healthcheck')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHealthcheckTools(data);
        }
      })
      .catch(err => console.error("Error fetching healthchecks:", err));
  }, []);
  
  const message = window._env_?.REACT_APP_MESSAGE || '';
  const documentationUrl = "https://altoariari.com";

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
      title: "DevOps Tools",
      description: "Access Git repositories and related tools",
      logoUrl: gitLogo,
      redirectUrl: "http://localhost:31180/api/inventario",
      docUrl: "http://localhost:31180/api/inventario"
    }
  ];


  const getStatusColor = (status) => {
    switch(status) {
      case 'ok': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: inputMessage }]);
      setInputMessage('');
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Hola, soy el asistente de DevOps. ¿En qué puedo ayudarte con las herramientas?' 
        }]);
      }, 500);
    }
  };

  return (
    <div className="admin-panel-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .admin-panel-container {
          width: 100%;
          min-height: 100vh;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .top-bar {
          background: white;
          padding: 15px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .logo-aries {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-aries-img {
          height: 100px;
          width: auto;
          object-fit: contain;
        }

        .logo-aries-text {
          font-size: 24px;
          font-weight: bold;
          color: #d32f2f;
          letter-spacing: 2px;
        }

        .healthcheck-container {
          display: flex;
          gap: 20px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .healthcheck-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .healthcheck-item:hover {
          background: #f0f0f0;
        }

        .healthcheck-logo {
          width: 40px;
          height: 40px;
          background: #e0e0e0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #666;
          font-size: 12px;
          position: relative;
        }

        .status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
        }

        .healthcheck-name {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }

        .docs-icon-button {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #6c757d;
          min-width: 36px;
          height: 36px;
        }

        .docs-icon-button:hover {
          background: #e9ecef;
          color: #495057;
          border-color: #adb5bd;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-panel {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
        }

        .panel-title {
          color: #333;
          font-size: 28px;
          margin-bottom: 30px;
        }

        .alert-message {
          color: #d32f2f;
          font-weight: bold;
          font-size: 16px;
          margin: 10px 0 20px;
          padding: 10px;
          background: #ffebee;
          border-radius: 4px;
        }

        .env-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0 40px;
        }

        .env-selector label {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        #environment {
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 8px;
          border: 2px solid #ddd;
          cursor: pointer;
          background: white;
          color: #333;
          min-width: 200px;
          transition: border-color 0.2s;
        }

        #environment:hover {
          border-color: #999;
        }

        #environment:focus {
          outline: none;
          border-color: #1976d2;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .service-card {
          background: white;
          border-radius: 12px;
          padding: 30px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .card-docs-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          color: #666;
        }

        .card-docs-btn:hover {
          background: #e0e0e0;
        }

        .card-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin: 0 auto 20px;
          display: block;
        }

        .card-title {
          font-size: 20px;
          color: #333;
          margin-bottom: 10px;
        }

        .card-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .card-access-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .card-access-btn:hover {
          background: #1565c0;
        }

        .chat-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #d32f2f;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s, background 0.2s;
          z-index: 1000;
        }

        .chat-button:hover {
          background: #b71c1c;
          transform: scale(1.05);
        }

        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
        }

        .chat-header {
          background: #d22f19ff;
          color: white;
          padding: 15px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-message {
          padding: 10px 15px;
          border-radius: 8px;
          max-width: 80%;
          word-wrap: break-word;
        }

        .chat-message.user {
          background: #d22f19ff;
          color: white;
          align-self: flex-end;
        }

        .chat-message.bot {
          background: #f0f0f0;
          color: #333;
          align-self: flex-start;
        }

        .chat-input-container {
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 10px;
        }

        .chat-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .chat-input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .chat-send {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .chat-send:hover {
          background: #1565c0;
        }

        @media (max-width: 768px) {
          .healthcheck-container {
            position: static;
            transform: none;
            margin-top: 10px;
          }

          .top-bar {
            flex-direction: column;
            gap: 15px;
          }

          .chat-window {
            width: calc(100% - 40px);
            right: 20px;
            bottom: 90px;
          }

          .chat-button {
            right: 20px;
            bottom: 20px;
          }
        }
      `}</style>

      <div className="top-bar">
        <div className="logo-aries">
          <img 
            src={ariesLogo}
            alt="Logo ARIES" 
            className="logo-aries-img"
          />
        </div>
        
        <div className="healthcheck-container">
          {healthcheckTools.map(tool => (
            <a 
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="healthcheck-item"
            >
              <div className="healthcheck-logo">
                <Activity size={20} />
                <div 
                  className="status-indicator"
                  style={{ background: getStatusColor(tool.status) }}
                ></div>
              </div>
              <span className="healthcheck-name">{tool.name}</span>
            </a>
          ))}
        </div>

        <button 
          className="docs-icon-button"
          onClick={() => window.open(documentationUrl, '_blank', 'noopener,noreferrer')}
          title="Documentación"
        >
          <FileText size={18} />
        </button>
      </div>

      <div className="admin-panel">
        <h1 className="panel-title">Panel de Control para Administración</h1>

        {message && (
          <p className="alert-message">{message}</p>
        )}

        <div className="env-selector">
          <label htmlFor="environment">Selecciona el ambiente:</label>
          <select 
            id="environment" 
            value={env} 
            onChange={(e) => setEnv(e.target.value)}
          >
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

      <button 
        className="chat-button"
        onClick={() => setChatOpen(!chatOpen)}
        title="Abrir chat de soporte"
      >
        <MessageCircle size={28} />
      </button>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Asistente DevOps IA</span>
            <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
          </div>
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div className="chat-message bot">
                ¡Hola! Soy tu asistente Aries DevOps. ¿En qué puedo ayudarte hoy?
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input 
              type="text" 
              className="chat-input"
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="chat-send" onClick={handleSendMessage}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;