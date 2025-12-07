// fetch theme settings from API and apply as CSS variables (--bs-*)
import api from './api';

export async function applyTheme() {
  try {
    const res = await api.get('/theme');
    const theme = res.data || {};
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(`--bs-${key}`, theme[key]);
    });
    if (theme.body_bg) document.documentElement.style.setProperty('--body-bg', theme.body_bg);
    if (theme.body_text) document.documentElement.style.setProperty('--body-text', theme.body_text);
  } catch (err) {
    console.warn('applyTheme failed', err);
  }
}
