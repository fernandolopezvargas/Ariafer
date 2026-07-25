const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navlinks a');

const hamburger = document.getElementById('hamburger');
const navWrap = document.querySelector('nav.wrap');

hamburger?.addEventListener('click', () => {
  navWrap.classList.toggle('open');
  hamburger.textContent = navWrap.classList.contains('open') ? '✕' : '☰';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navWrap.classList.remove('open');
    hamburger.textContent = '☰';
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.addEventListener('click', (e) => {
  if (navWrap?.classList.contains('open') && !e.target.closest('nav.wrap')) {
    navWrap.classList.remove('open');
    hamburger.textContent = '☰';
  }
});

const themeToggleMobile = document.getElementById('theme-toggle-mobile');
if (themeToggleMobile) {
  const updateMobileIcon = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const moon = themeToggleMobile.querySelector('.icon-moon');
    const sun = themeToggleMobile.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = theme === 'light' ? 'none' : 'block';
      sun.style.display = theme === 'light' ? 'block' : 'none';
    }
  };
  updateMobileIcon();
  themeToggleMobile.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (typeof updateThemeIcon === 'function') updateThemeIcon(next);
    updateMobileIcon();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navWrap?.classList.contains('open')) {
    navWrap.classList.remove('open');
    hamburger.textContent = '☰';
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
html.setAttribute('data-theme', savedTheme);

function updateThemeIcon(theme) {
  document.querySelectorAll('.nav-cta').forEach(btn => {
    const moon = btn.querySelector('.icon-moon');
    const sun = btn.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = theme === 'light' ? 'none' : 'block';
      sun.style.display = theme === 'light' ? 'block' : 'none';
    }
  });
}
updateThemeIcon(savedTheme);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  let startTime = null;
  const duration = 40000;

  function animateMarquee(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = (elapsed % duration) / duration;
    const offset = progress * 50;
    marqueeTrack.style.transform = `translateX(-${offset}%)`;
    requestAnimationFrame(animateMarquee);
  }

  requestAnimationFrame(animateMarquee);
}

document.getElementById('current-year').textContent = new Date().getFullYear();

const prompts = [
  'retrato editorial, luz de neón cian y violeta, 8k',
  'ux flow para app fintech, minimal, alto contraste',
  'sistema de diseño consistente, tokens, componentes',
  'identidad de marca cochabambina, moderna y cálida'
];
const ideas = [
  'nueva idea: portada para newsletter semanal',
  'nueva idea: icono isométrico para dashboard',
  'nueva idea: mockup de app de recetas',
  'nueva idea: ilustración de marca personal'
];
let ideaIdx = 0;
const typedEl = document.getElementById('typed');
const promptBox = document.querySelector('.prompt-box');
let pIndex = 0, cIndex = 0, deleting = false;

function typeLoop() {
  const current = prompts[pIndex];
  if (!deleting) {
    cIndex++;
    typedEl.textContent = current.slice(0, cIndex);
    if (cIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    cIndex--;
    typedEl.textContent = current.slice(0, cIndex);
    if (cIndex === 0) {
      deleting = false;
      pIndex = (pIndex + 1) % prompts.length;
    }
  }
  setTimeout(typeLoop, deleting ? 25 : 38);
}
typeLoop();

function nextPrompt() {
  pIndex = (pIndex + 1) % prompts.length;
  cIndex = 0;
  deleting = false;
}

function addIdea() {
  const idea = ideas[ideaIdx % ideas.length];
  ideaIdx++;
  document.getElementById('lastIdea').textContent = '> ' + idea + ' ';
  prompts.push(idea);
  pIndex = prompts.length - 1;
  cIndex = 0;
  deleting = false;
}

if (promptBox) {
  promptBox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      nextPrompt();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addIdea();
    }
  });
}

    const cards = document.querySelectorAll('.art-card');
    const progressFill = document.getElementById('progressFill');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const stage = document.getElementById('stage');
    
    let current = 0;
    const total = cards.length;
    let autoTimer;
    const autoDelay = 6000;
    let isPaused = false;

    function updatePositions() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');
            if (i === current) card.classList.add('active');
            else if (i === (current - 1 + total) % total) card.classList.add('prev');
            else if (i === (current + 1) % total) card.classList.add('next');
            else card.classList.add('hidden');
        });
        progressFill.style.width = ((current + 1) / total * 100) + '%';
    }

    function goTo(index) {
        current = (index + total) % total;
        updatePositions();
        resetAuto();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAuto() {
        clearInterval(autoTimer);
        if (!isPaused) autoTimer = setInterval(next, autoDelay);
    }

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    stage.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    }, {passive: true});

    let dragStart = 0, isDragging = false;
    stage.addEventListener('mousedown', (e) => { isDragging = true; dragStart = e.pageX; });
    stage.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = dragStart - e.pageX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    });

    stage.addEventListener('mouseenter', () => { isPaused = true; clearInterval(autoTimer); });
    stage.addEventListener('mouseleave', () => { isPaused = false; resetAuto(); });

    resetAuto();

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.job-row');
        row.classList.toggle('expanded');
    });
});


