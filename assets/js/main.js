/* ==========================================================================
   AURELIA GLOBAL HEALTH — MAIN INTERACTIVE CONTROLLER
   Handles Theme Toggle, Navbar, Dropdowns, Filtering, Modals, FAQs & Forms
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME MANAGEMENT (LIGHT / DARK)
     ------------------------------------------------------------------------ */
  const THEME_STORAGE_KEY = 'aurelia_theme_preference';

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore storage errors
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      btn.setAttribute('title', `Switch to ${nextTheme} theme`);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  // Apply immediately
  applyTheme(getInitialTheme());

  function initThemeToggle() {
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch (e) {
          // ignore
        }
        applyTheme(next);
      });
    });
  }

  /* ------------------------------------------------------------------------
     1b. RTL (RIGHT-TO-LEFT) DIRECTION MANAGEMENT
     ------------------------------------------------------------------------ */
  const RTL_STORAGE_KEY = 'aurelia_direction_preference';

  function getInitialDirection() {
    try {
      const saved = localStorage.getItem(RTL_STORAGE_KEY);
      if (saved === 'rtl' || saved === 'ltr') return saved;
    } catch (e) {
      // ignore
    }
    return document.documentElement.getAttribute('dir') || 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    const rtlButtons = document.querySelectorAll('.rtl-toggle');
    rtlButtons.forEach((btn) => {
      // inside rtl button only rtl text should be there as requested
      btn.textContent = 'RTL';
      btn.setAttribute('aria-pressed', dir === 'rtl' ? 'true' : 'false');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
      if (dir === 'rtl') {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  applyDirection(getInitialDirection());

  function initRtlToggle() {
    applyDirection(document.documentElement.getAttribute('dir') || 'ltr');
    document.querySelectorAll('.rtl-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        try {
          localStorage.setItem(RTL_STORAGE_KEY, next);
        } catch (e) {
          // ignore
        }
        applyDirection(next);
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. GRACEFUL HIGH-DPI SVG FALLBACK FOR IMAGES
     ------------------------------------------------------------------------ */
  function createSvgFallbackDataUri(label) {
    const safeLabel = (label || 'Aurelia Global Healthcare')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 48);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B192C"/>
          <stop offset="55%" stop-color="#15314F"/>
          <stop offset="100%" stop-color="#1D6F72"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <circle cx="680" cy="110" r="180" fill="#C5A880" fill-opacity="0.12"/>
      <circle cx="120" cy="420" r="210" fill="#2A8C8F" fill-opacity="0.18"/>
      <g stroke="#C5A880" stroke-opacity="0.28" stroke-width="1.5" fill="none">
        <rect x="48" y="48" width="704" height="404" rx="12"/>
        <line x1="48" y1="360" x2="752" y2="360"/>
      </g>
      <g transform="translate(80, 175)">
        <rect x="0" y="0" width="56" height="56" rx="12" fill="#C5A880" fill-opacity="0.2" stroke="#C5A880" stroke-width="1.5"/>
        <path d="M28 16v24M16 28h24" stroke="#DFCBB0" stroke-width="3" stroke-linecap="round"/>
        <text x="76" y="24" fill="#DFCBB0" font-family="sans-serif" font-size="13" font-weight="700" letter-spacing="2">AURELIA GLOBAL HEALTH</text>
        <text x="76" y="50" fill="#FFFFFF" font-family="sans-serif" font-size="22" font-weight="700">${safeLabel}</text>
      </g>
      <text x="80" y="405" fill="#CBD5E1" font-family="sans-serif" font-size="14">International Healthcare Coordination &amp; Partner Hospital Network</text>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function initImageFallbacks() {
    document.querySelectorAll('img').forEach((img) => {
      const handleError = () => {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = 'true';
        img.src = createSvgFallbackDataUri(img.alt || 'International Medical Facility');
      };
      img.addEventListener('error', handleError);
      if (img.complete && img.naturalWidth === 0) {
        handleError();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. STICKY HEADER, DROPDOWN & MOBILE HAMBURGER MENU
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    // Sticky scroll state
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 16) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Home dropdown toggle (works on click for both mobile & desktop accessibility)
    dropdownItems.forEach((item) => {
      const trigger = item.querySelector('.dropdown-toggle');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.toggle('dropdown-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    // Close dropdown & mobile menu on outside click
    document.addEventListener('click', (e) => {
      dropdownItems.forEach((item) => {
        if (!item.contains(e.target)) {
          item.classList.remove('dropdown-open');
          const trigger = item.querySelector('.dropdown-toggle');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (navMenu && mobileToggle && navMenu.classList.contains('is-open')) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Escape key closes open menus and modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach((item) => {
          item.classList.remove('dropdown-open');
          const trigger = item.querySelector('.dropdown-toggle');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
        if (navMenu && mobileToggle && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.focus();
        }
        closeActiveModal();
      }
    });

    // Reset mobile menu on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && navMenu && mobileToggle) {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. UNIVERSAL DETAILS MODAL (HOSPITALS & TREATMENTS)
     ------------------------------------------------------------------------ */
  let modalBackdrop = null;

  function ensureModalExists() {
    if (modalBackdrop) return modalBackdrop;
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    modalBackdrop.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <span class="badge badge-sample" id="modal-badge">Sample Profile</span>
            <h3 id="modal-title" style="margin-top: 6px;">Details</h3>
          </div>
          <button type="button" class="modal-close" aria-label="Close details dialog">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    modalBackdrop.querySelector('.modal-close').addEventListener('click', closeActiveModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeActiveModal();
    });

    return modalBackdrop;
  }

  function openHospitalModal(hospitalId) {
    if (!window.AURELIA_DATA || !window.AURELIA_DATA.hospitals) return;
    const hospital = window.AURELIA_DATA.hospitals.find((h) => h.id === hospitalId);
    if (!hospital) return;

    const modal = ensureModalExists();
    modal.querySelector('#modal-badge').textContent = `${hospital.sampleBadge} — ${hospital.city}, ${hospital.country}`;
    modal.querySelector('#modal-title').textContent = hospital.name;

    const body = modal.querySelector('#modal-body');
    body.innerHTML = `
      <div style="border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16 / 8.5; margin-bottom: var(--space-5); background: var(--color-navy-900);">
        <img src="${hospital.image}" alt="${hospital.name}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="compliance-banner" style="margin-bottom: var(--space-5);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <div class="compliance-banner-text">
          <strong>Demonstration Data Notice:</strong> This profile is fictional sample content created for template demonstration. Template buyers can replace all fields with verified partner hospital credentials.
        </div>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-5);">${hospital.overview}</p>
      
      <div class="grid-2" style="margin-bottom: var(--space-5);">
        <div style="background: var(--bg-surface-alt); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <h4 style="margin-bottom: var(--space-2); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">Specialty Focus Areas</h4>
          <div class="tag-list" style="margin-bottom: 0;">
            ${hospital.specialties.map((s) => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
        <div style="background: var(--bg-surface-alt); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <h4 style="margin-bottom: var(--space-2); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">Language Support</h4>
          <div class="tag-list" style="margin-bottom: 0;">
            ${hospital.languages.map((l) => `<span class="tag">${l}</span>`).join('')}
          </div>
        </div>
      </div>

      <h4 style="margin-bottom: var(--space-3);">Available International Patient Facilities &amp; Services</h4>
      <ul class="procedure-list" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-bottom: var(--space-5);">
        ${hospital.facilities.map((f) => `<li>${f}</li>`).join('')}
      </ul>

      <div style="background: var(--bg-subtle-teal); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: var(--space-6); font-size: 0.88rem; color: var(--text-secondary);">
        <strong style="color: var(--text-primary);">Coordination Protocol:</strong> ${hospital.coordinationNote}
      </div>

      <div class="modal-footer-actions">
        <button type="button" class="btn btn-secondary modal-cancel-btn">Close Window</button>
        <a href="contact.html?destination=${encodeURIComponent(hospital.country)}&hospital=${encodeURIComponent(hospital.name)}" class="btn btn-primary">
          Request Coordination for This Facility
        </a>
      </div>
    `;

    body.querySelector('.modal-cancel-btn').addEventListener('click', closeActiveModal);
    initImageFallbacks();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function openTreatmentModal(treatmentId) {
    if (!window.AURELIA_DATA || !window.AURELIA_DATA.treatments) return;
    const treatment = window.AURELIA_DATA.treatments.find((t) => t.id === treatmentId);
    if (!treatment) return;

    const modal = ensureModalExists();
    modal.querySelector('#modal-badge').textContent = 'Educational Treatment Overview';
    modal.querySelector('#modal-title').textContent = treatment.name;

    const body = modal.querySelector('#modal-body');
    body.innerHTML = `
      <div style="border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16 / 8; margin-bottom: var(--space-5); background: var(--color-navy-900);">
        <img src="${treatment.image}" alt="${treatment.name}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="compliance-banner" style="margin-bottom: var(--space-5);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <div class="compliance-banner-text">
          <strong>Educational Information Only:</strong> Content is general and educational. Aurelia Global Health is a non-clinical facilitator and does not provide medical advice or guarantee outcomes. Clinical suitability is determined solely by treating physicians.
        </div>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-5);">${treatment.educationalOverview}</p>

      <h4 style="margin-bottom: var(--space-3);">Commonly Coordinated Procedures &amp; Evaluations</h4>
      <ul class="procedure-list" style="margin-bottom: var(--space-5);">
        ${treatment.commonProcedures.map((p) => `<li>${p}</li>`).join('')}
      </ul>

      <h4 style="margin-bottom: var(--space-2);">Related Clinical Specialties</h4>
      <div class="tag-list" style="margin-bottom: var(--space-5);">
        ${treatment.relatedSpecialties.map((s) => `<span class="tag">${s}</span>`).join('')}
      </div>

      <div style="background: var(--bg-subtle-teal); padding: var(--space-4); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: var(--space-6); font-size: 0.88rem; color: var(--text-secondary);">
        <strong style="color: var(--text-primary);">Typical Pre-Evaluation Records Requested by Hospitals:</strong> ${treatment.coordinationConsiderations}
      </div>

      <div class="modal-footer-actions">
        <button type="button" class="btn btn-secondary modal-cancel-btn">Close Overview</button>
        <a href="contact.html?treatment=${encodeURIComponent(treatment.shortName)}" class="btn btn-primary">
          Enquire About ${treatment.shortName}
        </a>
      </div>
    `;

    body.querySelector('.modal-cancel-btn').addEventListener('click', closeActiveModal);
    initImageFallbacks();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeActiveModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function initModalTriggers() {
    document.addEventListener('click', (e) => {
      const hospBtn = e.target.closest('[data-hospital-modal]');
      if (hospBtn) {
        e.preventDefault();
        openHospitalModal(hospBtn.getAttribute('data-hospital-modal'));
        return;
      }

      const treatBtn = e.target.closest('[data-treatment-modal]');
      if (treatBtn) {
        e.preventDefault();
        openTreatmentModal(treatBtn.getAttribute('data-treatment-modal'));
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. PARTNER HOSPITALS PAGE FILTERING (hospitals.html)
     ------------------------------------------------------------------------ */
  function initHospitalFilters() {
    const grid = document.getElementById('hospitals-directory-grid');
    if (!grid || !window.AURELIA_DATA) return;

    const searchInput = document.getElementById('hospital-search');
    const countrySelect = document.getElementById('hospital-country-filter');
    const specialtySelect = document.getElementById('hospital-specialty-filter');
    const resetBtn = document.getElementById('hospital-filter-reset');
    const countEl = document.getElementById('hospital-results-count');
    const regionPills = document.querySelectorAll('[data-region-pill]');

    let activeRegion = 'all';

    // Check URL params for pre-selected country or specialty
    const params = new URLSearchParams(window.location.search);
    if (params.get('country') && countrySelect) {
      countrySelect.value = params.get('country');
    }
    if (params.get('specialty') && specialtySelect) {
      specialtySelect.value = params.get('specialty');
    }
    if (params.get('q') && searchInput) {
      searchInput.value = params.get('q');
    }

    function renderHospitals() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const country = countrySelect ? countrySelect.value : 'all';
      const specialty = specialtySelect ? specialtySelect.value : 'all';

      const filtered = window.AURELIA_DATA.hospitals.filter((h) => {
        const matchesRegion = activeRegion === 'all' || h.region === activeRegion;
        const matchesCountry = country === 'all' || h.country.toLowerCase() === country.toLowerCase();
        const matchesSpecialty =
          specialty === 'all' ||
          h.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()));
        const matchesQuery =
          !query ||
          h.name.toLowerCase().includes(query) ||
          h.city.toLowerCase().includes(query) ||
          h.country.toLowerCase().includes(query) ||
          h.shortIntro.toLowerCase().includes(query) ||
          h.specialties.some((s) => s.toLowerCase().includes(query));

        return matchesRegion && matchesCountry && matchesSpecialty && matchesQuery;
      });

      if (countEl) {
        countEl.textContent = `Showing ${filtered.length} of ${window.AURELIA_DATA.hospitals.length} sample hospital profiles`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <h3 style="margin-bottom: var(--space-2);">No Matching Sample Hospital Profiles</h3>
            <p class="text-muted" style="margin-bottom: var(--space-5);">Try clearing your search query or selecting another country or medical specialty.</p>
            <button type="button" class="btn btn-primary" id="empty-reset-hospitals">Reset All Filters</button>
          </div>
        `;
        const emptyReset = document.getElementById('empty-reset-hospitals');
        if (emptyReset) emptyReset.addEventListener('click', resetFilters);
        return;
      }

      grid.innerHTML = filtered
        .map(
          (h) => `
        <article class="card" data-hospital-id="${h.id}">
          <div class="card-media">
            <img src="${h.image}" alt="${h.name} — ${h.city}, ${h.country}" loading="lazy">
            <div class="card-badges">
              <span class="badge badge-location">${h.city}, ${h.country}</span>
              <span class="badge badge-sample">${h.sampleBadge}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-meta">${h.region} &bull; International Patient Desk</div>
            <h3 class="card-title">${h.name}</h3>
            <p class="card-text">${h.shortIntro}</p>
            <div style="margin-bottom: var(--space-3);">
              <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 6px;">Key Specialties</div>
              <div class="tag-list" style="margin-bottom: 0;">
                ${h.specialties.map((s) => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
            <div style="margin-bottom: var(--space-4);">
              <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 6px;">International Facilities</div>
              <ul class="procedure-list" style="margin-bottom: 0;">
                ${h.facilities.slice(0, 3).map((f) => `<li>${f}</li>`).join('')}
              </ul>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-hospital-modal="${h.id}">
                View Hospital Details
              </button>
              <a href="contact.html?destination=${encodeURIComponent(h.country)}&hospital=${encodeURIComponent(h.name)}" class="btn btn-primary btn-sm">
                Enquire
              </a>
            </div>
          </div>
        </article>
      `
        )
        .join('');

      initImageFallbacks();
    }

    function resetFilters() {
      if (searchInput) searchInput.value = '';
      if (countrySelect) countrySelect.value = 'all';
      if (specialtySelect) specialtySelect.value = 'all';
      activeRegion = 'all';
      regionPills.forEach((p) => p.classList.toggle('active', p.getAttribute('data-region-pill') === 'all'));
      renderHospitals();
    }

    if (searchInput) searchInput.addEventListener('input', renderHospitals);
    if (countrySelect) countrySelect.addEventListener('change', renderHospitals);
    if (specialtySelect) specialtySelect.addEventListener('change', renderHospitals);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    regionPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        activeRegion = pill.getAttribute('data-region-pill') || 'all';
        regionPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderHospitals();
      });
    });

    renderHospitals();
  }

  /* ------------------------------------------------------------------------
     6. TREATMENTS DISCOVERY FILTERING (treatments.html)
     ------------------------------------------------------------------------ */
  function initTreatmentFilters() {
    const grid = document.getElementById('treatments-directory-grid');
    if (!grid || !window.AURELIA_DATA) return;

    const searchInput = document.getElementById('treatment-search');
    const categorySelect = document.getElementById('treatment-category-select');
    const resetBtn = document.getElementById('treatment-filter-reset');
    const countEl = document.getElementById('treatment-results-count');
    const groupPills = document.querySelectorAll('[data-treatment-group]');

    let activeGroup = 'all';

    const params = new URLSearchParams(window.location.search);
    if (params.get('category') && categorySelect) {
      categorySelect.value = params.get('category');
    }
    if (params.get('q') && searchInput) {
      searchInput.value = params.get('q');
    }

    function renderTreatments() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const selectedCat = categorySelect ? categorySelect.value : 'all';

      const filtered = window.AURELIA_DATA.treatments.filter((t) => {
        const matchesGroup = activeGroup === 'all' || t.group === activeGroup;
        const matchesCat = selectedCat === 'all' || t.id === selectedCat;
        const matchesQuery =
          !query ||
          t.name.toLowerCase().includes(query) ||
          t.shortIntro.toLowerCase().includes(query) ||
          t.commonProcedures.some((p) => p.toLowerCase().includes(query)) ||
          t.relatedSpecialties.some((s) => s.toLowerCase().includes(query));

        return matchesGroup && matchesCat && matchesQuery;
      });

      if (countEl) {
        countEl.textContent = `Showing ${filtered.length} of ${window.AURELIA_DATA.treatments.length} medical treatment categories`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <h3 style="margin-bottom: var(--space-2);">No Matching Treatment Categories Found</h3>
            <p class="text-muted" style="margin-bottom: var(--space-5);">Try clearing your search filter or browsing all 10 medical specialties.</p>
            <button type="button" class="btn btn-primary" id="empty-reset-treatments">Show All Treatments</button>
          </div>
        `;
        const emptyBtn = document.getElementById('empty-reset-treatments');
        if (emptyBtn) emptyBtn.addEventListener('click', resetFilters);
        return;
      }

      grid.innerHTML = filtered
        .map(
          (t) => `
        <article class="card treatment-card" id="category-${t.id}">
          <div class="card-media">
            <img src="${t.image}" alt="${t.name}" loading="lazy">
            <div class="card-badges">
              <span class="badge badge-location">Educational Category</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-meta">Medical Travel Specialty</div>
            <h3 class="card-title">${t.name}</h3>
            <p class="card-text">${t.shortIntro}</p>
            <div class="treatment-procedures-block">
              <div class="treatment-sub-heading">Common Procedures &amp; Services</div>
              <ul class="procedure-list" style="margin-bottom: 0;">
                ${t.commonProcedures.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
            <div class="treatment-specialties-block">
              <div class="treatment-sub-heading">Related Specialties</div>
              <div class="tag-list" style="margin-bottom: 0;">
                ${t.relatedSpecialties.map((s) => `<span class="tag">${s}</span>`).join('')}
              </div>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-treatment-modal="${t.id}">
                Category Guide
              </button>
              <a href="contact.html?treatment=${encodeURIComponent(t.shortName)}" class="btn btn-primary btn-sm">
                Enquire Now
              </a>
            </div>
          </div>
        </article>
      `
        )
        .join('');

      initImageFallbacks();
    }

    function resetFilters() {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      activeGroup = 'all';
      groupPills.forEach((p) => p.classList.toggle('active', p.getAttribute('data-treatment-group') === 'all'));
      renderTreatments();
    }

    if (searchInput) searchInput.addEventListener('input', renderTreatments);
    if (categorySelect) categorySelect.addEventListener('change', renderTreatments);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    groupPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        activeGroup = pill.getAttribute('data-treatment-group') || 'all';
        groupPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderTreatments();
      });
    });

    renderTreatments();
  }

  /* ------------------------------------------------------------------------
     7. FAQ ACCORDION CONTROLLER
     ------------------------------------------------------------------------ */
  function initFaqAccordions() {
    document.querySelectorAll('.faq-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. FORMS VALIDATION & URL PARAMETER PRE-FILL (CONTACT, LOGIN, SIGNUP)
     ------------------------------------------------------------------------ */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(input, hasError, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    const errorEl = group.querySelector('.form-error');
    if (hasError) {
      group.classList.add('has-error');
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl && message) errorEl.textContent = message;
    } else {
      group.classList.remove('has-error');
      input.classList.remove('is-invalid');
      input.setAttribute('aria-invalid', 'false');
    }
  }

  function initForms() {
    // 8a. Pre-populate Contact Form from URL query parameters
    const contactForm = document.getElementById('patient-enquiry-form');
    if (contactForm) {
      const params = new URLSearchParams(window.location.search);
      const treatmentParam = params.get('treatment');
      const destinationParam = params.get('destination');
      const hospitalParam = params.get('hospital');

      const treatmentSelect = contactForm.querySelector('[name="treatment"]');
      const destinationSelect = contactForm.querySelector('[name="destination"]');
      const messageInput = contactForm.querySelector('[name="message"]');
      const prefillBanner = document.getElementById('enquiry-prefill-notice');

      if (treatmentParam && treatmentSelect) {
        Array.from(treatmentSelect.options).forEach((opt) => {
          if (opt.value.toLowerCase().includes(treatmentParam.toLowerCase()) || opt.textContent.toLowerCase().includes(treatmentParam.toLowerCase())) {
            treatmentSelect.value = opt.value;
          }
        });
      }

      if (destinationParam && destinationSelect) {
        Array.from(destinationSelect.options).forEach((opt) => {
          if (opt.value.toLowerCase().includes(destinationParam.toLowerCase()) || opt.textContent.toLowerCase().includes(destinationParam.toLowerCase())) {
            destinationSelect.value = opt.value;
          }
        });
      }

      if (hospitalParam && messageInput && !messageInput.value) {
        messageInput.value = `I would like to request non-clinical coordination information regarding ${hospitalParam}.`;
      }

      if ((treatmentParam || destinationParam || hospitalParam) && prefillBanner) {
        prefillBanner.style.display = 'flex';
        const prefillText = prefillBanner.querySelector('.prefill-text');
        if (prefillText) {
          const parts = [];
          if (treatmentParam) parts.push(`Specialty: ${treatmentParam}`);
          if (destinationParam) parts.push(`Destination: ${destinationParam}`);
          if (hospitalParam) parts.push(`Facility: ${hospitalParam}`);
          prefillText.textContent = `Your enquiry form has been pre-populated with your selection (${parts.join(' • ')}). You may adjust any field below.`;
        }
      }

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const fullName = contactForm.querySelector('[name="fullName"]');
        const email = contactForm.querySelector('[name="email"]');
        const phone = contactForm.querySelector('[name="phone"]');
        const residence = contactForm.querySelector('[name="residence"]');
        const treatment = contactForm.querySelector('[name="treatment"]');
        const message = contactForm.querySelector('[name="message"]');
        const consent = contactForm.querySelector('[name="consent"]');

        if (fullName) {
          const err = fullName.value.trim().length < 2;
          setFieldError(fullName, err, 'Please enter your full name.');
          if (err) valid = false;
        }
        if (email) {
          const err = !validateEmail(email.value.trim());
          setFieldError(email, err, 'Please enter a valid email address.');
          if (err) valid = false;
        }
        if (phone) {
          const err = phone.value.trim().length < 6;
          setFieldError(phone, err, 'Please enter a valid phone number with country code.');
          if (err) valid = false;
        }
        if (residence) {
          const err = !residence.value.trim();
          setFieldError(residence, err, 'Please enter or select your country of residence.');
          if (err) valid = false;
        }
        if (treatment) {
          const err = !treatment.value;
          setFieldError(treatment, err, 'Please select a treatment category of interest.');
          if (err) valid = false;
        }
        if (message) {
          const err = message.value.trim().length < 10;
          setFieldError(message, err, 'Please provide a brief summary of your coordination enquiry (at least 10 characters).');
          if (err) valid = false;
        }
        if (consent) {
          const err = !consent.checked;
          setFieldError(consent, err, 'Please confirm that you understand the facilitator role and privacy notice.');
          if (err) valid = false;
        }

        const feedback = document.getElementById('contact-form-feedback');
        if (!valid) {
          if (feedback) {
            feedback.className = 'form-feedback error is-visible';
            feedback.innerHTML = '<strong>Please review the highlighted fields above.</strong> Ensure all required contact details are completed.';
          }
          return;
        }

        if (feedback) {
          const selectedTreatment = treatment ? treatment.value : 'General Enquiry';
          const selectedDest = destinationSelect && destinationSelect.value ? destinationSelect.value : 'Flexible Destination';
          feedback.className = 'form-feedback success is-visible';
          feedback.innerHTML = `
            <h4 style="margin-bottom: 6px; color: inherit;">Enquiry Received — Coordination Reference #AGH-${Math.floor(100000 + Math.random() * 900000)}</h4>
            <p style="font-size: 0.9rem; margin-bottom: 8px;">
              Thank you, <strong>${fullName.value.trim()}</strong>. Your international patient enquiry regarding <strong>${selectedTreatment}</strong> (${selectedDest}) has been logged in this frontend demonstration interface.
            </p>
            <p style="font-size: 0.82rem; opacity: 0.9;">
              <strong>Next Step in a Live Deployment:</strong> An International Patient Coordinator contacts you via your preferred method to arrange a secure, encrypted hospital transfer link for any clinical documents.
            </p>
          `;
          contactForm.reset();
        }
      });
    }

    // 8b. Password Show/Hide Toggles
    document.querySelectorAll('.password-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.password-wrapper');
        if (!wrapper) return;
        const input = wrapper.querySelector('input');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'Hide' : 'Show';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });

    // 8c. Login Form UI Interaction
    const loginForm = document.getElementById('patient-login-form');
    if (loginForm) {
      const forgotTrigger = document.getElementById('forgot-password-trigger');
      const forgotBox = document.getElementById('forgot-password-box');

      if (forgotTrigger && forgotBox) {
        forgotTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          const isHidden = forgotBox.style.display === 'none' || !forgotBox.style.display;
          forgotBox.style.display = isHidden ? 'block' : 'none';
        });
      }

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const email = loginForm.querySelector('[name="email"]');
        const password = loginForm.querySelector('[name="password"]');

        if (email) {
          const err = !validateEmail(email.value.trim());
          setFieldError(email, err, 'Please enter a valid registered email address.');
          if (err) valid = false;
        }
        if (password) {
          const err = password.value.length < 6;
          setFieldError(password, err, 'Please enter your password (minimum 6 characters).');
          if (err) valid = false;
        }

        const feedback = document.getElementById('login-form-feedback');
        if (!valid) {
          if (feedback) {
            feedback.className = 'form-feedback error is-visible';
            feedback.innerHTML = '<strong>Invalid credentials format.</strong> Please check your email and password fields.';
          }
          return;
        }

        if (feedback) {
          feedback.className = 'form-feedback success is-visible';
          feedback.innerHTML = `
            <h4 style="margin-bottom: 4px; color: inherit;">Frontend Authentication UI Demonstration</h4>
            <p style="font-size: 0.88rem;">
              Sign-in validation succeeded for <strong>${email.value.trim()}</strong>. As a ThemeForest / Creative Market frontend template, this page demonstrates the patient authentication interface without connecting to a live backend or medical record database.
            </p>
          `;
        }
      });
    }

    // 8d. Sign Up Form UI Interaction
    const signupForm = document.getElementById('patient-signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const fullName = signupForm.querySelector('[name="fullName"]');
        const email = signupForm.querySelector('[name="email"]');
        const phone = signupForm.querySelector('[name="phone"]');
        const residence = signupForm.querySelector('[name="residence"]');
        const password = signupForm.querySelector('[name="password"]');
        const confirmPassword = signupForm.querySelector('[name="confirmPassword"]');
        const privacyConsent = signupForm.querySelector('[name="privacyConsent"]');

        if (fullName) {
          const err = fullName.value.trim().length < 2;
          setFieldError(fullName, err, 'Please enter your full legal or preferred name.');
          if (err) valid = false;
        }
        if (email) {
          const err = !validateEmail(email.value.trim());
          setFieldError(email, err, 'Please enter a valid email address.');
          if (err) valid = false;
        }
        if (phone) {
          const err = phone.value.trim().length < 5;
          setFieldError(phone, err, 'Please enter a valid phone number.');
          if (err) valid = false;
        }
        if (residence) {
          const err = !residence.value;
          setFieldError(residence, err, 'Please select your country of residence.');
          if (err) valid = false;
        }
        if (password) {
          const err = password.value.length < 8;
          setFieldError(password, err, 'Password must be at least 8 characters long.');
          if (err) valid = false;
        }
        if (confirmPassword && password) {
          const err = !confirmPassword.value || confirmPassword.value !== password.value;
          setFieldError(confirmPassword, err, 'Passwords do not match.');
          if (err) valid = false;
        }
        if (privacyConsent) {
          const err = !privacyConsent.checked;
          setFieldError(privacyConsent, err, 'You must accept the Privacy & Coordination Policy to create an enquiry profile.');
          if (err) valid = false;
        }

        const feedback = document.getElementById('signup-form-feedback');
        if (!valid) {
          if (feedback) {
            feedback.className = 'form-feedback error is-visible';
            feedback.innerHTML = '<strong>Please review the highlighted fields above</strong> to complete your account registration.';
          }
          return;
        }

        if (feedback) {
          feedback.className = 'form-feedback success is-visible';
          feedback.innerHTML = `
            <h4 style="margin-bottom: 4px; color: inherit;">Patient Coordination Profile Created (Frontend Demo)</h4>
            <p style="font-size: 0.88rem; margin-bottom: 8px;">
              Welcome, <strong>${fullName.value.trim()}</strong>. Your registration form passed all validation checks.
            </p>
            <p style="font-size: 0.82rem; opacity: 0.9;">
              Note: This template provides the complete frontend authentication UI ready for integration with your preferred identity provider.
            </p>
          `;
          signupForm.reset();
        }
      });
    }

    // 8e. Home 2 Quick Pathway Finder Form
    const quickFinderForm = document.getElementById('home2-quick-finder');
    if (quickFinderForm) {
      quickFinderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const specialty = quickFinderForm.querySelector('[name="specialty"]')?.value || 'all';
        const country = quickFinderForm.querySelector('[name="country"]')?.value || 'all';
        const params = new URLSearchParams();
        if (country !== 'all') params.set('country', country);
        if (specialty !== 'all') params.set('specialty', specialty);
        window.location.href = 'hospitals.html' + (params.toString() ? '?' + params.toString() : '');
      });
    }

    // Dashboard Mobile Sidebar Toggle & Interactive Upload Demo
    const dashboardSidebarToggle = document.getElementById('dashboard-sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    if (dashboardSidebarToggle && dashboardSidebar) {
      dashboardSidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dashboardSidebar.classList.toggle('is-open');
      });
      document.addEventListener('click', (e) => {
        if (!dashboardSidebar.contains(e.target) && !dashboardSidebarToggle.contains(e.target)) {
          dashboardSidebar.classList.remove('is-open');
        }
      });
    }

    const uploadZone = document.getElementById('report-dropzone');
    const fileInput = document.getElementById('report-file-input');
    const uploadFeedback = document.getElementById('report-upload-feedback');
    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          const fileName = fileInput.files[0].name;
          if (uploadFeedback) {
            uploadFeedback.className = 'form-feedback success is-visible';
            uploadFeedback.innerHTML = `<strong>File "${fileName}" uploaded successfully.</strong> File is encrypted with 256-bit protocol and securely forwarded to your case coordinator for hospital desk review.`;
          }
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. GLOBAL BACK TO TOP BUTTON (ALL PAGES)
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    const toggleVisibility = () => {
      if (window.scrollY > 260) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     INITIALIZE ALL MODULES ON DOM READY
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initRtlToggle();
    initNavigation();
    initImageFallbacks();
    initModalTriggers();
    initHospitalFilters();
    initTreatmentFilters();
    initFaqAccordions();
    initForms();
    initBackToTop();
  });
})();

