(() => {
  const config = window.PVC_CONFIG || {};
  const phone = String(config.phone || '').trim();
  const phoneDigits = phone.replace(/[^0-9+]/g, '');
  const kakaoUrl = String(config.kakaoUrl || '').trim();
  const serviceAreas = Array.isArray(config.serviceAreas) ? config.serviceAreas.map((item) => String(item).trim()).filter(Boolean) : [];
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }

  document.querySelectorAll('[data-contact]').forEach((link) => {
    const type = link.dataset.contact;
    const destination = type === 'phone' ? (phoneDigits ? `tel:${phoneDigits}` : '') : (type === 'kakao' ? kakaoUrl : '');
    if (destination) {
      link.href = destination;
      if (type === 'kakao') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.removeAttribute('aria-disabled');
    } else {
      link.href = '#contact';
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(type === 'phone' ? '전화번호는 사업자 확인 후 연결할 수 있어요.' : '카카오톡 채널 주소를 확인 후 연결할 수 있어요.');
      });
    }
  });

  const phoneLabel = document.getElementById('phone-label');
  if (phoneLabel) phoneLabel.textContent = phone || '연락처 설정 후 연결됩니다';
  const configNote = document.getElementById('config-note');
  if (configNote && phone && kakaoUrl) configNote.textContent = '전화와 카카오톡 상담 버튼이 연결되어 있어요.';
  else if (configNote && phone) configNote.textContent = '전화 상담 버튼이 연결되어 있어요. 카카오톡 채널은 준비 중입니다.';
  else if (configNote && kakaoUrl) configNote.textContent = '카카오톡 상담 버튼이 연결되어 있어요. 전화번호는 준비 중입니다.';

  const areaButtons = Array.from(document.querySelectorAll('.area-chip'));
  const selectedLabel = document.getElementById('selected-area');
  const areaMessage = document.querySelector('#area-result p');
  const areaCta = document.querySelector('.result-link');
  function updateArea(button) {
    const area = button.dataset.area;
    areaButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    if (selectedLabel) selectedLabel.textContent = area;
    if (areaMessage) {
      areaMessage.textContent = serviceAreas.includes(area)
        ? `${area}은 상담 가능한 지역으로 등록되어 있어요. 일정은 문의해 주세요.`
        : `${area} 방문 가능 여부는 위치와 일정 확인 후 안내드려요.`;
    }
    const areaInput = document.getElementById('quote-area');
    if (areaInput && !areaInput.value.trim()) areaInput.value = area;
  }
  areaButtons.forEach((button) => button.addEventListener('click', () => updateArea(button)));
  if (areaButtons.length) updateArea(areaButtons.find((button) => button.getAttribute('aria-pressed') === 'true') || areaButtons[0]);
  if (areaCta) areaCta.addEventListener('click', () => {
    const areaInput = document.getElementById('quote-area');
    if (areaInput && selectedLabel) areaInput.value = selectedLabel.textContent;
  });

  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!quoteForm.reportValidity()) return;
      const values = new FormData(quoteForm);
      const parts = [
        '안녕하세요. 평택빌라클린 PVC 계단청소 견적 문의드립니다.',
        `건물 위치: ${String(values.get('area') || '').trim()}`,
        values.get('floors') && `층수: ${String(values.get('floors')).trim()}`,
        values.get('units') && `세대수: ${String(values.get('units')).trim()}`,
        values.get('request') && `요청사항: ${String(values.get('request')).trim()}`
      ].filter(Boolean);
      const message = parts.join('\n');
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(message);
        else {
          const temp = document.createElement('textarea');
          temp.value = message;
          temp.setAttribute('readonly', '');
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          if (!document.execCommand('copy')) throw new Error('Clipboard copy failed');
          temp.remove();
        }
        const help = document.getElementById('form-help');
        if (help) help.textContent = '문의 문구를 복사했어요. 카카오톡에서 붙여넣어 보내주세요.';
        showToast('문의 문구를 복사했어요. 카카오톡에 붙여넣어 주세요.');
      } catch (_error) {
        showToast('문의 문구를 복사하지 못했어요. 입력한 내용을 확인해 주세요.');
      }
    });
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '메뉴 열기');
    }));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
