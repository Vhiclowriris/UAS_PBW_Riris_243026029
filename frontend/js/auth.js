// frontend/js/auth.js
// Auth State Management
const Auth = {
  getToken() {
    return localStorage.getItem('token');
  },
  
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setAuthData(token, user, expiresAt = null) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (expiresAt) {
      localStorage.setItem('tokenExpiry', expiresAt);
    }
  },
  
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  },
  
  isAuthenticated() {
    return !!this.getToken();
  },
  
  isTokenExpired() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  },
  
  requireAuth(redirectUrl = 'login.html') {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      this.clearAuth();
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },
  
  logout() {
    this.clearAuth();
    window.location.href = 'login.html';
  }
};

// Login Form Handler (compatible with your HTML structure)
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.getElementById('btnText');
  const alertDiv = document.getElementById('alert');
  
  // Real-time validation (from your original code)
  if (usernameInput) {
    usernameInput.addEventListener('input', () => 
      validateField(usernameInput, 'usernameError', validateUsername)
    );
  }
  if (passwordInput) {
    passwordInput.addEventListener('input', () => 
      validateField(passwordInput, 'passwordError', validatePassword)
    );
  }
  
  // Validation functions
  function validateUsername(value) {
    if (!value) return 'Username wajib diisi';
    if (value.length < 3) return 'Username minimal 3 karakter';
    if (value.length > 50) return 'Username maksimal 50 karakter';
    return null;
  }
  
  function validatePassword(value) {
    if (!value) return 'Password wajib diisi';
    if (value.length < 6) return 'Password minimal 6 karakter';
    return null;
  }
  
  function validateField(input, errorId, validator) {
    const error = validator(input.value);
    const errorEl = document.getElementById(errorId);
    if (error) {
      input.classList.add('error');
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.classList.add('show');
      }
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) {
        errorEl.classList.remove('show');
      }
      return true;
    }
  }
  
  function showAlert(message, type = 'error') {
    if (alertDiv) {
      alertDiv.textContent = message;
      alertDiv.className = `alert ${type} show`;
      setTimeout(() => alertDiv.classList.remove('show'), 5000);
    } else {
      alert(message);
    }
  }
  
  function setLoading(loading) {
    if (loginBtn) loginBtn.disabled = loading;
    if (btnText) {
      btnText.innerHTML = loading 
        ? '<span class="loading"></span>Memproses...' 
        : 'Login';
    }
  }
  
  // Form submit handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate
    const isUsernameValid = validateField(usernameInput, 'usernameError', validateUsername);
    const isPasswordValid = validateField(passwordInput, 'passwordError', validatePassword);
    
    if (!isUsernameValid || !isPasswordValid) {
      showAlert('Periksa kembali input Anda');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use API module
      const response = await API.login(
        usernameInput.value.trim().toLowerCase(),
        passwordInput.value
      );
      
      if (response.success) {
        // Save auth data
        Auth.setAuthData(
          response.data.token,
          response.data.user,
          response.data.expiresAt
        );
        
        showAlert('Login berhasil! Mengalihkan...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert(error.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  });
  
  // Enter key support
  if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginForm.requestSubmit();
    });
  }
}

// Check if already logged in
function checkAlreadyLoggedIn() {
  if (Auth.isAuthenticated() && !Auth.isTokenExpired()) {
    if (window.location.href.includes('login.html')) {
      window.location.href = 'dashboard.html';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAlreadyLoggedIn();
  setupLoginForm();
});