/* ============================================================
   MATHIS PAOLINI — Portfolio JS
   ============================================================ */

// ── AUTH ─────────────────────────────────────────────────────
const SITE_LOCKED = false;
const PASSWORD_HASH = "028b569b20e6d5a166657def82c41d87948efd97ac00820fc55b6103b65adf70";
const overlay = document.getElementById("login-overlay");
if (SITE_LOCKED && sessionStorage.getItem("auth") !== "true") {
    overlay.style.display = "flex";
}
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function checkPassword() {
    const input = document.getElementById("passwordInput").value;
    const errorMsg = document.getElementById("errorMsg");
    if (await sha256(input) === PASSWORD_HASH) {
        overlay.classList.add("hidden-overlay");
        setTimeout(() => { overlay.style.display = "none"; }, 800);
        sessionStorage.setItem("auth","true");
    } else {
        errorMsg.style.display = "block";
        document.querySelector('.login-box').classList.add("shake");
        setTimeout(() => document.querySelector('.login-box').classList.remove("shake"), 500);
    }
}

// ── PRELOADER ────────────────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('loaded');
    setTimeout(() => { preloader.style.display = 'none'; }, 500);
    const pwInput = document.getElementById("passwordInput");
    if(pwInput) pwInput.addEventListener("keypress", e => { if(e.key==="Enter") checkPassword(); });
});

// ── CONTACT FORM ─────────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if(contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const status = document.getElementById("form-status");
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        try {
            const res = await fetch(contactForm.action, {
                method: contactForm.method, body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if(res.ok) {
                status.innerHTML = '<p class="success-msg-form"><i class="fas fa-check-circle"></i> Message envoyé avec succès !</p>';
                contactForm.reset();
            } else {
                status.innerHTML = '<p class="error-msg-form"><i class="fas fa-exclamation-triangle"></i> Une erreur est survenue.</p>';
            }
        } catch(err) {
            status.innerHTML = '<p class="error-msg-form"><i class="fas fa-exclamation-triangle"></i> Vérifiez votre connexion.</p>';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
        }
    });
}
document.getElementById("year").textContent = new Date().getFullYear();

// ── SCROLL EFFECTS ───────────────────────────────────────────
const progressBar = document.getElementById("progress-bar");
const backToTop   = document.getElementById("back-to-top");
const sections    = document.querySelectorAll("section");
const navLinks    = document.querySelectorAll(".nav-link");
let ticking = false;

