document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(location.search);
  const container = document.getElementById('dataList');

  if (!container) return;

  if (!params.toString()) {
    container.innerHTML = '<p>No form data found in URL.</p>';
    return;
  }

  for (const [key, value] of params.entries()) {
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = value || '(empty)';
    container.appendChild(dt);
    container.appendChild(dd);
  }
});
