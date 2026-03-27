// Simple JavaScript for the button
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('my-button');
    
    button.addEventListener('click', function() {
        // Navigate to the game page
        window.location.href = 'game.html';
    });
});