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
