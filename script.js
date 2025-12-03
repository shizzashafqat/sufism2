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

// --- YOUTUBE AUTOPLAY ON SCROLL ---

// 1. Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 3. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    setupVideoObserver();
}

function setupVideoObserver() {
    const videoElement = document.getElementById('youtube-player');
    const shrineAudio = document.getElementById('shrine-audio');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // IF VIDEO IS IN VIEW
            if (entry.isIntersecting) {
                // Play Video
                if (player && player.playVideo) {
                    player.playVideo();
                }
                
                // Fade out background audio so it doesn't clash
                fadeAudio(shrineAudio, 0); 
            } 
            // IF VIDEO IS OUT OF VIEW
            else {
                // Pause Video
                if (player && player.pauseVideo) {
                    player.pauseVideo();
                }

                // Fade background audio back in
                shrineAudio.play(); // Ensure it's playing
                fadeAudio(shrineAudio, 0.6); // Restore volume
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the video is visible

    observer.observe(videoElement);
}

// Helper function to fade audio smoothly
function fadeAudio(audio, targetVolume) {
    const step = 0.05;
    const interval = 50; // ms
    
    // Clear any existing fade interval to prevent conflicts
    if (audio.fadeInterval) clearInterval(audio.fadeInterval);

    audio.fadeInterval = setInterval(() => {
        let currentVol = audio.volume;
        
        if (Math.abs(currentVol - targetVolume) < step) {
            audio.volume = targetVolume;
            clearInterval(audio.fadeInterval);
        } else if (currentVol > targetVolume) {
            audio.volume -= step;
        } else {
            audio.volume += step;
        }
    }, interval);
}
});
