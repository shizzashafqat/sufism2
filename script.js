document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECT ALL ELEMENTS AT THE TOP
    const enterBtn = document.getElementById('enter-btn');
    const landingScreen = document.getElementById('landing-screen');
    const shrineSection = document.getElementById('shrine-section');
    const modernSection = document.getElementById('modern-section');
    const analysisSection = document.getElementById('analysis-section');

    const modernBg = document.getElementById('modern-bg');
    const analysisBg = document.getElementById('analysis-bg');

    const landingAudio = document.getElementById('ambient-audio');
    const shrineAudio = document.getElementById('shrine-audio');

    const fadeElements = document.querySelectorAll('.fade-in-element');

    // 🔹 RITUAL MODAL ELEMENTS
    const ritualItems = document.querySelectorAll('.ritual-item');
    const ritualModal = document.getElementById('ritual-modal');
    const modalIconDisplay = document.getElementById('modal-icon-display');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeModalBtn = document.querySelector('.close-modal');

    // 🔹 CONTENT FOR EACH RITUAL
    const ritualContent = {
        thread: {
            icon: '🧵',
            title: 'Mannat (Sacred Thread)',
            text: 'Visitors tie threads to the shrine\'s grills or trees when making a mannat — a heartfelt prayer or vow. When the wish is fulfilled, they often return to untie the thread in gratitude.'
        },
        langar: {
            icon: '🍚',
            title: 'Langar (Sacred Meal)',
            text: 'Langar is the shared meal cooked and distributed at shrines. It symbolizes equality, community care, and the belief that blessings are multiplied when food is shared.'
        },
        rose: {
            icon: '🌹',
            title: 'Flower Offering',
            text: 'Rose petals and garlands are placed on the saint’s tomb as a sign of love and respect. The fragrance and colors create an atmosphere of beauty and devotion.'
        }
    };

    // 2. ENTER BUTTON LOGIC
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Play landing audio
            if (landingAudio) {
                landingAudio.volume = 0.5;
                landingAudio.play().catch(e => console.log("Audio play failed:", e));
            }

            // Visual Transition
            if (landingScreen) landingScreen.classList.add('fade-out');

            // Wait 1.5s then switch
            setTimeout(() => {
                if (landingScreen) landingScreen.style.display = 'none';

                if (shrineSection) {
                    shrineSection.classList.remove('hidden');
                    shrineSection.scrollIntoView({ behavior: 'smooth' });
                }

                if (modernSection) {
                    modernSection.classList.remove('hidden');
                }

                if (analysisSection) {
                    analysisSection.classList.remove('hidden');
                }

                if (landingAudio) fadeAudioOut(landingAudio);

                if (shrineAudio) {
                    shrineAudio.volume = 0.6;
                    shrineAudio.play().catch(e => console.log("Shrine audio failed:", e));
                }

            }, 1500);
        });
    }

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
                const id = entry.target.id;

                if (id === 'modern-section') {
                    if (modernBg) modernBg.classList.add('bg-active');
                    if (analysisBg) analysisBg.classList.remove('bg-active');
                    if (shrineAudio) fadeAudio(shrineAudio, 0);
                } else if (id === 'analysis-section') {
                    if (analysisBg) analysisBg.classList.add('bg-active');
                    // Optional: fade shrineAudio back in a bit
                    // if (shrineAudio) fadeAudio(shrineAudio, 0.3);
                }
            } else {
                if (entry.target.id === 'modern-section' && entry.boundingClientRect.top > 0) {
                    if (modernBg) modernBg.classList.remove('bg-active');
                    if (shrineAudio) {
                        shrineAudio.play().catch(() => {});
                        fadeAudio(shrineAudio, 0.6);
                    }
                }
            }
        });
    }, { threshold: 0.1 });

    if (modernSection) sceneObserver.observe(modernSection);
    if (analysisSection) sceneObserver.observe(analysisSection);

    // 🔹 5. RITUAL ICON CLICK LOGIC (FIX)
    ritualItems.forEach(item => {
        item.addEventListener('click', () => {
            const key = item.dataset.ritual;
            const data = ritualContent[key];

            if (!data || !ritualModal) return;

            // Fill modal content
            if (modalIconDisplay) modalIconDisplay.textContent = data.icon;
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalText) modalText.textContent = data.text;

            // Show modal
            ritualModal.classList.remove('hidden');
        });
    });

    // Close modal (X button)
    if (closeModalBtn && ritualModal) {
        closeModalBtn.addEventListener('click', () => {
            ritualModal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside content
    if (ritualModal) {
        ritualModal.addEventListener('click', (e) => {
            if (e.target === ritualModal) {
                ritualModal.classList.add('hidden');
            }
        });
    }
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

function onPlayerReady(event) {
    setupVideoObserver();
}

function setupVideoObserver() {
    const video1 = document.getElementById('youtube-player');
    const video2 = document.getElementById('modern-player');
    const shrineAudio = document.getElementById('shrine-audio');

    createVideoObserver(video1, player1, shrineAudio);
    createVideoObserver(video2, player2, shrineAudio);
}

function createVideoObserver(element, ytPlayer, bgAudio) {
    if (!element) return;

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

function fadeAudio(audio, targetVolume) {
    if (!audio) return;
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

function fadeAudioOut(audio) {
    if (!audio) return;
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

