
document.addEventListener('DOMContentLoaded', () => {
    const fillEl = document.getElementById('todayProgressFill');
    if (fillEl && fillEl.dataset.fill !== undefined) {
        fillEl.style.width = fillEl.dataset.fill + '%';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initGreeting();
    initWeeklyReflection();
    initBreathingTimer();
});


function initGreeting() {
    const greetingEl = document.getElementById('heroGreetingTime');
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } else if (hour >= 17) {
        greeting = "Good evening";
    }

    if (greetingEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', options);
        greetingEl.innerText = `${greeting} • Today is ${dateStr}`;
    }
}

function scrollToPractices() {
    const el = document.getElementById('dailyPracticesSection');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function markPracticeDone(activityName, btn) {
    if (btn.classList.contains('done')) return;

    fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: activityName })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            btn.classList.add('done');
            btn.innerText = '✓ Completed Today';
            
            
            const card = document.getElementById('practice-card-' + activityName);
            if (card) card.classList.add('is-completed');

            
            const countEl = document.getElementById('todayCompletedStat');
            const fillEl = document.getElementById('todayProgressFill');
            if (countEl) {
                let current = parseInt(countEl.innerText) || 0;
                if (current < 4) {
                    current++;
                    countEl.innerText = `${current} / 4`;
                    if (fillEl) fillEl.style.width = (current * 25) + '%';
                }
            }
            showToast('✓ Practice completed! Quiet consistency shapes the mind. 🙏');
        }
    })
    .catch(err => {
        console.error('Activity error:', err);
        showToast('⚠️ Could not save practice. Please try again.');
    });
}

function submitChallengeReflection(id, title) {
    const textarea = document.getElementById('challengeReflectionInput');
    const reflectionText = textarea ? textarea.value.trim() : '';

    if (!reflectionText) {
        showToast('🌸 Please write a short sentence reflecting on your experience.');
        return;
    }

    fetch('/api/challenge_reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            challenge_id: id,
            title: title,
            reflection: reflectionText
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast('✓ Dharma Challenge completed & reflection saved in your journey! 🤝');
            
            const challengePracticeBtn = document.getElementById('btn-practice-dharma');
            if (challengePracticeBtn) {
                challengePracticeBtn.classList.add('done');
                challengePracticeBtn.innerText = '✓ Completed Today';
            }

            setTimeout(() => {
                window.location.reload();
            }, 1200);
        }
    })
    .catch(err => {
        console.error('Challenge error:', err);
        showToast('⚠️ Could not save challenge reflection.');
    });
}

let breathInterval = null;
function toggleBreathingGuide() {
    const box = document.getElementById('breathingBox');
    const bubble = document.getElementById('breathBubble');
    const status = document.getElementById('breathStatus');

    if (!box) return;

    if (box.style.display === 'block') {
        box.style.display = 'none';
        clearInterval(breathInterval);
    } else {
        box.style.display = 'block';
        let isInhale = true;
        bubble.classList.add('expand');
        status.innerText = 'Inhale slowly... (4s)';

        breathInterval = setInterval(() => {
            isInhale = !isInhale;
            if (isInhale) {
                bubble.classList.add('expand');
                status.innerText = 'Inhale slowly... (4s)';
            } else {
                bubble.classList.remove('expand');
                status.innerText = 'Exhale gently... (4s)';
            }
        }, 4000);
    }
}

function toggleShlokaPreview() {
    const box = document.getElementById('shlokaPreviewBox');
    if (!box) return;
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
}

function switchCheckinTab(tab) {
    const mForm = document.getElementById('morningCheckinForm');
    const eForm = document.getElementById('eveningCheckinForm');
    const tabM = document.getElementById('tabBtnMorning');
    const tabE = document.getElementById('tabBtnEvening');

    if (tab === 'morning') {
        if (mForm) mForm.style.display = 'block';
        if (eForm) eForm.style.display = 'none';
        if (tabM) tabM.classList.add('active');
        if (tabE) tabE.classList.remove('active');
    } else {
        if (mForm) mForm.style.display = 'none';
        if (eForm) eForm.style.display = 'block';
        if (tabM) tabM.classList.remove('active');
        if (tabE) tabE.classList.add('active');
    }
}

