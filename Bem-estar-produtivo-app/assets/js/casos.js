document.addEventListener('DOMContentLoaded', function() {
    // Filtro de casos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ativar botão selecionado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrar casos
            caseCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Mostrar/ocultar detalhes do caso
    const detailButtons = document.querySelectorAll('.case-details-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const details = this.nextElementSibling;
            details.classList.toggle('active');
            
            // Alterar texto do botão
            this.textContent = details.classList.contains('active') ? 
                'Ocultar Detalhes' : 'Ver Detalhes';
        });
    });
    
    // Envio de formulário
    const caseForm = document.getElementById('caseStudyForm');
    
    if (caseForm) {
        caseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                companyName: document.getElementById('company-name').value,
                sector: document.getElementById('company-sector').value,
                description: document.getElementById('case-description').value,
                results: document.getElementById('case-results').value,
                date: new Date().toISOString()
            };
            
            // Simular envio (numa aplicação real, seria uma chamada AJAX)
            console.log('Caso enviado:', formData);
            
            // Feedback ao usuário
            alert('Obrigado por compartilhar seu caso! Ele será revisado e pode ser publicado em breve.');
            
            // Resetar formulário
            caseForm.reset();
            
            // Em uma aplicação real:
            // 1. Enviar para o servidor
            // 2. Adicionar à lista de casos pendentes
            // 3. Notificar administradores
        });
    }
    
    // Animação ao rolar a página
    const animateOnScroll = () => {
        caseCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configurar observador de interseção para animações
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    caseCards.forEach(card => {
        observer.observe(card);
    });
    
    // Inicializar animações
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez no carregamento
});