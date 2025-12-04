document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // For demo: log credentials
  console.log('Login attempt:', { email, password });

  // TODO: Replace with backend API call for real authentication
  if(email && password){
    alert(`✅ Login submitted for: ${email}`);
  } else {
    alert('⚠️ Please enter both email and password.');
  }
});
