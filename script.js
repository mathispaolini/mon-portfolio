// --- 1. SÉCURITÉ ---
const SITE_LOCKED = true; 
const PASSWORD_HASH = "028b569b20e6d5a166657def82c41d87948efd97ac00820fc55b6103b65adf70";

const overlay = document.getElementById("login-overlay");
if (SITE_LOCKED && sessionStorage.getItem("auth") !== "true") {
    overlay.style.display = "flex";
}

async function checkPassword() {
    const input = document.getElementById("passwordInput").value;
    const errorMsg = document.getElementById("errorMsg");
    // Hachage simple pour démo
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === PASSWORD_HASH) {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.style.display = "none", 800);
        sessionStorage.setItem("auth", "true");
    } else {
        errorMsg.style.display = "block";
        document.querySelector('.login-box').classList.add("shake");
        setTimeout(() => document.querySelector('.login-box').classList.remove("shake"), 500);
    }
}

// --- 2. CURSEUR HACKER (Le Script Magique) ---
const cursor = document.querySelector('.cursor');
const cursor2 = document.querySelector('.cursor2');

document.addEventListener('mousemove', function(e){
    cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
});

// Effet "Magnétique" sur les liens
const targets = document.querySelectorAll('.hover-target, a, button, .card');
targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursor2.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
        cursor2.classList.remove('cursor-hover');
    });
});

// --- 3. TYPING EFFECT ---
const textElement = document.getElementById('typing-text');
const phrases = ["Technicien SIO", "Admin Réseaux", "Cyber-Défenseur"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}
document.addEventListener('DOMContentLoaded', type);

// --- 4. TILT 3D ---
try {
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
    });
} catch(e) {}

// --- 5. SCROLL ANIMATION ---
window.addEventListener('scroll', reveal);
function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for(var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        if(revealTop < windowHeight - 100) {
            reveals[i].classList.add('active');
        }
    }
}
reveal();

// --- 6. PARTICLES ---
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#3b82f6';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.01; // Fade out
        if (this.size <= 0.2 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 50; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance/100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
