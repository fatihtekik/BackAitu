// Minimal health check entry without JSX or React
console.log('Vite health check OK');

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('root');
  if (el) {
    el.textContent = 'App boot stub - health check passed';
  }
});
