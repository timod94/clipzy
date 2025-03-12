// eslint.config.js
import { defineConfig } from 'eslint-plugin-react';

export default defineConfig({
  // Verwende direkt das Array von ESLint-Konfigurationen
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parserOptions: {
        ecmaVersion: 2021,             // Aktuelle ECMAScript-Version
        sourceType: 'module',          // Modul-Import/Export
        ecmaFeatures: {
          jsx: true,                   // JSX unterstützen
        },
      },
      env: {
        browser: true,                 // Wir arbeiten im Browser-Umfeld
        node: true,                    // Und im Node.js-Umfeld
      },
      plugins: ['react'], // Füge das React-Plugin hinzu
      rules: {
        // Hier kannst du deine spezifischen Regeln definieren
        'react/prop-types': 'off', // Wenn du die Prop-Types nicht verwenden möchtest
        'no-unused-vars': 'warn',   // Warnung bei ungenutzten Variablen
      },
      settings: {
        react: {
          version: 'detect',          // Automatisch die React-Version erkennen
        },
      },
    },
  ],
});
