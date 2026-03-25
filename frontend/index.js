import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import './styles/App.css';

createInertiaApp({
  resolve: name => {
    // Manuel resolution des pages pour compatibilité Create React App
    const pages = require.context('./pages', true, /\.jsx$/);
    return pages(`./${name}.jsx`).default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
