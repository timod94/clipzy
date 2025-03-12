import { screen } from '@testing-library/react';


  
  // Teste, ob bestimmte Elemente gerendert werden
  expect(screen.getByText(/Upload/i)).toBeInTheDocument(); // Beispiel: Überprüfe, ob der Link zu "Upload" angezeigt wird
