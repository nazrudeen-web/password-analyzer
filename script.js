// Professional Password Checker JavaScript

'use strict';

// DOM Elements
const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const strengthBadge = document.getElementById('strength-badge');
const strengthCircle = document.getElementById('strength-circle');
const strengthProgress = document.getElementById('strength-progress');
const strengthPercentage = document.getElementById('strength-percentage');
const resultsSection = document.getElementById('results-section');
const crackTimeElement = document.getElementById('crack-time');
const guessesElement = document.getElementById('guesses-count');
const warningCard = document.getElementById('warnings-card');
const warningText = document.getElementById('warning-text');
const suggestionsCard = document.getElementById('suggestions-card');
const suggestionsText = document.getElementById('suggestions-text');
const characterCount = document.querySelector('.count-number');
const toast = document.getElementById('toast');

// Action buttons
const toggleVisibilityBtn = document.querySelector('.toggle-visibility');
const copyPasswordBtn = document.querySelector('.copy-password');
const generatePasswordBtn = document.querySelector('.generate-password');
const shareBtn = document.querySelector('.share-btn');
const themeToggle = document.getElementById('theme-toggle');

// Generator elements
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const generateNewPasswordBtn = document.getElementById('generate-new-password');
const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');
const excludeAmbiguous = document.getElementById('exclude-ambiguous');
const noRepeating = document.getElementById('no-repeating');

// Constants
const STRENGTH_LEVELS = {
  0: { text: 'Very Weak', color: '#ef4444', percentage: 20 },
  1: { text: 'Weak', color: '#f97316', percentage: 40 },
  2: { text: 'Fair', color: '#f59e0b', percentage: 60 },
  3: { text: 'Good', color: '#84cc16', percentage: 80 },
  4: { text: 'Strong', color: '#10b981', percentage: 100 }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeEventListeners();
  updateLengthDisplay();
});

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  if (theme === 'dark') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// Event Listeners
function initializeEventListeners() {
  // Password input
  passwordInput.addEventListener('input', handlePasswordInput);
  
  // Action buttons
  toggleVisibilityBtn.addEventListener('click', togglePasswordVisibility);
  copyPasswordBtn.addEventListener('click', copyPassword);
  generatePasswordBtn.addEventListener('click', generateAndSetPassword);
  shareBtn.addEventListener('click', shareApp);
  themeToggle.addEventListener('click', toggleTheme);
  
  // Generator controls
  lengthSlider.addEventListener('input', updateLengthDisplay);
  generateNewPasswordBtn.addEventListener('click', generateAndSetPassword);
  
  // Prevent form submission
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target === passwordInput) {
      e.preventDefault();
    }
  });
}

// Password Input Handler
function handlePasswordInput() {
  const password = passwordInput.value;
  const length = password.length;
  
  // Update character count
  characterCount.textContent = length;
  
  // Update criteria validation
  updatePasswordCriteria(password);
  
  if (length > 0) {
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Analyze password strength
    analyzePasswordStrength(password);
  } else {
    // Hide results section
    resultsSection.classList.add('hidden');
    
    // Reset strength indicator
    resetStrengthIndicator();
  }
}

// Password Criteria Validation
function updatePasswordCriteria(password) {
  const criteria = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    length: password.length >= 8,
    common: !isCommonPassword(password)
  };
  
  // Update UI for each criterion
  Object.keys(criteria).forEach(criterion => {
    const element = document.querySelector(`[data-criterion="${criterion}"]`);
    if (element) {
      element.classList.toggle('valid', criteria[criterion]);
      element.classList.toggle('invalid', !criteria[criterion]);
    }
  });
}

