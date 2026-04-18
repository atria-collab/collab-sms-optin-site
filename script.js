// ============================================
// COLLAB AI BUTLER — MAIN SCRIPT
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
demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = demoForm.querySelector('input').value;
  const btn = demoForm.querySelector('button');
  btn.textContent = '✓ Request Sent!';
  btn.style.background = '#5CC489';
  btn.style.borderColor = '#5CC489';
  btn.disabled = true;
  demoForm.querySelector('input').value = '';
  setTimeout(() => {
    btn.textContent = 'Request Demo';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.disabled = false;
  }, 3000);
  console.log('Demo requested for:', email);
});

// ---- SMOOTH NAV CLOSE ON LINK CLICK ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', () => {
    if (navLinks.style.display === 'flex' && navLinks.style.position === 'absolute') {
      navLinks.style.display = 'none';
    }
  });
});

// ---- TYPING ANIMATION LOOP ----
// The typing indicator in the mockup already runs via CSS,
// but we can cycle new "AI messages" to make it feel live
const chatBody = document.querySelector('.mockup-body');
const aiMessages = [
  "Rent roll updated. 2 units with outstanding balances flagged for your review. 📋",
  "New Apartments.com inquiry — unit 2B, 2BR/1BA, June move-in. Auto-reply sent. 🏠",
  "Oxford showing confirmed for Thursday 2PM. Tenant notified via email + SMS. ✅",
  "Weekly property report ready. Occupancy: 96%. Revenue on track. 📊"
];
let msgIndex = 0;

function addAIMessage() {
  const typing = chatBody.querySelector('.typing')?.closest('.chat-msg');
  if (!typing) return;

  // Replace typing with a real message
  const newMsg = document.createElement('div');
  newMsg.className = 'chat-msg ai';
  newMsg.style.opacity = '0';
  newMsg.style.transform = 'translateY(8px)';
  newMsg.style.transition = 'all 0.3s ease';
  newMsg.innerHTML = `
    <div class="chat-avatar">✦</div>
    <div class="chat-bubble">${aiMessages[msgIndex % aiMessages.length]}</div>
  `;
  chatBody.insertBefore(newMsg, typing);
  msgIndex++;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      newMsg.style.opacity = '1';
      newMsg.style.transform = 'translateY(0)';
    });
  });

  // Remove old messages if too many (keep last 4)
  const allMsgs = chatBody.querySelectorAll('.chat-msg:not(.chat-msg:last-child)');
  if (allMsgs.length > 4) {
    allMsgs[0].style.opacity = '0';
    setTimeout(() => allMsgs[0].remove(), 300);
  }

  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Start cycling messages
setTimeout(addAIMessage, 3000);
setInterval(addAIMessage, 5000);

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
