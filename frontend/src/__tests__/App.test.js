import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Ändere dies von BrowserRouter zu MemoryRouter
import App from '../App'; // Importiere die App-Komponente

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  
  // Teste, ob bestimmte Elemente gerendert werden
  expect(screen.getByText(/Upload/i)).toBeInTheDocument(); // Beispiel: Überprüfe, ob der Link zu "Upload" angezeigt wird
});
