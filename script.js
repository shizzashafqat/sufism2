document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ALL ELEMENTS AT THE TOP
    const enterBtn = document.getElementById('enter-btn');
    const landingScreen = document.getElementById('landing-screen');
    const shrineSection = document.getElementById('shrine-section');
    const modernSection = document.getElementById('modern-section');
    
    const modernBg = document.getElementById('modern-bg');
    
    const landingAudio = document.getElementById('ambient-audio');
    const shrineAudio = document.getElementById('shrine-audio');
    
    const fadeElements = document.querySelectorAll('.fade-in-element');

    // 2. ENTER BUTTON LOGIC
    enterBtn.addEventListener('click', () => {
        // Play landing audio if not playing
        landingAudio.volume = 0.5;
        landingAudio.play().catch(e => console.log("Audio play failed:", e));

        // Visual Transition
        landingScreen.classList.add('fade-out');

        // Delay for transition (1.5s)
        setTimeout(() => {
            landingScreen.style.display = 'none';
            shrineSection.classList.remove('hidden');
            shrineSection.scrollIntoView({ behavior: 'smooth' });

            // Audio Switch: Fade out Landing, Start Shrine
            fadeAudioOut(landingAudio); // Helper function defined below
            
            shrineAudio.volume = 0.6;
            shrineAudio.play().catch(e => console.log("Shrine audio failed:", e));

        }, 1500); 
    });

    // 3. SCROLL OBSERVER (Text Fading)
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 4. SCENE OBSERVER (Background & Audio Switch)
    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If we scroll into the MODERN section
                if (entry.target.id === 'modern-section') {
                    // Show Modern BG
                    if(modernBg) modernBg.classList.add('bg-active');
                    // Fade Out Shrine Audio
                    fadeAudio(shrineAudio, 0); 
                }
            } else {
                // If we leave the MODERN section (scrolling UP back to shrine)
                if (entry.target.id === 'modern-section' && entry.boundingClientRect.top > 0) {
                    if(modernBg) modernBg.classList.remove('bg-active');
                    shrineAudio.play();
                    fadeAudio(shrineAudio, 0.6); // Restore volume
                }
            }
        });
    }, { threshold: 0.1 }); // Trigger as soon as 10% is visible

    if(modernSection) sceneObserver.observe(modernSection);
});

// ==========================================
// YOUTUBE API (GLOBAL SCOPE)
// ==========================================

var player1; // Shrine
var player2; // Modern

// 1. Load YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Initialize Players
function onYouTubeIframeAPIReady() {
    player1 = new YT.Player('youtube-player', {
        events: { 'onReady': onPlayerReady }
    });
    
    player2 = new YT.Player('modern-player', {
        events: { 'onReady': onPlayerReady }
    });
}

// 3. Set up Observers when API is ready
function onPlayerReady(event) {
    setupVideoObserver();
}

function setupVideoObserver() {
    const video1 = document.getElementById('youtube-player');
    const video2 = document.getElementById('modern-player');
    const shrineAudio = document.getElementById('shrine-audio');
    
    // Observer for Shrine Video
    createVideoObserver(video1, player1, shrineAudio);

    // Observer for Modern Video
    createVideoObserver(video2, player2, shrineAudio); 
}

function createVideoObserver(element, ytPlayer, bgAudio) {
    if(!element) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
                if (bgAudio) fadeAudio(bgAudio, 0);
            } else {
                if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(element);
}

// --- HELPER FUNCTIONS ---

// Fade to specific volume
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

// Specific helper to fade out completely and pause
function fadeAudioOut(audio) {
    let vol = audio.volume;
    const fadeOutInterval = setInterval(() => {
        if (vol > 0.1) {
            vol -= 0.1;
            audio.volume = vol;
        } else {
            clearInterval(fadeOutInterval);
            audio.pause(); 
            audio.currentTime = 0; 
        }
    }, 100);
}
