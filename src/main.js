import './styles.css';

const services = [
  {
    id: 'birth',
    title: 'Birth certificate',
    category: 'Certificates',
    icon: '🧾',
    description: 'Understand the typical journey for requesting a birth certificate.',
    tags: ['Documents', 'Online option', 'Step-by-step'],
    steps: ['Check the applicable local authority', 'Prepare the required documents', 'Submit the request', 'Track the application'],
    documents: ['Identity/address proof', 'Birth-related record or hospital document', 'Application details'],
    note: 'Requirements vary by location and situation. Verify the final checklist with the official authority before applying.'
  },
  {
    id: 'income',
    title: 'Income certificate',
    category: 'Certificates',
    icon: '📄',
    description: 'Find the information you need before starting an income-certificate request.',
    tags: ['Eligibility', 'Documents', 'Checklist'],
    steps: ['Check eligibility and issuing authority', 'Collect income and identity documents', 'Submit the application', 'Save the acknowledgement and track status'],
    documents: ['Identity proof', 'Address proof', 'Income-related supporting documents'],
    note: 'This is a prototype guide, not an official government application.'
  },
  {
    id: 'pension',
    title: 'Pension support',
    category: 'Benefits',
    icon: '🤝',
    description: 'Get a guided checklist for exploring pension or social-support services.',
    tags: ['Benefits', 'Eligibility', 'Help'],
    steps: ['Choose the relevant pension or support scheme', 'Check eligibility', 'Prepare documents', 'Apply through the appropriate channel'],
    documents: ['Identity proof', 'Bank details where applicable', 'Scheme-specific documents'],
    note: 'Scheme rules and documents depend on the programme and jurisdiction.'
  },
  {
    id: 'ration',
    title: 'Ration card services',
    category: 'Essential services',
    icon: '🛒',
    description: 'Explore a simple flow for new applications, updates, or corrections.',
    tags: ['Family', 'Documents', 'Application'],
    steps: ['Select the required ration-card service', 'Check household eligibility', 'Prepare supporting documents', 'Submit and track the request'],
    documents: ['Identity documents for household members', 'Address proof', 'Other scheme-specific documents'],
    note: 'Use the official state portal to confirm the current requirements.'
  },
  {
    id: 'grievance',
    title: 'File a public grievance',
    category: 'Support',
    icon: '📣',
    description: 'Understand how to record a complaint and keep track of its progress.',
    tags: ['Complaint', 'Tracking', 'Support'],
    steps: ['Describe the issue clearly', 'Attach supporting information if required', 'Submit the grievance', 'Save the reference number and monitor updates'],
    documents: ['Issue details', 'Reference numbers if any', 'Supporting files where applicable'],
    note: 'CivicFlow is designed to help users understand the journey; it does not submit a grievance itself in this prototype.'
  },
  {
    id: 'license',
    title: 'Driving licence help',
    category: 'Transport',
    icon: '🚗',
    description: 'Break a driving-licence journey into understandable preparation steps.',
    tags: ['Transport', 'Appointments', 'Documents'],
    steps: ['Identify the licence service you need', 'Check age and eligibility rules', 'Prepare documents', 'Complete the required online/offline steps'],
    documents: ['Identity proof', 'Address proof', 'Service-specific documents'],
    note: 'Rules and appointment requirements can change. Confirm them on the relevant official portal.'
  }
];

const state = {
  selectedService: null,
  query: '',
  activeTab: 'home',
  completed: new Set(),
  largeText: false,
  highContrast: false,
  language: 'English'
};

const app = document.querySelector('#root');

function serviceCard(service) {
  return `
    <article class="service-card" data-service="${service.id}">
      <div class="service-icon" aria-hidden="true">${service.icon}</div>
      <div class="service-card-body">
        <span class="eyebrow">${service.category}</span>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <div class="tag-row">${service.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <button class="text-button open-service" data-id="${service.id}">View guided steps <span>→</span></button>
      </div>
    </article>`;
}

