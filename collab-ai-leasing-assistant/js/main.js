/**
 * COLLAB AI LEASING ASSISTANT — Main JavaScript
 *
 * FORM BACKEND SETUP:
 * ==================
 * Option A (Recommended - permanent): Deploy a Google Apps Script web app that:
 *   1. Accepts POST with {name, email, phone, city, housing, timestamp}
 *   2. Appends to a Google Sheet
 *   3. Sends confirmation email to visitor
 *   4. Weekly trigger sends report to leasing@collabhome.io
 *   Set window.FORM_ENDPOINT to your Google Apps Script URL.
 *
 * Option B (Quick): Formspree - sign up at formspree.io, create a form, set the URL.
 *
 * Option C (Dev testing): Leave empty string to show success state immediately.
 */

// FormSubmit.co endpoint — sends to leasing@collabhome.io (which delivers to atria.collab inbox)
// No registration required. First submission triggers an activation email to leasing@.
// Replace with your GAS URL once Workspace admin enables public web app deployment.
// FormSubmit.co — using standard POST (not AJAX) so _autoresponse fires reliably
// The form submits natively and _next redirects back to the site with ?submitted=1
window.FORM_ENDPOINT = 'https://formsubmit.co/752e5b6d930839b5bd9378a19bcf5a22'; // FormSubmit (activated on new domain)

// ==========================================
// NAV SCROLL EFFECT
// ==========================================
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ==========================================
// MOBILE NAV TOGGLE
// ==========================================
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = 'rgba(21,23,24,0.98)';
      navLinks.style.padding = '20px 24px';
      navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    }
  });
}

// ==========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ==========================================
const fadeEls = document.querySelectorAll('.fade-in, .fade-in-delay');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      if (navLinks) navLinks.style.display = '';
    }
  });
});

// ==========================================
// JOURNEY DEMO
// ==========================================
function initJourneyDemo() {
  const stages = window.JOURNEY_STAGES;
  if (!stages) return;

  const tabs = document.querySelectorAll('.journey-tab');
  const infoPanel = document.querySelector('.journey-info');
  const chatMessages = document.querySelector('.chat-messages');
  const progressFill = document.querySelector('.progress-fill');
  const progressLabel = document.querySelector('.progress-label');

  if (!tabs.length || !infoPanel || !chatMessages) return;

  let currentStage = 0;
  let chatAnimTimer = null;

  function showStage(index) {
    currentStage = index;
    const stage = stages[index];

    // Update tabs
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    // Update info panel
    infoPanel.innerHTML = `
      <div class="stage-header">
        <span class="stage-num-badge">Stage ${stage.id}</span>
        <h3 class="stage-title">${stage.emoji} ${stage.title}</h3>
      </div>
      <div class="info-block">
        <div class="info-label">The Problem</div>
        <p class="info-text">${stage.painPoint}</p>
      </div>
      <div class="info-block">
        <div class="info-label">How Collab AI Helps</div>
        <p class="info-text">${stage.howHelps}</p>
      </div>
      <div class="info-block">
        <div class="info-label">Key Actions</div>
        <ul class="info-list">
          ${stage.actions.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      <div class="info-block">
        <div class="info-label">Value Created</div>
        <p class="info-text">${stage.value}</p>
      </div>
    `;

    // Update progress
    const pct = ((index + 1) / stages.length * 100).toFixed(0);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `Stage ${stage.id} of ${stages.length}`;

    // Animate chat messages
    animateChat(stage.chat);
  }

  function animateChat(messages) {
    if (chatAnimTimer) clearInterval(chatAnimTimer);
    chatMessages.innerHTML = '<div class="chat-date-divider">Today</div>';

    let i = 0;
    function addNext() {
      if (i >= messages.length) return;
      const msg = messages[i];
      const isUser = msg.from === 'user';

      // Show typing first
      const typingEl = document.createElement('div');
      typingEl.className = 'msg-row' + (isUser ? ' msg-user' : '');
      typingEl.innerHTML = `<div class="msg-typing"><span></span><span></span><span></span></div>`;
      chatMessages.appendChild(typingEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        chatMessages.removeChild(typingEl);
        const msgEl = document.createElement('div');
        msgEl.className = 'msg-row' + (isUser ? ' msg-user' : '');
        const text = msg.text.replace(/\n/g, '<br>');
        msgEl.innerHTML = `
          <div class="msg-bubble ${isUser ? '' : 'msg-ai'}">
            ${text}
            <span class="msg-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          </div>
        `;
        msgEl.style.opacity = '0';
        msgEl.style.transform = 'translateY(8px)';
        chatMessages.appendChild(msgEl);
        requestAnimationFrame(() => {
          msgEl.style.transition = 'opacity 0.3s, transform 0.3s';
          msgEl.style.opacity = '1';
          msgEl.style.transform = 'translateY(0)';
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
        i++;
        chatAnimTimer = setTimeout(addNext, isUser ? 800 : 1200);
      }, isUser ? 400 : 700);
    }
    addNext();
  }

  // Tab click handlers
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showStage(i));
  });

  // Prev / Next buttons
  const prevBtn = document.getElementById('journey-prev');
  const nextBtn = document.getElementById('journey-next');
  function updateNavBtns() {
    if (prevBtn) prevBtn.disabled = currentStage === 0;
    if (nextBtn) nextBtn.disabled = currentStage === stages.length - 1;
  }
  if (prevBtn) prevBtn.addEventListener('click', () => { if (currentStage > 0) showStage(currentStage - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (currentStage < stages.length - 1) showStage(currentStage + 1); });

  // Wrap showStage to update nav buttons each time
  const _showStage = showStage;
  showStage = function(index) { _showStage(index); updateNavBtns(); };

  // Auto-advance via keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentStage < stages.length - 1) showStage(currentStage + 1);
    if (e.key === 'ArrowLeft' && currentStage > 0) showStage(currentStage - 1);
  });

  // Init first stage
  showStage(0);
  updateNavBtns();
}

