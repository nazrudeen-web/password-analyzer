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