function render() {
  app.innerHTML = `
    <div class="app-shell ${state.largeText ? 'large-text' : ''} ${state.highContrast ? 'high-contrast' : ''}">
      <header class="topbar">
        <a class="brand" href="#home" data-tab="home" aria-label="CivicFlow home">
          <span class="brand-mark">C</span><span>Civic<span>Flow</span></span>
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          ${['home','services','applications','help'].map(tab => `<a href="#${tab}" class="${state.activeTab === tab ? 'active' : ''}" data-tab="${tab}">${tab[0].toUpperCase()+tab.slice(1)}</a>`).join('')}
        </nav>
        <div class="top-actions">
          <button class="icon-button" id="languageBtn" title="Change language">🌐 <span>${state.language}</span></button>
          <button class="profile-button" id="profileBtn"><span>👤</span> Profile</button>
        </div>
      </header>

      <main>
        ${state.activeTab === 'home' ? homeView() : state.activeTab === 'services' ? servicesView() : state.activeTab === 'applications' ? applicationsView() : helpView()}
      </main>

      <footer class="footer">
        <div><strong>CivicFlow</strong><span>Prototype for Hack With Hyderabad 3.0</span></div>
        <span>Built around the principle: show the next useful action first.</span>
      </footer>

      ${state.selectedService ? serviceModal(state.selectedService) : ''}
      <div id="toast" class="toast" role="status" aria-live="polite"></div>
    </div>`;
  bindEvents();
}

function homeView() {
  const suggested = services.slice(0, 4);
  return `
    <section class="hero section-pad" id="home">
      <div class="hero-copy">
        <div class="pill"><span class="status-dot"></span> Public-service navigation, simplified</div>
        <h1>What do you need <em>help with?</em></h1>
        <p class="hero-lead">Tell CivicFlow what you are trying to do. We'll turn a confusing public-service journey into a clear checklist of the next steps.</p>
        <div class="guide-box">
          <div class="search-row">
            <span class="search-icon">⌕</span>
            <input id="serviceSearch" value="${escapeHtml(state.query)}" placeholder="e.g. I need a birth certificate" aria-label="Describe the service you need" />
            <button id="voiceBtn" class="round-action" title="Use voice">🎙</button>
            <button id="guideBtn" class="primary-button">Guide me <span>→</span></button>
          </div>
          <div class="quick-row"><span>Try:</span>${['Birth certificate','Income certificate','File a grievance'].map(q => `<button class="quick-chip" data-query="${q}">${q}</button>`).join('')}</div>
        </div>
        <div class="trust-row"><span>✓ Clear steps</span><span>✓ Document checklist</span><span>✓ Accessibility options</span></div>
      </div>
      <div class="hero-visual" aria-label="CivicFlow journey illustration">
        <div class="journey-card">
          <div class="journey-head"><span>YOUR JOURNEY</span><span class="mini-check">● Guided</span></div>
          <div class="journey-step done"><span>✓</span><div><strong>Find your service</strong><small>We found a possible match</small></div></div>
          <div class="journey-line"></div>
          <div class="journey-step active-step"><span>2</span><div><strong>Check eligibility</strong><small>See what applies to you</small></div></div>
          <div class="journey-line"></div>
          <div class="journey-step"><span>3</span><div><strong>Prepare documents</strong><small>Know what to keep ready</small></div></div>
          <div class="journey-line"></div>
          <div class="journey-step"><span>4</span><div><strong>Apply & track</strong><small>Keep your reference number</small></div></div>
        </div>
        <div class="floating-note note-one">💡 <span>Next useful action first</span></div>
        <div class="floating-note note-two">✓ <span>Simple language</span></div>
      </div>
    </section>

    <section class="section-pad soft-section">
      <div class="section-heading"><div><span class="eyebrow">EXPLORE SERVICES</span><h2>Popular journeys</h2></div><button class="outline-button" data-tab="services">View all services →</button></div>
      <div class="service-grid">${suggested.map(serviceCard).join('')}</div>
    </section>

    <section class="section-pad feature-section">
      <div class="feature-copy"><span class="eyebrow">BUILT FOR REAL PEOPLE</span><h2>From “I don't know where to start” to “I know my next step.”</h2><p>CivicFlow is designed around a simple UX question: how might complex public-service journeys feel as easy as completing a guided checklist?</p></div>
      <div class="feature-list">
        <div><span>01</span><strong>Describe your need</strong><p>Use everyday language instead of knowing the exact government service name.</p></div>
        <div><span>02</span><strong>Understand the match</strong><p>See eligibility, documents and steps in one focused view.</p></div>
        <div><span>03</span><strong>Keep moving</strong><p>Track progress and recover from mistakes without starting over.</p></div>
      </div>
    </section>`;
}

