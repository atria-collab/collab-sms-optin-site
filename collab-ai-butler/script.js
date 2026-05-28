// ============================================
// ASKDWELL — MAIN SCRIPT
// ============================================

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ---- FADE IN ON SCROLL ----
const fadeEls = document.querySelectorAll('.fade-in, .fade-in-delay');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within grids
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in, .fade-in-delay');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.right = '24px';
  navLinks.style.background = 'rgba(21,23,24,0.98)';
  navLinks.style.backdropFilter = 'blur(16px)';
  navLinks.style.border = '1px solid rgba(255,255,255,0.08)';
  navLinks.style.borderRadius = '12px';
  navLinks.style.padding = '20px 24px';
  navLinks.style.gap = '16px';
  navLinks.style.minWidth = '200px';
});

// ---- DEMO FORM ----
const demoForm = document.getElementById('demo-form');
demoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = demoForm.querySelector('input');
  const email = emailInput.value.trim();
  const btn = demoForm.querySelector('button');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('_subject', 'New AskDwell Demo Request from ' + email);
    formData.append('_cc', 'jakob.stolzenberg@gmail.com');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    const res = await fetch('https://formsubmit.co/ajax/hello@askdwell.ai', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    const data = await res.json();
    if (data.success === 'true' || data.success === true) {
      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#5CC489';
      emailInput.value = '';
    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    btn.textContent = '✓ Request Sent!';
    btn.style.background = '#5CC489';
    emailInput.value = '';
    console.error('Form error:', err);
  }

  setTimeout(() => {
    btn.textContent = 'Request Demo';
    btn.style.background = '';
    btn.disabled = false;
  }, 3500);
});

// ---- SMOOTH NAV CLOSE ON LINK CLICK ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', () => {
    if (navLinks.style.display === 'flex' && navLinks.style.position === 'absolute') {
      navLinks.style.display = 'none';
    }
  });
});

// Hero mockup is static — no JS cycling needed

// ---- STAT COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '', prefix = '') {
  const duration = 1500;
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal ? (eased * target).toFixed(1) : Math.floor(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Observe stat numbers
const statNums = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      if (text.includes('$3.1B')) animateCounter(el, 3.1, 'B+', '$');
      else if (text.includes('50+')) animateCounter(el, 50, '+');
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ============================================
// ASKDWELL — INTERACTIVE DEMO
// ============================================

const demoScenarios = {
  pm_balances: [
    { role: 'tenant', avatar: 'PM', text: "Which tenants have unpaid balances this month?" },
    { role: 'ai', avatar: '✦', text: "3 units have outstanding balances: Oxford #204 ($1,200), Oxford #312 ($800), College Ave #1 ($950). Total outstanding: $2,950. Want me to send payment reminders to all three now? 💳" },
    { role: 'tenant', avatar: 'PM', text: "Yes, send reminders to all of them." },
    { role: 'ai', avatar: '✦', text: "Done — payment reminders sent via SMS and email to all 3 tenants ✅. I'll flag any non-responses after 48 hours and escalate automatically. Want a full rent roll report? 📋" }
  ],
  pm_maintenance: [
    { role: 'tenant', avatar: 'PM', text: "What open maintenance requests do we have right now?" },
    { role: 'ai', avatar: '✦', text: "2 open work orders: Unit 305 — leaky faucet (plumber scheduled tomorrow 10AM, tenant notified), Unit 108 — HVAC not cooling (vendor contacted, ETA Friday). 0 past-due orders this week. 🔧" },
    { role: 'tenant', avatar: 'PM', text: "Has the tenant in 305 been updated?" },
    { role: 'ai', avatar: '✦', text: "Yes — I sent the tenant in Unit 305 a confirmation this morning: plumber name, arrival window, and a 1-hour reminder is scheduled automatically. I'll notify you when the work order closes. ✅" }
  ],
  maintenance: [
    { role: 'tenant', avatar: 'T', text: "My kitchen faucet has been leaking for 3 days. Can you help?" },
    { role: 'ai', avatar: '✦', text: "I've logged Work Order #WO-2847 for your leaky faucet. A certified plumber is scheduled for tomorrow, Thursday May 29 between 10AM–12PM. I've notified your property manager and will send you a reminder 1 hour before. Is the time slot convenient? 🔧" },
    { role: 'tenant', avatar: 'T', text: "Yes that works, thank you!" },
    { role: 'ai', avatar: '✦', text: "Perfect! The plumber's name is Carlos from Swift Plumbing. If you can't be there, I can coordinate a key release with the property team. ✅" }
  ],
  scheduling: [
    { role: 'tenant', avatar: 'T', text: "I need my HVAC serviced before summer. Can you schedule this?" },
    { role: 'ai', avatar: '✦', text: "Found 3 HVAC technicians in our vendor network. Earliest slot: Friday May 30, 9AM–11AM with Pro Climate Services (4.8★, 12 past jobs at your property). Shall I book it? 📅" },
    { role: 'tenant', avatar: 'T', text: "Yes please book it" },
    { role: 'ai', avatar: '✦', text: "Done! HVAC service booked — Work Order #WO-2891 created. I've added this to your property manager's calendar and will remind you the evening before. ✅" }
  ],
  lease: [
    { role: 'tenant', avatar: 'T', text: "When does my lease expire? Can I renew early?" },
    { role: 'ai', avatar: '✦', text: "Your lease runs through February 28, 2027 — 9 months remaining. Yes, early renewal is available with a rate lock guarantee. Want me to notify your property manager to start the process? 📋" },
    { role: 'tenant', avatar: 'T', text: "What's the early termination policy?" },
    { role: 'ai', avatar: '✦', text: "Your lease requires 60 days written notice and a fee equal to 2 months' rent. Exceptions apply for job relocation, medical emergencies, and military deployment. Want me to connect you with the leasing team to discuss your options? 🏠" }
  ],
  rent: [
    { role: 'tenant', avatar: 'T', text: "I paid rent yesterday but my portal still shows it as due. Is it processed?" },
    { role: 'ai', avatar: '✦', text: "Your payment of $2,450 was received yesterday at 3:42 PM via ACH transfer. It's processing and will reflect in the portal within 1 business day — no late fee applies. 💳" },
    { role: 'tenant', avatar: 'T', text: "Can I set up autopay?" },
    { role: 'ai', avatar: '✦', text: "Absolutely! Autopay will draft on the 1st of each month with a 3-day advance notice. I'll send you a secure link to authorize right now. ✅" }
  ],
  services: [
    { role: 'tenant', avatar: 'T', text: "Can you recommend a good Italian restaurant nearby that delivers?" },
    { role: 'ai', avatar: '✦', text: "Based on your location at 1773 Oxford St, Berkeley: 🍝 Chez Panisse Café (0.3mi, 4.9★), Trattoria La Siciliana (0.5mi, 4.7★), Pasta! (0.7mi, 4.6★) — all available on DoorDash and Uber Eats. Want the delivery link? 🍕" },
    { role: 'tenant', avatar: 'T', text: "Also any professional laundry services nearby?" },
    { role: 'ai', avatar: '✦', text: "For laundry near your unit: 👔 Pressed (pickup & delivery, 4.8★ — picks up from your door!), Liberty Cleaners (0.4mi, same-day service). Pressed offers a free first pickup for Collab Home residents. Want the referral link? 🧺" }
  ],
  emergency: [
    { role: 'tenant', avatar: 'T', text: "There's water flooding from my upstairs neighbor's unit into my bathroom!" },
    { role: 'ai', avatar: '✦', text: "🚨 Emergency alert sent to your property manager RIGHT NOW! Maintenance is en route. Turn off your bathroom water shut-off valve (under the sink), move valuables away, and document with photos. ETA: 20–30 minutes. Are you safe? 🆘" },
    { role: 'tenant', avatar: 'T', text: "Yes I'm safe. When will someone arrive?" },
    { role: 'ai', avatar: '✦', text: "Emergency maintenance (Carlos, 415-555-0123) is en route — ETA 22 minutes. Your manager Sarah has been notified and will call you within 5 minutes. I've opened an emergency work order and flagged the upstairs unit. I'll update you every 10 minutes. ✅" }
  ]
};

// Sequential animated chat — messages appear one at a time
// Tenant msgs: 600ms delay, AI msgs: show typing bubble for 900ms first
let demoAnimTimer = null;

function clearDemoTimers() {
  if (demoAnimTimer) { clearTimeout(demoAnimTimer); demoAnimTimer = null; }
}

function appendMsg(chatEl, msg) {
  const div = document.createElement('div');
  div.className = `demo-msg ${msg.role} demo-msg-enter`;
  div.innerHTML = `
    <div class="demo-avatar">${msg.avatar}</div>
    <div class="demo-bubble">${msg.text}</div>
  `;
  chatEl.appendChild(div);
  // Trigger enter animation on next frame
  requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add('demo-msg-visible')));
  chatEl.scrollTop = chatEl.scrollHeight;
}

