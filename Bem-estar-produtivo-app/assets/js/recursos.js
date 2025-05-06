document.addEventListener('DOMContentLoaded', function() {
    // ================== PLANNER SEMANAL ================== //
    let currentWeek = new Date();
    const plannerGrid = document.querySelector('.planner-grid');
    const plannerTitle = document.getElementById('planner-title');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const savePlannerBtn = document.getElementById('save-planner');

    // Inicializar planner
    initPlanner();

    function initPlanner() {
        renderPlanner();
        setupRangeInputs();
        loadPlannerData();
        
        // Event listeners
        prevWeekBtn.addEventListener('click', () => {
            currentWeek.setDate(currentWeek.getDate() - 7);
            renderPlanner();
            showToast('Semana anterior carregada');
        });
        
        nextWeekBtn.addEventListener('click', () => {
            currentWeek.setDate(currentWeek.getDate() + 7);
            renderPlanner();
            showToast('Próxima semana carregada');
        });
        
        savePlannerBtn.addEventListener('click', savePlannerData);
    }

    function renderPlanner() {
        const weekStart = new Date(currentWeek);
        weekStart.setDate(currentWeek.getDate() - currentWeek.getDay());
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        plannerTitle.textContent = `Semana de ${formatDate(weekStart)} a ${formatDate(weekEnd)}`;
        plannerGrid.innerHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);
            
            const dayCard = document.createElement('div');
            dayCard.className = 'planner-day';
            
            const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][i];
            
            dayCard.innerHTML = `
                <h4>${dayName}</h4>
                <div class="planner-date">${dayDate.getDate()}/${dayDate.getMonth() + 1}</div>
                <textarea placeholder="Anote suas tarefas e compromissos..."></textarea>
                <div class="day-stats">
                    <label>
                        <input type="checkbox"> Bem-estar
                    </label>
                    <label>
                        <input type="checkbox"> Produtivo
                    </label>
                </div>
            `;
            
            plannerGrid.appendChild(dayCard);
        }
        
        loadWeekData(weekStart);
    }

    function setupRangeInputs() {
        const ranges = {
            'focus-range': 'focus-hours',
            'care-range': 'care-hours',
            'learn-range': 'learn-hours'
        };
        
        for (const [rangeId, spanId] of Object.entries(ranges)) {
            const range = document.getElementById(rangeId);
            const span = document.getElementById(spanId);
            
            span.textContent = range.value;
            
            range.addEventListener('input', function() {
                span.textContent = this.value;
            });
        }
    }

    function savePlannerData() {
        const weekStart = new Date(currentWeek);
        weekStart.setDate(currentWeek.getDate() - currentWeek.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        // Salvar configurações
        const plannerSettings = {
            focus: document.getElementById('focus-range').value,
            care: document.getElementById('care-range').value,
            learn: document.getElementById('learn-range').value
        };
        localStorage.setItem('plannerSettings', JSON.stringify(plannerSettings));
        
        // Salvar dados da semana
        const tasks = Array.from(document.querySelectorAll('.planner-day textarea')).map(el => el.value);
        const checks = Array.from(document.querySelectorAll('.planner-day input[type="checkbox"]')).map(el => el.checked);
        
        const savedWeeks = JSON.parse(localStorage.getItem('plannerWeeks')) || {};
        savedWeeks[weekKey] = { tasks, checks };
        localStorage.setItem('plannerWeeks', JSON.stringify(savedWeeks));
        
        showToast('Planner salvo com sucesso!');
    }

    function loadPlannerData() {
        const savedData = localStorage.getItem('plannerSettings');
        if (savedData) {
            const { focus, care, learn } = JSON.parse(savedData);
            document.getElementById('focus-range').value = focus;
            document.getElementById('care-range').value = care;
            document.getElementById('learn-range').value = learn;
            
            document.getElementById('focus-hours').textContent = focus;
            document.getElementById('care-hours').textContent = care;
            document.getElementById('learn-hours').textContent = learn;
        }
    }

    function loadWeekData(weekStart) {
        const savedWeeks = JSON.parse(localStorage.getItem('plannerWeeks')) || {};
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (savedWeeks[weekKey]) {
            const textareas = document.querySelectorAll('.planner-day textarea');
            textareas.forEach((textarea, index) => {
                if (savedWeeks[weekKey].tasks[index]) {
                    textarea.value = savedWeeks[weekKey].tasks[index];
                }
            });
            
            const checkboxes = document.querySelectorAll('.planner-day input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                if (savedWeeks[weekKey].checks[index] !== undefined) {
                    checkbox.checked = savedWeeks[weekKey].checks[index];
                }
            });
        }
    }

    // ================== CHECKLISTS ================== //
    const tabBtns = document.querySelectorAll('.tab-btn');
    const checklists = document.querySelectorAll('.checklist');
    const saveChecklistBtns = document.querySelectorAll('.save-checklist-btn');
    const printChecklistBtns = document.querySelectorAll('.print-checklist-btn');
    const resetChecklistBtns = document.querySelectorAll('.reset-checklist-btn');

    // Inicializar checklists
    initChecklists();

    function initChecklists() {
        // Tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                
                // Ativar tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar checklist correspondente
                checklists.forEach(cl => cl.classList.remove('active'));
                document.getElementById(`${tab}-checklist`).classList.add('active');
                
                showToast(`Mostrando checklist para ${btn.textContent}`);
            });
        });
        
        // Botões de ação
        saveChecklistBtns.forEach(btn => {
            btn.addEventListener('click', saveChecklist);
        });
        
        printChecklistBtns.forEach(btn => {
            btn.addEventListener('click', printChecklist);
        });
        
        resetChecklistBtns.forEach(btn => {
            btn.addEventListener('click', resetChecklist);
        });
        
        // Carregar checklists salvos
        loadChecklists();
    }

    function saveChecklist() {
        const activeChecklist = document.querySelector('.checklist.active');
        const checklistId = activeChecklist.id;
        const checkboxes = activeChecklist.querySelectorAll('input[type="checkbox"]');
        
        const progress = Array.from(checkboxes).map(cb => cb.checked);
        localStorage.setItem(checklistId, JSON.stringify(progress));
        
        showToast('Progresso do checklist salvo!');
    }

    function printChecklist() {
        const activeChecklist = document.querySelector('.checklist.active').cloneNode(true);
        
        // Remover botões
        activeChecklist.querySelector('.checklist-actions').remove();
        
        // Abrir janela de impressão
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Checklist de Bem-Estar</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h3 { color: #2c3e50; }
                        ul { list-style: none; padding-left: 0; }
                        li { margin-bottom: 10px; }
                        input[type="checkbox"] { margin-right: 10px; }
                        .checked { text-decoration: line-through; color: #777; }
                    </style>
                </head>
                <body>
                    ${activeChecklist.innerHTML}
                    <p>Impresso em ${new Date().toLocaleString()}</p>
                </body>
            </html>
        `);
        
        // Marcar itens concluídos
        const checkboxes = printWindow.document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                cb.nextElementSibling.classList.add('checked');
            }
            cb.remove(); // Remove os inputs para impressão
        });
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    function resetChecklist() {
        if (confirm('Tem certeza que deseja reiniciar este checklist?')) {
            const activeChecklist = document.querySelector('.checklist.active');
            const checkboxes = activeChecklist.querySelectorAll('input[type="checkbox"]');
            
            checkboxes.forEach(cb => {
                cb.checked = false;
                cb.nextElementSibling.style.textDecoration = 'none';
                cb.nextElementSibling.style.opacity = '1';
            });
            
            showToast('Checklist reiniciado');
        }
    }

    function loadChecklists() {
        checklists.forEach(checklist => {
            const checklistId = checklist.id;
            const savedProgress = localStorage.getItem(checklistId);
            
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
                
                checkboxes.forEach((cb, index) => {
                    cb.checked = progress[index];
                    if (progress[index]) {
                        cb.nextElementSibling.style.textDecoration = 'line-through';
                        cb.nextElementSibling.style.opacity = '0.7';
                    }
                });
            }
        });
    }

    // ================== CALCULADORA DE ROI ================== //
    const calculateBtn = document.getElementById('calculate-roi');
    let roiChart = null;

    calculateBtn.addEventListener('click', calculateROI);

    function calculateROI() {
        // Obter valores dos inputs
        const employees = parseInt(document.getElementById('employees').value) || 0;
        const turnover = parseFloat(document.getElementById('turnover').value) || 0;
        const absenteeism = parseFloat(document.getElementById('absenteeism').value) || 0;
        const salary = parseFloat(document.getElementById('salary').value) || 0;
        const turnoverReduction = parseFloat(document.getElementById('turnover-reduction').value) || 0;
        const absenteeismReduction = parseFloat(document.getElementById('absenteeism-reduction').value) || 0;
        const productivityGain = parseFloat(document.getElementById('productivity-gain').value) || 0;
        
        // Calcular economias
        const turnoverSavings = (turnover / 100) * (turnoverReduction / 100) * employees * salary * 0.5;
        const absenteeismSavings = (absenteeism / 220) * (absenteeismReduction / 100) * employees * salary;
        const productivityValue = (productivityGain / 100) * employees * salary;
        const totalSavings = turnoverSavings + absenteeismSavings + productivityValue;
        
        // Atualizar UI
        document.getElementById('turnover-savings').textContent = formatCurrency(turnoverSavings);
        document.getElementById('absenteeism-savings').textContent = formatCurrency(absenteeismSavings);
        document.getElementById('productivity-value').textContent = formatCurrency(productivityValue);
        document.getElementById('total-savings').textContent = formatCurrency(totalSavings);
        
        // Atualizar gráfico
        updateROIChart(turnoverSavings, absenteeismSavings, productivityValue);
        
        // Atualizar resumo
        updateROISummary(totalSavings, employees);
        
        showToast('Cálculo de ROI realizado com sucesso!');
    }

    function updateROIChart(turnover, absenteeism, productivity) {
        const ctx = document.getElementById('roiChart').getContext('2d');
        
        if (roiChart) {
            roiChart.destroy();
        }
        
        roiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Redução de Rotatividade', 'Redução de Absenteísmo', 'Ganho de Produtividade'],
                datasets: [{
                    label: 'Valor (R$)',
                    data: [turnover, absenteeism, productivity],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(46, 204, 113, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(46, 204, 113, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    function updateROISummary(totalSavings, employees) {
        const savingsPerEmployee = totalSavings / employees;
        const summaryText = `
            Com os investimentos em bem-estar, sua organização pode economizar aproximadamente
            <strong>${formatCurrency(totalSavings)} por ano</strong>, o que equivale a cerca de
            <strong>${formatCurrency(savingsPerEmployee)} por funcionário</strong>.
            Esses valores são estimativas baseadas nos dados fornecidos.
        `;
        
        document.getElementById('roi-summary-text').innerHTML = summaryText;
    }

    // ================== BIBLIOTECA DE MÍDIA ================== //
    const mediaTabBtns = document.querySelectorAll('.media-tab-btn');
    const mediaLists = document.querySelectorAll('.media-list');
    const videoItems = document.querySelectorAll('#videos-media li');
    const podcastItems = document.querySelectorAll('#podcasts-media li');
    const podcastAudio = document.getElementById('podcast-audio');

    // Inicializar mídia
    initMedia();

    function initMedia() {
        // Tabs
        mediaTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mediaType = btn.getAttribute('data-media');
                
                // Ativar tab
                mediaTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar conteúdo correspondente
                mediaLists.forEach(list => list.classList.remove('active'));
                document.getElementById(`${mediaType}-media`).classList.add('active');
            });
        });
        
        // Vídeos
        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-video-id');
                const iframe = document.querySelector('.video-container iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                
                // Destacar item selecionado
                videoItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                showToast(`Carregando vídeo: ${item.textContent}`);
            });
        });
        
        // Podcasts
        podcastItems.forEach(item => {
            item.addEventListener('click', () => {
                const podcastFile = item.getAttribute('data-podcast');
                podcastAudio.src = `../assets/media/podcasts/${podcastFile}`;
                podcastAudio.play();
                
                // Atualizar informações
                const podcastInfo = document.querySelector('.podcast-info');
                podcastInfo.innerHTML = `
                    <p><strong>${item.textContent}</strong></p>
                    <p>Duração: ${getRandomDuration(20, 45)} min</p>
                `;
                
                // Destacar item selecionado
                podcastItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                showToast(`Reproduzindo podcast: ${item.textContent}`);
            });
        });
    }

    // ================== FUNÇÕES UTILITÁRIAS ================== //
    function formatDate(date) {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(value);
    }

    function getRandomDuration(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Adicionar estilos para o toast dinamicamente
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .toast-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(toastStyles);
});