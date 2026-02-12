
    // Add this script to all pages
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    
    // Hide loader after 500ms
    setTimeout(function() {
        loader.classList.add('hide');
    }, 800);
});

// Show loader when clicking internal links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    
    if (link && 
        link.href.includes(window.location.hostname) && 
        !link.href.includes('#') && 
        link.target !== '_blank') {
        
        // Show loader
        const loader = document.getElementById('pageLoader');
        loader.classList.remove('hide');
    }
});

