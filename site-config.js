/*
 * 평택빌라클린 PVC 공개 사이트 설정
 * 확인된 실제 정보만 입력하세요. 비워둔 항목은 사이트에 표시되지 않습니다.
 */
window.PVC_CONFIG = {
  phone: '010-2954-3144',
  owner: '이영민',
  kakaoUrl: '', // 예: 'https://pf.kakao.com/_채널주소' — 비워두면 견적 버튼이 문자(SMS)로 연결됩니다
  businessNumber: '', // 예: '000-00-00000' — 입력하면 하단에 표시됩니다
  serviceAreas: ['고덕동', '지제동'], // 현재 관리 중인 지역
  // 첫 화면 배경 사진 (5초마다 바뀜)
  heroImages: ['/assets/hero-1.webp', '/assets/hero-2.webp', '/assets/hero-3.webp'],
  // 실제 고객 후기만 입력하세요. 비어 있으면 후기 섹션이 숨겨집니다.
  // 예: { text: '후기 내용', who: '○○빌라 건물주', area: '고덕동', date: '2026-10' }
  reviews: []
};
