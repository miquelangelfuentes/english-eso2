(() => {
  'use strict';

  const filename = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const unitMatch = filename.match(/^unit(\d+)(?:-(reforc|ampliacio))?\.html$/);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function addSharedAccessibility() {
    document.querySelectorAll('button').forEach((button) => {
      if (button.getAttribute('aria-label') || button.textContent.trim()) return;
      const icon = button.querySelector('[data-lucide]')?.getAttribute('data-lucide');
      const labels = {
        x: 'Tanca',
        printer: 'Imprimeix',
        menu: 'Obre el menú',
        volume2: 'Escolta l’àudio',
        'volume-2': 'Escolta l’àudio'
      };
      if (icon && labels[icon]) button.setAttribute('aria-label', labels[icon]);
    });

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', `${link.textContent.trim()} (s’obre en una pestanya nova)`);
      }
    });

    if (prefersReducedMotion && typeof window.confetti === 'function') {
      window.confetti = () => Promise.resolve();
    }
  }

  function enhanceUnitsModal() {
    const modal = document.getElementById('units-modal');
    if (!modal) return;

    const title = modal.querySelector('h2');
    if (title && !title.id) title.id = 'units-modal-title';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (title) modal.setAttribute('aria-labelledby', title.id);
    modal.setAttribute('aria-hidden', modal.classList.contains('hidden') ? 'true' : 'false');
    const modalToggles = Array.from(document.querySelectorAll('[aria-controls="units-modal"]'));
    modalToggles.forEach((button) => button.setAttribute('aria-expanded', modal.classList.contains('hidden') ? 'false' : 'true'));

    const closeButton = Array.from(modal.querySelectorAll('button')).find((button) =>
      button.querySelector('[data-lucide="x"]')
    );
    if (closeButton) closeButton.setAttribute('aria-label', 'Tanca el temari');

    let returnFocus = null;
    const originalToggle = window.toggleUnitsModal;
    if (typeof originalToggle === 'function' && !originalToggle.__accessibleWrapped) {
      const wrapped = function () {
        const opening = modal.classList.contains('hidden');
        if (opening) returnFocus = document.activeElement;
        originalToggle();
        const isHidden = modal.classList.contains('hidden');
        modal.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
        modalToggles.forEach((button) => button.setAttribute('aria-expanded', isHidden ? 'false' : 'true'));
        document.querySelector('main')?.toggleAttribute('inert', !isHidden);
        if (!isHidden) {
          window.setTimeout(() => (closeButton || modal.querySelector('a, button'))?.focus(), 0);
        } else if (returnFocus && typeof returnFocus.focus === 'function') {
          returnFocus.focus();
        }
      };
      wrapped.__accessibleWrapped = true;
      window.toggleUnitsModal = wrapped;
    }

    document.addEventListener('keydown', (event) => {
      if (modal.classList.contains('hidden')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        window.toggleUnitsModal?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hasAttribute('hidden'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function rememberProgress() {
    if (!unitMatch) return;
    const unit = unitMatch[1];
    safeSet('english2eso:lastPage', filename);
    safeSet('english2eso:lastUnit', unit);

    const inspectScore = (element) => {
      if (!(element instanceof Element)) return;
      const container = element.closest('[id*="score"], [id*="result"], [class*="score"], [class*="result"], #practice-section');
      if (!container) return;
      const text = element.textContent || '';
      let value = null;
      const outOfTen = text.match(/\b(10|[0-9])\s*\/\s*10\b/);
      const percent = text.match(/\b(100|[1-9]?[0-9])\s*%/);
      if (outOfTen) value = Number(outOfTen[1]) * 10;
      else if (percent) value = Number(percent[1]);
      if (value === null) return;
      const key = `english2eso:best:unit${unit}`;
      const previous = Number(safeGet(key) || 0);
      if (value > previous) safeSet(key, String(value));
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => inspectScore(mutation.target));
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function enhanceIndex() {
    if (filename !== 'index.html') return;
    const main = document.querySelector('main');
    if (!main) return;
    const hero = main.querySelector(':scope > section');

    if (hero) {
      const stats = Array.from(hero.querySelectorAll('.grid')).find((grid) =>
        /unitats completes/i.test(grid.textContent || '') && /preguntes/i.test(grid.textContent || '')
      );
      if (stats) stats.remove();

      const lastPage = safeGet('english2eso:lastPage');
      const lastUnit = safeGet('english2eso:lastUnit');
      const target = lastPage && /^unit\d+(?:-(?:reforc|ampliacio))?\.html$/.test(lastPage) ? lastPage : 'unit1.html';
      const label = lastUnit ? `Continua amb la unitat ${lastUnit}` : 'Comença per la unitat 1';

      if (!hero.querySelector('[data-continue-learning]')) {
        const actions = document.createElement('div');
        actions.dataset.continueLearning = 'true';
        actions.className = 'relative z-10 mt-6 flex flex-wrap items-center gap-3';
        actions.innerHTML = `
          <a href="${target}" id="continue-learning" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm">
            <span>${label}</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
          <a href="#units-grid" class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
            <span>Tria una altra unitat</span>
          </a>`;
        hero.querySelector('.relative.z-10')?.appendChild(actions);
      }
    }

    const unitsGrid = document.getElementById('units-grid');
    if (unitsGrid) {
      for (let unit = 1; unit <= 8; unit += 1) {
        const best = Number(safeGet(`english2eso:best:unit${unit}`) || 0);
        if (!best) continue;
        const link = unitsGrid.querySelector(`a[href="unit${unit}.html"]`);
        const card = link?.closest('.rounded-3xl');
        if (!card || card.querySelector('[data-best-score]')) continue;
        const badge = document.createElement('div');
        badge.dataset.bestScore = 'true';
        badge.className = 'mt-3 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2';
        badge.textContent = `Millor resultat desat en aquest navegador: ${best}%`;
        const content = card.querySelector('.space-y-3') || card.firstElementChild;
        content?.appendChild(badge);
      }

      const unitSection = unitsGrid.closest('section');
      const verbQuestHeading = Array.from(document.querySelectorAll('h3')).find((heading) => /Verb Quest/i.test(heading.textContent || ''));
      const verbQuestSection = verbQuestHeading?.closest('section');
      if (unitSection && verbQuestSection && unitSection.nextElementSibling !== verbQuestSection) {
        unitSection.after(verbQuestSection);
      }
    }
  }

  function addLearningRoute() {
    if (!unitMatch) return;
    const unit = unitMatch[1];
    const mode = unitMatch[2] || 'main';
    const main = document.querySelector('main');
    if (!main || main.querySelector('[data-learning-route]')) return;

    const box = document.createElement('aside');
    box.dataset.learningRoute = 'true';
    box.className = 'rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3';

    let message = '';
    let actions = '';
    if (mode === 'main') {
      message = '<strong>Com treballar aquesta unitat.</strong> Aquesta és la ruta principal. Pots canviar a Reforç si necessites més suport o passar a Ampliació per aprofundir.';
      actions = `<a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-emerald-200 bg-white text-emerald-800 font-bold hover:bg-emerald-50" href="unit${unit}-reforc.html">Reforç</a><a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-800 font-bold hover:bg-purple-50" href="unit${unit}-ampliacio.html">Ampliació</a>`;
    } else if (mode === 'reforc') {
      message = '<strong>Ruta de Reforç.</strong> Pots tornar a la unitat completa o passar a Ampliació quan vulguis aprofundir.';
      actions = `<a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-indigo-200 bg-white text-indigo-800 font-bold hover:bg-indigo-50" href="unit${unit}.html">Unitat completa</a><a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-800 font-bold hover:bg-purple-50" href="unit${unit}-ampliacio.html">Ampliació</a>`;
    } else {
      message = '<strong>Ruta d’Ampliació.</strong> Pots tornar a la unitat completa o obrir Reforç si necessites més suport.';
      actions = `<a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-indigo-200 bg-white text-indigo-800 font-bold hover:bg-indigo-50" href="unit${unit}.html">Unitat completa</a><a class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-emerald-200 bg-white text-emerald-800 font-bold hover:bg-emerald-50" href="unit${unit}-reforc.html">Reforç</a>`;
    }

    box.innerHTML = `<p class="leading-relaxed">${message}</p><div class="flex flex-wrap gap-2 shrink-0">${actions}</div>`;

    const firstSection = main.querySelector(':scope > section');
    if (firstSection) firstSection.after(box);
    else main.prepend(box);
  }

  function addProgressiveDisclosure() {
    if (!unitMatch || unitMatch[2]) return;

    if (!document.documentElement.dataset.progressiveDisclosureBound) {
      document.documentElement.dataset.progressiveDisclosureBound = 'true';
      document.addEventListener('click', (event) => {
        const button = event.target.closest?.('.progressive-toggle');
        if (!button) return;

        const targetId = button.getAttribute('aria-controls');
        const card = (targetId && document.getElementById(targetId)) || button.previousElementSibling;
        if (!card?.classList.contains('progressive-card')) return;

        event.preventDefault();
        const expanded = card.classList.toggle('progressive-card-expanded');
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        button.textContent = expanded ? 'Mostra menys' : 'Mostra més';

        if (expanded) {
          card.style.maxHeight = 'none';
          card.style.overflow = 'visible';
        } else {
          card.style.removeProperty('max-height');
          card.style.removeProperty('overflow');
        }
      });
    }

    const practice = document.getElementById('practice-section');
    const candidates = Array.from(document.querySelectorAll('main .print-card, main .bg-white.rounded-3xl'));
    let count = 0;

    candidates.forEach((card) => {
      if (count >= 8) return;
      if (practice?.contains(card)) return;
      if (card.closest('#overview, #scaffolding-section')) return;
      if (card.matches('.grid, .flex') || card.querySelector('input, select, textarea, button')) return;
      if ((card.textContent || '').trim().length < 950) return;
      if (card.dataset.progressiveReady) return;

      count += 1;
      const cardId = card.id || `progressive-card-unit${unitMatch[1]}-${count}`;
      card.id = cardId;
      card.dataset.progressiveReady = 'true';
      card.classList.add('progressive-card');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'progressive-toggle';
      button.dataset.progressiveToggle = 'true';
      button.setAttribute('aria-controls', cardId);
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'Mostra més';
      card.after(button);
    });
  }

  function addPracticeLinksForUnit2() {
    if (filename !== 'unit2.html') return;
    ['contrast-section', 'stative-section', 'tags-section'].forEach((id) => {
      const section = document.getElementById(id);
      if (!section || section.querySelector('[data-practice-link]')) return;
      const link = document.createElement('a');
      link.dataset.practiceLink = 'true';
      link.href = '#practice-section';
      link.className = 'inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-sm transition-colors';
      link.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i><span>Practica aquesta part</span>';
      section.appendChild(link);
    });
  }

  function addOpenProductionForUnit2() {
    if (filename !== 'unit2.html') return;
    const practice = document.getElementById('practice-section');
    if (!practice || practice.querySelector('[data-open-production]')) return;

    const block = document.createElement('section');
    block.dataset.openProduction = 'true';
    block.className = 'bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5';
    block.innerHTML = `
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">Producció pròpia</span>
        <h3 class="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-2">Ara construeix les frases tu</h3>
        <p class="text-sm text-slate-600 mt-1">Aquí no hi ha opcions per triar. Escriu una resposta i utilitza el model només després d’haver-ho intentat.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${[
          ['Escriu una frase sobre una rutina teva en present simple.', 'I walk to school every morning.'],
          ['Descriu una acció que passa ara mateix amb present continuous.', 'My classmates are working quietly now.'],
          ['Escriu una frase amb un verb d’estat que expressi opinió, sentiment o possessió.', 'I think this exercise is useful.'],
          ['Completa amb una tag question: Your best friend likes music, ...?', "Your best friend likes music, doesn’t he / she?"]
        ].map(([prompt, sample], index) => `
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <label for="production-${index}" class="block text-sm font-semibold text-slate-800">${prompt}</label>
            <textarea id="production-${index}" rows="3" class="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Escriu aquí..."></textarea>
            <button type="button" class="text-xs font-bold text-brand-700 hover:text-brand-900 underline underline-offset-2" aria-expanded="false" data-sample-toggle="${index}">Mostra una possibilitat</button>
            <p class="hidden text-xs text-slate-600 bg-white rounded-lg border border-slate-200 p-2" data-sample="${index}"><strong>Exemple:</strong> ${sample}</p>
          </div>`).join('')}
      </div>`;

    block.querySelectorAll('[data-sample-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const sample = block.querySelector(`[data-sample="${button.dataset.sampleToggle}"]`);
        const hidden = sample.classList.toggle('hidden');
        button.setAttribute('aria-expanded', hidden ? 'false' : 'true');
        button.textContent = hidden ? 'Mostra una possibilitat' : 'Amaga el model';
      });
    });

    practice.appendChild(block);
  }

  document.addEventListener('DOMContentLoaded', () => {
    addSharedAccessibility();
    enhanceUnitsModal();
    rememberProgress();
    enhanceIndex();
    addLearningRoute();
    addProgressiveDisclosure();
    addPracticeLinksForUnit2();
    addOpenProductionForUnit2();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  });
})();