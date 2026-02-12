
(function() {
  'use strict';
  
  // Disable scrolling
  document.body.classList.add('no-scroll');
  
  // Wait for window load
  window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    const heroSection = document.querySelector('.hero-section');
    
    if (!loader) return;
    
    // Start fade out after minimum 2 seconds total
    const minDisplayTime = 2000; // 2 seconds
    const animationStart = performance.now();
    const elapsedTime = performance.now() - animationStart;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    setTimeout(() => {
      // Fade out loader
      loader.classList.add('fade-out');
      
      // Enable scrolling
      document.body.classList.remove('no-scroll');
      
      // Reveal hero section
      if (heroSection) {
        heroSection.classList.add('reveal');
      }
      
      // Remove loader from DOM after transition
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500); // Match CSS transition duration
      
    }, remainingTime);
  });
  
  // Fallback: ensure loader disappears even if load event takes too long
  setTimeout(() => {
    const loader = document.getElementById('loader-wrapper');
    if (loader && loader.classList.contains('fade-out') === false) {
      loader.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.classList.add('reveal');
      }
      
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }
  }, 3000); // 3 second fallback
})();





(function() {
  'use strict';
  
  // Carousel elements
  const carouselTrack = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const dots = document.querySelectorAll('.pagination-dot');
  
  // Carousel state
  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth + 32; // width + gap
  let autoScrollInterval;
  let isHovering = false;
  
  // Calculate visible cards based on screen size
  function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  
  // Update card width on resize
  function updateCardWidth() {
    const trackContainer = document.querySelector('.carousel-track-container');
    const containerWidth = trackContainer.offsetWidth;
    const visibleCards = getVisibleCards();
    const gap = 32; // 2rem gap
    cardWidth = (containerWidth / visibleCards) - (gap * (visibleCards - 1) / visibleCards);
    
    // Update card min-width
    cards.forEach(card => {
      card.style.minWidth = `${cardWidth}px`;
    });
    
    updateCarouselPosition();
  }
  
  // Update carousel position
  function updateCarouselPosition() {
    const translateX = -currentIndex * cardWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    updatePagination();
  }
  
  // Update pagination dots
  function updatePagination() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    const totalSlides = cards.length - getVisibleCards() + 1;
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarouselPosition();
  }
  
  // Next slide
  function nextSlide() {
    const totalSlides = cards.length - getVisibleCards() + 1;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarouselPosition();
  }
  
  // Previous slide
  function prevSlide() {
    const totalSlides = cards.length - getVisibleCards() + 1;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarouselPosition();
  }
  
  // Auto scroll functionality
  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    autoScrollInterval = setInterval(() => {
      if (!isHovering) {
        nextSlide();
      }
    }, 4000); // Scroll every 4 seconds
  }
  
  // Stop auto scroll on hover
  function handleCarouselHover(hovering) {
    isHovering = hovering;
    if (hovering) {
      clearInterval(autoScrollInterval);
    } else {
      startAutoScroll();
    }
  }
  
  // Event Listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoScroll(); // Restart timer after manual navigation
  });
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoScroll(); // Restart timer after manual navigation
  });
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      goToSlide(index);
      startAutoScroll();
    });
  });
  
  // Pause auto-scroll on hover
  const carousel = document.querySelector('.testimonials-carousel');
  carousel.addEventListener('mouseenter', () => handleCarouselHover(true));
  carousel.addEventListener('mouseleave', () => handleCarouselHover(false));
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCardWidth();
      startAutoScroll();
    }, 250);
  });
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    updateCardWidth();
    startAutoScroll();
    
    // Ensure smooth transitions after load
    setTimeout(() => {
      carouselTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 100);
  });
  
  // Pause auto-scroll when tab is not active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoScrollInterval);
    } else {
      startAutoScroll();
    }
  });
  
  // Add touch swipe support
  let startX = 0;
  let isDragging = false;
  
  carouselTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    carouselTrack.style.transition = 'none';
    clearInterval(autoScrollInterval);
  });
  
  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].clientX;
    const walk = (x - startX) * 1.5;
    carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth + walk}px)`;
  });
  
  carouselTrack.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    carouselTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // If swipe distance is significant, change slide
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      updateCarouselPosition();
    }
    
    startAutoScroll();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('button, input, textarea')) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      startAutoScroll();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      startAutoScroll();
    }
  });
})();


(function () {
  'use strict';

  // ===== FORM ELEMENTS =====
  const bookingForm = document.getElementById('bookingForm');
  const patientName = document.getElementById('patientName');
  const patientPhone = document.getElementById('patientPhone');
  const treatmentSelect = document.getElementById('treatment');
  const preferredDate = document.getElementById('preferredDate');
  const submitBtn = bookingForm.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const appointmentContainer = document.querySelector('.appointment-container');

  // ===== CONFIRMATION MODAL =====
  function createConfirmationModal() {
    const modalHTML = `
      <div class="confirmation-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <div class="confirmation-content" style="
          background: white;
          border-radius: 24px;
          padding: 3rem;
          max-width: 500px;
          width: 90%;
          margin: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: translateY(20px);
          transition: transform 0.3s ease;
          text-align: center;
          border: 1px solid rgba(42, 89, 52, 0.1);
        ">
          <div class="confirmation-icon" style="
            width: 80px;
            height: 80px;
            background: rgba(42, 89, 52, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          ">
            <svg viewBox="0 0 24 24" width="40" height="40" style="color: #2A5934;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <h3 class="confirmation-title" style="
            font-size: 1.8rem;
            font-weight: 700;
            color: #2A5934;
            margin-bottom: 1rem;
          ">Appointment Booked Successfully!</h3>
          
          <p class="confirmation-message" style="
            color: #6B7280;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          ">Your appointment request has been received. We'll contact you within 30 minutes to confirm your slot.</p>
          
          <div class="booking-details" style="
            background: #F8FAF9;
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          ">
            <div class="detail-item" style="margin-bottom: 0.8rem;">
              <span style="color: #4B5563; font-weight: 600;">Patient Name:</span>
              <span style="color: #2A5934; margin-left: 0.5rem;" id="detail-name"></span>
            </div>
            <div class="detail-item" style="margin-bottom: 0.8rem;">
              <span style="color: #4B5563; font-weight: 600;">Contact:</span>
              <span style="color: #2A5934; margin-left: 0.5rem;" id="detail-phone"></span>
            </div>
            <div class="detail-item" style="margin-bottom: 0.8rem;">
              <span style="color: #4B5563; font-weight: 600;">Treatment:</span>
              <span style="color: #2A5934; margin-left: 0.5rem;" id="detail-treatment"></span>
            </div>
            <div class="detail-item">
              <span style="color: #4B5563; font-weight: 600;">Preferred Date:</span>
              <span style="color: #2A5934; margin-left: 0.5rem;" id="detail-date"></span>
            </div>
          </div>
          
          <div class="modal-buttons" style="display: flex; gap: 1rem;">
            <button type="button" class="modal-btn whatsapp-btn" id="whatsappConfirmBtn" style="
              flex: 1;
              background: #25D366;
              color: white;
              border: none;
              border-radius: 12px;
              padding: 1rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              transition: all 0.3s ease;
            ">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88z"/>
              </svg>
              Open WhatsApp
            </button>
            <button type="button" class="modal-btn close-btn" id="closeModalBtn" style="
              flex: 1;
              background: #F8FAF9;
              color: #2A5934;
              border: 2px solid rgba(42, 89, 52, 0.2);
              border-radius: 12px;
              padding: 1rem;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            ">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.querySelector('.confirmation-modal');
  }

  // Initialize modal
  const confirmationModal = createConfirmationModal();

  // ===== SET MIN DATE =====
  function setMinDate() {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    preferredDate.min = minDate;

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    preferredDate.value = defaultDate.toISOString().split('T')[0];
  }

  // ===== PHONE FORMAT & VALIDATION =====
  function formatPhoneNumber() {
    let value = patientPhone.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    patientPhone.value = value;

    if (value.length === 10) {
      patientPhone.setCustomValidity('');
      patientPhone.style.borderColor = '';
    } else {
      patientPhone.setCustomValidity('Invalid phone number');
    }
  }

  // ===== ERROR HANDLING =====
  function showError(input, message) {
    const group = input.closest('.form-group');
    let error = group.querySelector('.error-message');

    if (!error) {
      error = document.createElement('div');
      error.className = 'error-message';
      group.appendChild(error);
    }

    error.textContent = message;
    error.style.color = '#DC2626';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '6px';
    error.style.animation = 'fadeIn 0.3s ease';

    input.style.borderColor = '#DC2626';
    input.style.animation = 'shake 0.3s ease';
    
    setTimeout(() => {
      input.style.animation = '';
    }, 300);
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    const error = group.querySelector('.error-message');
    if (error) error.remove();
    input.style.borderColor = '';
  }

  // Add shake animation
  if (!document.querySelector('#animations')) {
    const style = document.createElement('style');
    style.id = 'animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // ===== FORM VALIDATION =====
  function validateForm() {
    let valid = true;
    const errors = [];

    if (patientName.value.trim().length < 2) {
      showError(patientName, 'Please enter your full name');
      errors.push('name');
      valid = false;
    } else {
      clearError(patientName);
    }

    if (!/^[0-9]{10}$/.test(patientPhone.value)) {
      showError(patientPhone, 'Please enter a valid 10-digit phone number');
      errors.push('phone');
      valid = false;
    } else {
      clearError(patientPhone);
    }

    if (!treatmentSelect.value) {
      showError(treatmentSelect, 'Please select a treatment');
      errors.push('treatment');
      valid = false;
    } else {
      clearError(treatmentSelect);
    }

    if (!preferredDate.value) {
      showError(preferredDate, 'Please select a preferred date');
      errors.push('date');
      valid = false;
    } else {
      clearError(preferredDate);
    }

    const selectedTime = document.querySelector('input[name="time"]:checked');
    if (!selectedTime) {
      errors.push('time');
      valid = false;
    }

    return valid;
  }

  // ===== SHOW SUCCESS MODAL =====
  function showSuccessModal(formData) {
    // Update modal content
    document.getElementById('detail-name').textContent = formData.name;
    document.getElementById('detail-phone').textContent = formData.phone;
    document.getElementById('detail-treatment').textContent = formData.treatment;
    document.getElementById('detail-date').textContent = formData.date;
    
    // Store WhatsApp message for later use
    const modal = document.querySelector('.confirmation-modal');
    modal.setAttribute('data-whatsapp-message', formData.whatsappMessage);
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('.confirmation-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Disable scroll on body
    document.body.style.overflow = 'hidden';
  }

  // ===== CLOSE MODAL =====
  function closeModal() {
    const modal = document.querySelector('.confirmation-modal');
    modal.style.opacity = '0';
    modal.querySelector('.confirmation-content').style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  // ===== FORM SUBMIT =====
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      // Add subtle shake to form for attention
      bookingForm.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        bookingForm.style.animation = '';
      }, 500);
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.textContent = 'Processing...';

    const selectedTime = document.querySelector('input[name="time"]:checked');

    const formData = {
      name: patientName.value.trim(),
      phone: patientPhone.value,
      treatment: treatmentSelect.options[treatmentSelect.selectedIndex].text,
      date: new Date(preferredDate.value).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: selectedTime.value
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Create WhatsApp message
    const message = 
      `🦷 *New Appointment Request*%0A%0A` +
      `👤 *Name:* ${formData.name}%0A` +
      `📱 *Phone:* ${formData.phone}%0A` +
      `🩺 *Treatment:* ${formData.treatment}%0A` +
      `📅 *Date:* ${formData.date}%0A` +
      `⏰ *Time:* ${formData.time}%0A%0A` +
      `_This booking was made via the website_`;
    
    formData.whatsappMessage = message;

    // Show success modal instead of directly opening WhatsApp
    showSuccessModal(formData);

    // Reset form
    bookingForm.reset();
    setMinDate();

    // Reset button
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    btnText.textContent = 'Book Appointment Now';
  }

  // ===== EVENT LISTENERS =====
  patientPhone.addEventListener('input', formatPhoneNumber);
  bookingForm.addEventListener('submit', handleSubmit);

  // Modal event listeners
  document.addEventListener('click', function(e) {
    const modal = document.querySelector('.confirmation-modal');
    
    // Close modal when clicking outside or on close button
    if (e.target === modal || e.target.id === 'closeModalBtn') {
      closeModal();
    }
    
    // Open WhatsApp when clicking WhatsApp button
    if (e.target.id === 'whatsappConfirmBtn' || e.target.closest('#whatsappConfirmBtn')) {
      const message = modal.getAttribute('data-whatsapp-message');
      const whatsappNumber = '919042779903';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      window.open(whatsappURL, '_blank');
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Real-time validation
  const inputs = [patientName, patientPhone, treatmentSelect, preferredDate];
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) validateForm();
    });
  });

  // Initialize
  setMinDate();

  // Add success animation to form submission
  submitBtn.addEventListener('click', function() {
    if (bookingForm.checkValidity()) {
      this.style.animation = 'successPulse 0.5s ease';
      setTimeout(() => {
        this.style.animation = '';
      }, 500);
    }
  });
})();



