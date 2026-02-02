/**
 * Dashly Frontend Application
 * 
 * This file handles:
 * - User login
 * - Token storage and decoding
 * - Role-based UI rendering (admin button visibility)
 * 
 * The admin button logic is CORRECT - it checks user.role === 'admin'
 * The bug is NOT here!
 */

const API_BASE = '/api';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const messageContainer = document.getElementById('message-container');

// Check for existing session on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('dashly_token');
    if (token) {
        try {
            const user = decodeToken(token);
            showDashboard(user, token);
        } catch (e) {
            localStorage.removeItem('dashly_token');
        }
    }
});

// Login form handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || 'Login failed', 'error');
            return;
        }

        // Store token and show dashboard
        localStorage.setItem('dashly_token', data.token);

        // Decode the token to get user info
        // This is how we determine what to show in the UI
        const user = decodeToken(data.token);
        showDashboard(user, data.token);

    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
});

/**
 * Decode a JWT token to extract the payload
 * This is a standard base64 decode - no verification on the client
 */
function decodeToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        // Decode the payload (second part)
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Failed to decode token:', e);
        return null;
    }
}

/**
 * Show the dashboard with user information
 * 
 * IMPORTANT: The admin button is shown based on the role in the token
 * This logic is CORRECT - the bug is elsewhere!
 */
function showDashboard(user, token) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';

    // Update user info display
    document.getElementById('welcome-message').textContent = `Welcome, ${user.name || 'User'}!`;
    document.getElementById('user-name').textContent = user.name || 'Unknown';
    document.getElementById('user-email').textContent = user.email || 'Unknown';

    // Display role (or show it's missing)
    const roleElement = document.getElementById('user-role');
    const role = user.role;

    if (role) {
        roleElement.textContent = role;
        roleElement.className = `user-role role-${role}`;
    } else {
        roleElement.textContent = 'undefined';
        roleElement.className = 'user-role role-undefined';
    }

    // Show admin button ONLY if user.role === 'admin'
    // This is the correct check! The bug is not here.
    const adminButtonContainer = document.getElementById('admin-button-container');

    if (user.role === 'admin') {
        adminButtonContainer.innerHTML = `
      <button class="btn-admin" onclick="openAdminDashboard()">
        🔐 Admin Dashboard
      </button>
    `;
    } else {
        adminButtonContainer.innerHTML = '';
    }

    // Show decoded token payload for debugging
    document.getElementById('token-payload').textContent = JSON.stringify(user, null, 2);
}

/**
 * Open admin dashboard (placeholder)
 */
async function openAdminDashboard() {
    const token = localStorage.getItem('dashly_token');

    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Error: ${data.error}`);
            return;
        }

        alert(`${data.welcome}\n\nStats: ${JSON.stringify(data.stats, null, 2)}`);
    } catch (error) {
        alert('Failed to load admin dashboard');
    }
}

/**
 * Quick login helper for testing
 */
function quickLogin(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    loginForm.dispatchEvent(new Event('submit'));
}

/**
 * Logout and return to login screen
 */
function logout() {
    localStorage.removeItem('dashly_token');
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    messageContainer.innerHTML = '';
}

/**
 * Show a message to the user
 */
function showMessage(message, type = 'info') {
    const className = type === 'error' ? 'error-message' : 'success-message';
    messageContainer.innerHTML = `<div class="${className}">${message}</div>`;
}
