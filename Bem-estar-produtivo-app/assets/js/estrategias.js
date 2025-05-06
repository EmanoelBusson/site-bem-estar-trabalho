document.addEventListener('DOMContentLoaded', function() {
    // Timer Pomodoro
    const pomodoroButton = document.querySelector('.timer-button[data-minutes="25"]');
    
    if (pomodoroButton) {
        pomodoroButton.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            startTimer(minutes, this);
        });
    }

    function startTimer(minutes, button) {
        let seconds = minutes * 60;
        const originalText = button.textContent;
        
        button.textContent = `${minutes}:00`;
        button.disabled = true;
        button.classList.add('active-timer');
        
        const countdown = setInterval(() => {
            seconds--;
            const displayMinutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            
            button.textContent = `${displayMinutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
            
            if (seconds <= 0) {
                clearInterval(countdown);
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('active-timer');
                playCompletionSound();
                showTimerNotification(minutes);
            }
        }, 1000);
    }

    function playCompletionSound() {
        const audio = new Audio();
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3";
        audio.play().catch(e => console.log("Não foi possível reproduzir som:", e));
    }

    function showTimerNotification(minutes) {
        if (!("Notification" in window)) return;
        
        if (Notification.permission === "granted") {
            new Notification(`Timer de ${minutes} minutos concluído!`, {
                body: "Hora de fazer uma pausa!",
                icon: "../assets/images/icon.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(`Timer de ${minutes} minutos concluído!`, {
                        body: "Hora de fazer uma pausa!",
                        icon: "../assets/images/icon.png"
                    });
                }
            });
        }
    }

    // Matriz de Eisenhower - Botões de ação
    const actionButtons = document.querySelectorAll('.matrix-cell');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('h4').textContent;
            alert(`Ação selecionada: ${action}\nEsta funcionalidade pode ser expandida para adicionar tarefas específicas.`);
        });
    });

    // Exercício de respiração 4-7-8
    const breathButton = document.querySelector('.breath-button');
    const breathAnimation = document.querySelector('.breath-animation');
    const breathCircle = document.querySelector('.breath-circle');
    const breathInstruction = document.querySelector('.breath-instruction');
    
    if (breathButton) {
        let breathCycle = 0;
        let breathTimeout;
        let isExercising = false;

        breathButton.addEventListener('click', function() {
            if (!isExercising) {
                startBreathingExercise();
                this.textContent = 'Parar Exercício';
                isExercising = true;
            } else {
                stopBreathingExercise();
                this.textContent = 'Iniciar Exercício';
                isExercising = false;
            }
        });

        function startBreathingExercise() {
            breathAnimation.classList.remove('hidden');
            breathCycle = 0;
            breatheStep();
        }

        function stopBreathingExercise() {
            clearTimeout(breathTimeout);
            breathAnimation.classList.add('hidden');
            breathCircle.style.transform = 'scale(1)';
            breathInstruction.textContent = '';
        }

        function breatheStep() {
            if (breathCycle >= 4) {
                breathInstruction.textContent = 'Exercício completo!';
                setTimeout(() => {
                    stopBreathingExercise();
                    breathButton.textContent = 'Iniciar Exercício';
                    isExercising = false;
                }, 2000);
                return;
            }

            // Inspirar (4 segundos)
            breathInstruction.textContent = 'INSPIRE...';
            animateBreath(1.5, 4000, () => {
                // Segurar (7 segundos)
                breathInstruction.textContent = 'SEGURE...';
                breathTimeout = setTimeout(() => {
                    // Expirar (8 segundos)
                    breathInstruction.textContent = 'EXPIRE...';
                    animateBreath(1, 8000, () => {
                        breathCycle++;
                        breathTimeout = setTimeout(breatheStep, 1000);
                    });
                }, 7000);
            });
        }

        function animateBreath(targetScale, duration, callback) {
            breathCircle.style.transition = `transform ${duration/1000}s ease-in-out`;
            breathCircle.style.transform = `scale(${targetScale})`;
            
            breathTimeout = setTimeout(() => {
                if (callback) callback();
            }, duration);
        }
    }

    // Solicitar permissão para notificações ao carregar a página
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});


