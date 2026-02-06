// --- CONFIGURATION ---
const SITE_LOCKED = false; 
const PASSWORD_HASH = "028b569b20e6d5a166657def82c41d87948efd97ac00820fc55b6103b65adf70";

// --- GESTION LOGIN ---
const overlay = document.getElementById("login-overlay");
if (SITE_LOCKED && sessionStorage.getItem("auth") !== "true") {
    overlay.style.display = "flex";
}
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
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
    }
}
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => preloader.style.display = 'none', 500); }, 500);
    }
});

// --- GESTION MENU MOBILE (LOGIQUE CORRIGÉE POUR LE NOUVEAU MENU) ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileTrigger = document.getElementById('mobile-trigger');
    const mobileMenu = document.getElementById('mobile-fullscreen-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const icon = mobileTrigger ? mobileTrigger.querySelector('i') : null;

    if (mobileTrigger && mobileMenu) {
        mobileTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle de la classe 'open'
            mobileMenu.classList.toggle('open');
            
            // Changement d'icône (Bars <-> Times)
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fermer le menu quand on clique sur un lien
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// --- SCROLL BAR ---
const progressBar = document.getElementById("progress-bar");
window.addEventListener('scroll', () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    if(progressBar) progressBar.style.width = scrolled + "%";
});

// --- PARTICULES & ANIMATIONS ---
const canvas = document.getElementById('canvas1'); 
if (canvas && window.innerWidth > 900) { // Désactivé sur mobile pour perfs
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let particlesArray = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if(this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if(this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = '#3b82f6'; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    
    function init() { for(let i=0; i<50; i++) particlesArray.push(new Particle()); }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i<particlesArray.length; i++) {
            particlesArray[i].update(); particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }
    init(); animate();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

// --- MODALES COMPETENCES ---
const skillsData = {
    cisco: { title: "CISCO IOS", desc: "VLANs, OSPF, ACLs, NAT/PAT, STP..." },
    windows: { title: "WINDOWS SERVER", desc: "AD DS, DNS, DHCP, GPO, WSUS..." },
    linux: { title: "LINUX / DEBIAN", desc: "Apache, Bind9, IPTables, Bash..." },
    ad: { title: "ACTIVE DIRECTORY", desc: "Gestion utilisateurs, droits, forêts..." },
    packettracer: { title: "PACKET TRACER", desc: "Simulation réseaux complexes." },
    wireshark: { title: "WIRESHARK", desc: "Analyse de trames réseaux." }
};

const skillModal = document.getElementById("skill-modal");
const skillModalBody = document.getElementById("skill-modal-body");

function openSkillModal(key) {
    const data = skillsData[key];
    if(!data) return;
    if(skillModalBody) {
        skillModalBody.innerHTML = `<h2>${data.title}</h2><p>${data.desc}</p>`;
        skillModal.style.display = "block";
    }
}
function closeSkillModal() { if(skillModal) skillModal.style.display = "none"; }

// --- EVENTS ---
const legalBtn = document.getElementById("open-legal");
const legalModal = document.getElementById("legal-modal");
if(legalBtn && legalModal) legalBtn.onclick = () => legalModal.style.display = "block";

document.querySelectorAll(".close-modal").forEach(el => el.onclick = function() { this.closest('.modal').style.display = "none"; });
window.onclick = (e) => { if(e.target.classList.contains('modal')) e.target.style.display = "none"; };

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
