document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    function updateCountdown() {
        const launchDate = new Date('2025-09-01T00:00:00');
        const now = new Date();
        const diff = launchDate - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = `${days} Tage, ${hours} Stunden, ${minutes} Minuten bis Launch`;
            }
            
            const daysLeftElement = document.getElementById('daysLeft');
            if (daysLeftElement) {
                daysLeftElement.textContent = days;
            }
        }
    }
    
    // Update countdown every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
    
    // Task checkbox functionality
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgress();
            saveTaskState(this.id, this.checked);
        });
    });
    
    // Load saved task states
    function loadTaskStates() {
        checkboxes.forEach(checkbox => {
            const saved = localStorage.getItem(checkbox.id);
            if (saved === 'true') {
                checkbox.checked = true;
            }
        });
        updateProgress();
    }
    
    // Save task state to localStorage
    function saveTaskState(taskId, isChecked) {
        localStorage.setItem(taskId, isChecked.toString());
    }
    
    // Update overall progress
    function updateProgress() {
        const totalTasks = checkboxes.length;
        const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
        const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
        
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.setProperty('--progress', `${progressPercentage}%`);
            progressText.textContent = `${progressPercentage}% Gesamtfortschritt`;
        }
        
        // Update week progress indicators
        updateWeekProgress();
    }
    
    // Update progress for individual weeks
    function updateWeekProgress() {
        const weeks = document.querySelectorAll('.week');
        weeks.forEach((week, index) => {
            const weekCheckboxes = week.querySelectorAll('.task-checkbox');
            const weekCompleted = week.querySelectorAll('.task-checkbox:checked').length;
            const weekTotal = weekCheckboxes.length;
            const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
            
            // Add progress indicator to week header if it doesn't exist
            let progressIndicator = week.querySelector('.week-progress');
            if (!progressIndicator && weekTotal > 0) {
                progressIndicator = document.createElement('div');
                progressIndicator.className = 'week-progress';
                progressIndicator.style.cssText = `
                    background: #f0f0f0;
                    height: 8px;
                    border-radius: 4px;
                    margin-top: 10px;
                    overflow: hidden;
                `;
                
                const progressBar = document.createElement('div');
                progressBar.style.cssText = `
                    background: #D10C27;
                    height: 100%;
                    transition: width 0.3s ease;
                    width: ${weekProgress}%;
                `;
                
                progressIndicator.appendChild(progressBar);
                week.querySelector('.week-header').appendChild(progressIndicator);
            } else if (progressIndicator) {
                const progressBar = progressIndicator.querySelector('div');
                if (progressBar) {
                    progressBar.style.width = `${weekProgress}%`;
                }
            }
        });
    }
    
    // Smooth scrolling for action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the button text to determine which section to scroll to
            const buttonText = this.textContent.toLowerCase();
            let targetSection = null;
            
            if (buttonText.includes('ug gründung')) {
                targetSection = document.querySelector('#week1');
            } else if (buttonText.includes('developer')) {
                targetSection = document.querySelector('#week1');
            } else if (buttonText.includes('dsgvo')) {
                targetSection = document.querySelector('.week:nth-child(2)');
            } else if (buttonText.includes('team-meeting')) {
                targetSection = document.querySelector('.critical-tasks');
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add priority indicators to critical tasks
    function addPriorityIndicators() {
        const criticalItems = document.querySelectorAll('.critical-item');
        criticalItems.forEach((item, index) => {
            const priority = ['SOFORT!', 'HOCH', 'HOCH', 'MITTEL', 'NIEDRIG'][index] || 'NIEDRIG';
            const timeEstimate = item.querySelector('.time-estimate');
            
            if (timeEstimate && timeEstimate.textContent !== 'KRITISCH!') {
                const priorityBadge = document.createElement('span');
                priorityBadge.textContent = priority;
                priorityBadge.style.cssText = `
                    background: ${priority === 'SOFORT!' ? '#dc2626' : priority === 'HOCH' ? '#ea580c' : priority === 'MITTEL' ? '#ca8a04' : '#16a34a'};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.7em;
                    margin-left: 8px;
                `;
                timeEstimate.appendChild(priorityBadge);
            }
        });
    }
    
    // Initialize everything
    loadTaskStates();
    addPriorityIndicators();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to mark current section as complete
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('.week')) {
                const week = activeElement.closest('.week');
                const weekCheckboxes = week.querySelectorAll('.task-checkbox:not(:checked)');
                weekCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                    saveTaskState(checkbox.id, true);
                });
                updateProgress();
            }
        }
    });
    
    // Add visual feedback for completed weeks
    function updateWeekCompletion() {
        const weeks = document.querySelectorAll('.week');
        weeks.forEach(week => {
            const weekCheckboxes = week.querySelectorAll('.task-checkbox');
            const weekCompleted = week.querySelectorAll('.task-checkbox:checked').length;
            
            if (weekCompleted === weekCheckboxes.length && weekCheckboxes.length > 0) {
                week.style.background = '#f0f9ff';
                week.style.borderColor = '#22c55e';
                
                // Add completion badge if it doesn't exist
                if (!week.querySelector('.completion-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'completion-badge';
                    badge.textContent = '✅ ABGESCHLOSSEN';
                    badge.style.cssText = `
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: #22c55e;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 0.8em;
                        font-weight: 600;
                    `;
                    week.appendChild(badge);
                }
            } else {
                week.style.background = '#ffffff';
                week.style.borderColor = week.classList.contains('current-week') ? '#D10C27' : '#e5e5e5';
                
                const badge = week.querySelector('.completion-badge');
                if (badge) {
                    badge.remove();
                }
            }
        });
    }
    
    // Update week completion status when tasks change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateWeekCompletion);
    });
    
    // Initial week completion check
    updateWeekCompletion();
});