// NAVIGATION - DEBUGGED VERSION
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    // ====== MOBILE MENU TOGGLE ======
    function toggleMobileMenu() {
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (isActive) {
            // Close menu
            closeMobileMenu();
        } else {
            // Open menu
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        closeAllMobileDropdowns();
    }
    
    // Event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // ====== MOBILE DROPDOWNS ======
    function closeAllMobileDropdowns() {
        document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            const arrow = dropdown.querySelector('.mobile-dropdown-arrow');
            const menu = dropdown.querySelector('.mobile-dropdown-menu');
            if (arrow) arrow.textContent = '+';
            if (menu) menu.style.maxHeight = '0';
        });
    }
    
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
        const arrow = toggle.querySelector('.mobile-dropdown-arrow');
        const dropdown = toggle.closest('.mobile-dropdown');
        const dropdownMenu = dropdown.querySelector('.mobile-dropdown-menu');
        
        // Initialize
        dropdownMenu.style.maxHeight = '0';
        arrow.textContent = '+';
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = dropdown.classList.contains('active');
            
            // Close all dropdowns first
            closeAllMobileDropdowns();
            
            // If this dropdown wasn't active, open it
            if (!isActive) {
                dropdown.classList.add('active');
                arrow.textContent = '−';
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
            }
        });
    });
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-link').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // ====== DESKTOP HOVER ======
    // Pure CSS - no JavaScript needed
    
    // ====== WINDOW RESIZE ======
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 769) {
            closeMobileMenu();
        }
    });
});


// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Announcement Bar Elements
    const announcementBar = document.getElementById('announcementBar');
    const announcementClose = document.getElementById('announcementClose');
    const siteHeader = document.getElementById('siteHeader');
    
    // Check if user previously closed the announcement
    const announcementClosed = localStorage.getItem('announcementClosed');
    
    // If announcement was closed, hide it
    if (announcementClosed === 'true') {
        announcementBar.classList.add('hidden');
        siteHeader.classList.add('no-announcement');
    }
    
    // Close announcement when X is clicked
    if (announcementClose) {
        announcementClose.addEventListener('click', function() {
            announcementBar.classList.add('hidden');
            siteHeader.classList.add('no-announcement');
            
            // Remember user's preference for 24 hours
            localStorage.setItem('announcementClosed', 'true');
            
            // Remove after 24 hours
            setTimeout(() => {
                localStorage.removeItem('announcementClosed');
            }, 24 * 60 * 60 * 1000);
        });
    }
    
    // Auto-hide on scroll for mobile
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide
                announcementBar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show
                announcementBar.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        }
    });
    
    // Language selector functionality
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            // You can add language switching logic here
            alert('Language selection feature coming soon!');
        });
    }
});



// Add this function to fix display issues
function fixPageDisplay() {
    // 1. Ensure body is visible
    document.body.style.display = 'block';
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // 2. Fix floating badges position
    const badges = document.querySelectorAll('.floating-badge');
    badges.forEach(badge => {
        if (window.innerWidth <= 768) {
            badge.style.position = 'relative';
            badge.style.margin = '15px auto';
            badge.style.display = 'inline-flex';
            badge.style.float = 'none';
        }
    });
    
    // 3. Fix stats text
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(label => {
        label.style.whiteSpace = 'normal';
        label.style.wordWrap = 'break-word';
    });
    
    // 4. Prevent horizontal scroll
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    // 5. Ensure page takes full width
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100%';
}

// Run on load and resize
document.addEventListener('DOMContentLoaded', fixPageDisplay);
window.addEventListener('resize', fixPageDisplay);
window.addEventListener('load', fixPageDisplay);


  
