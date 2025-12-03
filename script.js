document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    const landingScreen = document.getElementById('landing-screen');
    const shrineSection = document.getElementById('shrine-section');
    
    // --- ENTER BUTTON LOGIC ---
    enterBtn.addEventListener('click', () => {
        const landingAudio = document.getElementById('ambient-audio');
        const shrineAudio = document.getElementById('shrine-audio');

        // Start landing audio
        landingAudio.volume = 0.5;
        landingAudio.play().catch(e => console.log("Audio play failed:", e));

        // Visual Transition
        landingScreen.classList.add('fade-out');

        // WAIT 1.5 seconds
        setTimeout(() => {
            landingScreen.style.display = 'none';
            shrineSection.classList.remove('hidden');
            shrineSection.scrollIntoView({ behavior: 'smooth' });

            // --- AUDIO SWITCH ---
            let vol = 0.5;
            const fadeOutInterval = setInterval(() => {
                if (vol > 0.1) {
                    vol -= 0.1;
                    landingAudio.volume = vol;
                } else {
                    clearInterval(fadeOutInterval);
                    landingAudio.pause(); 
                    landingAudio.currentTime = 0; 
                }
            }, 100);

            shrineAudio.volume = 0.6; 
            shrineAudio.play().catch(e => console.log("Shrine audio failed:", e));

        }, 1500); 
    });

    // --- SCROLL ANIMATION OBSERVER ---
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(el => observer.observe(el));
});

// ==========================================
// YOUTUBE API (MUST BE OUTSIDE DOMContentLoaded)
// ==========================================

var player; // Global variable

// 1. Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
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
            if (entry.isIntersecting) {
                // Video In View: Play Video, Fade Audio
                if (player && player.playVideo) {
                    player.playVideo();
                }
                fadeAudio(shrineAudio, 0); 
            } else {
                // Video Out of View: Pause Video, Restore Audio
                if (player && player.pauseVideo) {
                    player.pauseVideo();
                }
                if(shrineAudio) {
                    shrineAudio.play();
                    fadeAudio(shrineAudio, 0.6); 
                }
            }
        });
    }, { threshold: 0.5 });

    observer.observe(videoElement);
}

// Helper function to fade audio smoothly
function fadeAudio(audio, targetVolume) {
    if(!audio) return;
    const step = 0.05;
    const interval = 50; 
    
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
