const SITE_LOCKED = false; 
const PASSWORD_HASH = "028b569b20e6d5a166657def82c41d87948efd97ac00820fc55b6103b65adf70";
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
        document.querySelector('.login-box').classList.add("shake");
        setTimeout(() => document.querySelector('.login-box').classList.remove("shake"), 500);
    }
}
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
document.getElementById("year").textContent = new Date().getFullYear();
const header = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById("progress-bar");

let isScrolling = false;

function onScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            let winScroll = window.scrollY || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";

            if (winScroll > 50) { 
                header.classList.add('scrolled'); 
                backToTop.classList.add('show'); 
            } else { 
                header.classList.remove('scrolled'); 
                backToTop.classList.remove('show'); 
            }
            
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (winScroll >= sectionTop - 200) { current = section.getAttribute("id"); }
            });
            navLinks.forEach(link => {
                link.classList.remove("active-link");
                if (link.getAttribute("href").includes(current)) { link.classList.add("active-link"); }
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
}
window.addEventListener('scroll', onScroll, { passive: true });
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');
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
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
const skillsData = {
    cisco: { 
        title: "CISCO IOS & ROUTING", 
        icon: '<i class="fas fa-satellite-dish" style="color: #cbd5e1;"></i>', 
        desc: `
            <strong>Maîtrise de l'environnement Cisco IOS</strong> pour la configuration avancée des infrastructures réseaux.<br><br>
            Je suis capable de déployer et maintenir des architectures complexes en assurant la connectivité et la sécurité.<br>
            <ul>
                <li><strong>Switching :</strong> Configuration des VLANs (802.1Q), Trunking, Spanning Tree Protocol (STP/RSTP) pour éviter les boucles, et EtherChannel (LACP) pour l'agrégation de liens.</li>
                <li><strong>Routing :</strong> Mise en place du routage statique et dynamique (OSPF multi-area, RIPv2). Configuration du routage inter-VLAN (Router on a Stick).</li>
                <li><strong>Sécurité :</strong> Implémentation des ACLs (Standard/Extended), Port Security, DHCP Snooping pour prévenir les attaques man-in-the-middle.</li>
                <li><strong>Services :</strong> Configuration des services DHCP, NAT/PAT pour l'accès internet, et SSH pour l'administration sécurisée.</li>
            </ul>
        `, 
        tags: ["VLAN", "Routage Inter-VLAN", "ACL", "DHCP Snooping", "Port Security", "OSPF", "NAT/PAT", "STP"] 
    },
    windows: { 
        title: "WINDOWS SERVER", 
        icon: '<i class="fab fa-windows" style="color: #3b82f6;"></i>', 
        desc: `
            <strong>Administration système sous Windows Server 2019 et 2022.</strong><br><br>
            Capacité à déployer un domaine complet en entreprise, de l'installation du serveur à la gestion des postes clients.<br>
            <ul>
                <li><strong>Active Directory (AD DS) :</strong> Installation et promotion de contrôleurs de domaine. Gestion des utilisateurs, groupes et ordinateurs.</li>
                <li><strong>Services Réseaux :</strong> Configuration et maintenance des rôles DNS (Zones directes/inverses) et DHCP (Étendues, réservations).</li>
                <li><strong>Stratégies de Groupe (GPO) :</strong> Déploiement de restrictions, mappage de lecteurs réseaux, et installation de logiciels automatique.</li>
                <li><strong>Déploiement :</strong> Utilisation de WDS/MDT pour le déploiement d'images systèmes sur le parc informatique.</li>
                <li><strong>Stockage :</strong> Gestion des partages de fichiers (SMB) et des permissions NTFS.</li>
            </ul>
        `, 
        tags: ["AD DS", "DNS / DHCP", "GPO", "WSUS", "WDS / MDT", "PowerShell", "Hyper-V", "SMB"] 
    },
    linux: { 
        title: "LINUX / DEBIAN", 
        icon: '<i class="fab fa-linux" style="color: #facc15;"></i>', 
        desc: `
            <strong>Administration avancée de systèmes Linux (Debian, Ubuntu Server).</strong><br><br>
            À l'aise avec la ligne de commande (CLI) pour gérer des serveurs, automatiser des tâches et sécuriser l'environnement.<br>
            <ul>
                <li><strong>Gestion Système :</strong> Installation de paquets (APT), gestion des utilisateurs et des permissions (chmod/chown/ACLs).</li>
                <li><strong>Serveurs Web :</strong> Déploiement de la stack LAMP (Linux, Apache2, MySQL/MariaDB, PHP) pour l'hébergement de sites web.</li>
                <li><strong>Services Réseaux :</strong> Configuration de serveurs DNS (Bind9), DHCP (ISC-DHCP-Server), et partage de fichiers (Samba).</li>
                <li><strong>Sécurité :</strong> Configuration du pare-feu (UFW/IPTables), gestion des clés SSH, et fail2ban.</li>
                <li><strong>Scripting :</strong> Automatisation de tâches de sauvegarde et de maintenance via des scripts Bash et Cron jobs.</li>
            </ul>
        `, 
        tags: ["Bash Scripting", "Apache2 / Nginx", "SSH", "Gestion Droits", "IPTables", "Cron", "Samba", "Bind9"] 
    },
    ad: { 
        title: "ACTIVE DIRECTORY", 
        icon: '<i class="fas fa-users-cog" style="color: #a855f7;"></i>', 
        desc: `
            <strong>Expertise en gestion des identités et des accès (IAM).</strong><br><br>
            L'Active Directory est la pierre angulaire de l'infrastructure Microsoft. Je maîtrise son architecture logique et physique.<br><br>
            <ul>
                <li><strong>Architecture :</strong> Compréhension des concepts de Forêts, Arbres, Domaines et Sites AD. Gestion des relations d'approbation.</li>
                <li><strong>Gestion des Objets :</strong> Administration quotidienne des comptes utilisateurs, ordinateurs et groupes de sécurité. Structuration logique via les Unités d'Organisation (OU).</li>
                <li><strong>Sécurité :</strong> Application des politiques de mots de passe, gestion des groupes restreints, audit des accès et délégation de droits d'administration.</li>
                <li><strong>Automatisation :</strong> Utilisation de scripts PowerShell pour l'importation massive d'utilisateurs et la modification d'attributs AD en masse.</li>
            </ul>
        `, 
        tags: ["Utilisateurs & Groupes", "Arborescence OU", "Sécurité Kerberos", "LDAP", "Profils Itinérants", "Domaine"] 
    },
    vmware: { 
        title: "VMWARE / ESXI", 
        icon: '<i class="fas fa-cloud" style="color: #ffffff;"></i>', 
        desc: `
            <strong>Virtualisation d'infrastructure avec la suite VMware vSphere.</strong><br><br>
            Compétences solides dans la mise en œuvre et la maintenance d'environnements virtualisés pour optimiser les ressources et assurer la continuité de service.<br><br>
            <ul>
                <li><strong>Hyperviseur Bare-Metal :</strong> Installation et configuration de VMware ESXi (Type 1) sur serveurs physiques.</li>
                <li><strong>Gestion des VMs :</strong> Création, clonage, et modification des machines virtuelles (Windows/Linux). Gestion des ressources (vCPU, vRAM).</li>
                <li><strong>Réseau Virtuel :</strong> Configuration des vSwitches standards, Port Groups et VLANs pour isoler le trafic des VMs.</li>
                <li><strong>Stockage :</strong> Gestion des Datastores (VMFS, NFS, iSCSI) et connexion aux baies de stockage.</li>
                <li><strong>Maintenance :</strong> Gestion des Snapshots pour la sécurisation avant mise à jour et installation des VMware Tools.</li>
            </ul>
        `, 
        tags: ["vSphere", "Snapshots", "Allocation Ressources", "Réseau Virtuel", "Datastores", "Hyperviseur"] 
    },
    powershell: { 
        title: "POWERSHELL", 
        icon: '<i class="fas fa-terminal" style="color: #94a3b8;"></i>', 
        desc: `
            <strong>Automatisation et Scripting avancé pour l'administration système.</strong><br><br>
            Utilisation intensive de PowerShell pour automatiser les tâches administratives répétitives et gérer les environnements Windows à grande échelle.<br><br>
            <ul>
                <li><strong>Administration AD :</strong> Scripts de création, modification et suppression de comptes utilisateurs en masse à partir de fichiers CSV.</li>
                <li><strong>Gestion de fichiers :</strong> Scripts de sauvegarde, de déplacement, de renommage et d'archivage de fichiers et dossiers.</li>
                <li><strong>Reporting :</strong> Création de scripts d'audit pour extraire des informations sur l'état des serveurs, l'espace disque, ou les services arrêtés (Export HTML/CSV).</li>
                <li><strong>Pipelines :</strong> Maîtrise des commandes, des pipes et des objets pour manipuler les données efficacement.</li>
            </ul>
        `, 
        tags: ["Scripting", "Automatisation AD", "Reporting", "Gestion de fichiers", "Pipelines", "Cmdlets"] 
    },
    packettracer: { 
        title: "CISCO PACKET TRACER", 
        icon: '<i class="fas fa-network-wired" style="color: #0d9488;"></i>', 
        desc: `
            <strong>Outil de simulation et de maquettage réseau de référence.</strong><br><br>
            J'utilise Packet Tracer quotidiennement pour concevoir, prototyper et tester des architectures réseaux avant leur mise en production réelle.<br><br>
            <ul>
                <li><strong>Conception :</strong> Création de topologies réseaux complexes intégrant routeurs, switchs L2/L3, points d'accès sans fil, serveurs et terminaux.</li>
                <li><strong>Configuration :</strong> Application des commandes Cisco IOS en ligne de commande (CLI) comme sur du matériel réel.</li>
                <li><strong>Simulation :</strong> Analyse détaillée du trafic réseau en mode simulation pour visualiser le cheminement des paquets (PDU) couche par couche.</li>
                <li><strong>IoT :</strong> Expérimentation avec des objets connectés et programmation de scénarios domotiques.</li>
            </ul>
        `, 
        tags: ["Simulation", "Maquettage", "IoT", "Tests de connectivité", "PDU", "CLI"] 
    },
    wireshark: { 
        title: "WIRESHARK", 
        icon: '<i class="fas fa-water" style="color: #3b82f6;"></i>', 
        desc: `
            <strong>Analyseur de protocoles réseau pour le diagnostic avancé.</strong><br><br>
            Outil indispensable pour le dépannage réseau, l'analyse de performance et la cybersécurité (analyse forensique).<br><br>
            <ul>
                <li><strong>Capture :</strong> Interception du trafic réseau en temps réel sur différentes interfaces.</li>
                <li><strong>Filtrage :</strong> Utilisation experte des filtres de capture (BPF) et d'affichage pour isoler les flux pertinents.</li>
                <li><strong>Analyse :</strong> Décorticage des en-têtes de paquets (Ethernet, IP, TCP/UDP, HTTP, DNS) pour comprendre les échanges et identifier les anomalies.</li>
                <li><strong>Diagnostic :</strong> Identification de problèmes de latence, de retransmissions TCP ou d'attaques réseaux.</li>
            </ul>
        `, 
        tags: ["Analyse de trames", "Sniffing", "TCP/IP", "Diagnostic", "Filtres", "Cyber"] 
    },
    putty: { 
        title: "PUTTY / SSH", 
        icon: '<i class="fas fa-terminal" style="color: #facc15;"></i>', 
        desc: `
            <strong>Client de connexion à distance standard de l'industrie.</strong><br><br>
            Mon outil principal pour l'administration sécurisée des serveurs Linux et des équipements réseaux Cisco à distance.<br><br>
            <ul>
                <li><strong>Accès Distant :</strong> Connexion via SSH (Secure Shell) pour une administration en ligne de commande cryptée et sécurisée.</li>
                <li><strong>Authentification :</strong> Configuration et utilisation de l'authentification par clés publiques/privées (RSA/Ed25519) pour renforcer la sécurité.</li>
                <li><strong>Logging :</strong> Enregistrement des sessions pour la documentation et la traçabilité des interventions.</li>
                <li><strong>Tunneling :</strong> Mise en place de tunnels SSH pour accéder à des services internes de manière sécurisée.</li>
            </ul>
        `, 
        tags: ["Accès distant", "CLI", "Sécurité", "Administration", "Tunneling", "SSH"] 
    },
    virtualbox: { 
        title: "VIRTUALBOX", 
        icon: '<i class="fas fa-box-open" style="color: #f97316;"></i>', 
        desc: `
            <strong>Hyperviseur de type 2 pour la création de laboratoires de test.</strong><br><br>
            Je l'utilise pour monter des environnements de test isolés et sécurisés directement sur mon poste de travail.<br><br>
            <ul>
                <li><strong>Multi-OS :</strong> Installation et gestion simultanée de multiples systèmes d'exploitation (Windows Server, Debian, Kali Linux, pfSense).</li>
                <li><strong>Réseau Virtuel :</strong> Configuration avancée des cartes réseaux virtuelles (NAT, Pont, Réseau Interne, Réseau Privé Hôte) pour simuler des architectures réelles.</li>
                <li><strong>Snapshots :</strong> Utilisation intensive des instantanés pour sauvegarder des états stables et revenir en arrière après des tests destructifs.</li>
                <li><strong>Guest Additions :</strong> Optimisation des performances et de l'intégration avec le système hôte.</li>
            </ul>
        `, 
        tags: ["Laboratoire", "Isolation", "Snapshots", "Réseau NAT/Bridge", "Multi-OS", "Test"] 
    },
    glpi: { 
        title: "GLPI & OCS INVENTORY", 
        icon: '<i class="fas fa-ticket-alt" style="color: #a855f7;"></i>', 
        desc: `
            <strong>Solution ITSM open-source de gestion de parc et de Helpdesk.</strong><br><br>
            J'ai déployé et administré cette solution pour centraliser la gestion des services informatiques.<br><br>
            <ul>
                <li><strong>Service Desk (Helpdesk) :</strong> Gestion complète du cycle de vie des tickets d'incidents et de demandes (création, qualification, attribution, résolution, clôture, enquêtes de satisfaction).</li>
                <li><strong>Gestion de Parc (Asset Management) :</strong> Inventaire automatisé du matériel et des logiciels via l'agent OCS Inventory ou FusionInventory.</li>
                <li><strong>Gestion Administrative :</strong> Suivi des contrats, des licences logicielles, des budgets et des fournisseurs.</li>
                <li><strong>Base de Connaissances :</strong> Création et maintenance d'une FAQ pour les utilisateurs et de procédures pour les techniciens.</li>
            </ul>
        `, 
        tags: ["Ticketing", "Inventaire", "Helpdesk", "Base de connaissances", "Suivi", "ITSM"] 
    },
    drawio: { 
        title: "VISIO / DRAW.IO", 
        icon: '<i class="fas fa-ruler-combined" style="color: #eab308;"></i>', 
        desc: `
            <strong>Outils de diagramme et de modélisation d'architecture.</strong><br><br>
            Compétence essentielle pour documenter les projets, planifier les déploiements et communiquer techniquement.<br><br>
            <ul>
                <li><strong>Topologie Réseau :</strong> Création de schémas physiques (câblage, baies) et logiques (VLANs, sous-réseaux, adressage IP).</li>
                <li><strong>Diagrammes de Flux :</strong> Illustration des flux de données, des processus métiers et des algorithmes.</li>
                <li><strong>Architecture Système :</strong> Modélisation des infrastructures serveurs, Active Directory et virtualisation.</li>
                <li><strong>Standardisation :</strong> Utilisation des bibliothèques d'icônes standardisées (Cisco, AWS, Azure) pour des rendus professionnels.</li>
            </ul>
        `, 
        tags: ["Schémas réseau", "Documentation", "Topologie", "UML", "Rack Layout", "Design"] 
    },
    secnum: { title: "SECNUMACADÉMIE", icon: '<i class="fas fa-shield-alt" style="color: #ef4444;"></i>', desc: `<strong>Certification de sensibilisation à la sécurité du numérique délivrée par l'ANSSI.</strong>...`, pdf: "assets/docs/certs/secnum.pdf" },
    pix: { title: "CERTIFICATION PIX", icon: '<i class="fas fa-desktop" style="color: #3b82f6;"></i>', desc: `<strong>Certification nationale reconnue par l'État et le monde professionnel.</strong>...`, pdf: "assets/docs/certs/pix.pdf" },
    cisco_intro: { title: "CISCO INTRO TO CYBERSECURITY", icon: '<i class="fas fa-user-secret" style="color: #facc15;"></i>', desc: `<strong>Fondamentaux de la cybersécurité par Cisco Networking Academy.</strong>...`, pdf: "assets/docs/certs/cisco_intro.pdf" },
    cisco_basics: { title: "CISCO NETWORKING BASICS", icon: '<i class="fas fa-globe" style="color: #0d9488;"></i>', desc: `<strong>Bases fondamentales des réseaux informatiques.</strong>...`, pdf: "assets/docs/certs/cisco_basics.pdf" },
    cisco_config: { title: "CISCO NETWORK DEVICES", icon: '<i class="fas fa-cogs" style="color: #94a3b8;"></i>', desc: `<strong>Configuration et gestion des équipements réseaux Cisco.</strong>...`, pdf: "assets/docs/certs/cisco_config.pdf" },
    proc_samba: { title: "PROCÉDURE SAMBA", icon: '<i class="fab fa-linux" style="color: #facc15;"></i>', desc: `<strong>Mise en place d'un contrôleur de domaine et serveur de fichiers sous Linux.</strong>...`, pdf: "assets/docs/procs/proc_samba.pdf" },
    proc_bind9: { title: "DNS PRIMAIRE BIND9", icon: '<i class="fas fa-globe" style="color: #3b82f6;"></i>', desc: `<strong>Configuration complet d'un serveur DNS Maître (Authoritative) avec Bind9.</strong>...`, pdf: "assets/docs/procs/proc_bind9.pdf" },
    proc_glpi: { title: "GLPI & OCS INVENTORY", icon: '<i class="fas fa-ticket-alt" style="color: #a855f7;"></i>', desc: `<strong>Déploiement d'une solution de gestion de parc et de Helpdesk (ITSM).</strong>...`, pdf: "assets/docs/procs/proc_glpi.pdf" },
    proc_3tiers: { title: "ARCHITECTURE 3-TIERS", icon: '<i class="fas fa-server" style="color: #f97316;"></i>', desc: `<strong>Déploiement d'une architecture Web sécurisée et modulaire.</strong>...`, pdf: "assets/docs/procs/proc_3tiers.pdf" },
    proc_haproxy: { title: "LOAD BALANCING HAPROXY", icon: '<i class="fas fa-balance-scale" style="color: #ef4444;"></i>', desc: `<strong>Mise en œuvre de la haute disponibilité et de la répartition de charge.</strong>...`, pdf: "assets/docs/procs/proc_haproxy.pdf" },
    proc_ad: { title: "ACTIVE DIRECTORY", icon: '<i class="fab fa-windows" style="color: #3b82f6;"></i>', desc: `<strong>Installation et configuration d'un contrôleur de domaine Windows Server 2022.</strong>...`, pdf: "assets/docs/procs/proc_ad.pdf" }
};

const skillModal = document.getElementById("skill-modal");
const skillModalBody = document.getElementById("skill-modal-body");

function openSkillModal(skillKey) {
    const data = skillsData[skillKey];
    if(!data) return;
    let tagsHtml = "";
    if(data.tags){ tagsHtml = data.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join(''); }
    skillModalBody.innerHTML = `<div class="skill-detail-icon">${data.icon}</div><div class="skill-detail-title">${data.title}</div><div class="skill-detail-desc">${data.desc}</div><div class="skill-tag-container">${tagsHtml}</div>`;
    skillModal.style.display = "block";
}

function openCertifModal(certKey) {
    const data = skillsData[certKey];
    if(!data) return;
    skillModalBody.innerHTML = `<div class="skill-detail-icon">${data.icon}</div><div class="skill-detail-title">${data.title}</div><div class="skill-detail-desc">${data.desc}</div><div class="certif-preview-container"><iframe src="${data.pdf}" class="certif-preview-frame"></iframe><div class="certif-overlay" onclick="window.open('${data.pdf}', '_blank')"><i class="fas fa-external-link-alt"></i> Cliquez pour ouvrir</div></div><div style="text-align:center; margin-top:1rem;"><a href="${data.pdf}" target="_blank" class="btn-cv-outline" style="display:inline-block; font-size:0.9rem;"><i class="fas fa-file-pdf"></i> Ouvrir le PDF en grand</a></div>`;
    skillModal.style.display = "block";
}

function closeSkillModal() { skillModal.style.display = "none"; }

const legalModal = document.getElementById("legal-modal");
const legalBtn = document.getElementById("open-legal");
const legalSpan = legalModal.querySelector(".close-modal");

legalBtn.onclick = function() { legalModal.style.display = "block"; }
legalSpan.onclick = function() { legalModal.style.display = "none"; }

window.onclick = function(event) {
    if (event.target == legalModal) { legalModal.style.display = "none"; }
    if (event.target == skillModal) { skillModal.style.display = "none"; }
}

const canvas = document.getElementById('canvas1'); const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let particlesArray; let mouse = { x: null, y: null, radius: (canvas.height/80) * (canvas.width/80) }
window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });
class Particle {
    constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; }
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
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    if (window.innerWidth < 768) { numberOfParticles = (canvas.height * canvas.width) / 30000; }
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
