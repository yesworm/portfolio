// Smooth scroll to projects when clicking arrow
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Optional: Make marquee pause on hover
const marquee = document.querySelector('.marquee-content');
marquee.addEventListener('mouseenter', () => {
    marquee.style.animationPlayState = 'paused';
});

marquee.addEventListener('mouseleave', () => {
    marquee.style.animationPlayState = 'running';
});