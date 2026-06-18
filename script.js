/* ==========================================================================
   Premium Portfolio Interactivity Scripts
   Client: Asesh Nayek (Graphic Designer)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Preloader dismissal --- */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
    
    // Trigger animations for the Hero Section immediately on load
    document.querySelectorAll('#home .reveal').forEach(el => {
      el.classList.add('revealed');
    });
  });

  /* --- 2. Sticky Header and Scroll-To-Top Button --- */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-to-top-btn');

  const handleScroll = () => {
    // Add blurred visual background to header once scrolled
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Toggle scroll-to-top button visibility
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  
  // Smooth scroll back to top on click
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* --- 3. Mobile Navigation Menu Toggle --- */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when nav item is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* --- 4. Intersection Observer for Scroll Animations --- */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* --- 5. Skill Progress Bars Animation on Scroll --- */
  const skillsContainer = document.getElementById('skills-bar-container');
  const skillBars = document.querySelectorAll('.skill-progress');

  if (skillsContainer) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsContainer);
  }

  /* --- 6. Active Navigation Link Highlighting on Scroll --- */
  const sections = document.querySelectorAll('section');

  const highlightNav = () => {
    let scrollPosition = window.scrollY + 200; // Offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  /* --- 7. Portfolio Filtering System --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active state of buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterVal === 'all' || itemCategory === filterVal) {
          item.classList.remove('hidden');
          // Scale back in smoothly
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // Fully hide after animation completes
          setTimeout(() => {
            item.classList.add('hidden');
          }, 350);
        }
      });
    });
  });

  /* --- 8. Fullscreen Lightbox Preview --- */
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption-text');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || '';
      const category = item.getAttribute('data-category-label') || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.innerHTML = title ? `<strong>${title}</strong> &mdash; ${category}` : '';
      
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Resume scroll
  };

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close when clicking outside content area
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* --- 9. Before / After Interactive Image Slider --- */
  const rangeInput = document.getElementById('slider-range-input');
  const imgAfterClip = document.getElementById('after-image-clip');
  const dragHandle = document.getElementById('slider-drag-handle');

  if (rangeInput && imgAfterClip && dragHandle) {
    const updateSlider = () => {
      const sliderVal = rangeInput.value;
      // Adjust clip-path polygon percentage on the overlapping "after" image
      imgAfterClip.style.clipPath = `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`;
      // Position handle visually
      dragHandle.style.left = `${sliderVal}%`;
    };

    rangeInput.addEventListener('input', updateSlider);
    // Trigger initial positioning
    updateSlider();
  }

  /* --- 10. Contact Form Visual Validation & Submission --- */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status-message');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Check required fields
      if (!name || !email || !message) {
        showStatus('Please fill out all required fields.', 'error');
        return;
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Visual sending animation state
      formSubmitBtn.disabled = true;
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = 'Sending...';

      // Simulate API form submission post
      setTimeout(() => {
        showStatus('Thank you, Asesh has received your message! I will respond within 24 hours.', 'success');
        contactForm.reset();
        
        // Restore submit button state
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
      }, 1500);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;

    // Smoothly fade out the status alert after 6 seconds
    setTimeout(() => {
      formStatus.style.opacity = '0';
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.style.opacity = '1';
        formStatus.classList.remove('success', 'error');
      }, 400);
    }, 6000);
  }

});
