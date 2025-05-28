// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Add active class on hover over interactive elements
    const interactiveElements = document.querySelectorAll('button, .dot, .prev, .next, .rotating-coin');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    // Generate Flying Coins
    const flyingCoinsContainer = document.querySelector('.flying-coins');
    generateFlyingCoins(flyingCoinsContainer, 20);
    
    // Slider functionality
    initSlider();
    
    // Beat Section audio and animations
    initBeatSection();
    
    // Mobile Wallet Chart
    initWalletChart();
    
    // Smooth scroll for navigation buttons
    initSmoothScroll();
});

// Generate Flying Coins
function generateFlyingCoins(container, count) {
    for (let i = 0; i < count; i++) {
        const coin = document.createElement('div');
        coin.classList.add('flying-coin');
        
        // Random coin styling
        const size = Math.random() * 30 + 10; // 10-40px
        const duration = Math.random() * 10 + 5; // 5-15s
        const delay = Math.random() * 5; // 0-5s
        
        // Coin SVG
        coin.innerHTML = `
            <svg viewBox="0 0 100 100" width="${size}px" height="${size}px">
                <circle cx="50" cy="50" r="45" fill="url(#goldGradient)" />
                <text x="50" y="55" text-anchor="middle" fill="#000" font-weight="bold" font-size="18">$</text>
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" />
                        <stop offset="50%" stop-color="#FFC107" />
                        <stop offset="100%" stop-color="#FFD700" />
                    </linearGradient>
                </defs>
            </svg>
        `;
        
        // Random position
        const startX = Math.random() * 100; // 0-100%
        const startY = Math.random() * 100 + 100; // 100-200%
        
        // Apply styles
        coin.style.cssText = `
            position: absolute;
            left: ${startX}%;
            top: ${startY}%;
            filter: drop-shadow(0 0 5px #FFD700);
            animation: floatCoin ${duration}s linear ${delay}s infinite;
            z-index: 1;
        `;
        
        container.appendChild(coin);
    }
    
    // Add animation keyframes for coins
    if (!document.getElementById('coin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'coin-keyframes';
        style.textContent = `
            @keyframes floatCoin {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-1000px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Slider Functionality
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Update slider position
    const updateSlider = () => {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        slides[currentSlide].classList.add('active');
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };
    
    // Set first slide as active initially
    slides[0].classList.add('active');
    
    // Event listeners for controls
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide every 8 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }, 8000);
}

// Beat Section audio and equalizer
function initBeatSection() {
    const beatSection = document.querySelector('.beat-section');
    const equalizer = document.querySelector('.equalizer');
    const audioElement = document.getElementById('beat');
    
    // Initialize audio context
    let audioContext, analyser, dataArray;
    
    // Function to start audio
    const startAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(audioElement);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 128;
            
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        audioElement.play();
        equalizer.classList.add('active');
        
        // Animate bars based on audio frequency
        const updateEqualizer = () => {
            if (!equalizer.classList.contains('active')) return;
            
            analyser.getByteFrequencyData(dataArray);
            const bars = equalizer.querySelectorAll('.bar');
            
            // Get subset of data for our bars
            const step = Math.floor(dataArray.length / bars.length);
            
            bars.forEach((bar, index) => {
                const dataIndex = index * step;
                const value = dataArray[dataIndex] / 255;
                const height = 20 + value * 80; // 20-100px
                bar.style.height = `${height}px`;
            });
            
            requestAnimationFrame(updateEqualizer);
        };
        
        updateEqualizer();
    };
    
    // Function to stop audio
    const stopAudio = () => {
        audioElement.pause();
        audioElement.currentTime = 0;
        equalizer.classList.remove('active');
    };
    
    // Mouse enter/leave events for beat section
    beatSection.addEventListener('mouseenter', startAudio);
    beatSection.addEventListener('mouseleave', stopAudio);
}

// Wallet Chart
function initWalletChart() {
    const chartContainer = document.querySelector('.wallet-chart');
    
    // Create SVG for chart
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    // Generate chart data points (rising pattern)
    const points = [];
    let price = 1000;
    for (let i = 0; i < 20; i++) {
        const increase = Math.random() * 500 + 100;
        price += increase;
        points.push({
            x: i * (100 / 19), // Spread points across 0-100%
            y: 100 - (price / 10000 * 100) // Normalize to 0-100% (inverted for SVG)
        });
    }
    
    // Create polyline element
    const polyline = document.createElementNS(svgNS, "polyline");
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
    polyline.setAttribute("points", pointsString);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#39ff14");
    polyline.setAttribute("stroke-width", "3");
    
    // Create gradient for area under line
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute("id", "chartGradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");
    
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#39ff14");
    stop1.setAttribute("stop-opacity", "0.5");
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#39ff14");
    stop2.setAttribute("stop-opacity", "0");
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    
    // Create area under the line
    const area = document.createElementNS(svgNS, "path");
    let areaPath = `M0,100 ${points.map(p => `L${p.x},${p.y}`).join(' ')} L100,100 Z`;
    area.setAttribute("d", areaPath);
    area.setAttribute("fill", "url(#chartGradient)");
    
    // Add all elements to SVG
    svg.appendChild(defs);
    svg.appendChild(area);
    svg.appendChild(polyline);
    
    // Add SVG to container
    chartContainer.appendChild(svg);
    
    // Add swipe animation to show chart growing
    const phone = document.querySelector('.phone');
    phone.addEventListener('click', () => {
        // Create animation effect of balance increasing
        const balanceAmount = document.querySelector('.balance-amount');
        const currentAmount = parseInt(balanceAmount.textContent.replace(/[^0-9]/g, ''));
        
        // Animate to a new higher number
        const targetAmount = currentAmount * 1.5;
        const duration = 1000; // 1 second
        const startTime = performance.now();
        
        const animateBalance = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(currentAmount + (targetAmount - currentAmount) * eased);
            balanceAmount.textContent = `${currentValue.toLocaleString()} $GUNIT`;
            
            if (progress < 1) {
                requestAnimationFrame(animateBalance);
            }
        };
        
        requestAnimationFrame(animateBalance);
    });
}

// Smooth Scroll for navigation
function initSmoothScroll() {
    const blingButtons = document.querySelectorAll('.bling-button');
    
    blingButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // First button scrolls to beat section, second to CTA
            const targetSection = index === 0 ? 
                document.querySelector('.beat-section') : 
                document.querySelector('.cta-section');
                
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
} 