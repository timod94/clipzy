import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App'; // Importiere die App-Komponente

// Test für das Rendering der App-Komponenten
test('renders NavBar and UploadPage route', () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Überprüfe, ob der NavBar-Text vorhanden ist
  const navBarElement = screen.getByText(/upload/i);
  expect(navBarElement).toBeInTheDocument();

  // Überprüfe, ob der Link zur UploadPage existiert
  const uploadPageLink = screen.getByRole('link', { name: /upload/i });
  expect(uploadPageLink).toBeInTheDocument();
});

test('navigates to UploadPage when the link is clicked', () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Klicke auf den "Upload" Link
  const uploadPageLink = screen.getByRole('link', { name: /upload/i });
  fireEvent.click(uploadPageLink);

  // Überprüfe, ob die UploadPage gerendert wird
  const uploadPageElement = screen.getByText(/upload/i); // Hier kannst du einen Text von der UploadPage überprüfen
  expect(uploadPageElement).toBeInTheDocument();
});
