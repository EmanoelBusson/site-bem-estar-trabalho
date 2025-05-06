document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.environment-checklist input[type="checkbox"]');
    const saveButton = document.querySelector('.save-checklist');
    
    // Carregar progresso salvo
    function loadChecklistProgress() {
        const savedProgress = localStorage.getItem('checklistProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = progress[index];
            });
        }
    }
    
    // Salvar progresso
    function saveChecklistProgress() {
        const progress = Array.from(checkboxes).map(checkbox => checkbox.checked);
        localStorage.setItem('checklistProgress', JSON.stringify(progress));
        
        // Feedback visual
        saveButton.textContent = 'Salvo!';
        setTimeout(() => {
            saveButton.textContent = 'Salvar Progresso';
        }, 2000);
    }
    
    saveButton.addEventListener('click', saveChecklistProgress);
    
    // Inicializar
    loadChecklistProgress();
    
    // Adicionar efeito visual as checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.7';
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        });
        
        // Aplicar estilo inicial
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling;
            label.style.textDecoration = 'line-through';
            label.style.opacity = '0.7';
        }
    });
});