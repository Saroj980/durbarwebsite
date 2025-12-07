import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Load bootstrap JS only here

import './index.css';
import './css/AboutSection.css';
import './css/FeaturesSection.css';

import { applyTheme } from './theme';

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  offset: 80,
});

// Load theme first then render app
applyTheme().finally(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <App /> // StrictMode removed
  );
});
