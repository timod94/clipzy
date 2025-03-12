import React from 'react';
import { screen } from '@testing-library/react';

import App from '../App'; // Importiere die App-Komponente

  
  // Teste, ob bestimmte Elemente gerendert werden
  expect(screen.getByText(/Upload/i)).toBeInTheDocument(); // Beispiel: Überprüfe, ob der Link zu "Upload" angezeigt wird