function servicesView() {
  const filtered = services.filter(s => `${s.title} ${s.category} ${s.description}`.toLowerCase().includes(state.query.toLowerCase()));
  return `<section class="section-pad page-section"><div class="page-title"><span class="eyebrow">SERVICES</span><h1>Find a public service</h1><p>Browse a prototype set of common journeys. Requirements shown here are illustrative and should be verified with the relevant official authority.</p></div><div class="filter-bar"><div class="search-control"><span>⌕</span><input id="serviceSearch" value="${escapeHtml(state.query)}" placeholder="Search services" /></div><button class="outline-button" id="clearSearch">Clear</button></div><div class="service-grid">${filtered.length ? filtered.map(serviceCard).join('') : `<div class="empty-state"><span>🔎</span><h3>No service found</h3><p>Try a broader phrase such as “certificate”, “benefit”, or “complaint”.</p></div>`}</div></section>`;
}

function applicationsView() {
  return `<section class="section-pad page-section"><div class="page-title"><span class="eyebrow">APPLICATIONS</span><h1>Keep track of your journey</h1><p>This prototype demonstrates the tracking experience. It does not connect to a government database.</p></div><div class="tracking-card"><div class="tracking-top"><div><span class="eyebrow">DEMO APPLICATION</span><h2>Birth certificate request</h2><p>Reference: <strong>CF-DEMO-2048</strong></p></div><span class="status-badge">In progress</span></div><div class="progress"><div class="progress-fill"></div></div><div class="tracking-steps"><div class="track done"><span>✓</span><strong>Request started</strong><small>Completed</small></div><div class="track done"><span>✓</span><strong>Documents checked</strong><small>Completed</small></div><div class="track current"><span>3</span><strong>Application review</strong><small>Current step</small></div><div class="track"><span>4</span><strong>Decision / certificate</strong><small>Next</small></div></div></div><div class="tip-box">💡 <div><strong>Keep your reference number</strong><p>When using a real service, save the official acknowledgement or reference number so you can check status later.</p></div></div></section>`;
}

function helpView() {
  return `<section class="section-pad page-section"><div class="page-title"><span class="eyebrow">HELP & ACCESSIBILITY</span><h1>Make CivicFlow work for you</h1><p>Choose accessibility preferences and explore how the prototype handles common usability needs.</p></div><div class="access-grid"><div class="access-card"><span class="access-icon">🔠</span><h3>Larger text</h3><p>Increase text size across the experience.</p><button class="outline-button" id="largeTextBtn">${state.largeText ? 'Turn off' : 'Turn on'}</button></div><div class="access-card"><span class="access-icon">◐</span><h3>High contrast</h3><p>Increase contrast for easier reading.</p><button class="outline-button" id="contrastBtn">${state.highContrast ? 'Turn off' : 'Turn on'}</button></div><div class="access-card"><span class="access-icon">🎙</span><h3>Voice assistance</h3><p>Speak a request using your browser's voice recognition when supported.</p><button class="outline-button" id="voiceHelpBtn">Try voice</button></div><div class="access-card"><span class="access-icon">🌐</span><h3>Language</h3><p>Prototype language switcher for future multilingual support.</p><button class="outline-button" id="langHelpBtn">${state.language}</button></div></div><div class="disclaimer"><strong>Prototype note</strong><p>CivicFlow is a hackathon prototype. It does not replace official government websites or verify live eligibility, fees, document lists, appointment availability, or application status.</p></div></section>`;
}

