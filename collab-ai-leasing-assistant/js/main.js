/**
 * COLLAB AI LEASING ASSISTANT — Main JavaScript
 *
 * FORM BACKEND SETUP:
 * ==================
 * Currently using Web3Forms (https://web3forms.com) — free, no account required.
 *
 * To get/replace the access key:
 *   1. Go to https://web3forms.com
 *   2. Enter leasing@collabhome.io (or atria.collab@collabhome.io)
 *   3. Copy the access key from the email they send
 *   4. Replace the value of window.WEB3FORMS_KEY below
 *
 * Option B (Permanent): Google Apps Script web app — see README for setup guide.
 * Option C (Dev testing): Set window.WEB3FORMS_KEY = '' to skip API and show success inline.
 */

// Web3Forms access key — replace with key received from https://web3forms.com
// (enter leasing@collabhome.io there to get a key emailed instantly)
window.WEB3FORMS_KEY = 'c4ca479d-2263-4a7f-b123-78628ff9f2f4';

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) return;

    // Check duplicate email
    const email = form.querySelector('[name="email"]').value.toLowerCase().trim();
    const submitted = JSON.parse(localStorage.getItem('collab_submitted_emails') || '[]');
    if (submitted.includes(email)) {
      alert('This email has already been submitted. Each email can only enter once.');
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim() || '';
    const city = form.querySelector('[name="city"]').value.trim();
    const housing = form.querySelector('[name="housing"]').value;
    const turnstileToken = (form.querySelector('[name="cf-turnstile-response"]') || {}).value || '';

    // Dev / no-key mode: skip API and show success inline
    const key = window.WEB3FORMS_KEY || '';
    if (!key || key === 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY') {
      submitted.push(email);
      localStorage.setItem('collab_submitted_emails', JSON.stringify(submitted));
      formCard.classList.add('hidden');
      successEl.classList.add('show');
      return;
    }

    try {
      const payload = {
        access_key: key,
        subject: "New Sweepstakes Entry — Collab AI Leasing Assistant 🎉",
        from_name: "Collab AI Sweepstakes Form",
        replyto: email,
        name,
        email,
        phone,
        city,
        housing,
        "cf-turnstile-response": turnstileToken,
        timestamp: new Date().toISOString()
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Save email to prevent duplicates
        submitted.push(email);
        localStorage.setItem('collab_submitted_emails', JSON.stringify(submitted));
        trackEvent('sweepstakes_submit', { city, housing });
        formCard.classList.add('hidden');
        successEl.classList.add('show');
        document.getElementById('sweepstakes')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error(json.message || 'Submission failed');
      }

    } catch (err) {
      console.error('Form submission error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = '🎉 Enter Sweepstakes';
      // Show a friendly inline error
      let errEl = form.querySelector('.form-submit-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-submit-error';
        errEl.style.cssText = 'color:#e74c3c;font-size:13px;margin-top:12px;text-align:center';
        submitBtn.parentNode.insertBefore(errEl, submitBtn.nextSibling);
      }
      errEl.textContent = 'Something went wrong. Please try again or email us at atria.collab@collabhome.io';
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