// Check if password is common (simplified check)
function isCommonPassword(password) {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'hello', 'login', 'pass'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

// Password Strength Analysis
function analyzePasswordStrength(password) {
  if (typeof zxcvbn === 'undefined') {
    console.error('zxcvbn library not loaded');
    return;
  }
  
  const result = zxcvbn(password);
  const strength = STRENGTH_LEVELS[result.score];
  
  // Update strength indicator
  updateStrengthIndicator(result.score, strength);
  
  // Update crack time
  updateCrackTime(result.crack_times_seconds.offline_slow_hashing_1e4_per_second);
  
  // Update guesses count
  updateGuessesCount(result.guesses);
  
  // Update feedback
  updateFeedback(result.feedback);
}

// Update Strength Indicator
function updateStrengthIndicator(score, strength) {
  // Update progress bar
  strengthBar.style.width = `${strength.percentage}%`;
  strengthBar.style.backgroundColor = strength.color;
  
  // Update badge
  const badgeText = strengthBadge.querySelector('.badge-text');
  badgeText.textContent = strength.text;
  strengthBadge.style.backgroundColor = strength.color;
  strengthBadge.style.color = 'white';
  
  // Update circular progress
  const circumference = 2 * Math.PI * 15.9155;
  const offset = circumference - (strength.percentage / 100) * circumference;
  
  strengthProgress.style.strokeDasharray = `${circumference} ${circumference}`;
  strengthProgress.style.strokeDashoffset = offset;
  strengthProgress.style.stroke = strength.color;
  
  strengthPercentage.textContent = `${strength.percentage}%`;
  strengthPercentage.style.color = strength.color;
}

// Reset Strength Indicator
function resetStrengthIndicator() {
  strengthBar.style.width = '0%';
  strengthBar.style.backgroundColor = '#e5e7eb';
  
  const badgeText = strengthBadge.querySelector('.badge-text');
  badgeText.textContent = 'No Password';
  strengthBadge.style.backgroundColor = '#6b7280';
  strengthBadge.style.color = 'white';
  
  strengthProgress.style.strokeDasharray = '0, 100';
  strengthProgress.style.stroke = '#e5e7eb';
  
  strengthPercentage.textContent = '0%';
  strengthPercentage.style.color = '#6b7280';
}

// Update Crack Time Display
function updateCrackTime(seconds) {
  const formattedTime = formatTime(seconds);
  crackTimeElement.textContent = formattedTime;
}

// Update Guesses Count
function updateGuessesCount(guesses) {
  const formattedGuesses = formatNumber(guesses);
  guessesElement.textContent = formattedGuesses;
}

// Update Feedback
function updateFeedback(feedback) {
  // Handle warnings
  if (feedback.warning) {
    warningText.textContent = feedback.warning;
    warningCard.style.display = 'block';
  } else {
    warningCard.style.display = 'none';
  }
  
  // Handle suggestions
  if (feedback.suggestions && feedback.suggestions.length > 0) {
    suggestionsText.textContent = feedback.suggestions.join(' ');
    suggestionsCard.style.display = 'block';
  } else {
    suggestionsCard.style.display = 'none';
  }
}

// Utility Functions
function formatTime(seconds) {
  const units = [
    { label: 'century', value: 60 * 60 * 24 * 365 * 100 },
    { label: 'year', value: 60 * 60 * 24 * 365 },
    { label: 'month', value: 60 * 60 * 24 * 30 },
    { label: 'day', value: 60 * 60 * 24 },
    { label: 'hour', value: 60 * 60 },
    { label: 'minute', value: 60 },
    { label: 'second', value: 1 }
  ];
  
  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);
      return `${formatNumber(count)} ${unit.label}${count !== 1 ? 's' : ''}`;
    }
  }
  
  return 'instantly';
}

function formatNumber(num) {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num < 1000000000000) return `${(num / 1000000000).toFixed(1)}B`;
  return `${(num / 1000000000000).toFixed(1)}T`;
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const eyeClosed = toggleVisibilityBtn.querySelector('.eye-closed');
  const eyeOpen = toggleVisibilityBtn.querySelector('.eye-open');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeClosed.style.display = 'none';
    eyeOpen.style.display = 'block';
  } else {
    passwordInput.type = 'password';
    eyeClosed.style.display = 'block';
    eyeOpen.style.display = 'none';
  }
}

// Copy Password
async function copyPassword() {
  if (!passwordInput.value.trim()) return;
  
  try {
    await navigator.clipboard.writeText(passwordInput.value);
    showToast('Password copied to clipboard!');
    
    // Update button icon temporarily
    const copyIcon = copyPasswordBtn.querySelector('.copy-icon');
    const copySuccess = copyPasswordBtn.querySelector('.copy-success');
    
    copyIcon.style.display = 'none';
    copySuccess.style.display = 'block';
    
    setTimeout(() => {
      copyIcon.style.display = 'block';
      copySuccess.style.display = 'none';
    }, 2000);
  } catch (error) {
    console.error('Failed to copy password:', error);
    showToast('Failed to copy password', 'error');
  }
}

