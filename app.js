(() => {
  const config = window.PVC_CONFIG || {};
  const phone = String(config.phone || '').trim();
  const phoneDigits = phone.replace(/[^0-9+]/g, '');
  const owner = String(config.owner || '').trim();
  const kakaoUrl = String(config.kakaoUrl || '').trim();
  const businessNumber = String(config.businessNumber || '').trim();
  const serviceAreas = Array.isArray(config.serviceAreas) ? config.serviceAreas.map((item) => String(item).trim()).filter(Boolean) : [];

  // 카카오톡 채널이 없으면 견적 버튼을 문자(SMS)로 연결합니다.
  const quoteHref = kakaoUrl || (phoneDigits ? `sms:${phoneDigits}` : '');
  const usesKakao = Boolean(kakaoUrl);

  document.querySelectorAll('[data-contact]').forEach((link) => {
    const type = link.dataset.contact;
    const destination = type === 'phone' ? (phoneDigits ? `tel:${phoneDigits}` : '') : quoteHref;
    if (destination) {
      link.href = destination;
      if (type === 'quote' && usesKakao) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } else {
      link.hidden = true;
    }
  });

  document.querySelectorAll('[data-phone-label]').forEach((el) => { el.textContent = phone; });
  document.querySelectorAll('[data-owner]').forEach((el) => { el.textContent = owner; });
  if (!usesKakao) {
    document.querySelectorAll('[data-quote-label]').forEach((el) => { el.textContent = '문자로 견적 받기'; });
    document.querySelectorAll('[data-quote-cta]').forEach((el) => { el.textContent = '문자로 견적 보내기'; });
    document.querySelectorAll('[data-quote-channel]').forEach((el) => { el.textContent = '문자'; });
  }
  document.querySelectorAll('[data-biz-number]').forEach((el) => {
    el.textContent = businessNumber ? ` · 사업자등록번호 ${businessNumber}` : '';
  });

  const areaStatus = document.getElementById('area-status');
  if (areaStatus) {
    if (serviceAreas.length) {
      areaStatus.innerHTML = '현재 <span class="hl"></span> 관리 중';
      areaStatus.querySelector('.hl').textContent = serviceAreas.join(' · ');
    } else {
      areaStatus.textContent = '평택 전 지역 방문 견적 상담 가능';
    }
  }
})();
