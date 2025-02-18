'use strict';

// SELECTING ELEMENT
const passwordInput = document.querySelector('.input-password');

//  SHOW AND HIDE PASSWORD
const showHidePassword = document.querySelector('.toggle-visibility');
const eyeClosedIcon = document.querySelector('.eye-close');
const eyeOpenIcon = document.querySelector('.eye-open');
showHidePassword.addEventListener('click', (e) => {
  e.preventDefault();
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeClosedIcon.style.display = 'none';
    eyeOpenIcon.style.display = 'block';
  } else {
    passwordInput.type = 'password';
    eyeClosedIcon.style.display = 'block';
    eyeOpenIcon.style.display = 'none';
  }
});

//  COPY PASSWORD
const copyButton = document.querySelector('.copy-password');
const copyIcon = document.querySelector('.icon-copy');
const copySuccess = document.querySelector('.copy-success');
copyButton.addEventListener('click', async () => {
  if (passwordInput.value.trim() === '') return;
  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyIcon.style.display = 'none';
    copySuccess.style.display = 'block';
    // Reset icon back after a delay (2 seconds)
    setTimeout(() => {
      copyIcon.style.display = 'block';
      copySuccess.style.display = 'none';
    }, 2000);
  } catch (error) {
    console.log('Failed to copy:', error);
  }
});

//  GENERATE RANDOM PASSWORD
const generatePassword = document.querySelector('.generate-password');
const randomIcon = document.querySelector('.icon-random');
// Password generator function
function generateStrongPassword() {
  const password = PasswordGenerator.generatePassword({
    length: 16,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
  });
  return password;
}
// Trigger password generation on button click
generatePassword.addEventListener('click', () => {
  const randomPassword = generateStrongPassword();
  passwordInput.value = randomPassword;
  // Rotate the icon
  randomIcon.style.transform = 'rotate(360deg)';
  randomIcon.style.transition = 'transform 0.5s ease';
  // Reset rotation after animation is complete
  setTimeout(() => {
    randomIcon.style.transform = 'rotate(0deg)';
  }, 500);
  //Dispatch an 'input' event so any input listeners get notified mean when generate random password strength result will show othewise not show result
  passwordInput.dispatchEvent(new Event('input'));
});

// CHECK PASSWORD RESULTS
passwordInput.addEventListener('input', () => {
  document.querySelector('.char-count').textContent =
    passwordInput.value.length;
  validatePasswordCharacter(passwordInput.value);

  if (passwordInput.value.length > 0) {
    document.querySelector('.password-results').classList.remove('hidden');
    analyzePassword(passwordInput.value);
  } else {
    document.querySelector('.password-results').classList.add('hidden');
    resetProgressBar();
  }
});

// Validate Password Characters
function validatePasswordCharacter(password) {
  let containsUpper = false;
  let containsLower = false;
  let containsNumber = false;
  let containsSymbol = false;

  // Loop through each character in the password to check conditions
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= 'A' && char <= 'Z') {
      containsUpper = true;
    } else if (char >= 'a' && char <= 'z') {
      containsLower = true;
    } else if (char >= '0' && char <= '9') {
      containsNumber = true;
    } else {
      containsSymbol = true;
    }
  }
  document
    .querySelector('.has-uppercase')
    .classList.toggle('valid', containsUpper);
  document
    .querySelector('.icon-upper')
    .classList.toggle('icon-highlight', containsUpper);
  document
    .querySelector('.has-lowercase')
    .classList.toggle('valid', containsLower);
  document
    .querySelector('.icon-lower')
    .classList.toggle('icon-highlight', containsLower);
  document
    .querySelector('.has-numbers')
    .classList.toggle('valid', containsNumber);
  document
    .querySelector('.icon-number')
    .classList.toggle('icon-highlight', containsNumber);
  document
    .querySelector('.has-symbols')
    .classList.toggle('valid', containsSymbol);
  document
    .querySelector('.icon-symbol')
    .classList.toggle('icon-highlight', containsSymbol);
}

// Format seconds
function formatSeconds(seconds) {
  const units = [
    { label: 'trillion', value: 1e12 },
    { label: 'billion', value: 1e9 },
    { label: 'million', value: 1e6 },
    { label: 'year', value: 60 * 60 * 24 * 365 },
    { label: 'day', value: 60 * 60 * 24 },
    { label: 'hour', value: 60 * 60 },
    { label: 'minute', value: 60 },
    { label: 'second', value: 1 },
  ];

  let result = [];
  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);
      seconds %= unit.value;
      result.push(`${count} ${unit.label}${count > 1 ? 's' : ''}`);
    }
  }

  return result.length > 0 ? result.join(', ') : 'less than a second';
}

function updateProgressBar(score) {
  const progressValues = [20, 40, 60, 80, 100];
  const progressColors = [
    '#FF0000',
    '#D32F2F',
    '#f08c00',
    '#37b24d',
    '#2b8a3e',
  ];

  progress.style.width = `${progressValues[score]}%`;
  progress.style.backgroundColor = progressColors[score];
}

function resetProgressBar() {
  progress.style.width = '0%';
  progress.style.backgroundColor = '#ccc';
}
// Analyze password
function analyzePassword(password) {
  const result = zxcvbn(password);

  const scoreText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const textColor = ['#FF0000', '#D32F2F', '#f08c00', '#37b24d', '#2b8a3e'];

  updateProgressBar(result.score);

  // strength
  document.querySelector('.strength-value').textContent =
    scoreText[result.score];
  document.querySelector('.strength-value').style.color =
    textColor[result.score];

  // Time to crack (realistic attack)
  const convertSeconds = formatSeconds(
    result.crack_times_seconds.offline_slow_hashing_1e4_per_second
  );
  document.getElementById('crack-time').textContent = convertSeconds;
  document.getElementById('crack-time').style.color = textColor[result.score];

  // Number of guesses
  document.getElementById('guesses').textContent =
    result.guesses.toLocaleString() + ' attempts';
  document.getElementById('guesses').style.color = textColor[result.score];

  // Warnings & Suggestions
  document.getElementById('warning').textContent =
    result.feedback.warning || 'No specific warnings.';
  document.getElementById('suggestions').textContent =
    result.feedback.suggestions.length > 0
      ? result.feedback.suggestions.join(', ')
      : 'No specific suggestions.';
}
