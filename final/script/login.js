export function initializeLoginForm() {
  const form = document.getElementById('loginForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Basic client-side validation; let the form submit (method=GET action=form-result.html) when valid
      if (!email || !password) {
        e.preventDefault();
        alert('⚠️ Please enter both email and password.');
        return;
      }

      // when valid we allow the native GET submission so form-result.html can read URLSearchParams
      // no e.preventDefault() here
    });
  }
}

// Auto-initialize on module load
initializeLoginForm();