window.addEventListener("scroll", () => {
    if(!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const height   = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (scrolled / height * 100) + "%";

            backToTop.classList.toggle("show", scrolled > 200);

            let current = "";
            sections.forEach(s => { if(scrolled >= s.offsetTop - 250) current = s.id; });
            navLinks.forEach(link => {
                link.classList.toggle("active-link", link.getAttribute("href") === "#"+current);
            });
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

backToTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

// ── MOBILE MENU ──────────────────────────────────────────────
const menuToggle = document.querySelector(".menu-toggle");
const navUl      = document.querySelector("nav ul");
menuToggle.addEventListener("click", () => {
    const open = navUl.classList.toggle("active");
    menuToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navUl.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ── REVEAL ON SCROLL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) { entry.target.classList.add("active"); revealObserver.unobserve(entry.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── CANVAS PARTICLES ─────────────────────────────────────────
const canvas = document.getElementById("canvas1");
const ctx    = canvas.getContext("2d");
canvas.width  = innerWidth;
canvas.height = innerHeight;
const mouse = { x:null, y:null, radius: 80 };
window.addEventListener("mousemove", e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener("mouseout",  () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() { this.reset(true); }
    reset(init) {
        this.x  = Math.random() * canvas.width;
        this.y  = init ? Math.random() * canvas.height : (Math.random() > .5 ? 0 : canvas.height);
        this.vx = (Math.random() - .5) * .5;
        this.vy = (Math.random() - .5) * .5;
        this.size = Math.random() * 1.5 + .5;
        this.alpha = Math.random() * .4 + .1;
    }
    update() {
        if(mouse.x !== null) {
            const dx = mouse.x - this.x, dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= dx / dist * force * 2;
                this.y -= dy / dist * force * 2;
            }
        }
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset(false);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(59,130,246,${this.alpha})`;
        ctx.fill();
    }
}

let particles = [];
function initParticles() {
    const count = window.innerWidth < 768 ? 40 : Math.min(100, Math.floor(innerWidth*innerHeight / 12000));
    particles = Array.from({ length: count }, () => new Particle());
}
function drawConnections() {
    if(window.innerWidth < 768) return;
    const maxDist = 120;
    for(let a = 0; a < particles.length; a++) {
        for(let b = a+1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const d  = Math.sqrt(dx*dx + dy*dy);
            if(d < maxDist) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59,130,246,${(1 - d/maxDist) * .15})`;
                ctx.lineWidth = .8;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
}
window.addEventListener("resize", () => {
    canvas.width = innerWidth; canvas.height = innerHeight;
    initParticles();
});
initParticles();
animate();

// ── SKILL MODAL ───────────────────────────────────────────────
const skillsData = {
    cisco: {
        title: "CISCO IOS & ROUTING",
        icon: '<i class="fas fa-satellite-dish" style="color:#cbd5e1"></i>',
        desc: `<strong>Maîtrise de l'environnement Cisco IOS</strong> pour la configuration avancée des infrastructures réseaux.<br><br>
        <ul>
            <li><strong>Switching :</strong> Configuration des VLANs (802.1Q), Trunking, Spanning Tree Protocol (STP/RSTP), EtherChannel (LACP).</li>
            <li><strong>Routing :</strong> Routage statique et dynamique (OSPF multi-area, RIPv2), routage inter-VLAN (Router on a Stick).</li>
            <li><strong>Sécurité :</strong> ACLs (Standard/Extended), Port Security, DHCP Snooping pour prévenir les attaques man-in-the-middle.</li>
            <li><strong>Services :</strong> DHCP, NAT/PAT pour l'accès internet, SSH pour l'administration sécurisée.</li>
        </ul>`,
        tags: ["VLAN","Routage Inter-VLAN","ACL","DHCP Snooping","Port Security","OSPF","NAT/PAT","STP"]
    },
    windows: {
        title: "WINDOWS SERVER",
        icon: '<i class="fab fa-windows" style="color:#3b82f6"></i>',
        desc: `<strong>Administration système sous Windows Server 2019 et 2022.</strong><br><br>
        <ul>
            <li><strong>Active Directory (AD DS) :</strong> Installation et promotion de contrôleurs de domaine, gestion des utilisateurs, groupes et ordinateurs.</li>
            <li><strong>Services Réseaux :</strong> Configuration DNS (Zones directes/inverses) et DHCP (Étendues, réservations).</li>
            <li><strong>GPO :</strong> Déploiement de restrictions, mappage de lecteurs réseaux, installation de logiciels automatique.</li>
            <li><strong>Déploiement :</strong> WDS/MDT pour le déploiement d'images systèmes sur le parc informatique.</li>
            <li><strong>Stockage :</strong> Gestion des partages de fichiers (SMB) et des permissions NTFS.</li>
        </ul>`,
        tags: ["AD DS","DNS / DHCP","GPO","WSUS","WDS / MDT","PowerShell","Hyper-V","SMB"]
    },
    linux: {
        title: "LINUX / DEBIAN",
        icon: '<i class="fab fa-linux" style="color:#facc15"></i>',
        desc: `<strong>Administration avancée de systèmes Linux (Debian, Ubuntu Server).</strong><br><br>
        <ul>
            <li><strong>Gestion Système :</strong> Gestion des paquets (APT), utilisateurs et permissions (chmod/chown/ACLs).</li>
            <li><strong>Serveurs Web :</strong> Déploiement stack LAMP (Linux, Apache2, MySQL/MariaDB, PHP).</li>
            <li><strong>Services Réseaux :</strong> DNS (Bind9), DHCP (ISC-DHCP-Server), partage de fichiers (Samba).</li>
            <li><strong>Sécurité :</strong> UFW/IPTables, gestion des clés SSH, fail2ban.</li>
            <li><strong>Scripting :</strong> Automatisation via scripts Bash et Cron jobs.</li>
        </ul>`,
        tags: ["Bash Scripting","Apache2 / Nginx","SSH","Gestion Droits","IPTables","Cron","Samba","Bind9"]
    },
    ad: {
        title: "ACTIVE DIRECTORY",
        icon: '<i class="fas fa-users-cog" style="color:#a855f7"></i>',
        desc: `<strong>Expertise en gestion des identités et des accès (IAM).</strong><br><br>
        <ul>
            <li><strong>Architecture :</strong> Forêts, Arbres, Domaines, Sites AD, relations d'approbation.</li>
            <li><strong>Gestion des Objets :</strong> Comptes utilisateurs, ordinateurs, groupes de sécurité, Unités d'Organisation (OU).</li>
            <li><strong>Sécurité :</strong> Politiques de mots de passe, groupes restreints, audit des accès, délégation de droits.</li>
            <li><strong>Automatisation :</strong> Scripts PowerShell pour l'importation massive d'utilisateurs depuis CSV.</li>
        </ul>`,
        tags: ["Utilisateurs & Groupes","Arborescence OU","Sécurité Kerberos","LDAP","Profils Itinérants","Domaine"]
    },
    vmware: {
        title: "VMWARE / ESXI",
        icon: '<i class="fas fa-cloud" style="color:#ffffff"></i>',
        desc: `<strong>Virtualisation d'infrastructure avec la suite VMware vSphere.</strong><br><br>
        <ul>
            <li><strong>Hyperviseur Bare-Metal :</strong> Installation et configuration de VMware ESXi (Type 1) sur serveurs physiques.</li>
            <li><strong>Gestion des VMs :</strong> Création, clonage, modification (Windows/Linux), gestion des ressources (vCPU, vRAM).</li>
            <li><strong>Réseau Virtuel :</strong> vSwitches standards, Port Groups, VLANs pour isoler le trafic.</li>
            <li><strong>Stockage :</strong> Gestion des Datastores (VMFS, NFS, iSCSI).</li>
            <li><strong>Maintenance :</strong> Snapshots avant mise à jour, installation des VMware Tools.</li>
        </ul>`,
        tags: ["vSphere","Snapshots","Allocation Ressources","Réseau Virtuel","Datastores","Hyperviseur"]
    },
    powershell: {
        title: "POWERSHELL",
        icon: '<i class="fas fa-terminal" style="color:#94a3b8"></i>',
        desc: `<strong>Automatisation et Scripting avancé pour l'administration système.</strong><br><br>
        <ul>
            <li><strong>Administration AD :</strong> Scripts de création, modification et suppression de comptes en masse depuis CSV.</li>
            <li><strong>Gestion de fichiers :</strong> Scripts de sauvegarde, déplacement, renommage et archivage.</li>
            <li><strong>Reporting :</strong> Audit de l'état des serveurs, espace disque, services arrêtés (Export HTML/CSV).</li>
            <li><strong>Pipelines :</strong> Maîtrise des commandes, pipes et objets pour manipuler les données efficacement.</li>
        </ul>`,
        tags: ["Scripting","Automatisation AD","Reporting","Gestion de fichiers","Pipelines","Cmdlets"]
    },
    packettracer: {
        title: "CISCO PACKET TRACER",
        icon: '<i class="fas fa-network-wired" style="color:#0d9488"></i>',
        desc: `<strong>Outil de simulation et de maquettage réseau de référence.</strong><br><br>
        <ul>
            <li><strong>Conception :</strong> Topologies réseaux complexes avec routeurs, switchs L2/L3, points d'accès Wi-Fi, serveurs.</li>
            <li><strong>Configuration :</strong> Commandes Cisco IOS en CLI, comme sur du matériel réel.</li>
            <li><strong>Simulation :</strong> Analyse du trafic réseau en mode simulation, visualisation du cheminement des paquets (PDU).</li>
            <li><strong>IoT :</strong> Expérimentation avec des objets connectés et programmation de scénarios domotiques.</li>
        </ul>`,
        tags: ["Simulation","Maquettage","IoT","Tests de connectivité","PDU","CLI"]
    },
    wireshark: {
        title: "WIRESHARK",
        icon: '<i class="fas fa-water" style="color:#3b82f6"></i>',
        desc: `<strong>Analyseur de protocoles réseau pour le diagnostic avancé.</strong><br><br>
        <ul>
            <li><strong>Capture :</strong> Interception du trafic réseau en temps réel sur différentes interfaces.</li>
            <li><strong>Filtrage :</strong> Filtres de capture (BPF) et d'affichage pour isoler les flux pertinents.</li>
            <li><strong>Analyse :</strong> Décorticage des en-têtes de paquets (Ethernet, IP, TCP/UDP, HTTP, DNS).</li>
            <li><strong>Diagnostic :</strong> Identification de problèmes de latence, retransmissions TCP ou attaques réseaux.</li>
        </ul>`,
        tags: ["Analyse de trames","Sniffing","TCP/IP","Diagnostic","Filtres","Cyber"]
    },
    putty: {
        title: "PUTTY / SSH",
        icon: '<i class="fas fa-terminal" style="color:#facc15"></i>',
        desc: `<strong>Client de connexion à distance standard de l'industrie.</strong><br><br>
        <ul>
            <li><strong>Accès Distant :</strong> Connexion via SSH (Secure Shell) pour une administration en ligne de commande cryptée.</li>
            <li><strong>Authentification :</strong> Configuration et utilisation de l'authentification par clés publiques/privées (RSA/Ed25519).</li>
            <li><strong>Logging :</strong> Enregistrement des sessions pour la documentation et la traçabilité.</li>
            <li><strong>Tunneling :</strong> Tunnels SSH pour accéder à des services internes de manière sécurisée.</li>
        </ul>`,
        tags: ["Accès distant","CLI","Sécurité","Administration","Tunneling","SSH"]
    },
    virtualbox: {
        title: "VIRTUALBOX",
        icon: '<i class="fas fa-box-open" style="color:#f97316"></i>',
        desc: `<strong>Hyperviseur de type 2 pour la création de laboratoires de test.</strong><br><br>
        <ul>
            <li><strong>Multi-OS :</strong> Installation simultanée de multiple systèmes (Windows Server, Debian, Kali Linux, pfSense).</li>
            <li><strong>Réseau Virtuel :</strong> Cartes réseaux virtuelles (NAT, Pont, Réseau Interne, Réseau Privé Hôte).</li>
            <li><strong>Snapshots :</strong> Sauvegardes d'états stables et retour arrière après tests destructifs.</li>
            <li><strong>Guest Additions :</strong> Optimisation des performances et de l'intégration avec le système hôte.</li>
        </ul>`,
        tags: ["Laboratoire","Isolation","Snapshots","Réseau NAT/Bridge","Multi-OS","Test"]
    },
    glpi: {
        title: "GLPI & OCS INVENTORY",
        icon: '<i class="fas fa-ticket-alt" style="color:#a855f7"></i>',
        desc: `<strong>Solution ITSM open-source de gestion de parc et de Helpdesk.</strong><br><br>
        <ul>
            <li><strong>Service Desk :</strong> Gestion complète du cycle de vie des tickets d'incidents et de demandes.</li>
            <li><strong>Gestion de Parc :</strong> Inventaire automatisé du matériel et des logiciels via OCS Inventory ou FusionInventory.</li>
            <li><strong>Gestion Administrative :</strong> Suivi des contrats, licences logicielles, budgets et fournisseurs.</li>
            <li><strong>Base de Connaissances :</strong> Création et maintenance d'une FAQ pour les utilisateurs.</li>
        </ul>`,
        tags: ["Ticketing","Inventaire","Helpdesk","Base de connaissances","Suivi","ITSM"]
    },
    drawio: {
        title: "VISIO / DRAW.IO",
        icon: '<i class="fas fa-ruler-combined" style="color:#eab308"></i>',
        desc: `<strong>Outils de diagramme et de modélisation d'architecture.</strong><br><br>
        <ul>
            <li><strong>Topologie Réseau :</strong> Schémas physiques (câblage, baies) et logiques (VLANs, sous-réseaux, adressage IP).</li>
            <li><strong>Diagrammes de Flux :</strong> Flux de données, processus métiers et algorithmes.</li>
            <li><strong>Architecture Système :</strong> Modélisation des infrastructures serveurs, Active Directory et virtualisation.</li>
            <li><strong>Standardisation :</strong> Bibliothèques d'icônes standardisées (Cisco, AWS, Azure) pour des rendus professionnels.</li>
        </ul>`,
        tags: ["Schémas réseau","Documentation","Topologie","UML","Rack Layout","Design"]
    }
};

const skillModal     = document.getElementById("skill-modal");
const skillModalBody = document.getElementById("skill-modal-body");

function openSkillModal(key) {
    const d = skillsData[key];
    if(!d) return;
    const tags = (d.tags||[]).map(t => `<span class="tech-tag">${t}</span>`).join('');
    skillModalBody.innerHTML = `
        <span class="skill-detail-icon">${d.icon}</span>
        <div class="skill-detail-title">${d.title}</div>
        <div class="skill-detail-desc">${d.desc}</div>
        <div class="skill-tag-container">${tags}</div>`;
    skillModal.style.display = "flex";
}
function closeSkillModal() { skillModal.style.display = "none"; }

// ── LEGAL MODAL ───────────────────────────────────────────────
const legalModal = document.getElementById("legal-modal");
document.getElementById("open-legal").onclick = () => legalModal.style.display = "flex";
legalModal.querySelector(".close-modal").onclick = () => legalModal.style.display = "none";

// Close on outside click
window.addEventListener("click", e => {
    if(e.target === legalModal) legalModal.style.display = "none";
    if(e.target === skillModal) skillModal.style.display = "none";
    const pdfM = document.getElementById("pdf-modal");
    if(e.target === pdfM) closePdfModal();
});

// ── PDF MODAL ─────────────────────────────────────────────────
function openPdfModal(title, desc, url) {
    document.getElementById("pdf-modal-title").textContent = title;
    document.getElementById("pdf-modal-desc").textContent  = desc;
    document.getElementById("pdf-modal-iframe").src = url;
    document.getElementById("pdf-modal-link").href  = url;
    document.getElementById("pdf-modal").style.display = "flex";
}
function closePdfModal() {
    document.getElementById("pdf-modal").style.display = "none";
    document.getElementById("pdf-modal-iframe").src = "";
}

// ── PROCEDURE CARDS ANIMATION ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.proc-card');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry,i) => {
            if(entry.isIntersecting) {
                entry.target.style.transitionDelay = (i % 4 * .05) + 's';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold:.08 });
    cards.forEach(c => {
        c.style.opacity = '0'; c.style.transform = 'translateY(16px)';
        c.style.transition = 'all .4s ease';
        obs.observe(c);
    });
});
