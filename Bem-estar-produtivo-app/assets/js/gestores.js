document.addEventListener('DOMContentLoaded', function() {
    // 1. Animação dos Cards de Impacto
    const impactCards = document.querySelectorAll('.impact-card');
    impactCards.forEach((card, index) => {
        card.style.transition = `all 0.5s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });

    // 2. Gerador de Feedback de Reconhecimento
    const generateFeedbackBtn = document.getElementById('generate-feedback');
    const copyFeedbackBtn = document.getElementById('copy-feedback');
    
    generateFeedbackBtn.addEventListener('click', function() {
        const name = document.getElementById('employee-name').value;
        const achievement = document.getElementById('achievement').value;
        const impact = document.getElementById('impact').value;
        
        if (name && achievement && impact) {
            const templates = [
                `"${name}, quero reconhecer seu excelente trabalho em ${achievement}. Isso teve um impacto muito positivo porque ${impact}. Seu esforço e dedicação fazem toda a diferença para nossa equipe!"`,
                `"${name}, seu desempenho em ${achievement} foi excepcional. O resultado foi ${impact}, o que demonstra seu comprometimento com nossos valores. Parabéns!"`,
                `"${name}, nossa equipe está melhor graças à sua contribuição em ${achievement}. O impacto disso foi ${impact}. Continue com esse excelente trabalho!"`
            ];
            
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            document.getElementById('feedback-output').textContent = randomTemplate;
        } else {
            alert('Por favor, preencha todos os campos para gerar o feedback.');
        }
    });
    
    copyFeedbackBtn.addEventListener('click', function() {
        const feedbackText = document.getElementById('feedback-output').textContent;
        
        if (feedbackText) {
            navigator.clipboard.writeText(feedbackText).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        }
    });

    // 3. Exemplos de Reconhecimento
    document.querySelectorAll('.recognition-example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.parentElement.querySelector('h4').textContent;
            let example = '';
            
            if (type === 'Reconhecimento Público') {
                example = `"Na reunião geral desta manhã, gostaria de destacar o trabalho excepcional da equipe de desenvolvimento na entrega do projeto X antes do prazo. Sua dedicação e trabalho em equipe resultaram em um feedback extremamente positivo do cliente, o que fortalece nossa reputação no mercado."`;
            } else {
                example = `"Maria, quero agradecer pessoalmente pela maneira como você lidou com a situação difícil com o cliente na semana passada. Sua paciência e habilidade de escuta ativa transformaram uma reclamação em uma oportunidade de melhoria. Esse tipo de atitude faz toda a diferença para nosso time."`;
            }
            
            alert(`Exemplo de ${type}:\n\n${example}`);
        });
    });

    // 4. Técnica SBI para Feedback
    document.getElementById('compile-sbi').addEventListener('click', function() {
        const situation = document.querySelectorAll('.sbi-input')[0].value;
        const behavior = document.querySelectorAll('.sbi-input')[1].value;
        const impact = document.querySelectorAll('.sbi-input')[2].value;
        
        if (situation && behavior && impact) {
            const feedback = `Feedback Construtivo:\n\nSituação: ${situation}\nComportamento: ${behavior}\nImpacto: ${impact}\n\nSugestão: Vamos trabalhar juntos para manter os aspectos positivos e melhorar onde necessário.`;
            document.getElementById('sbi-result').textContent = feedback;
        } else {
            alert('Por favor, preencha todos os campos SBI.');
        }
    });

    // 5. Checklist de Reuniões
    document.getElementById('save-checklist').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.meeting-checklist input[type="checkbox"]');
        const progress = Array.from(checkboxes).map(item => item.checked);
        
        localStorage.setItem('meetingChecklist', JSON.stringify(progress));
        
        this.innerHTML = '<i class="fas fa-check"></i> Salvo!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-save"></i> Salvar Checklist';
        }, 2000);
    });
    
    // Carregar checklist salvo
    const savedChecklist = localStorage.getItem('meetingChecklist');
    if (savedChecklist) {
        const progress = JSON.parse(savedChecklist);
        document.querySelectorAll('.meeting-checklist input[type="checkbox"]').forEach((checkbox, index) => {
            checkbox.checked = progress[index];
        });
    }

    // 6. Diagnóstico de Saúde da Equipe
    const metricSliders = document.querySelectorAll('.health-metrics input[type="range"]');
    const metricValues = {};
    
    metricSliders.forEach(slider => {
        const metricId = slider.id;
        const valueDisplay = slider.nextElementSibling;
        
        // Inicializa valores
        metricValues[metricId] = parseInt(slider.value);
        valueDisplay.textContent = slider.value;
        
        slider.addEventListener('input', function() {
            const value = parseInt(this.value);
            metricValues[metricId] = value;
            valueDisplay.textContent = value;
            
            // Atualiza cor baseada no valor
            if (value <= 3) {
                valueDisplay.style.color = '#e74c3c';
            } else if (value <= 7) {
                valueDisplay.style.color = '#f39c12';
            } else {
                valueDisplay.style.color = '#27ae60';
            }
        });
    });

    // 7. Gerador de Relatório Completo
    document.getElementById('generate-metrics').addEventListener('click', function() {
        const metrics = {
            engagement: parseInt(document.getElementById('engagement').value),
            clarity: parseInt(document.getElementById('clarity').value),
            balance: parseInt(document.getElementById('balance').value),
            growth: parseInt(document.getElementById('growth').value)
        };
        
        if (metrics.engagement && metrics.clarity && metrics.balance && metrics.growth) {
            renderHealthChart(metrics);
            generateTextualAnalysis(metrics);
            document.getElementById('metrics-report').style.display = 'block';
            
            // Scroll para o relatório
            document.getElementById('metrics-report').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Por favor, preencha todos os campos de métricas antes de gerar o relatório.');
        }
    });

    function renderHealthChart(metrics) {
        const ctx = document.getElementById('teamHealthChart').getContext('2d');
        
        if (window.teamHealthChart) {
            window.teamHealthChart.destroy();  // Destrói o gráfico anterior se ele existir
        }

        window.teamHealthChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Engajamento', 'Clareza', 'Equilíbrio', 'Crescimento'],
                datasets: [{
                    label: 'Saúde da Equipe',
                    data: [metrics.engagement, metrics.clarity, metrics.balance, metrics.growth],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${context.raw}/10`;
                            }
                        }
                    }
                }
            }
        });
    }

    function generateTextualAnalysis(metrics) {
        const reportContainer = document.getElementById('metrics-analysis');
        let analysisHTML = '<h4>Análise Detalhada:</h4><ul>';
        
        // Engajamento
        analysisHTML += `<li><strong>Engajamento (${metrics.engagement}/10):</strong> `;
        if (metrics.engagement <= 3) {
            analysisHTML += 'Equipe desengajada. Considere pesquisas de clima e conversas individuais para entender as causas.';
        } else if (metrics.engagement <= 7) {
            analysisHTML += 'Engajamento médio. Fortaleça a conexão entre os membros e os objetivos da empresa.';
        } else {
            analysisHTML += 'Alto engajamento! Mantenha as práticas atuais e reconheça os esforços da equipe.';
        }
        analysisHTML += '</li>';
        
        // Clareza
        analysisHTML += `<li><strong>Clareza (${metrics.clarity}/10):</strong> `;
        if (metrics.clarity <= 3) {
            analysisHTML += 'Falta de direção clara. Priorize a definição de metas SMART e expectativas transparentes.';
        } else if (metrics.clarity <= 7) {
            analysisHTML += 'Alguma clareza, mas pode melhorar. Realize reuniões de alinhamento semanais.';
        } else {
            analysisHTML += 'Excelente clareza de expectativas! Continue comunicando objetivos e feedbacks.';
        }
        analysisHTML += '</li>';
        
        // Equilíbrio
        analysisHTML += `<li><strong>Equilíbrio (${metrics.balance}/10):</strong> `;
        if (metrics.balance <= 3) {
            analysisHTML += 'Risco de burnout. Avalie cargas de trabalho e promova políticas de trabalho flexível.';
        } else if (metrics.balance <= 7) {
            analysisHTML += 'Equilíbrio razoável. Incentive pausas regulares e desconexão após o horário.';
        } else {
            analysisHTML += 'Ótimo equilíbrio! A equipe parece ter uma relação saudável com o trabalho.';
        }
        analysisHTML += '</li>';
        
        // Crescimento
        analysisHTML += `<li><strong>Crescimento (${metrics.growth}/10):</strong> `;
        if (metrics.growth <= 3) {
            analysisHTML += 'Falta de oportunidades. Crie plano de desenvolvimento individual para cada membro.';
        } else if (metrics.growth <= 7) {
            analysisHTML += 'Algumas oportunidades existem. Considere programas de mentoria e treinamentos.';
        } else {
            analysisHTML += 'Excelente desenvolvimento! A equipe sente que está evoluindo em suas habilidades.';
        }
        analysisHTML += '</li>';

        analysisHTML += '</ul>';
        reportContainer.innerHTML = analysisHTML;
    }
});
// 8. Sistema de Plano de Ação
document.addEventListener('DOMContentLoaded', function() {
    // ... (seu código existente)

    // Elementos
    const savePlanBtn = document.getElementById('save-plan');
    const viewPlanBtn = document.querySelector('.view-plan-btn');
    const modal = document.querySelector('.plan-modal');
    
    // Inicializar datas
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    
    // Salvar Plano
    savePlanBtn.addEventListener('click', function() {
        const selectedOptions = Array.from(document.getElementById('strategy-select').selectedOptions);
        const strategies = selectedOptions.map(option => option.text);
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const commitment = document.getElementById('commitment').value;
        
        // Validação
        if (strategies.length === 0 || !startDate || !endDate || !commitment) {
            alert('Por favor, preencha todos os campos do plano!');
            return;
        }
        
        if (new Date(endDate) < new Date(startDate)) {
            alert('A data de conclusão não pode ser anterior à data de início!');
            return;
        }
        
        // Criar objeto do plano
        const newPlan = {
            id: Date.now(),
            strategies,
            startDate,
            endDate,
            commitment,
            createdAt: new Date().toLocaleString('pt-BR'),
            status: 'pending',
            statusText: 'Pendente'
        };
        
        // Salvar no localStorage
        const savedPlans = JSON.parse(localStorage.getItem('actionPlans')) || [];
        savedPlans.push(newPlan);
        localStorage.setItem('actionPlans', JSON.stringify(savedPlans));
        
        // Feedback visual
        const originalText = savePlanBtn.textContent;
        savePlanBtn.textContent = '✓ Plano Salvo!';
        savePlanBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            savePlanBtn.textContent = originalText;
            savePlanBtn.style.backgroundColor = '';
        }, 2000);
        
        // Limpar campos
        document.getElementById('commitment').value = '';
        document.getElementById('strategy-select').selectedIndex = -1;
    });
    
    // Visualizar Planos
    viewPlanBtn.addEventListener('click', function() {
        displaySavedPlans();
        modal.style.display = 'block';
    });
    
    // Fechar Modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displaySavedPlans(this.getAttribute('data-filter'));
        });
    });
    
    // Exibir planos salvos
    function displaySavedPlans(filter = 'all') {
        const savedPlans = JSON.parse(localStorage.getItem('actionPlans')) || [];
        const plansList = document.getElementById('saved-plans-list');
        
        if (savedPlans.length === 0) {
            plansList.innerHTML = '<p>Nenhum plano salvo ainda. Crie seu primeiro plano acima!</p>';
            return;
        }
        
        // Ordenar por data (mais recente primeiro)
        savedPlans.sort((a, b) => b.id - a.id);
        
        // Filtrar
        const filteredPlans = savedPlans.filter(plan => {
            if (filter === 'all') return true;
            if (filter === 'pending') return plan.status === 'pending';
            if (filter === 'completed') return plan.status === 'completed';
            return true;
        });
        
        if (filteredPlans.length === 0) {
            plansList.innerHTML = `<p>Nenhum plano encontrado para o filtro selecionado.</p>`;
            return;
        }
        
        // Gerar HTML
        plansList.innerHTML = filteredPlans.map(plan => `
            <div class="saved-plan" data-id="${plan.id}">
                <h4>Plano criado em: ${plan.createdAt}</h4>
                <p><strong>Status:</strong> <span class="status-${plan.status}">${plan.statusText}</span></p>
                <p><strong>Período:</strong> ${plan.startDate} a ${plan.endDate}</p>
                <p><strong>Estratégias (${plan.strategies.length}):</strong></p>
                <ul>
                    ${plan.strategies.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
                <p><strong>Compromisso:</strong> ${plan.commitment}</p>
                <div class="plan-actions">
                    ${plan.status === 'pending' ? 
                        `<button class="complete-plan-btn">✓ Concluir</button>` : 
                        `<span class="completed-badge">Concluído em: ${plan.completedDate || ''}</span>`
                    }
                    <button class="delete-plan-btn">✗ Excluir</button>
                </div>
            </div>
        `).join('');
        
        // Adicionar eventos
        document.querySelectorAll('.complete-plan-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const planId = parseInt(this.closest('.saved-plan').getAttribute('data-id'));
                markPlanAsCompleted(planId);
            });
        });
        
        document.querySelectorAll('.delete-plan-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const planId = parseInt(this.closest('.saved-plan').getAttribute('data-id'));
                deletePlan(planId);
            });
        });
    }
    
    // Marcar como concluído
    function markPlanAsCompleted(planId) {
        let savedPlans = JSON.parse(localStorage.getItem('actionPlans')) || [];
        savedPlans = savedPlans.map(plan => {
            if (plan.id === planId) {
                return {
                    ...plan,
                    status: 'completed',
                    statusText: 'Concluído',
                    completedDate: new Date().toLocaleString('pt-BR')
                };
            }
            return plan;
        });
        localStorage.setItem('actionPlans', JSON.stringify(savedPlans));
        displaySavedPlans(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
    }
    
    // Excluir plano
    function deletePlan(planId) {
        if (!confirm('Tem certeza que deseja excluir este plano permanentemente?')) return;
        
        let savedPlans = JSON.parse(localStorage.getItem('actionPlans')) || [];
        savedPlans = savedPlans.filter(plan => plan.id !== planId);
        localStorage.setItem('actionPlans', JSON.stringify(savedPlans));
        displaySavedPlans(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
    }
});