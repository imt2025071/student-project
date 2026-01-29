/* Ripple effect for buttons and chips */
(function addRippleEffect(){
  function createRipple(e){
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size/2) + 'px';
    circle.style.top = (e.clientY - rect.top - size/2) + 'px';
    circle.className = 'ripple';
    btn.appendChild(circle);
    setTimeout(()=> circle.remove(), 600);
  }

  document.querySelectorAll('.btn, .chip').forEach(el=>{
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', createRipple);
  });

  const style = document.createElement('style');
  style.textContent = `
    .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);transform:scale(0);animation:rippleAnim 600ms ease-out;pointer-events:none}
    @keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}
  `;
  document.head.appendChild(style);
})();

/* Badge pulse animation */
(function pulseBadges(){
  const badges = document.querySelectorAll('.badge, .tag');
  if(!badges.length) return;
  let on = false;
  setInterval(()=>{
    on = !on;
    badges.forEach(b=>{
      b.style.transform = on ? 'translateY(-2px)' : 'translateY(0)';
      b.style.filter = on ? 'brightness(1.05) saturate(1.05)' : 'none';
    });
  }, 1400);
})();

/* Events filter logic */
(function eventsFilter(){
  const filterRow = document.querySelector('.filter-row');
  if(!filterRow) return;

  const chips = filterRow.querySelectorAll('.chip');
  const eventsList = document.getElementById('eventsList');
  const cards = eventsList ? Array.from(eventsList.querySelectorAll('.event-card')) : [];

  function setActiveChip(chip){
    chips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
  }

  function filterBy(category){
    cards.forEach(card=>{
      if(category === 'all') {
        card.style.display = '';
      } else {
        card.style.display = (card.dataset.category === category) ? '' : 'none';
      }
    });
  }

  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const cat = chip.dataset.filter;
      setActiveChip(chip);
      filterBy(cat);
    });
  });
})();

/* Sign-in placeholder */
document.querySelectorAll('#signInBtn, #signInBtn2, #signInBtn3').forEach(btn=>{
  if(btn) btn.addEventListener('click', ()=> alert('Sign in is a placeholder in this demo.'));
});

/* Keyboard focus visibility */
(function focusOutline(){
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Tab') document.body.classList.add('show-focus');
  });
})();

document.querySelectorAll(".club-card").forEach(card => {
  card.addEventListener("click", () => {
    console.log("Club card clicked!");
  });
  // script.js
// Handles simple auth UI (demo), service worker registration and notifications.
// NOTE: This is a demo-only implementation. Storing passwords in localStorage is insecure.
// For production, use a proper backend and secure auth flows.

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const signInBtn = document.getElementById('signInBtn');
  const authModal = document.getElementById('authModal');
  const closeAuth = document.getElementById('closeAuth');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toRegister = document.getElementById('toRegister');
  const toLogin = document.getElementById('toLogin');
  const userDisplay = document.getElementById('userDisplay');
  const notifyBtn = document.getElementById('notifyBtn');

  // Utility: users stored in localStorage under 'cep_users' as object { email: {name, password} }
  function loadUsers(){
    try { return JSON.parse(localStorage.getItem('cep_users') || '{}'); }
    catch(e){ return {}; }
  }
  function saveUsers(obj){
    localStorage.setItem('cep_users', JSON.stringify(obj));
  }

  function openAuth(){
    authModal.setAttribute('aria-hidden','false');
    authModal.style.opacity = 1;
  }
  function closeAuthModal(){
    authModal.setAttribute('aria-hidden','true');
    authModal.style.opacity = 0;
  }

  function showLogin(){
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginPanel.hidden = false;
    registerPanel.hidden = true;
  }
  function showRegister(){
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerPanel.hidden = false;
    loginPanel.hidden = true;
  }

  // Basic auth storage: store current user in localStorage 'cep_user'
  function setCurrentUser(user){
    localStorage.setItem('cep_user', JSON.stringify(user));
    updateAuthUI();
  }
  function clearCurrentUser(){
    localStorage.removeItem('cep_user');
    updateAuthUI();
  }
  function getCurrentUser(){
    try { return JSON.parse(localStorage.getItem('cep_user') || 'null'); }
    catch(e){ return null; }
  }

  function updateAuthUI(){
    const user = getCurrentUser();
    if(user){
      userDisplay.textContent = user.name;
      userDisplay.style.display = 'inline-block';
      signInBtn.textContent = 'Sign out';
      signInBtn.classList.remove('primary');
      signInBtn.onclick = () => {
        // Sign out
        clearCurrentUser();
      };
    } else {
      userDisplay.style.display = 'none';
      signInBtn.textContent = 'Sign in';
      signInBtn.onclick = openAuth;
    }
  }

  // initial UI
  updateAuthUI();

  // Tab handlers
  tabLogin.addEventListener('click', showLogin);
  tabRegister.addEventListener('click', showRegister);
  toRegister.addEventListener('click', showRegister);
  toLogin.addEventListener('click', showLogin);

  // Modal close
  closeAuth.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (ev) => {
    if(ev.target === authModal) closeAuthModal();
  });

  // Register handler
  registerForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    if(!name || !email || !password){ alert('Please fill all fields'); return; }

    const users = loadUsers();
    if(users[email]){
      alert('An account with this email already exists. Please login.');
      showLogin();
      return;
    }
    users[email] = { name, password };
    saveUsers(users);

    // auto-login
    setCurrentUser({ name, email });
    closeAuthModal();
    alert('Account created — you are now signed in (demo).');
  });

  // Login handler
  loginForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = loadUsers();
    if(!users[email] || users[email].password !== password){
      alert('Invalid credentials (demo).');
      return;
    }
    setCurrentUser({ name: users[email].name, email });
    closeAuthModal();
  });

  // Notification button: requests permission and shows a sample notification
  notifyBtn.addEventListener('click', async () => {
    // ask for permission
    if(!('Notification' in window)){
      alert('Notifications are not supported in your browser.');
      return;
    }

    // Register the service worker (optional but recommended)
    if('serviceWorker' in navigator){
      try {
        await navigator.serviceWorker.register('sw.js');
        // console.log('SW registered');
      } catch(e){
        // console.warn('SW registration failed', e);
      }
    }

    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){
      alert('Notification permission denied.');
      return;
    }

    // Show a test notification via ServiceWorker registration if available (better UX on mobile)
    if('serviceWorker' in navigator && navigator.serviceWorker.getRegistration){
      const reg = await navigator.serviceWorker.getRegistration();
      if(reg && reg.showNotification){
        reg.showNotification('Campus Events Portal', {
          body: 'You will receive important updates and alerts here.',
          icon: 'favicon.png',
          tag: 'cep-welcome'
        });
        return;
      }
    }

    // fallback: show via Notification constructor
    new Notification('Campus Events Portal', {
      body: 'You will receive important updates and alerts here.',
      icon: 'favicon.png',
      tag: 'cep-welcome'
    });
  });

  // register service worker on load (best-effort)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{/* ignore */});
  }

});
});

