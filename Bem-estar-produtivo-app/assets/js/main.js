// Animação simples de fade-in nos elementos
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('section');

    elements.forEach((el, index) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }, index * 300);
    });
});
