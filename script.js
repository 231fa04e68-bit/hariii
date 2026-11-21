// Page navigation
const openingPage = document.getElementById('opening-page');
const cakePage = document.getElementById('cake-page');
const wishesPage = document.getElementById('wishes-page');
const galleryPage = document.getElementById('gallery-page');

const startBtn = document.getElementById('start-btn');
const galleryBtn = document.getElementById('gallery-btn');
const cake = document.getElementById('cake');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNumber = document.getElementById('countdown-number');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');

// Page history for back button navigation
let pageHistory = ['opening'];

// Function to switch pages
function switchPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    setTimeout(() => {
        toPage.classList.add('active');
        // Add to history
        const toPageId = toPage.id.replace('-page', '');
        if (pageHistory[pageHistory.length - 1] !== toPageId) {
            pageHistory.push(toPageId);
            // Push to browser history
            history.pushState({ page: toPageId }, '', `#${toPageId}`);
        }
    }, 100);
}

// Handle browser back button
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        const targetPage = event.state.page;
        pageHistory.pop();
        
        // Hide all pages
        [openingPage, cakePage, wishesPage, galleryPage].forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        switch(targetPage) {
            case 'opening':
                openingPage.classList.add('active');
                break;
            case 'cake':
                cakePage.classList.add('active');
                break;
            case 'wishes':
                wishesPage.classList.add('active');
                break;
            case 'gallery':
                galleryPage.classList.add('active');
                break;
        }
    }
});

// Initialize history on load
history.replaceState({ page: 'opening' }, '', '#opening');

let cakeCutProgress = 0;
const requiredCuts = 5;

// Start button - triggers countdown
startBtn.addEventListener('click', () => {
    startCountdown();
});

// Countdown function
function startCountdown() {
    let count = 3;
    countdownOverlay.classList.add('active');
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            // Re-trigger animation
            countdownNumber.style.animation = 'none';
            countdownNumber.offsetHeight; // Trigger reflow
            countdownNumber.style.animation = 'countPulse 1s ease-in-out';
        } else {
            clearInterval(countdownInterval);
            countdownOverlay.classList.remove('active');
            setTimeout(() => {
                switchPage(openingPage, cakePage);
            }, 500);
        }
    }, 1000);
}

// Cake cutting interaction
cake.addEventListener('click', (e) => {
    cakeCutProgress++;
    
    // Add cutting effect
    cake.classList.add('cutting');
    setTimeout(() => {
        cake.classList.remove('cutting');
    }, 500);
    
    // Create sparkle effect at click position
    createSparkle(e.clientX, e.clientY);
    
    // Check if enough cuts have been made
    if (cakeCutProgress >= requiredCuts) {
        setTimeout(() => {
            switchPage(cakePage, wishesPage);
            cakeCutProgress = 0; // Reset for future use
        }, 800);
    }
});

// Also support mousemove for cake cutting
let isCutting = false;
cake.addEventListener('mousedown', () => {
    isCutting = true;
});

cake.addEventListener('mouseup', () => {
    isCutting = false;
});

cake.addEventListener('mouseleave', () => {
    isCutting = false;
});

cake.addEventListener('mousemove', (e) => {
    if (isCutting) {
        createSparkle(e.clientX, e.clientY);
    }
});

// Create sparkle effect
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '20px';
    sparkle.style.height = '20px';
    sparkle.style.background = 'radial-gradient(circle, #ffd700 0%, transparent 70%)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Gallery button - goes to gallery page
galleryBtn.addEventListener('click', () => {
    switchPage(wishesPage, galleryPage);
});

// Add confetti effect on wishes page
function createConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff6b6b', '#ffb6c1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
`;
document.head.appendChild(confettiStyle);

// Trigger confetti when wishes page loads
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'wishes-page' && mutation.target.classList.contains('active')) {
            setTimeout(createConfetti, 500);
        }
    });
});

observer.observe(wishesPage, { attributes: true, attributeFilter: ['class'] });

// Add touch support for mobile
cake.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isCutting = true;
});

cake.addEventListener('touchend', () => {
    isCutting = false;
});

cake.addEventListener('touchmove', (e) => {
    if (isCutting) {
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY);
    }
});

cake.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    cakeCutProgress++;
    createSparkle(touch.clientX, touch.clientY);
    
    if (cakeCutProgress >= requiredCuts) {
        setTimeout(() => {
            switchPage(cakePage, wishesPage);
            cakeCutProgress = 0;
        }, 800);
    }
});

// Music button functionality
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
        isPlaying = true;
    }
});

// Gallery Carousel functionality
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('carousel-dots');
let currentSlide = 0;
const totalSlides = slides.length;

// Set first slide as active
if (slides.length > 0) {
    slides[0].classList.add('active');
}

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

const videoBtn = document.getElementById('video-btn');
const videoOverlay = document.getElementById('video-overlay');
const memoryVideo = document.getElementById('memory-video');
const closeVideoBtn = document.getElementById('close-video');
const videoHint = document.getElementById('video-hint');

function showVideoHint() {
    videoHint.hidden = false;
    memoryVideo.classList.add('missing');
}

memoryVideo.addEventListener('error', showVideoHint);

async function openMemoryVideo() {
    videoOverlay.classList.add('active');
    videoOverlay.setAttribute('aria-hidden', 'false');
    try {
        if (videoOverlay.requestFullscreen) {
            await videoOverlay.requestFullscreen();
        } else if (videoOverlay.webkitRequestFullscreen) {
            videoOverlay.webkitRequestFullscreen();
        }
    } catch (err) {
        // The overlay still covers the screen if fullscreen is blocked.
    }
    try {
        await memoryVideo.play();
    } catch (err) {
        // Playback waits until the file is in the folder.
    }
}

function closeMemoryVideo() {
    memoryVideo.pause();
    videoOverlay.classList.remove('active');
    videoOverlay.setAttribute('aria-hidden', 'true');
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(() => {});
    }
}

videoBtn.addEventListener('click', openMemoryVideo);
closeVideoBtn.addEventListener('click', closeMemoryVideo);

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && videoOverlay.classList.contains('active')) {
        closeMemoryVideo();
    }
});

// Touch support for carousel
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        goToSlide(currentSlide + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        goToSlide(currentSlide - 1);
    }
}
