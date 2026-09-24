/**
 * ADICIONES A MI DEFENSA (1896): THE LEGALISTIC MIND OF DR. JOSÉ RIZAL
 * Interactive Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const siteHeader = document.getElementById('site-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.main-nav .nav-item');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const printBriefBtn = document.getElementById('btn-print-docket');

  // Search & Filter elements
  const searchInput = document.getElementById('rebuttal-search-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  const categoryPills = document.querySelectorAll('#category-filter-pills .filter-pill');
  const resultsCountText = document.getElementById('results-count-text');
  const expandAllBtn = document.getElementById('btn-expand-all');
  const collapseAllBtn = document.getElementById('btn-collapse-all');
  const rebuttalItems = document.querySelectorAll('.rebuttal-item');

  // Toast notification
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  // Timeline elements
  const timelineItems = document.querySelectorAll('.timeline-item');
  const resetTimelineBtn = document.getElementById('btn-reset-timeline');

  // -------------------------------------------------------------------------
  // 1. Reading Progress Bar & Sticky Header Elevation
  // -------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Active Section Tracking
    highlightActiveNav();
  }, { passive: true });

  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = (window.scrollY || document.documentElement.scrollTop) + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // -------------------------------------------------------------------------
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on nav click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Rebuttal Accordion Interactivity
  // -------------------------------------------------------------------------
  rebuttalItems.forEach(item => {
    const header = item.querySelector('.rebuttal-header');
    const body = item.querySelector('.rebuttal-body');

    header.addEventListener('click', () => {
      toggleAccordionItem(item, header, body);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordionItem(item, header, body);
      }
    });
  });

  function toggleAccordionItem(item, header, body) {
    const isOpen = item.classList.contains('open');

    if (isOpen) {
      item.classList.remove('open');
      header.setAttribute('aria-expanded', 'false');
      body.setAttribute('hidden', '');
    } else {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      body.removeAttribute('hidden');
    }
  }

  function setAllAccordions(open) {
    rebuttalItems.forEach(item => {
      if (item.style.display !== 'none') {
        const header = item.querySelector('.rebuttal-header');
        const body = item.querySelector('.rebuttal-body');

        if (open) {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
          body.removeAttribute('hidden');
        } else {
          item.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
          body.setAttribute('hidden', '');
        }
      }
    });
  }

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => setAllAccordions(true));
  }
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => setAllAccordions(false));
  }

  // By default, open Point 1 and Point 5 (key highlight) for instant engagement
  const point1 = document.querySelector('.rebuttal-item[data-point="1"]');
  const point5 = document.querySelector('.rebuttal-item[data-point="5"]');
  if (point1) {
    point1.classList.add('open');
    point1.querySelector('.rebuttal-header').setAttribute('aria-expanded', 'true');
    point1.querySelector('.rebuttal-body').removeAttribute('hidden');
  }
  if (point5) {
    point5.classList.add('open');
    point5.querySelector('.rebuttal-header').setAttribute('aria-expanded', 'true');
    point5.querySelector('.rebuttal-body').removeAttribute('hidden');
  }

  // -------------------------------------------------------------------------
  // 4. Search and Category Filtering
  // -------------------------------------------------------------------------
  let activeCategory = 'all';
  let searchQuery = '';

  function filterRebuttals() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    rebuttalItems.forEach(item => {
      const categories = (item.getAttribute('data-category') || '').split(' ');
      const categoryMatches = activeCategory === 'all' || categories.includes(activeCategory);

      // Search match in text content
      const textContent = item.textContent.toLowerCase();
      const searchMatches = !query || textContent.includes(query);

      if (categoryMatches && searchMatches) {
        item.style.display = '';
        visibleCount++;

        // If user typed a search term, auto-expand matching items for convenience
        if (query.length > 2) {
          item.classList.add('open');
          item.querySelector('.rebuttal-header').setAttribute('aria-expanded', 'true');
          item.querySelector('.rebuttal-body').removeAttribute('hidden');
        }
      } else {
        item.style.display = 'none';
      }
    });

    // Update count display
    if (resultsCountText) {
      resultsCountText.textContent = `Showing ${visibleCount} of 12 Points`;
    }

    // Toggle clear search button visibility
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterRebuttals();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      filterRebuttals();
      searchInput.focus();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      filterRebuttals();
    });
  });

  // -------------------------------------------------------------------------
  // 5. Timeline Stepper Interactivity
  // -------------------------------------------------------------------------
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      timelineItems.forEach(t => t.classList.remove('active-milestone'));
      item.classList.add('active-milestone');
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        timelineItems.forEach(t => t.classList.remove('active-milestone'));
        item.classList.add('active-milestone');
      }
    });
  });

  if (resetTimelineBtn) {
    resetTimelineBtn.addEventListener('click', () => {
      timelineItems.forEach(t => t.classList.remove('active-milestone'));
      const trialMilestone = document.querySelector('.timeline-item[data-milestone="5"]');
      if (trialMilestone) {
        trialMilestone.classList.add('active-milestone');
        trialMilestone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Copy to Clipboard & Toast System
  // -------------------------------------------------------------------------
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // Delegate copy button clicks
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-quote]');
    if (!copyBtn) return;

    const quoteText = copyBtn.getAttribute('data-quote');
    if (!quoteText) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(quoteText).then(() => {
        showToast("Legal argument copied to clipboard.");
      }).catch(() => {
        fallbackCopy(quoteText);
      });
    } else {
      fallbackCopy(quoteText);
    }
  });

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showToast("Legal argument copied to clipboard.");
    } catch (err) {
      showToast("Failed to copy. Please manually select and copy.");
    }

    document.body.removeChild(textArea);
  }

  // -------------------------------------------------------------------------
  // 7. Print Brief Docket
  // -------------------------------------------------------------------------
  if (printBriefBtn) {
    printBriefBtn.addEventListener('click', () => {
      // Expand all accordion points prior to printing so full content is visible
      setAllAccordions(true);
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }
});
