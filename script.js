// --- 1. CONFIGURATION SÉCURISÉE ---
const SITE_LOCKED = true; // ACTIVÉ
const PASSWORD_HASH = "028b569b20e6d5a166657def82c41d87948efd97ac00820fc55b6103b65adf70";

// --- GESTION DU VERROUILLAGE ---
const overlay = document.getElementById("login-overlay");
if (SITE_LOCKED && sessionStorage.getItem("auth") !== "true") {
    // Force l'affichage pour éviter le bug visuel
    overlay.style.display = "flex";
}

// --- HACHAGE ---
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- VERIFICATION MDP ---
async function checkPassword() {
    const input = document.getElementById("passwordInput").value;
    const errorMsg = document.getElementById("errorMsg");
    const overlay = document.getElementById("login-overlay");
    const inputHash = await sha256(input);

    if (inputHash === PASSWORD_HASH) {
        overlay.classList.add("hidden-overlay");
        setTimeout(() => { overlay.style.display = "none"; }, 800);
        sessionStorage.setItem("auth", "true");
    } else {
        errorMsg.style.display = "block";
        document.querySelector('.login-box').classList.add("shake");
        setTimeout(() => document.querySelector('.login-box').classList.remove("shake"), 500);
    }
}

// --- CHARGEMENT ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('loaded');
    setTimeout(() => { preloader.style.display = 'none'; }, 500);

    const pwInput = document.getElementById("passwordInput");
    if(pwInput){
        pwInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") { checkPassword(); }
        });
    }
});

// --- FORMULAIRE AJAX ---
const contactForm = document.getElementById("contact-form");
if(contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const status = document.getElementById("form-status");
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.innerHTML = '<div class="success-msg-form"><i class="fas fa-check-circle"></i> Merci ! Votre message a été envoyé avec succès.</div>';
                contactForm.reset();
            } else {
                status.innerHTML = '<div class="error-msg-form"><i class="fas fa-exclamation-triangle"></i> Oups ! Une erreur est survenue.</div>';
            }
        } catch (error) {
            status.innerHTML = '<div class="error-msg-form"><i class="fas fa-exclamation-triangle"></i> Oups ! Vérifiez votre connexion.</div>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }
    });
}

// DATE DYNAMIQUE
document.getElementById("year").textContent = new Date().getFullYear();

// --- SCROLL, NAV & UI ---
const header = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";

    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) { 
        header.classList.add('scrolled'); backToTop.classList.add('show'); 
    } else { 
        header.classList.remove('scrolled'); backToTop.classList.remove('show'); 
    }
    
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) { current = section.getAttribute("id"); }
    });
    navLinks.forEach(link => {
        link.classList.remove("active-link");
        if (link.getAttribute("href").includes(current)) { link.classList.add("active-link"); }
    });
    reveal();
};

backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

// MENU MOBILE
menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('active');
    menuToggle.innerHTML = navUl.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

const navLinksMobile = document.querySelectorAll('.nav-link');
navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for(var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        if(revealTop < windowHeight - 100) reveals[i].classList.add('active');
    }
}
reveal();

const textElement = document.getElementById('typing-text');
const phrases = ["Technicien SIO", "Admin Réseaux", "Passionné IT"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) { textElement.textContent = currentPhrase.substring(0, charIndex - 1); charIndex--; } 
    else { textElement.textContent = currentPhrase.substring(0, charIndex + 1); charIndex++; }
    if (!isDeleting && charIndex === currentPhrase.length) { isDeleting = true; setTimeout(type, 2000); } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(type, 500); } 
    else { setTimeout(type, isDeleting ? 50 : 100); }
}
document.addEventListener('DOMContentLoaded', type);

// EFFET SOURIS SUR CARTES
const addMouseEffect = (containerId) => {
     const container = document.getElementById(containerId);
     if(container){
        container.onmousemove = e => {
            for(const card of container.getElementsByClassName("card")) {
                const rect = card.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`); card.style.setProperty("--mouse-y", `${y}px`);
            }
        };
     }
}
addMouseEffect("cards-container"); addMouseEffect("cards-container-profil"); addMouseEffect("cards-container-docs"); addMouseEffect("cards-container-veille");

// MODAL MENTIONS LEGALES
const modal = document.getElementById("legal-modal");
const btn = document.getElementById("open-legal");
const span = document.getElementsByClassName("close-modal")[0];
btn.onclick = function() { modal.style.display = "block"; }
span.onclick = function() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }

// PARTICLES (FOND BLEU)
const canvas = document.getElementById('canvas1'); const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let particlesArray; let mouse = { x: null, y: null, radius: (canvas.height/80) * (canvas.width/80) }
window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        if (window.innerWidth > 768) {
            let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }
        }
        this.x += this.directionX; this.y += this.directionY; this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    if (window.innerWidth < 768) { numberOfParticles = (canvas.height * canvas.width) / 25000; }
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; let directionY = (Math.random() * 2) - 1;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, '#3b82f6'));
    }
}

function animate() {
    requestAnimationFrame(animate); ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); } connect();
}

function connect() {
    if (window.innerWidth < 768) return; 
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                let opacityValue = 1 - (distance/20000); 
                let color = particlesArray[a].color === '#00ff00' ? '0, 255, 0' : '59, 130, 246';
                ctx.strokeStyle = 'rgba(' + color + ',' + opacityValue + ')'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
            }
        }
    }
}
window.addEventListener('resize', function() { canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = ((canvas.height/80) * (canvas.height/80)); init(); });
window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });
init(); animate();

// KONAMI CODE
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiCursor = 0;
document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiCursor]) {
        konamiCursor++;
        if (konamiCursor === konamiCode.length) { activateMatrixMode(); konamiCursor = 0; }
    } else { konamiCursor = 0; }
});
function activateMatrixMode() {
    alert("ACCESS GRANTED : MATRIX MODE ACTIVATED 🐰🕳️");
    document.documentElement.style.setProperty('--primary', '#00ff00');
    document.documentElement.style.setProperty('--secondary', '#003300');
    document.documentElement.style.setProperty('--text-muted', '#00cc00');
    document.documentElement.style.setProperty('--bg-dark', '#000000');
    document.documentElement.style.setProperty('--card-glass', 'rgba(0, 50, 0, 0.8)');
    document.body.style.fontFamily = "'Courier New', monospace";
    particlesArray.forEach(p => p.color = '#00ff00');
}
