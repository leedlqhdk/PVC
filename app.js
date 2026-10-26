(() => {
  const config = window.PVC_CONFIG || {};
  const phone = String(config.phone || '').trim();
  const phoneDigits = phone.replace(/[^0-9+]/g, '');
  const owner = String(config.owner || '').trim();
  const kakaoUrl = String(config.kakaoUrl || '').trim();
  const businessNumber = String(config.businessNumber || '').trim();
  const serviceAreas = Array.isArray(config.serviceAreas) ? config.serviceAreas.map((item) => String(item).trim()).filter(Boolean) : [];
  const heroImages = Array.isArray(config.heroImages) ? config.heroImages.filter(Boolean) : [];
  const reviews = Array.isArray(config.reviews) ? config.reviews.filter((r) => r && r.text) : [];
  const setText = (selector, text) => document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });

  // 연락처 — 카카오톡 채널이 없으면 견적 버튼을 문자(SMS)로 연결합니다.
  const usesKakao = Boolean(kakaoUrl);
  const quoteHref = kakaoUrl || (phoneDigits ? `sms:${phoneDigits}` : '');
  document.querySelectorAll('[data-contact]').forEach((link) => {
    const type = link.dataset.contact;
    const destination = type === 'phone' ? (phoneDigits ? `tel:${phoneDigits}` : '') : quoteHref;
    if (!destination) { link.hidden = true; return; }
    link.href = destination;
    if (type === 'quote') {
      if (usesKakao) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else link.classList.add('is-sms');
    }
  });
  setText('[data-phone-label]', phone);
  setText('[data-owner]', owner);
  if (!usesKakao) {
    setText('[data-quote-short]', '문자 견적');
    setText('[data-quote-cta]', '문자로 문의하기');
    setText('[data-quote-cta2]', '문자 상담');
    setText('[data-quote-channel]', '문자');
    setText('[data-quote-channel-name]', '문자');
  }
  setText('[data-biz-number]', businessNumber ? ` · 사업자등록번호 ${businessNumber}` : '');
  if (serviceAreas.length) setText('[data-area-short]', serviceAreas.map((a) => a.replace(/동$/, '')).join('·'));

  // 히어로 슬라이드
  const slides = document.getElementById('hero-slides');
  const dotsWrap = document.getElementById('hero-dots');
  if (slides && heroImages.length) {
    slides.innerHTML = '';
    const imgs = heroImages.map((src, k) => {
      const img = document.createElement('img');
      img.className = 'hero-img' + (k === 0 ? ' is-on' : '');
      img.src = src;
      img.alt = '';
      if (k > 0) img.loading = 'lazy';
      slides.appendChild(img);
      return img;
    });
    let current = 0;
    let timer;
    const dots = imgs.length > 1 ? imgs.map((_, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${k + 1}번째 사진`);
      b.addEventListener('click', () => { show(k); start(); });
      dotsWrap.appendChild(b);
      return b;
    }) : [];
    function show(k) {
      current = k;
      imgs.forEach((img, i) => img.classList.toggle('is-on', i === k));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === k)));
    }
    function start() {
      clearInterval(timer);
      if (imgs.length > 1) timer = setInterval(() => show((current + 1) % imgs.length), 5000);
    }
    show(0);
    start();
  }

  // 후기 — 실제 후기가 있을 때만 표시
  const reviewSec = document.getElementById('reviews');
  if (reviewSec && reviews.length) {
    reviewSec.hidden = false;
    let i = 0;
    const render = () => {
      const r = reviews[i];
      document.getElementById('review-text').textContent = r.text;
      document.getElementById('review-date').textContent = r.date || '';
      document.getElementById('review-who').textContent = r.who || '';
      document.getElementById('review-area').textContent = r.area || '';
    };
    document.getElementById('review-prev').addEventListener('click', () => { i = (i - 1 + reviews.length) % reviews.length; render(); });
    document.getElementById('review-next').addEventListener('click', () => { i = (i + 1) % reviews.length; render(); });
    const nav = reviewSec.querySelector('.review-nav');
    if (reviews.length < 2 && nav) nav.hidden = true;
    render();
  }

  // 스크롤할 때 섹션 내용이 부드럽게 나타남
  const revealTargets = document.querySelectorAll('.statement h2, .statement-sub, .row > *, .owner-sec > *:not(.accent-bar), .faq-inner > *');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el, k) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(k % 3) * 0.12}s`;
      io.observe(el);
    });
  }

  // 오른쪽 섹션 이동 점
  const dotNav = document.getElementById('section-dots');
  const sections = Array.from(document.querySelectorAll('main > section')).filter((s) => !s.hidden);
  if (dotNav && sections.length) {
    const buttons = sections.map((sec) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', sec.dataset.label || '');
      b.innerHTML = '<span class="dot-mark"></span><span class="dot-tip"></span>';
      b.querySelector('.dot-tip').textContent = sec.dataset.label || '';
      b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
      dotNav.appendChild(b);
      return b;
    });
    const update = () => {
      const y = window.scrollY + window.innerHeight / 2;
      let active = 0;
      sections.forEach((s, k) => { if (s.offsetTop <= y) active = k; });
      buttons.forEach((b, k) => b.setAttribute('aria-current', String(k === active)));
      dotNav.classList.toggle('on-dark', sections[active].hasAttribute('data-dark'));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
