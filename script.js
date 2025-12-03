document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    const landingScreen = document.getElementById('landing-screen');
    const shrineSection = document.getElementById('shrine-section');
    const audio = document.getElementById('ambient-audio');

    enterBtn.addEventListener('click', () => {
        // 1. Start the audio (User interaction allows this)
        // Ensure you have an audio file, or comment this out to test without sound
        audio.volume = 0.5; // Set volume to 50%
        audio.play().catch(error => console.log("Audio play failed:", error));

        // 2. Fade out the landing screen
        landingScreen.classList.add('fade-out');

        // 3. Wait for the CSS transition (1.5s) to finish, then remove landing
        setTimeout(() => {
            landingScreen.style.display = 'none';
            
            // 4. Reveal the next section (The Shrine)
            shrineSection.classList.remove('hidden');
            
            // Optional: Smooth scroll into the shrine view
            shrineSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500); // 1500ms matches the CSS transition time
    });
    // --- SCROLL ANIMATION OBSERVER ---
const observerOptions = {
    threshold: 0.2 // Trigger when 20% of the item is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add a class to animate
        }
    });
}, observerOptions);

// Select all elements meant to fade in
const fadeElements = document.querySelectorAll('.fade-in-element');
fadeElements.forEach(el => observer.observe(el));
});
