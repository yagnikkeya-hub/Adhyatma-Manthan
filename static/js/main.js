function toggleMenu() {
    var navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('open');
    }
}

function toggleDropdown(btn) {
    if (window.innerWidth <= 768) {
        var dropdown = btn.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.toggle('open');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var dateEl = document.getElementById('todayDate');
    if (dateEl) {
        var today = new Date();
        var options = { day: '2-digit', month: 'short' };
        dateEl.textContent = today.toLocaleDateString('en-IN', options);
    }

    
    var welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        welcomeTime.textContent = getCurrentTime();
    }
});

function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}