function selectMood(moodVal, btn) {
    const container = btn.closest('.db-mood-grid');
    if (container) {
        container.querySelectorAll('.db-mood-btn').forEach(b => b.classList.remove('selected'));
    }
    btn.classList.add('selected');

    
    const parentForm = btn.closest('form') || btn.closest('#morningCheckinForm') || btn.closest('#eveningCheckinForm');
    if (parentForm) {
        parentForm.setAttribute('data-selected-mood', moodVal);
    }
}

function submitMorningCheckin() {
    const form = document.getElementById('morningCheckinForm');
    const mood = form ? form.getAttribute('data-selected-mood') : '';
    const goal = document.getElementById('mGoalInput').value.trim();
    const quality = document.getElementById('mQualityInput').value.trim();

    const feeling = mood || quality || "Focused";

    fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            time_of_day: 'morning',
            feeling: feeling,
            goal: goal,
            learned: quality
        })
    })
    .then(res => res.json())
    .then(data => {
        showToast('✓ Morning intention recorded! Have a mindful, peaceful day. ☀️');
        const summary = document.getElementById('checkinSummaryBanner');
        if (summary) {
            summary.innerText = "✓ Morning intention saved: " + (data.recommendation || "Stay steady in your duty today.");
            summary.style.display = 'block';
        }

        const journalBtn = document.getElementById('btn-practice-journal');
        if (journalBtn) {
            journalBtn.classList.add('done');
            journalBtn.innerText = '✓ Completed Today';
        }
    })
    .catch(err => {
        console.error('Checkin error:', err);
        showToast('⚠️ Could not save check-in.');
    });
}

function submitEveningCheckin() {
    const form = document.getElementById('eveningCheckinForm');
    const mood = form ? form.getAttribute('data-selected-mood') : '';
    const gratitude = document.getElementById('eGratitudeInput').value.trim();
    const challenge = document.getElementById('eChallengeInput').value.trim();
    const learned = document.getElementById('eLearnedInput').value.trim();

    fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            time_of_day: 'evening',
            feeling: mood || "Reflective",
            grateful: gratitude,
            challenge: challenge,
            learned: learned
        })
    })
    .then(res => res.json())
    .then(data => {
        showToast('✓ Evening reflection saved! Rest with a peaceful mind. 🌙');
        const summary = document.getElementById('checkinSummaryBanner');
        if (summary) {
            summary.innerText = "✓ Evening reflection saved: " + (data.recommendation || "Rest well and start fresh tomorrow.");
            summary.style.display = 'block';
        }
        const journalBtn = document.getElementById('btn-practice-journal');
        if (journalBtn) {
            journalBtn.classList.add('done');
            journalBtn.innerText = '✓ Completed Today';
        }
    })
    .catch(err => {
        console.error('Checkin error:', err);
        showToast('⚠️ Could not save check-in.');
    });
}

function initWeeklyReflection() {
    try {
        const saved = localStorage.getItem('adhyatma_weekly_reflection');
        const el = document.getElementById('weeklyReflectionText');
        if (saved && el) {
            el.value = saved;
        }
    } catch (e) {}
}

function saveWeeklyReflection() {
    const el = document.getElementById('weeklyReflectionText');
    const status = document.getElementById('weeklyStatus');
    if (!el) return;
    try {
        localStorage.setItem('adhyatma_weekly_reflection', el.value.trim());
        if (status) {
            status.style.display = 'inline-block';
            setTimeout(() => { status.style.display = 'none'; }, 3000);
        }
        showToast('✓ Weekly reflection noted quietly in your journal.');
    } catch (e) {}
}

function showToast(message) {
    const existing = document.getElementById('toastNotification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #15222B;
        color: #F5EFE3;
        border: 1px solid rgba(226, 185, 97, 0.4);
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.88rem;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: fadeIn 0.25s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}