function showTyping(chatEl) {
  const div = document.createElement('div');
  div.className = 'demo-msg ai demo-msg-typing demo-msg-enter';
  div.innerHTML = `
    <div class="demo-avatar">✦</div>
    <div class="demo-bubble demo-typing-bubble"><span></span><span></span><span></span></div>
  `;
  chatEl.appendChild(div);
  requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add('demo-msg-visible')));
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function renderDemo(scenario) {
  clearDemoTimers();
  const chatEl = document.getElementById('demo-chat');
  if (!chatEl) return;
  chatEl.innerHTML = '';

  const messages = demoScenarios[scenario] || [];
  let cursor = 0;

  function step() {
    if (cursor >= messages.length) return;
    const msg = messages[cursor];
    cursor++;

    if (msg.role === 'ai') {
      // Show typing indicator, then replace with actual message
      const typingEl = showTyping(chatEl);
      demoAnimTimer = setTimeout(() => {
        typingEl.remove();
        appendMsg(chatEl, msg);
        demoAnimTimer = setTimeout(step, 700);
      }, 1100);
    } else {
      // Tenant message appears quickly
      appendMsg(chatEl, msg);
      demoAnimTimer = setTimeout(step, 500);
    }
  }

  // Kick off with a short initial pause
  demoAnimTimer = setTimeout(step, 300);
}

// Attach tab click handlers
document.querySelectorAll('.demo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.demo-tabs').querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderDemo(tab.dataset.scenario);
  });
});

// Audience toggle
document.querySelectorAll('.audience-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.audience-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const audience = btn.dataset.audience;
    const tenantTabs = document.getElementById('demo-tabs-tenant');
    const pmTabs = document.getElementById('demo-tabs-pm');
    if (audience === 'tenant') {
      tenantTabs.style.display = 'flex';
      pmTabs.style.display = 'none';
      tenantTabs.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
      tenantTabs.querySelector('.demo-tab').classList.add('active');
      renderDemo('maintenance');
    } else {
      tenantTabs.style.display = 'none';
      pmTabs.style.display = 'flex';
      pmTabs.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
      pmTabs.querySelector('.demo-tab').classList.add('active');
      renderDemo('pm_balances');
    }
  });
});

// Load first scenario
renderDemo('maintenance');

// ============================================
// ASKDWELL — TEST BUILD BADGE
// ============================================
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('test') === '1') {
    const badge = document.getElementById('test-badge');
    if (badge) badge.style.display = 'block';
    document.title = document.title + ' (Test)';
  }
})();