function serviceModal(service) {
  return `<div class="modal-backdrop" id="modalBackdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" id="closeModal" aria-label="Close">×</button><div class="modal-icon">${service.icon}</div><span class="eyebrow">${service.category}</span><h2 id="modalTitle">${service.title}</h2><p>${service.description}</p><div class="modal-grid"><div><h3>Eligibility / preparation</h3><div class="info-box">Check the rules that apply to your location and situation before submitting anything.</div><h3>Documents to prepare</h3><ul class="checklist">${service.documents.map((doc,i)=>`<li><label><input type="checkbox" data-check="${service.id}-${i}" ${state.completed.has(`${service.id}-${i}`) ? 'checked' : ''}><span>${doc}</span></label></li>`).join('')}</ul></div><div><h3>Guided steps</h3><ol class="step-list">${service.steps.map((step,i)=>`<li><span>${i+1}</span><div><strong>${step}</strong><small>${i === 0 ? 'Start here' : i === service.steps.length-1 ? 'Keep your reference number' : 'CivicFlow guidance'}</small></div></li>`).join('')}</ol><div class="notice">⚠️ ${service.note}</div></div></div><div class="modal-footer"><button class="outline-button" id="saveJourney">Save journey</button><button class="primary-button" id="startJourney">Start guided journey →</button></div></section></div>`;
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); state.activeTab = el.dataset.tab; if (state.activeTab !== 'services') state.query = ''; render(); window.scrollTo({top:0,behavior:'smooth'}); }));
  document.querySelectorAll('.open-service').forEach(btn => btn.addEventListener('click', () => { state.selectedService = services.find(s => s.id === btn.dataset.id); render(); }));
  document.querySelectorAll('.quick-chip').forEach(btn => btn.addEventListener('click', () => { state.query = btn.dataset.query; state.activeTab = 'services'; render(); }));
  const search = document.querySelector('#serviceSearch');
  if (search) { search.addEventListener('input', e => { state.query = e.target.value; if (state.activeTab === 'services') render(); }); search.addEventListener('keydown', e => { if(e.key==='Enter'){ state.activeTab='services'; render(); }}); }
  document.querySelector('#guideBtn')?.addEventListener('click', () => { const value = document.querySelector('#serviceSearch')?.value.trim(); state.query = value || 'certificate'; state.activeTab='services'; render(); });
  document.querySelector('#voiceBtn')?.addEventListener('click', startVoice);
  document.querySelector('#voiceHelpBtn')?.addEventListener('click', startVoice);
  document.querySelector('#clearSearch')?.addEventListener('click', () => { state.query=''; render(); });
  document.querySelector('#closeModal')?.addEventListener('click', () => { state.selectedService=null; render(); });
  document.querySelector('#modalBackdrop')?.addEventListener('click', e => { if(e.target.id==='modalBackdrop'){ state.selectedService=null; render(); }});
  document.querySelectorAll('[data-check]').forEach(box => box.addEventListener('change', e => { e.target.checked ? state.completed.add(e.target.dataset.check) : state.completed.delete(e.target.dataset.check); }));
  document.querySelector('#startJourney')?.addEventListener('click', () => toast('Guided journey started. Your next step is shown above.'));
  document.querySelector('#saveJourney')?.addEventListener('click', () => toast('Journey saved for this prototype session.'));
  document.querySelector('#largeTextBtn')?.addEventListener('click', () => { state.largeText=!state.largeText; render(); });
  document.querySelector('#contrastBtn')?.addEventListener('click', () => { state.highContrast=!state.highContrast; render(); });
  document.querySelector('#langHelpBtn')?.addEventListener('click', cycleLanguage);
  document.querySelector('#languageBtn')?.addEventListener('click', cycleLanguage);
  document.querySelector('#profileBtn')?.addEventListener('click', () => toast('Profile is a prototype feature — no account is required.'));
}

function cycleLanguage(){ const langs=['English','తెలుగు','हिन्दी']; state.language=langs[(langs.indexOf(state.language)+1)%langs.length]; render(); toast(`Language set to ${state.language} (prototype UI).`); }
function startVoice(){
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!Recognition){ toast('Voice recognition is not supported in this browser. Try Chrome.'); return; }
  const recognition = new Recognition(); recognition.lang='en-IN'; recognition.interimResults=false; recognition.maxAlternatives=1;
  toast('Listening… tell CivicFlow what you need.');
  recognition.onresult = e => { state.query=e.results[0][0].transcript; state.activeTab='services'; render(); };
  recognition.onerror = () => toast('Voice input could not be completed. Please try again.');
  recognition.start();
}
function toast(message){ const el=document.querySelector('#toast'); if(!el) return; el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); }
function escapeHtml(value=''){ return value.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

render();
