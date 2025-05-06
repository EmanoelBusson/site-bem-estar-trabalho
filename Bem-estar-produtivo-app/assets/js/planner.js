document.addEventListener('DOMContentLoaded', function() {
    const plannerGrid = document.querySelector('.planner-grid');
    const plannerTitle = document.getElementById('planner-title');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    let currentDate = new Date();
    
    function renderPlanner() {
        plannerGrid.innerHTML = '';
        
        // Configurar título
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        plannerTitle.textContent = `Semana de ${formatDate(weekStart)} a ${formatDate(weekEnd)}`;
        
        // Criar dias da semana
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);
            
            const dayCard = document.createElement('div');
            dayCard.className = 'planner-day';
            
            const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][i];
            
            dayCard.innerHTML = `
                <h4>${dayName}</h4>
                <div class="planner-date">${dayDate.getDate()}/${dayDate.getMonth() + 1}</div>
                <textarea placeholder="Principais tarefas..."></textarea>
                <div class="day-stats">
                    <label>
                        <input type="checkbox"> Bem-estar
                    </label>
                    <label>
                        <input type="checkbox"> Produtiva
                    </label>
                </div>
            `;
            
            plannerGrid.appendChild(dayCard);
        }
    }
    
    function formatDate(date) {
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    
    prevWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        renderPlanner();
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        renderPlanner();
    });
    
    // Inicializar
    renderPlanner();
    
    // Salvar dados no localStorage
    document.querySelectorAll('.planner-day textarea').forEach(textarea => {
        textarea.addEventListener('change', function() {
            const weekKey = `planner-${currentDate.getFullYear()}-${currentDate.getMonth()}-${Math.floor(currentDate.getDate() / 7)}`;
            const dayIndex = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode);
            
            let plannerData = JSON.parse(localStorage.getItem(weekKey)) || {};
            plannerData[dayIndex] = this.value;
            
            localStorage.setItem(weekKey, JSON.stringify(plannerData));
        });
    });
});