import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPanel from '../AdminPanel';

// Mock para fetch de config.json
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      alertMessage: "NOTA: Se está presentando intermitencias en CIAD",
      showAlert: true
    })
  })
);

describe('AdminPanel Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Renderiza correctamente el título del panel', () => {
    render(<AdminPanel />);
    expect(screen.getByText('Panel de Control para Administración')).toBeInTheDocument();
  });

  test('Muestra el mensaje de alerta si showAlert es true', async () => {
    render(<AdminPanel />);
    await waitFor(() => {
      expect(screen.getByText('NOTA: Se está presentando intermitencias en CIAD')).toBeInTheDocument();
    });
  });

  test('Permite cerrar la alerta al hacer clic en el botón de cierre', async () => {
    render(<AdminPanel />);
    await waitFor(() => {
      expect(screen.getByText('NOTA: Se está presentando intermitencias en CIAD')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✖');
    fireEvent.click(closeButton);

    expect(screen.queryByText('NOTA: Se está presentando intermitencias en CIAD')).not.toBeInTheDocument();
  });

  test('Cambia de ambiente correctamente cuando se selecciona un nuevo ambiente', async () => {
    render(<AdminPanel />);

    const select = screen.getByLabelText('Selecciona el ambiente:');
    fireEvent.change(select, { target: { value: 'uat' } });

    expect(select.value).toBe('uat');
  });

  test('Carga correctamente los servicios disponibles', async () => {
    render(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Cloud Services')).toBeInTheDocument();
      expect(screen.getByText('DevOps Tools')).toBeInTheDocument();
    });
  });
});