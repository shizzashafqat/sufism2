document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    const landingScreen = document.getElementById('landing-screen');
    const shrineSection = document.getElementById('shrine-section');
    const audio = document.getElementById('ambient-audio');

enterBtn.addEventListener('click', () => {
        // 1. Initialize Audio Elements
        const landingAudio = document.getElementById('ambient-audio');
        const shrineAudio = document.getElementById('shrine-audio');

        // Start landing audio (if it wasn't already playing)
        landingAudio.volume = 0.5;
        landingAudio.play().catch(e => console.log("Audio play failed:", e));

        // 2. Visual Transition
        landingScreen.classList.add('fade-out');

        // 3. WAIT 1.5 seconds (matches the CSS animation time)
        setTimeout(() => {
            // Hide Landing, Show Shrine
            landingScreen.style.display = 'none';
            shrineSection.classList.remove('hidden');
            shrineSection.scrollIntoView({ behavior: 'smooth' });

            // --- THE AUDIO SWITCH ---
            
            // Fade out the Wind/Bells (Landing Audio)
            let vol = 0.5;
            const fadeOutInterval = setInterval(() => {
                if (vol > 0.1) {
                    vol -= 0.1;
                    landingAudio.volume = vol;
                } else {
                    clearInterval(fadeOutInterval);
                    landingAudio.pause(); // Stop it completely
                    landingAudio.currentTime = 0; // Reset for next time
                }
            }, 100); // Reduce volume every 100ms

            // Start the Shrine Audio (Clapping/Ambience)
            shrineAudio.volume = 0.6; // Set comfortable volume
            shrineAudio.play().catch(e => console.log("Shrine audio failed:", e));

        }, 1500); 
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
