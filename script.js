// DOM elements
const form = document.getElementById('signupForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrength = document.getElementById('passwordStrength');
const signupBtn = document.getElementById('signupBtn');
const spinner = document.getElementById('spinner');

// Form fields
const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    password: passwordInput,
    confirmPassword: confirmPasswordInput,
    terms: document.getElementById('terms')
};

// Error message elements
const errorElements = {
    firstName: document.getElementById('firstNameError'),
    lastName: document.getElementById('lastNameError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    terms: document.getElementById('termsError')
};

// Validation rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: 'First name must be at least 2 characters and contain only letters'
    },
    lastName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: 'Last name must be at least 2 characters and contain only letters'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
    },
    confirmPassword: {
        required: true,
        matchField: 'password',
        message: 'Passwords do not match'
    },
    terms: {
        required: true,
        message: 'You must agree to the Terms of Service and Privacy Policy'
    }
};

// Initialize event listeners
function initializeEventListeners() {
    // Toggle password visibility
    togglePassword.addEventListener('click', handlePasswordToggle);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field.type === 'checkbox') {
            field.addEventListener('change', () => validateField(fieldName));
        } else {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => {
                clearError(fieldName);
                if (fieldName === 'password') {
                    updatePasswordStrength(field.value);
                    if (fields.confirmPassword.value) {
                        validateField('confirmPassword');
                    }
                }
                if (fieldName === 'confirmPassword') {
                    validateField('confirmPassword');
                }
            });
        }
    });

    // Social login buttons
    document.querySelector('.google-btn').addEventListener('click', () => {
        alert('Google sign-up integration would be implemented here');
    });
    
    document.querySelector('.github-btn').addEventListener('click', () => {
        alert('GitHub sign-up integration would be implemented here');
    });
}

// Toggle password visibility
function handlePasswordToggle() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Update icon (you could replace this with actual icon toggling)
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    if (type === 'text') {
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Update password strength indicator
function updatePasswordStrength(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (password.length === 0) {
        passwordStrength.classList.remove('show');
        return;
    }
    
    passwordStrength.classList.add('show');
    
    let score = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    // Remove all strength classes
    strengthFill.className = 'strength-fill';
    
    if (score <= 2) {
        strengthFill.classList.add('weak');
        feedback = 'Weak password';
    } else if (score <= 4) {
        strengthFill.classList.add('fair');
        feedback = 'Fair password';
    } else if (score <= 5) {
        strengthFill.classList.add('good');
        feedback = 'Good password';
    } else {
        strengthFill.classList.add('strong');
        feedback = 'Strong password';
    }
    
    strengthText.textContent = feedback;
}

// Validate individual field
function validateField(fieldName) {
    const field = fields[fieldName];
    const rule = validationRules[fieldName];
    const errorElement = errorElements[fieldName];
    
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (rule.required) {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                errorMessage = rule.message;
            }
        } else if (!field.value.trim()) {
            isValid = false;
            errorMessage = rule.message;
        }
    }
    
    // Length check
    if (isValid && rule.minLength && field.value.length < rule.minLength) {
        isValid = false;
        errorMessage = rule.message;
    }
    
    // Pattern check
    if (isValid && rule.pattern && !rule.pattern.test(field.value)) {
        isValid = false;
        errorMessage = rule.message;
    }
    
    // Match field check (for confirm password)
    if (isValid && rule.matchField) {
        const matchField = fields[rule.matchField];
        if (field.value !== matchField.value) {
            isValid = false;
            errorMessage = rule.message;
        }
    }
    
    // Update UI
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        errorElement.classList.add('show');
        errorElement.textContent = errorMessage;
        
        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
    }
    
    return isValid;
}

// Clear error state
function clearError(fieldName) {
    const field = fields[fieldName];
    const errorElement = errorElements[fieldName];
    
    field.classList.remove('error');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    try {
        // Simulate API call
        await simulateSignup();
        
        // Success feedback
        showSuccessMessage();
        
    } catch (error) {
        // Error feedback
        showErrorMessage(error.message);
    } finally {
        // Hide loading state
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
    }
}

// Simulate signup API call
function simulateSignup() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.2) {
                resolve({ success: true });
            } else {
                reject(new Error('Email already exists. Please try a different email address.'));
            }
        }, 2000);
    });
}

// Show success message
function showSuccessMessage() {
    // Create and show success modal/message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            z-index: 1000;
            animation: slideUp 0.3s ease-out;
        ">
            <div style="color: #10b981; font-size: 48px; margin-bottom: 16px;">✓</div>
            <h2 style="color: #1f2937; margin-bottom: 8px;">Account Created Successfully!</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">Please check your email to verify your account.</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            ">Continue</button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(successDiv);
}

// Show error message
function showErrorMessage(message) {
    // Create and show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideInFromRight 0.3s ease-out;
            max-width: 400px;
        ">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">⚠️</span>
                <span style="font-weight: 500;">${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #dc2626;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeEventListeners);