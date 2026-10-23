(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Menü öffnen';
    nav.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.querySelector('.sr-only').textContent = open ? 'Menü öffnen' : 'Menü schließen';
    nav.classList.toggle('is-open', !open);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const reveals = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(item => revealObserver.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-poster-rotator]').forEach(rotator => {
    const posters = [...rotator.querySelectorAll('.poster')];
    let active = 0;
    if (!reducedMotion && posters.length > 1) {
      window.setInterval(() => {
        posters[active].classList.remove('is-active');
        active = (active + 1) % posters.length;
        posters[active].classList.add('is-active');
      }, 3800);
    }
  });

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = element => {
    const target = Number(element.dataset.count);
    const duration = 1000;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(counter => reducedMotion ? counter.textContent = counter.dataset.count : counterObserver.observe(counter));

  document.querySelectorAll('.recipe-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.recipe-card');
      const open = card.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span:first-child').textContent = open ? 'Rezept zuklappen' : 'Rezept aufklappen';
      button.querySelector('span:last-child').textContent = open ? '−' : '＋';
    });
  });

  const quarkForm = document.querySelector('#quark-form');
  const quarkResult = document.querySelector('#quark-result');
  const resultTitle = document.querySelector('#result-title');
  const resultCopy = document.querySelector('#result-copy');
  const resultAmount = document.querySelector('#result-amount');
  const resultMeter = document.querySelector('#result-meter');
  const resultSlogan = document.querySelector('#result-slogan');

  const quarkPlans = {
    herzhaft: {
      frueh: ['Bautz\'ner Bolzen', 'Naturquark, Senf, Gurke und ordentlich Pfeffer. In fünf Minuten schichtbereit.', '„Früh anfangen heißt früher löffeln.“'],
      spaet: ['Schichtleiter-Stulle', 'Kräuterquark, Ei und Graubrot. Hält bis Feierabend und wahrscheinlich noch länger.', '„Wenn de Stulle steht, steht der Plan.“'],
      nacht: ['Gruben-Gurke', 'Quark, Gurke, Dill und Salz. Kühl, direkt und heller als de Hallenbeleuchtung.', '„Dunkel draußen. Löffel trotzdem finden.“']
    },
    suess: {
      frueh: ['Apfel-Abriss', 'Quark, Apfel, Hafer und Zimt. Süß genug zum Wachwerden, solide genug zum Anpacken.', '„Eener für die Energie, eener für die Moral.“'],
      spaet: ['Pausengong-Pfirsich', 'Quark, Pfirsich und eine Prise Zimt. Betriebsferien im Becher.', '„Kurz süß, dann weiter.“'],
      nacht: ['Nachtschicht Vanille', 'Cremiger Vanillequark mit Hafer. Macht die Dunkelstunden wenigstens essbar.', '„Die Lampe flackert. Der Quark nich.“']
    },
    pur: {
      frueh: ['Planerfüller Natur', 'Quark. Löffel. Fertsch. Mehr Zutaten würden bloß die Übergabe verzögern.', '„Keine Ablenkung vom Wesentlichen.“'],
      spaet: ['Halbzeit-Halber', 'Naturquark mit einem Schluck Wasser glattgerührt. Unaufgeregt und unkaputtbar.', '„Pause kurz. Wirkung lang.“'],
      nacht: ['Weißer Wachposten', 'Naturquark pur, direkt aus dem Eimer. Spart Abwasch und Diskussionen.', '„Wer würzt, hat noch Reserven.“']
    }
  };

  const updateQuarkPlan = (stamp = false) => {
    if (!quarkForm || !quarkResult) return;
    const data = new FormData(quarkForm);
    const shift = data.get('shift');
    const hunger = data.get('hunger');
    const taste = data.get('taste');
    const plan = quarkPlans[taste][shift];
    const amount = hunger === 'abriss' ? 500 : 250;
    resultTitle.textContent = plan[0];
    resultCopy.textContent = `${amount} g ${plan[1].charAt(0).toLowerCase()}${plan[1].slice(1)}`;
    resultAmount.textContent = `${amount} g`;
    resultMeter.style.width = `${amount === 500 ? 100 : 50}%`;
    resultSlogan.textContent = plan[2];
    quarkResult.classList.toggle('is-stamped', stamp);
    if (stamp && !reducedMotion) {
      quarkResult.animate([{ transform: 'rotate(1deg) scale(1)' }, { transform: 'rotate(1deg) scale(.985)' }, { transform: 'rotate(1deg) scale(1)' }], { duration: 260 });
    }
  };

  quarkForm?.addEventListener('change', () => updateQuarkPlan(false));
  quarkForm?.addEventListener('submit', event => {
    event.preventDefault();
    updateQuarkPlan(true);
  });

  document.querySelectorAll('[data-prefill]').forEach(button => {
    button.addEventListener('click', () => {
      const shift = button.dataset.prefill;
      const input = quarkForm?.querySelector(`input[name="shift"][value="${shift}"]`);
      if (input) input.checked = true;
      if (shift === 'nacht') {
        const sweet = quarkForm?.querySelector('input[name="taste"][value="suess"]');
        if (sweet) sweet.checked = true;
      }
      updateQuarkPlan(false);
      document.querySelector('#quarkomat')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  const quotes = [
    '„Wer den Löffel abgibt, hat nich richtich angefangen.“',
    '„Quark im Bauch, Feierabend in Sicht.“',
    '„Nich quatschen. Quark machen.“',
    '„Der Bizeps wächst nich von der Bauberatung.“',
    '„Eener geht noch nei. Nu los.“',
    '„Was de Kelle für de Wand, is der Löffel für den Mann.“'
  ];
  const quoteElement = document.querySelector('#daily-quote');
  document.querySelector('#new-quote')?.addEventListener('click', event => {
    let next = quoteElement.textContent;
    while (next === quoteElement.textContent && quotes.length > 1) {
      next = quotes[Math.floor(Math.random() * quotes.length)];
    }
    quoteElement.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: reducedMotion ? 1 : 350 });
    quoteElement.textContent = next;
    event.currentTarget.blur();
  });

  const clock = document.querySelector('#clock');
  const updateClock = () => {
    if (clock) clock.textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 30000);

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  if (!reducedMotion) {
    const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
    let ticking = false;
    const updateParallax = () => {
      const viewportCenter = window.innerHeight / 2;
      parallaxItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - viewportCenter) * Number(item.dataset.parallax);
        item.style.setProperty('--parallax-y', `${Math.max(-45, Math.min(45, -offset))}px`);
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }
})();
