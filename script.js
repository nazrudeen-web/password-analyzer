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
