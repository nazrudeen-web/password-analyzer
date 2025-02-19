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

  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);
      return `${count} ${unit.label}${count > 1 ? 's' : ''}`;
    }
  }

  return 'less than a second';
}

function formatNumber(num) {
  // Array of units from smallest to largest.
  const units = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
  ];

  let unitIndex = 0;
  // Keep dividing by 1000 until num is less than 1000
  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  // Format the number to 2 decimal places and add the appropriate unit.
  return `${num.toFixed(0)} ${units[unitIndex]}`;
}



const progressBar = document.getElementById("progress-bar");
function updateProgressBar(strength) {
  let width = 0;
  let color = "";

  if (strength === 0 || strength === 1) {
      width = 25;
      color = "linear-gradient(to right, #ff4b4b, #ff6b6b)"; // Red
  } else if (strength === 2) {
      width = 50;
      color = "linear-gradient(to right, #ff9f43, #ffb84d)"; // Orange
  } else if (strength === 3) {
      width = 75;
      color = "linear-gradient(to right, #45a049, #57d57b)"; // Light Green
  } else if (strength === 4) {
      width = 100;
      color = "linear-gradient(to right, #1b8c00, #2bc400)"; // Dark Green
  }

  progressBar.style.width = width + "%";
  progressBar.style.background = color;
}


function resetProgressBar() {
  progressBar.style.width = '0%';
  progressBar.style.background = '#ccc';
}

// Analyze password
function analyzePassword(password) {
  const result = zxcvbn(password);

  const scoreText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const textColor = ['#FF0000', '#D32F2F', '#f08c00', '#37b24d', '#2b8a3e'];

  updateProgressBar(result.score);
  console.log(result.score)

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
  const attempts = result.guesses;
  document.getElementById('guesses').textContent = `${formatNumber(attempts)} attempts`;
  document.getElementById('guesses').style.color = textColor[result.score];

  // Warnings & Suggestions
  document.getElementById('warning').textContent =
    result.feedback.warning || 'No specific warnings.';
  document.getElementById('suggestions').textContent =
    result.feedback.suggestions.length > 0
      ? result.feedback.suggestions.join(', ')
      : 'No specific suggestions.';
}




