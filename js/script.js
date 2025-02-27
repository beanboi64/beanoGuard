// Get references to all the necessary DOM elements using their IDs.
const passwordBtn = document.getElementById('generate-btn'); // Button to generate a password.
const passLen = document.getElementById('password-length'); // Input field where the user enters the password length.
const inputVal = document.getElementById('password-input'); // Input field where the generated password will be displayed.
const saveBtn = document.getElementById('save-btn'); // Button to save the generated password.
const passwordList = document.getElementById('password-list'); // List where saved passwords will be displayed.
const emptyState = document.getElementById('empty-passwords'); // Message shown when there are no saved passwords.

// Define an array of character sets to use for generating passwords.
// This includes uppercase letters, lowercase letters, numbers, and special characters.
const characters = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // Uppercase letters.
    "abcdefghijklmnopqrstuvwxyz", // Lowercase letters.
    "1234567890", // Numbers.
    "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" // Special characters.
];

// Add an event listener to the "Generate Password" button.
passwordBtn.addEventListener('click', () => {
    let genPassword = ''; // This variable will store the generated password.

    // Get the password length entered by the user and convert it to a number.
    const passwordLength = parseInt(passLen.value);

    // Check if the entered password length is valid (a positive number).
    if (isNaN(passwordLength) || passwordLength <= 0) {
        alert("Please enter a valid password length."); // Show an alert if the input is invalid.
        return; // Stop the function if the input is invalid.
    }

    // Generate the password by randomly selecting characters from the character sets.
    for (let i = 0; i < passwordLength; i++) {
        let randomSet = characters[Math.floor(Math.random() * characters.length)]; // Randomly select a character set.
        let randomCharacter = randomSet[Math.floor(Math.random() * randomSet.length)]; // Randomly select a character from the chosen set.
        genPassword += randomCharacter; // Add the selected character to the password.
    }

    inputVal.value = genPassword; // Display the generated password in the input field.

    // If a strength meter exists in the UI, update it with the generated password.
    if (window.beanoGuardUI && window.beanoGuardUI.updateStrengthMeter) {
        window.beanoGuardUI.updateStrengthMeter(genPassword);
    }
});

// Add an event listener to the "Save Password" button.
saveBtn.addEventListener('click', () => {
    const generatedPassword = inputVal.value.trim(); // Get the generated password from the input field and remove any extra spaces.

    // Check if there is a password to save.
    if (generatedPassword === '') {
        alert("No password to save. Please generate a password first."); // Show an alert if no password is available.
        return; // Stop the function if there's nothing to save.
    }

    // Add the password to the list of saved passwords.
    passwordList.innerHTML += `<li>${generatedPassword}</li>`; // Create a new list item for the saved password.
    inputVal.value = ''; // Clear the input field after saving.

    // Save the password to the browser's local storage so it persists even after refreshing the page.
    saveToLocalStorage(generatedPassword);

    // Load all saved passwords from local storage and display them in the list.
    loadFromLocalStorage();

    // If a modal is open (e.g., for saving passwords), close it if the UI function exists.
    if (window.beanoGuardUI && window.beanoGuardUI.closeModal) {
        window.beanoGuardUI.closeModal();
    }
});

// Function to save a password to the browser's local storage.
function saveToLocalStorage(password) {
    let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || []; // Get the list of saved passwords or create an empty array if none exist.
    savedPasswords.push(password); // Add the new password to the list.
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords)); // Save the updated list back to local storage.
}

// Function to load saved passwords from the browser's local storage and display them in the list.
function loadFromLocalStorage() {
    let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || []; // Get the list of saved passwords or create an empty array if none exist.
    passwordList.innerHTML = ''; // Clear the current list of passwords.

    // Add each saved password to the list.
    savedPasswords.forEach((password) => {
        passwordList.innerHTML += `<li>${password}</li>`;
    });

    // Update the visibility of the "no saved passwords" message based on whether there are saved passwords.
    updateEmptyStateVisibility(savedPasswords.length > 0);
}

// Function to update the visibility of the "no saved passwords" message.
function updateEmptyStateVisibility(hasSavedPasswords) {
    if (emptyState) { // Check if the empty state element exists.
        if (hasSavedPasswords) {
            emptyState.style.display = 'none'; // Hide the message if there are saved passwords.
        } else {
            emptyState.style.display = 'block'; // Show the message if there are no saved passwords.
        }
    }

    // If a UI function exists to update the password list visibility, call it.
    if (window.beanoGuardUI && window.beanoGuardUI.updatePasswordListVisibility) {
        window.beanoGuardUI.updatePasswordListVisibility();
    }
}

// When the page loads, load saved passwords from local storage and check the visibility of the empty state message.
window.onload = function() {
    loadFromLocalStorage(); // Load saved passwords.

    // Check if there are saved passwords and update the empty state message accordingly.
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    updateEmptyStateVisibility(savedPasswords.length > 0);
};