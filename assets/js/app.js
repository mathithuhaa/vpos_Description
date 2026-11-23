document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close sidebar on item click (mobile)
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  // Dark Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('viepos_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('viepos_theme', 'light');
        themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('viepos_theme', 'dark');
        themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      }
    });
  }

  // Lightbox Modal
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  window.openLightbox = function(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Xem sơ đồ chi tiết';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Attach click to all img-card-body and gallery thumbs
  document.querySelectorAll('.img-card-body, .gallery-thumb').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      if (img) {
        const title = img.alt || el.getAttribute('data-title') || 'Biểu đồ ViePOS';
        openLightbox(img.src, title);
      }
    });
  });

  // Scrollspy
  const sections = document.querySelectorAll('.doc-section');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
          if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = link.querySelector('span')?.textContent || '';
          }
        }
      });
    }
  });

  // Live Instant Search
  const searchInput = document.getElementById('docSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        sections.forEach(sec => sec.style.display = '');
        return;
      }
      sections.forEach(sec => {
        const text = sec.innerText.toLowerCase();
        if (text.includes(q)) {
          sec.style.display = '';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  }

  // Business Rules Search Filter
  const brFilterInput = document.getElementById('brFilterInput');
  if (brFilterInput) {
    brFilterInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#brTableBody tr');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(val) ? '' : 'none';
      });
    });
  }

  // Data Dictionary Search Filter
  const ddFilterInput = document.getElementById('ddFilterInput');
  if (ddFilterInput) {
    ddFilterInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const tables = document.querySelectorAll('.dd-table-block');
      tables.forEach(tb => {
        const text = tb.innerText.toLowerCase();
        tb.style.display = text.includes(val) ? '' : 'none';
      });
    });
  }

  // Gallery Category Filter
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-thumb');
  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('btn-primary'));
        galleryFilterBtns.forEach(b => b.classList.add('btn-outline'));
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');

        const cat = btn.getAttribute('data-cat');
        galleryItems.forEach(item => {
          if (cat === 'all' || item.getAttribute('data-category') === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Interactive ROI Simulator
  const sliderSeats = document.getElementById('sliderSeats');
  const sliderHours = document.getElementById('sliderHours');
  const sliderRatio4h = document.getElementById('sliderRatio4h');

  const valSeats = document.getElementById('valSeats');
  const valHours = document.getElementById('valHours');
  const valRatio4h = document.getElementById('valRatio4h');

  const resOldRev = document.getElementById('resOldRev');
  const resNewRev = document.getElementById('resNewRev');
  const resDeltaProfit = document.getElementById('resDeltaProfit');
  const resPayback = document.getElementById('resPayback');
  const resROI = document.getElementById('resROI');

  function calculateROI() {
    if (!sliderSeats || !sliderHours || !sliderRatio4h) return;

    const seats = parseInt(sliderSeats.value);
    const hours = parseInt(sliderHours.value);
    const ratio4h = parseInt(sliderRatio4h.value) / 100.0;
    const ratioFull = 1.0 - ratio4h;

    valSeats.textContent = seats + ' ghế';
    valHours.textContent = hours + 'h / ngày';
    valRatio4h.textContent = Math.round(ratio4h * 100) + '% 4h / ' + Math.round(ratioFull * 100) + '% Cả ngày';

    // Old As-Is: avg stay 6.5h, 35k/guest
    const oldAvgStay = 6.5;
    const oldTurnover = hours / oldAvgStay;
    const oldDailyGuests = Math.round(seats * oldTurnover);
    const oldDailyRev = oldDailyGuests * 35000;
    const oldMonthlyRev = oldDailyRev * 30;

    // New To-Be:
    // Avg stay for 4h = 3.8h, for full = 8.5h
    const newWeightedStay = (ratio4h * 3.8) + (ratioFull * 8.5);
    const newTurnover = hours / newWeightedStay;
    const newDailyGuests = Math.round(seats * newTurnover);
    const guests4h = Math.round(newDailyGuests * ratio4h);
    const guestsFull = newDailyGuests - guests4h;
    const newDailyRev = (guests4h * 35000) + (guestsFull * 45000);
    const newMonthlyRev = newDailyRev * 30;

    // COGS: 12,000 VND / guest
    const oldMonthlyGrossProfit = oldDailyGuests * (35000 - 12000) * 30;
    const newMonthlyGrossProfit = ((guests4h * (35000 - 12000)) + (guestsFull * (45000 - 12000))) * 30;
    const deltaGrossProfit = newMonthlyGrossProfit - oldMonthlyGrossProfit;

    // Financial investment: CAPEX = 5,700,000 VND, OPEX = 1,100,000 VND/tháng
    const capex = 5700000;
    const opexMonthly = 1100000;
    const netMonthlyBenefit = deltaGrossProfit - opexMonthly;

    // Payback period (months)
    const paybackMonths = netMonthlyBenefit > 0 ? (capex / netMonthlyBenefit) : 999;
    const paybackDays = Math.round(paybackMonths * 30);

    // Year 1 ROI
    const totalCostYear1 = capex + (opexMonthly * 12);
    const netBenefitYear1 = (deltaGrossProfit * 12) - totalCostYear1;
    const roiYear1 = Math.round((netBenefitYear1 / totalCostYear1) * 100);

    // Format VND
    const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';

    if (resOldRev) resOldRev.textContent = fmt(oldDailyRev) + ' / ngày';
    if (resNewRev) resNewRev.textContent = fmt(newDailyRev) + ' / ngày';
    if (resDeltaProfit) resDeltaProfit.textContent = '+' + fmt(deltaGrossProfit) + ' / tháng';
    if (resPayback) resPayback.textContent = paybackDays <= 30 ? `~${paybackDays} ngày` : `${paybackMonths.toFixed(1)} tháng`;
    if (resROI) resROI.textContent = roiYear1 + '%';
  }

  if (sliderSeats && sliderHours && sliderRatio4h) {
    sliderSeats.addEventListener('input', calculateROI);
    sliderHours.addEventListener('input', calculateROI);
    sliderRatio4h.addEventListener('input', calculateROI);
    calculateROI();
  }
});
