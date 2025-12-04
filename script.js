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
        // --- SCENE SWITCHER (Backgrounds & Audio) ---
    const shrineSection = document.getElementById('shrine-section');
    const modernSection = document.getElementById('modern-section');
    const shrineBg = document.getElementById('shrine-bg');
    const modernBg = document.getElementById('modern-bg');
    const shrineAudio = document.getElementById('shrine-audio');

    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If we scroll into the MODERN section
                if (entry.target.id === 'modern-section') {
                    // 1. Show Modern BG
                    modernBg.classList.add('bg-active');
                    // 2. Hide Shrine BG (Optional, or just cover it)
                    // 3. Fade Out Shrine Audio
                    fadeAudio(shrineAudio, 0); 
                }
            } else {
                // If we leave the MODERN section (scrolling UP back to shrine)
                if (entry.target.id === 'modern-section' && entry.boundingClientRect.top > 0) {
                    modernBg.classList.remove('bg-active');
                    shrineAudio.play();
                    fadeAudio(shrineAudio, 0.6);
                }
            }
        });
    }, { threshold: 0.1 }); // Trigger as soon as 10% of the section is visible

    sceneObserver.observe(modernSection);
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

// Updated YouTube Logic

var player1; // Shrine
var player2; // Modern

function onYouTubeIframeAPIReady() {
    // Player 1 (Shrine)
    player1 = new YT.Player('youtube-player', {
        events: { 'onReady': onPlayerReady }
    });
    
    // Player 2 (Modern)
    player2 = new YT.Player('modern-player', {
        events: { 'onReady': onPlayerReady }
    });
}

function setupVideoObserver() {
    // Observer for Shrine Video
    const video1 = document.getElementById('youtube-player');
    const shrineAudio = document.getElementById('shrine-audio');
    
    // Create specific observer for Video 1 (Shrine)
    createVideoObserver(video1, player1, shrineAudio);

    // Observer for Modern Video
    const video2 = document.getElementById('modern-player');
    // We pass 'null' for audio because we don't have a specific modern ambience track to pause yet
    // Or you can pass shrineAudio to ensure it stays off.
    createVideoObserver(video2, player2, shrineAudio); 
}

function createVideoObserver(element, ytPlayer, bgAudio) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
                if (bgAudio) fadeAudio(bgAudio, 0);
            } else {
                if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
                // Only fade audio back in if we are NOT in the modern section (this logic can get complex)
                // For simplicity, we just pause the video.
            }
        });
    }, { threshold: 0.5 });
    observer.observe(element);
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