// Generate Password
function generatePassword() {
  const length = parseInt(lengthSlider.value);
  const options = {
    length: length,
    uppercase: includeUppercase.checked,
    lowercase: includeLowercase.checked,
    digits: includeNumbers.checked,
    symbols: includeSymbols.checked,
    excludeAmbiguous: excludeAmbiguous.checked,
    noRepeating: noRepeating.checked
  };
  
  // Ensure at least one character type is selected
  if (!options.uppercase && !options.lowercase && !options.digits && !options.symbols) {
    showToast('Please select at least one character type', 'error');
    return null;
  }
  
  try {
    if (typeof PasswordGenerator !== 'undefined') {
      return PasswordGenerator.generatePassword(options);
    } else {
      // Fallback password generation
      return generateFallbackPassword(options);
    }
  } catch (error) {
    console.error('Password generation failed:', error);
    return generateFallbackPassword(options);
  }
}

// Fallback Password Generation
function generateFallbackPassword(options) {
  let charset = '';
  
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.digits) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (options.excludeAmbiguous) {
    charset = charset.replace(/[0O1lI]/g, '');
  }
  
  let password = '';
  const charsetArray = charset.split('');
  
  for (let i = 0; i < options.length; i++) {
    if (options.noRepeating && password.length > 0) {
      const availableChars = charsetArray.filter(char => !password.includes(char));
      if (availableChars.length === 0) break;
      password += availableChars[Math.floor(Math.random() * availableChars.length)];
    } else {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  
  return password;
}

// Generate and Set Password
function generateAndSetPassword() {
  const password = generatePassword();
  if (password) {
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));
    
    // Animate generate button
    const generateIcon = generatePasswordBtn.querySelector('.generate-icon') || 
                        generateNewPasswordBtn.querySelector('svg');
    if (generateIcon) {
      generateIcon.style.transform = 'rotate(360deg)';
      generateIcon.style.transition = 'transform 0.5s ease';
      
      setTimeout(() => {
        generateIcon.style.transform = 'rotate(0deg)';
      }, 500);
    }
    
    showToast('New password generated!');
  }
}

// Update Length Display
function updateLengthDisplay() {
  lengthValue.textContent = lengthSlider.value;
}

// Share App
async function shareApp() {
  const shareData = {
    title: 'SecurePass - Password Strength Analyzer',
    text: 'Check your password strength with this professional security tool!',
    url: window.location.href
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  } catch (error) {
    console.error('Sharing failed:', error);
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    } catch (clipboardError) {
      console.error('Clipboard access failed:', clipboardError);
      showToast('Unable to share or copy link', 'error');
    }
  }
}

// Toast Notification
function showToast(message, type = 'success') {
  const toastMessage = toast.querySelector('.toast-message');
  toastMessage.textContent = message;
  
  // Update toast styling based on type
  if (type === 'error') {
    toast.style.backgroundColor = '#ef4444';
  } else {
    toast.style.backgroundColor = '#10b981';
  }
  
  // Show toast
  toast.classList.add('show');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + G to generate password
  if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
    e.preventDefault();
    generateAndSetPassword();
  }
  
  // Ctrl/Cmd + C to copy password (when input is focused)
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement === passwordInput) {
    copyPassword();
  }
  
  // Escape to clear password
  if (e.key === 'Escape' && document.activeElement === passwordInput) {
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
  }
});

// Performance Optimization: Debounce password analysis
let analysisTimeout;
const originalHandlePasswordInput = handlePasswordInput;

handlePasswordInput = function() {
  clearTimeout(analysisTimeout);
  analysisTimeout = setTimeout(originalHandlePasswordInput, 150);
};

// Initialize password input handler with debouncing
passwordInput.addEventListener('input', handlePasswordInput);

// Accessibility Improvements
document.addEventListener('keydown', function(e) {
  // Tab navigation improvements
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(style);