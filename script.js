document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const nav = document.querySelector('nav');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    // Language Switcher Elements
    const langEnBtn = document.getElementById('lang-en');
    const langIdBtn = document.getElementById('lang-id');

    // Icons
    const sunIcon = '<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    const moonIcon = '<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    // State
    let currentData = null;
    let currentLang = localStorage.getItem('lang') || 'id';

    // Theme Logic
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.innerHTML = moonIcon;
    } else {
        if (themeToggleBtn) themeToggleBtn.innerHTML = sunIcon;
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            themeToggleBtn.innerHTML = isLight ? moonIcon : sunIcon;
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // Language Logic
    function updateLangButtons() {
        if (!langEnBtn || !langIdBtn) return;
        if (currentLang === 'en') {
            langEnBtn.classList.add('active');
            langIdBtn.classList.remove('active');
        } else {
            langIdBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        }
    }

    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            if (currentLang === 'en') return;
            currentLang = 'en';
            localStorage.setItem('lang', 'en');
            updateLangButtons();
            renderContent();
        });
    }

    if (langIdBtn) {
        langIdBtn.addEventListener('click', () => {
            if (currentLang === 'id') return;
            currentLang = 'id';
            localStorage.setItem('lang', 'id');
            updateLangButtons();
            renderContent();
        });
    }

    // Cursor Logic - Optimized for Desktop Fine Pointer
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // Scroll Logic
    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    // Fetch and render data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            currentData = data;
            updateLangButtons();
            renderContent();
        })
        .catch(error => console.error('Error loading data:', error));

    function renderContent() {
        if (!currentData) return;

        const langData = currentData.languages[currentLang];
        const common = currentData.common;

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        const setQueryText = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };

        const setHref = (id, url) => {
            const el = document.getElementById(id);
            if (el) el.href = url;
        };

        try {
            // Hero
            const profileImg = document.getElementById('profile-img');
            if (profileImg) profileImg.src = common.image;

            setText('profile-name', common.name);
            setQueryText('.hero .subtitle', langData.title);
            setText('profile-bio', langData.bio);
        } catch (e) { console.error("Error rendering Hero:", e); }

        try {
            // About
            setQueryText('.about h2', langData.about_title);
            const aboutEl = document.getElementById('profile-about');
            if (aboutEl) aboutEl.innerHTML = langData.about;
            const programEl = document.getElementById('profile-program');
            if (programEl) programEl.innerHTML = langData.program || '';
            setText('profile-full-name', common.fullName);
        } catch (e) { console.error("Error rendering About:", e); }

        try {
            // Social Activity Section
            setQueryText('.social-activity h2', langData.social_title);

            // Instagram
            if (langData.social && langData.social.instagram) {
                const instaData = langData.social.instagram;
                setText('instagram-platform', instaData.platform);
                setText('instagram-handle', instaData.username);
                setText('instagram-activity', instaData.activity);
                setText('instagram-link', instaData.cta);
                setHref('instagram-link', instaData.url);
            }

            // TikTok
            if (langData.social && langData.social.tiktok) {
                const tiktokData = langData.social.tiktok;
                setText('tiktok-platform', tiktokData.platform);
                setText('tiktok-handle', tiktokData.username);
                setText('tiktok-activity', tiktokData.activity);
                setText('tiktok-link', tiktokData.cta);
                setHref('tiktok-link', tiktokData.url);
            }
        } catch (e) { console.error("Error rendering Social:", e); }

        try {
            // Contact Section
            setQueryText('.contact h2', langData.contact_title);
            const labels = langData.contact_labels;
            const contactLabels = document.querySelectorAll('.contact-item .label');
            if (contactLabels.length >= 2 && labels) {
                if (contactLabels[0]) contactLabels[0].textContent = labels.personal;
                if (contactLabels[1]) contactLabels[1].textContent = labels.instagram;
                if (contactLabels[2]) contactLabels[2].textContent = labels.github;
            }

            const contact = common.contact;
            if (contact) {
                const personalEmail = document.getElementById('personal-email');
                if (personalEmail) {
                    personalEmail.href = `mailto:${contact.personalEmail}`;
                    personalEmail.textContent = contact.personalEmail;
                }
                setHref('instagram-dm', contact.instagramUrl);
                setHref('github-link', contact.githubUrl);
            }
        } catch (e) { console.error("Error rendering Contact:", e); }

        try {
            // Footer
            const footerP = document.querySelector('footer p');
            if (footerP) {
                footerP.innerHTML = `&copy; 2025 ${common.name}. ${langData.footer}`;
            }
        } catch (e) { console.error("Error rendering Footer:", e); }
    }
});
