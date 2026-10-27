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
  const address = String(config.address || '').trim();
  document.querySelectorAll('[data-biz-number-plain]').forEach((el) => { if (businessNumber) el.textContent = businessNumber; else el.closest('div').hidden = true; });
  document.querySelectorAll('[data-address]').forEach((el) => { if (address) el.textContent = address; else el.closest('div').hidden = true; });
  const year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
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

  // 한 번 스크롤하면 한 화면씩 부드럽게 이동 (마우스·트랙패드·키보드)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pages = () => Array.from(document.querySelectorAll('main > section, main > footer')).filter((el) => !el.hidden);
  const maxY = () => document.documentElement.scrollHeight - window.innerHeight;
  let animating = false;
  let lockUntil = 0;
  function scrollToY(target) {
    target = Math.max(0, Math.min(maxY(), Math.round(target)));
    const start = window.scrollY;
    const dist = target - start;
    if (Math.abs(dist) < 2) return;
    if (reduceMotion) { window.scrollTo(0, target); return; }
    const duration = Math.min(1100, 650 + Math.abs(dist) * 0.25);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const t0 = performance.now();
    animating = true;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else { animating = false; lockUntil = performance.now() + 450; }
    };
    requestAnimationFrame(step);
  }
  function pageTarget(dir) {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const list = pages();
    if (dir > 0) {
      const current = list.filter((el) => el.offsetTop <= y + 2).pop();
      // 화면보다 긴 섹션은 섹션 안에서 한 화면씩 내려감
      if (current && current.offsetTop + current.offsetHeight > y + vh + 2) {
        return Math.min(current.offsetTop + current.offsetHeight - vh, y + vh * 0.9);
      }
      const next = list.find((el) => el.offsetTop > y + 2);
      return next ? next.offsetTop : maxY();
    }
    const prev = list.filter((el) => el.offsetTop < y - 2).pop();
    if (!prev) return 0;
    if (prev.offsetTop + prev.offsetHeight > y - 2 && y - prev.offsetTop > vh) return y - vh * 0.9;
    return prev.offsetTop;
  }
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    // 휠 값은 브라우저마다 단위가 달라(파이어폭스는 줄 단위) 픽셀로 맞춘 뒤,
    // 작은 움직임도 모아서 일정량이 되면 한 화면 이동
    let wheelSum = 0;
    let wheelIdle;
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || document.querySelector('dialog[open]')) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = e.deltaY * unit;
      if (animating || performance.now() < lockUntil) {
        // 이동 중·직후의 관성 스크롤은 무시 (관성이 이어지는 동안 잠금 연장)
        if (!animating) lockUntil = Math.max(lockUntil, performance.now() + 150);
        wheelSum = 0;
        return;
      }
      if (wheelSum && Math.sign(dy) !== Math.sign(wheelSum)) wheelSum = 0;
      wheelSum += dy;
      clearTimeout(wheelIdle);
      wheelIdle = setTimeout(() => { wheelSum = 0; }, 220);
      if (Math.abs(wheelSum) >= 40) {
        const dir = wheelSum > 0 ? 1 : -1;
        wheelSum = 0;
        scrollToY(pageTarget(dir));
      }
    }, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (document.querySelector('dialog[open]')) return;
      if (e.target.closest && e.target.closest('input, textarea, select, summary, [contenteditable]')) return;
      const down = ['PageDown', 'ArrowDown', ' '].includes(e.key) && !e.shiftKey;
      const up = ['PageUp', 'ArrowUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (e.key === 'Home') { e.preventDefault(); scrollToY(0); return; }
      if (e.key === 'End') { e.preventDefault(); scrollToY(maxY()); return; }
      if (!down && !up) return;
      e.preventDefault();
      if (!animating) scrollToY(pageTarget(down ? 1 : -1));
    });
  }
  // 페이지 안 링크(#contact 등)도 같은 방식으로 이동
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target || link.href.startsWith('sms:') || link.href.startsWith('tel:')) return;
      e.preventDefault();
      scrollToY(target.offsetTop);
    });
  });

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

  // 자격증 크게 보기
  const certDialog = document.getElementById('cert-dialog');
  if (certDialog && typeof certDialog.showModal === 'function') {
    const certImg = document.getElementById('cert-dialog-img');
    document.querySelectorAll('[data-cert]').forEach((btn) => btn.addEventListener('click', () => {
      certImg.src = btn.dataset.cert;
      certImg.alt = btn.dataset.certTitle || '';
      certDialog.showModal();
    }));
    document.getElementById('cert-close').addEventListener('click', () => certDialog.close());
    certDialog.addEventListener('click', (e) => { if (e.target === certDialog) certDialog.close(); });
  } else {
    document.querySelectorAll('[data-cert]').forEach((btn) => btn.addEventListener('click', () => window.open(btn.dataset.cert, '_blank')));
  }

  // 상단 로고 — 아래 섹션 배경에 맞춰 색 전환, 마지막 견적 문의 섹션에서는 숨김
  const header = document.getElementById('site-header');
  function updateHeader() {
    if (!header) return;
    const probe = window.scrollY + header.offsetHeight / 2;
    const list = Array.from(document.querySelectorAll('main > section, main > footer')).filter((el) => !el.hidden);
    let under = list[0];
    list.forEach((el) => { if (el.offsetTop <= probe) under = el; });
    const hide = under.id === 'contact' || under.tagName === 'FOOTER';
    header.classList.toggle('is-hidden', hide);
    header.classList.toggle('on-light', !under.hasAttribute('data-dark'));
    header.classList.toggle('past-hero', under.id !== 'home');
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  updateHeader();

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
      b.addEventListener('click', () => scrollToY(sec.offsetTop));
      dotNav.appendChild(b);
      return b;
    });
    const update = () => {
      const y = window.scrollY + window.innerHeight / 2;
      let active = 0;
      sections.forEach((s, k) => { if (s.offsetTop <= y) active = k; });
      buttons.forEach((b, k) => b.setAttribute('aria-current', String(k === active)));
      dotNav.classList.toggle('on-dark', sections[active].hasAttribute('data-dark'));
      updateHeader();
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
