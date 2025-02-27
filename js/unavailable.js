/**
 * BeanoGuard Password Generator
 * Unavailable.js - Handles unavailable/disabled PRO features
 */

// Wait for the DOM to fully load before running the script.
document.addEventListener('DOMContentLoaded', function() {

    // **Tab Switching Functionality**
    // Get all tab buttons and their corresponding content areas.
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event listeners to each tab button.
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove the "active" class from all buttons and hide all content areas.
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            // Add the "active" class to the clicked button and show its corresponding content area.
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab'); // Get the ID of the tab to show.
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });

    // **Modal Functionality**
    // Get references to the modal and its buttons.
    const saveModal = document.getElementById('save-modal'); // The modal window.
    const saveBtn = document.getElementById('save-btn'); // Button to open the modal.
    const cancelBtn = document.getElementById('cancel-save'); // Button to cancel saving.
    const confirmBtn = document.getElementById('confirm-save'); // Button to confirm saving.
    const closeModal = document.querySelector('.close-modal'); // Close button inside the modal.

    // Open the modal when the "Save" button is clicked.
    saveBtn.addEventListener('click', () => {
        saveModal.style.display = 'flex'; // Show the modal.
    });

    // Function to close the modal.
    function closeModalFunc() {
        saveModal.style.display = 'none'; // Hide the modal.
    }

    // Close the modal when the "Cancel" or "X" buttons are clicked.
    cancelBtn.addEventListener('click', closeModalFunc);
    closeModal.addEventListener('click', closeModalFunc);

    // Confirm saving (for now, just close the modal).
    confirmBtn.addEventListener('click', () => {
        closeModalFunc(); // Call the function to close the modal.
    });

    // **Range Input and Number Input Synchronization**
    // Get references to the range slider and number input for password length.
    const rangeInput = document.getElementById('password-range'); // Range slider.
    const numberInput = document.getElementById('password-length'); // Number input field.

    // Sync the range slider and number input.
    rangeInput.addEventListener('input', () => {
        numberInput.value = rangeInput.value; // Update the number input when the slider changes.
    });

    numberInput.addEventListener('input', () => {
        const value = parseInt(numberInput.value); // Get the number input value as a number.
        if (value >= 8 && value <= 32) { // Ensure the value is within the allowed range.
            rangeInput.value = value; // Update the slider when the number input changes.
        }
    });

    // **Handle Clicks on Disabled Features**
    // Get all elements with the "disabled" class (features not available in the free version).
    const disabledElements = document.querySelectorAll('.disabled');

    // Add click event listeners to these elements.
    disabledElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from affecting other elements.

            // Create a tooltip to inform the user about the PRO requirement.
            const tooltip = document.createElement('div'); // Create a new div for the tooltip.
            tooltip.className = 'pro-tooltip'; // Add a class for styling.
            tooltip.textContent = 'This feature requires BeanoGuard PRO'; // Set the tooltip text.
            
            // Style the tooltip.
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '1000';
            tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

            // Position the tooltip near the clicked element.
            tooltip.style.left = `${e.pageX}px`;
            tooltip.style.top = `${e.pageY + 20}px`;

            // Add the tooltip to the page.
            document.body.appendChild(tooltip);

            // Remove the tooltip after 2 seconds.
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        });
    });

    // **Empty State Button**
    // Get the button that appears when there are no saved passwords.
    const generateFromEmpty = document.getElementById('generate-from-empty');

    // If the button exists, add a click event listener.
    if (generateFromEmpty) {
        generateFromEmpty.addEventListener('click', () => {
            // Switch to the password generator tab.
            tabButtons.forEach(btn => btn.classList.remove('active')); // Remove "active" from all tabs.
            tabContents.forEach(content => content.style.display = 'none'); // Hide all tab contents.

            // Activate the generator tab.
            const generatorBtn = document.querySelector('[data-tab="generator"]');
            generatorBtn.classList.add('active'); // Add "active" to the generator tab.
            document.getElementById('generator-tab').style.display = 'block'; // Show the generator tab content.
        });
    }

    // **Simulate Password Strength Meter**
    // Get references to the strength meter and its label.
    const strengthMeter = document.getElementById('strength-meter'); // Progress bar for strength.
    const strengthText = document.getElementById('strength-text'); // Text description of strength.

    // Function to update the password strength meter.
    function updateStrengthMeter(password) {
        const length = password ? password.length : 0; // Get the length of the password.
        let strength = 0; // Initialize the strength percentage.
        let strengthLabel = ''; // Initialize the strength label.

        // Determine the strength based on password length.
        if (length === 0) {
            strength = 0;
            strengthLabel = 'None';
            strengthMeter.style.backgroundColor = '#e0e0e0'; // Gray color for no password.
        } else if (length < 10) {
            strength = 25;
            strengthLabel = 'Weak';
            strengthMeter.style.backgroundColor = '#f44336'; // Red color for weak passwords.
        } else if (length < 12) {
            strength = 50;
            strengthLabel = 'Medium';
            strengthMeter.style.backgroundColor = '#ff9800'; // Orange color for medium passwords.
        } else if (length < 14) {
            strength = 75;
            strengthLabel = 'Strong';
            strengthMeter.style.backgroundColor = '#4CAF50'; // Green color for strong passwords.
        } else {
            strength = 100;
            strengthLabel = 'Very Strong';
            strengthMeter.style.backgroundColor = '#2E7D32'; // Dark green for very strong passwords.
        }

        // Update the strength meter and label.
        strengthMeter.style.width = `${strength}%`;
        strengthText.textContent = strengthLabel;
    }

    // **Copy Button Functionality**
    // Get references to the copy button and password input field.
    const copyBtn = document.getElementById('copy-btn'); // Copy button.
    const passwordInput = document.getElementById('password-input'); // Password input field.

    // Add a click event listener to the copy button.
    copyBtn.addEventListener('click', () => {
        if (passwordInput.value) { // Check if there is a password to copy.
            passwordInput.select(); // Select the password text.
            document.execCommand('copy'); // Copy the selected text to the clipboard.

            // Show a visual feedback that the password was copied.
            const originalInnerHTML = copyBtn.innerHTML; // Save the original button text.
            copyBtn.innerHTML = '✓'; // Change the button text to a checkmark.
            copyBtn.style.color = '#4CAF50'; // Change the button color to green.

            // Reset the button after 1.5 seconds.
            setTimeout(() => {
                copyBtn.innerHTML = originalInnerHTML; // Restore the original button text.
                copyBtn.style.color = ''; // Reset the button color.
            }, 1500);
        }
    });

    // **Initialize the Strength Meter**
    // Call the strength meter function with an empty password to start.
    updateStrengthMeter('');

    // **Enable Password Strength Updates**
    // Get the "Generate Password" button.
    const generateBtn = document.getElementById('generate-btn');

    // Add a click event listener to update the strength meter after generating a password.
    generateBtn.addEventListener('click', () => {
        setTimeout(() => {
            updateStrengthMeter(passwordInput.value); // Update the strength meter with the generated password.
        }, 100); // Delay slightly to ensure the password is generated first.
    });

    // **Show Empty State or Password List**
    // Function to update the visibility of the empty state message.
    function updatePasswordListVisibility() {
        const passwordList = document.getElementById('password-list'); // List of saved passwords.
        const emptyState = document.getElementById('empty-passwords'); // Empty state message.

        // If there are saved passwords, hide the empty state message.
        if (passwordList.children.length > 0) {
            if (emptyState) emptyState.style.display = 'none';
        } else {
            // If there are no saved passwords, show the empty state message.
            if (emptyState) emptyState.style.display = 'block';
        }
    }

    // Call the function to initialize the visibility.
    updatePasswordListVisibility();

    // **Export Functions to Window**
    // Make some functions accessible to other scripts (e.g., `script.js`).
    window.beanoGuardUI = {
        updateStrengthMeter, // Function to update the password strength meter.
        updatePasswordListVisibility, // Function to update the visibility of the empty state.
        closeModal: closeModalFunc // Function to close the modal.
    };
});