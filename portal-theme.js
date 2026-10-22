(() => {
  const STORAGE_KEY = 'eso2-portal-theme';
  const root = document.documentElement;
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const unitMatch = currentFile.match(/^unit([1-8])\.html$/);
  const unitNumber = unitMatch ? Number(unitMatch[1]) : null;

  if (!document.querySelector('link[data-portal-mobile]')) {
    const mobileStyles = document.createElement('link');
    mobileStyles.rel = 'stylesheet';
    mobileStyles.href = 'portal-mobile.css?v=1';
    mobileStyles.dataset.portalMobile = 'true';
    document.head.appendChild(mobileStyles);
  }

  if (unitNumber) {
    root.classList.add('page-unit', `page-unit${unitNumber}`);
  }

  const unitOverviewGoals = {
    1: [
      {
        icon: 'home',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'There is / there are',
        text: 'Expressar "hi ha" en singular, plural i noms no comptables.'
      },
      {
        icon: 'pie-chart',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Articles i quantificadors',
        text: 'Distingir quan cal some, any, much, many, a lot of o preguntar quantitat.'
      },
      {
        icon: 'user-check',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'Pronoms objecte',
        text: 'Substituir persones i coses amb him, her, them o us sense repetir noms.'
      }
    ],
    2: [
      {
        icon: 'refresh-cw',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Hàbit vs. moment',
        text: "Distingir rutines d'accions que passen ara mateix, pel·lícules i fotografies."
      },
      {
        icon: 'heart',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Verbs estàtics',
        text: 'Quan expressen un estat, aquests verbs normalment no s’utilitzen en continuous.'
      },
      {
        icon: 'tag',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'Tag questions',
        text: "La regla de l’imant (+ / −), l’auxiliar adequat i el pronom corresponent."
      }
    ],
    3: [
      {
        icon: 'history',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Past simple',
        text: "Formar el passat amb -ed o verbs irregulars i utilitzar did / didn't."
      },
      {
        icon: 'building-2',
        tone: 'bg-indigo-400/20 text-indigo-300',
        title: 'There was / there were',
        text: 'Expressar què hi havia en singular i plural en un moment del passat.'
      },
      {
        icon: 'rotate-ccw',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Used to',
        text: 'Descriure hàbits i situacions del passat que han canviat.'
      }
    ],
    4: [
      {
        icon: 'scale',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Comparatius',
        text: 'Comparar amb -er / more... than i expressar també inferioritat.'
      },
      {
        icon: 'equal',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Igualtat, too i enough',
        text: 'Utilitzar (not) as... as i expressar excés o suficiència segons el significat.'
      },
      {
        icon: 'trophy',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'Superlatius',
        text: 'Expressar el grau màxim amb les formes en -est o amb most.'
      }
    ],
    5: [
      {
        icon: 'zap',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Can i could',
        text: "Parlar d'habilitat i formular peticions o permisos."
      },
      {
        icon: 'shield-check',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Must i have to',
        text: 'Expressar obligació o prohibició i diferenciar què imposa la situació.'
      },
      {
        icon: 'message-circle',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'Should i need to',
        text: 'Donar consells i indicar què és necessari o què no cal fer.'
      }
    ],
    6: [
      {
        icon: 'clock',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Past continuous',
        text: 'Descriure accions en procés en un moment determinat del passat.'
      },
      {
        icon: 'zap',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'When',
        text: "Introduir un fet breu que interromp una acció que s'estava desenvolupant."
      },
      {
        icon: 'repeat',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'While',
        text: 'Relacionar accions que es desenvolupaven al mateix temps.'
      }
    ],
    7: [
      {
        icon: 'target',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Be going to',
        text: 'Expressar plans i intencions, o fer prediccions a partir d’evidències.'
      },
      {
        icon: 'calendar',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Present continuous i will',
        text: 'Distingir cites acordades de decisions del moment i altres prediccions.'
      },
      {
        icon: 'git-branch',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'First conditional',
        text: 'Formular condicions possibles de futur amb if o unless.'
      }
    ],
    8: [
      {
        icon: 'circle-check',
        tone: 'bg-emerald-400/20 text-emerald-300',
        title: 'Present perfect',
        text: "Parlar d'experiències i d'accions connectades amb el present."
      },
      {
        icon: 'clock',
        tone: 'bg-amber-400/20 text-amber-300',
        title: 'Partícules temporals',
        text: 'Situar les accions amb els adverbis i les expressions temporals de la unitat.'
      },
      {
        icon: 'arrow-left-right',
        tone: 'bg-rose-400/20 text-rose-300',
        title: 'Present perfect vs. past simple',
        text: 'Decidir si cal connectar el passat amb el present o parlar d’un passat acabat.'
      }
    ]
  };

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function getInitialTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function renderToggle(theme = root.dataset.theme || 'light') {
    const button = document.querySelector('.portal-theme-toggle');
    if (!button) return;

    const dark = theme === 'dark';
    const label = dark ? 'Activa el mode clar' : 'Activa el mode fosc';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}" class="portal-theme-icon" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // La web continua funcionant encara que l'emmagatzematge estigui bloquejat.
      }
    }
    renderToggle(theme);
  }

  function findHeaderActions(header) {
    const soundButton = header.querySelector(
      'button[aria-label*="efectes sonors"], button[title*="efectes sonors"]'
    );
    if (soundButton?.parentElement) {
      return { actions: soundButton.parentElement, soundButton };
    }

    const quickLink = header.querySelector('a[href="#units-grid"]');
    if (quickLink?.parentElement) {
      return { actions: quickLink.parentElement, soundButton: null };
    }

    const bar = header.querySelector(':scope > div > div');
    const actions = bar?.lastElementChild || header.querySelector(':scope > div > div:last-child');
    return { actions, soundButton: null };
  }

  function addToggle() {
    const header = document.querySelector('header');
    if (!header) return;

    const { actions, soundButton } = findHeaderActions(header);
    if (!actions) return;

    actions.style.display = 'flex';
    actions.style.alignItems = 'center';
    actions.style.columnGap = '.5rem';

    let button = header.querySelector('.portal-theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-theme-toggle';
      if (soundButton) soundButton.insertAdjacentElement('beforebegin', button);
      else actions.prepend(button);
    } else if (soundButton && button.parentElement !== actions) {
      soundButton.insertAdjacentElement('beforebegin', button);
    }

    if (button.dataset.themeBound !== 'true') {
      button.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
      button.dataset.themeBound = 'true';
    }

    renderToggle();
  }

  function addOverviewGoals() {
    if (!unitNumber) return;

    const goals = unitOverviewGoals[unitNumber];
    const overview = document.getElementById('overview');
    const content = overview?.querySelector(':scope > .relative.z-10') || overview?.querySelector('.relative.z-10');
    if (!goals || !content) return;

    const grid = document.createElement('div');
    grid.className = 'portal-overview-goals grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2';
    grid.innerHTML = goals.map((goal) => `
      <div class="portal-overview-goal flex items-start gap-3 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
        <div class="portal-overview-goal-icon w-10 h-10 min-w-10 rounded-xl ${goal.tone} flex items-center justify-center shrink-0">
          <i data-lucide="${goal.icon}" class="w-6 h-6" stroke-width="2.4" aria-hidden="true"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold text-white">${goal.title}</h4>
          <p class="text-[11px] text-indigo-200">${goal.text}</p>
        </div>
      </div>
    `).join('');

    const existingGrid = Array.from(content.children).find((child) => child.classList?.contains('grid'));
    if (existingGrid) existingGrid.replaceWith(grid);
    else content.appendChild(grid);

    window.lucide?.createIcons();
  }

  function addQuickAccessCard() {
    if (currentFile !== 'index.html' || document.querySelector('.portal-access-card')) return;
    const main = document.querySelector('main');
    const hero = main?.querySelector(':scope > section');
    if (!main || !hero) return;

    if (!document.getElementById('portal-access-card-styles')) {
      const style = document.createElement('style');
      style.id = 'portal-access-card-styles';
      style.textContent = `
        .portal-access-card{display:grid;grid-template-columns:minmax(0,1fr) 176px;gap:1.5rem;align-items:center;padding:1.25rem 1.5rem;background:var(--portal-surface);border:1px solid var(--portal-border);border-radius:var(--portal-radius-card);box-shadow:var(--portal-shadow)}
        .portal-access-title{display:flex;align-items:center;gap:.55rem;margin:0 0 .4rem;font-family:var(--portal-font-display);font-size:1.125rem;font-weight:700;color:var(--portal-text)}
        .portal-access-title svg{width:22px;height:22px;flex:0 0 22px;color:var(--portal-brand-600)}
        .portal-access-card p{margin:0 0 .85rem;color:var(--portal-muted);font-size:.95rem;line-height:1.55}
        .portal-access-url{display:inline-flex;align-items:center;gap:.45rem;min-height:44px;padding:.55rem .8rem;border:1px solid var(--portal-brand-200);border-radius:var(--portal-radius-control);background:var(--portal-brand-50);color:var(--portal-brand-700);font-weight:800;text-decoration:none}
        .portal-access-url:hover{text-decoration:underline}
        .portal-access-url svg{width:18px;height:18px;flex:0 0 18px}
        .portal-access-qr{justify-self:center;display:block;padding:.5rem;background:#fff;border:1px solid var(--portal-border);border-radius:var(--portal-radius-control)}
        .portal-access-qr img{display:block;width:156px;height:156px}
        @media(max-width:600px){.portal-access-card{grid-template-columns:1fr;text-align:center;padding:1.1rem}.portal-access-title,.portal-access-url{justify-content:center}.portal-access-qr img{width:168px;height:168px}}
      `;
      document.head.appendChild(style);
    }

    const card = document.createElement('section');
    card.className = 'portal-access-card';
    card.setAttribute('aria-labelledby', 'portal-access-title');
    card.innerHTML = `
      <div>
        <h2 id="portal-access-title" class="portal-access-title"><i data-lucide="smartphone" aria-hidden="true"></i><span>Accés ràpid al portal</span></h2>
        <p>Escriu l’adreça curta o escaneja el codi QR amb el mòbil.</p>
        <a class="portal-access-url" href="https://ja.cat/quercus-2eso-grammar" target="_blank" rel="noopener">
          <span>ja.cat/quercus-2eso-grammar</span>
          <i data-lucide="external-link" aria-hidden="true"></i>
        </a>
      </div>
      <a class="portal-access-qr" href="https://ja.cat/quercus-2eso-grammar" target="_blank" rel="noopener" aria-label="Obrir ja.cat/quercus-2eso-grammar">
        <img src="assets/qr-quercus-2eso-grammar.svg" width="156" height="156" alt="Codi QR per accedir a Grammar Lab">
      </a>
    `;
    hero.insertAdjacentElement('afterend', card);
    window.lucide?.createIcons();
  }

  function initPortalChrome() {
    addToggle();
    addOverviewGoals();
    addQuickAccessCard();
  }

  applyTheme(getInitialTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalChrome, { once: true });
  } else {
    initPortalChrome();
  }
})();
