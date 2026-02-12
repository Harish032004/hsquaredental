// Root Canal Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Root Canal Page Loaded');
    
    // ====== MOBILE MENU FUNCTIONALITY ======
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileDropdownArrows = document.querySelectorAll('.mobile-dropdown-arrow');
    
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Mobile dropdown functionality
    mobileDropdownArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const dropdown = this.closest('.mobile-dropdown');
            const menu = dropdown.querySelector('.mobile-dropdown-menu');
            const isActive = menu.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.mobile-dropdown-menu').forEach(m => {
                m.classList.remove('active');
            });
            document.querySelectorAll('.mobile-dropdown-arrow').forEach(a => {
                a.textContent = '+';
            });
            
            // Toggle current dropdown
            if (!isActive) {
                menu.classList.add('active');
                this.textContent = '−';
            }
        });
    });
    
    // ====== RESPONSIVE FIXES ======
    function applyResponsiveFixes() {
        const width = window.innerWidth;
        const isMobile = width <= 768;
        
        // Floating badges adjustment
        const floatingBadges = document.querySelectorAll('.floating-badge');
        floatingBadges.forEach(badge => {
            if (isMobile) {
                badge.style.position = 'relative';
                badge.style.display = 'block';
                badge.style.margin = '20px auto';
                badge.style.width = '90%';
                badge.style.maxWidth = '250px';
                badge.style.animation = 'none';
            } else {
                badge.style.position = 'absolute';
                badge.style.display = 'flex';
                badge.style.margin = '0';
                badge.style.width = 'auto';
                badge.style.maxWidth = 'none';
                badge.style.animation = 'float 3s ease-in-out infinite';
            }
        });
        
        // Prevent horizontal scroll
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
    }
    
    // ====== ACTIVE LINK HIGHLIGHT ======
    function highlightActiveLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-link, .mobile-dropdown-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'rootcanal.html' && link.classList.contains('active'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // ====== SMOOTH SCROLL FOR ANCHOR LINKS ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (mobileNavOverlay.classList.contains('active')) {
                        mobileNavOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Smooth scroll to target
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ====== INITIALIZE ======
    applyResponsiveFixes();
    highlightActiveLink();
    
    // Run on window resize
    window.addEventListener('resize', applyResponsiveFixes);
    
    // Fix for iOS Safari 100vh issue
    function fixVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    fixVH();
    window.addEventListener('resize', fixVH);
    
    // Prevent horizontal scroll on touch
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Fallback for older browsers
if (window.MSInputMethodContext && document.documentMode) {
    document.body.style.msOverflowX = 'hidden';
}