// ==========================================
// FORM HANDLING
// ==========================================
function initForm() {
  const form = document.getElementById('sweepstakes-form');
  const formCard = document.querySelector('.form-card');
  const successEl = document.querySelector('.form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) return;

    // Duplicate check is handled server-side by GAS — no localStorage block needed
    const email = form.querySelector('[name="email"]').value.toLowerCase();

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const data = {
      name: form.querySelector('[name="name"]').value,
      email: email,
      phone: form.querySelector('[name="phone"]').value || '',
      city: form.querySelector('[name="city"]').value,
      housing: form.querySelector('[name="housing"]').value,
      tc_accepted: true,
      privacy_accepted: true,
      email_consent: true,
      timestamp: new Date().toISOString()
    };

    try {
      if (window.FORM_ENDPOINT) {
        // Native form POST to FormSubmit — triggers _autoresponse ACK email to submitter
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = window.FORM_ENDPOINT;
        hiddenForm.style.display = 'none';

        const fields = {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          city: data.city,
          housing: data.housing,
          _subject: "You\'re entered! Collab AI Leasing Assistant Sweepstakes 🎉",
          _captcha: 'false',
          _template: 'table',
          _replyto: data.email,
          _autoresponse: `Hi ${data.name.split(' ')[0] || 'there'},\n\nThank you for entering the Collab AI Leasing Assistant Sweepstakes! 🎉 Your entry is confirmed.\n\nFirst 200 winners get 3 months of Collab AI for $1.\n\nLearn more: https://ai-leasing-assistant.collabhome.io/collab-ai-leasing-assistant/\n\nBest,\nCollab AI Leasing Team\nleasing@collabhome.io`,
          _next: 'https://ai-leasing-assistant.collabhome.io/collab-ai-leasing-assistant/?submitted=1'
        };

        Object.entries(fields).forEach(([k, v]) => {
          const inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = k;
          inp.value = v;
          hiddenForm.appendChild(inp);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit(); // page redirects to ?submitted=1
        return;
      }

      // Fallback (no endpoint set): show inline success
      formCard.classList.add('hidden');
      successEl.classList.add('show');

    } catch (err) {
      console.error('Form submission error:', err);
      formCard.classList.add('hidden');
      successEl.classList.add('show');
    }
  });
}

function validateForm() {
  const form = document.getElementById('sweepstakes-form');
  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

  // Required text fields
  ['name', 'email', 'city'].forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    const group = input.closest('.form-group');
    if (!input.value.trim()) {
      group.classList.add('error');
      valid = false;
    }
  });

  // Email format
  const emailInput = form.querySelector('[name="email"]');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value && !emailRegex.test(emailInput.value)) {
    emailInput.closest('.form-group').classList.add('error');
    emailInput.closest('.form-group').querySelector('.form-error-msg').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  // Housing dropdown
  const housing = form.querySelector('[name="housing"]');
  if (!housing.value) {
    housing.closest('.form-group').classList.add('error');
    valid = false;
  }

  // Checkboxes
  ['tc_check', 'privacy_check', 'email_check'].forEach(id => {
    const cb = document.getElementById(id);
    if (!cb.checked) {
      cb.closest('.form-check').style.outline = '1px solid #e74c3c';
      cb.closest('.form-check').style.outlineOffset = '4px';
      cb.closest('.form-check').style.borderRadius = '4px';
      valid = false;
    } else {
      cb.closest('.form-check').style.outline = '';
    }
  });

  return valid;
}

// ==========================================
// HERO CHAT ANIMATION
// ==========================================
function initHeroChat() {
  const heroBubbles = document.querySelectorAll('.wa-body .wa-msg');
  if (!heroBubbles.length) return;

  heroBubbles.forEach((bubble, i) => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(10px)';
    setTimeout(() => {
      bubble.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 800 + i * 600);
  });
}

// ==========================================
// GA4 EVENT TRACKING HELPER
// ==========================================
function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}

// ==========================================
// VERIFIED=1 SUCCESS BANNER
// ==========================================
function checkVerifiedParam() {
  const params = new URLSearchParams(window.location.search);
  // Handle both ?verified=1 (email verify) and ?submitted=1 (form redirect from FormSubmit)
  if (params.get('verified') === '1' || params.get('submitted') === '1') {
    const formCard = document.querySelector('.form-card');
    const successEl = document.querySelector('.form-success');
    if (formCard && successEl) {
      formCard.classList.add('hidden');
      successEl.classList.add('show');
      document.getElementById('sweepstakes')?.scrollIntoView({ behavior: 'smooth' });
    }
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname + '#sweepstakes');
  }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  checkVerifiedParam();
  initHeroChat();
  initJourneyDemo();
  initForm();
  // Track page view
  trackEvent('page_view', { page_title: document.title });
});
