document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Icons
    const sunIcon = '<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    const moonIcon = '<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    // Check saved preference
    const currentTheme = localStorage.getItem('theme');
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

    // Logo Scroll to Top
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic Nav on Scroll
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add 'scrolled' class when user scrolls down more than 50px
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay for the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Fetch and render data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Check which page we are on
            if (window.location.pathname.includes('project.html')) {
                // Pass both portfolio AND moodboard galleries to search logic
                renderProjectPage(data.portfolio, data.moodboard_galleries);
            } else {
                renderProfile(data.profile);
                if (data.moodboard_section) renderMoodBoard(data.moodboard_section);
                renderPortfolio(data.portfolio);
                renderBusiness(data.business);
            }
        })
        .catch(error => console.error('Error loading data:', error));

    /* --- Home Page Functions --- */
    function renderProfile(profile) {
        // ... (existing code for profile)
        const elName = document.getElementById('profile-name');
        if (elName) elName.textContent = profile.name;

        const elTitle = document.getElementById('profile-title');
        if (elTitle) elTitle.textContent = profile.title;

        const elBio = document.getElementById('profile-bio');
        if (elBio) elBio.textContent = profile.bio;

        const emailLink = document.getElementById('email-link');
        if (emailLink) {
            emailLink.href = `mailto:${profile.email}`;
            emailLink.textContent = profile.email;
        }

        const instaLink = document.getElementById('instagram-link');
        if (instaLink) {
            instaLink.href = profile.instagramUrl;
            instaLink.textContent = profile.instagram;
        }
    }

    // New Function: Render Mood Board Section
    function renderMoodBoard(sectionData) {
        const container = document.getElementById('moodboard-buttons');
        const titleEl = document.getElementById('moodboard-title');

        if (!container || !sectionData) return;

        if (titleEl) titleEl.textContent = sectionData.title;

        sectionData.buttons.forEach(btnData => {
            const a = document.createElement('a');
            a.href = `project.html?id=${btnData.target_id}`;
            a.className = 'btn-mood';
            a.textContent = btnData.label;
            container.appendChild(a);
        });
    }

    function renderPortfolio(items) {
        const grid = document.getElementById('portfolio-grid');
        const categoriesContainer = document.getElementById('categories');

        if (!grid || !categoriesContainer) return; // Exit if not on home page

        const uniqueCategories = ['all', ...new Set(items.map(item => item.category))];

        // Render Categories
        uniqueCategories.forEach(cat => {
            if (cat === 'all') return;
            const btn = document.createElement('button');
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            btn.dataset.filter = cat;
            categoriesContainer.appendChild(btn);
        });

        // Click handler for categories
        categoriesContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.categories button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderItems(e.target.dataset.filter);
            }
        });

        // Initial Render
        renderItems('all');

        function renderItems(filter) {
            grid.innerHTML = '';

            const filteredItems = filter === 'all'
                ? items
                : items.filter(item => item.category === filter);

            filteredItems.forEach((item, index) => {
                const a = document.createElement('a'); // Change to anchor tag
                a.href = `project.html?id=${item.id}`;
                a.className = 'portfolio-item fade-in-up';
                a.style.animationDelay = `${index * 0.1}s`;
                a.style.display = 'block'; // Make anchor behave like block div

                a.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <h4>${item.title}</h4>
                        <p>${item.category}</p>
                    </div>
                `;
                grid.appendChild(a);
            });
        }
    }

    function renderBusiness(business) {
        const elName = document.getElementById('business-name');
        if (!elName) return;

        elName.textContent = business.name;
        document.getElementById('business-desc').textContent = business.description;

        const link = document.getElementById('business-link');
        link.href = business.link;
        link.innerHTML = `${business.linkText} <span class="arrow">→</span>`;
    }

    /* --- Project Page Functions --- */
    let currentImageIndex = 0;
    let galleryImages = [];

    function renderProjectPage(portfolioItems, moodboardItems) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        // Search in Portfolio items first, then Moodboard items
        let project = portfolioItems.find(p => p.id === projectId);
        if (!project && moodboardItems) {
            project = moodboardItems.find(p => p.id === projectId);
        }

        if (!project) {
            document.querySelector('.project-header').innerHTML = '<div class="container"><h1>Project not found</h1></div>';
            return;
        }

        document.title = `${project.title} | Wicaksono`;
        document.getElementById('project-category').textContent = project.category;
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-desc').textContent = project.description;

        const galleryGrid = document.getElementById('project-gallery-grid');
        const images = project.gallery || [project.image];
        galleryImages = images; // Store for lightbox navigation

        images.forEach((imgUrl, index) => {
            const div = document.createElement('div');
            div.className = 'project-image fade-in-up';
            div.style.animationDelay = `${index * 0.1}s`;

            div.innerHTML = `<img src="${imgUrl}" alt="${project.title} image ${index + 1}">`;

            // Add click event for lightbox
            div.addEventListener('click', () => openLightbox(index));

            galleryGrid.appendChild(div);
        });

        // Initialize lightbox controls
        initLightbox();
    }

    // Lightbox Functions
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (!lightbox) return; // Not on project page

        // Close button
        closeBtn.addEventListener('click', closeLightbox);

        // Navigation buttons
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);

        // Click outside image to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const counter = document.getElementById('lightbox-counter');

        lightboxImage.src = galleryImages[currentImageIndex];
        lightboxImage.alt = `Image ${currentImageIndex + 1}`;
        counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        const counter = document.getElementById('lightbox-counter');

        lightboxImage.src = galleryImages[currentImageIndex];
        lightboxImage.alt = `Image ${currentImageIndex + 1}`;
        counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }

});
