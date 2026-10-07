import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { AuthProvider } from './contexts/AuthContext.tsx';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MantineProvider defaultColorScheme="auto">
        <Notifications position="top-right" />
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
