# 평택빌라클린 PVC 공식 홈페이지

평택 지역 빌라 계단청소 전문업체 **평택빌라클린(PVC)**의 공식 홈페이지입니다. GitHub에 공개된 `PVC 홈 와이어프레임`과 `PVC 홈 1d 디자인` 파일을 바탕으로, 별도 프레임워크나 빌드 없이 Vercel에서 호스팅할 수 있는 반응형 정적 사이트로 구현했습니다.

## 사이트 구성

v2 풀스크린 랜딩 디자인(홈 → 소개 → 문의 안내 → 관리 방식 → 서비스 지역 → 대표 인사 → 고객 후기 → 자주 묻는 질문 → 견적 문의)입니다.

- `index.html` — 사이트 콘텐츠, 검색·공유 메타데이터, 구조화 데이터
- `styles.css` — 남색·흰색·파랑 테마, 섹션 스냅 스크롤, 반응형 스타일
- `app.js` — 첫 화면 사진 슬라이드, 오른쪽 섹션 이동 점, 연락처 버튼, 후기 표시
- `site-config.js` — 전화번호·대표자명·카카오톡 URL·사업자번호·서비스 지역·첫 화면 사진·후기 설정
- `assets/pvc-logo.png`, `assets/pvc-logo-color.webp` — PVC 로고(흰색 / 컬러)
- `assets/pyeongtaek-map-light.svg` — 평택시 서비스 지역 지도
- `assets/owner-lee-youngmin.webp` — 대표 이영민 사진
- `assets/hero-1.webp` ~ `assets/hero-4.webp` — 첫 화면 사진(계단 · 엘리베이터 홀 · 복도 · 현관)
- `fonts/` — Pretendard 웹폰트(SIL Open Font License 1.1)
- `robots.txt`, `sitemap.xml`, `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `vercel.json`

## 사업 정보 설정

`site-config.js`에서 관리합니다. 비워둔 항목은 사이트에 표시되지 않습니다.

- `businessNumber`, `address`는 하단 사업자 정보에 표시됩니다(주소는 동·호수 제외).
- `kakaoUrl`을 비워두면 견적 버튼이 파란색 "문자" 버튼으로 연결되고, 채널 주소를 넣으면 노란 카카오톡 버튼으로 바뀝니다.
- `heroImages`에 첫 화면 사진 경로를 넣으면 5초마다 바뀝니다.
- `reviews`에는 실제 고객 후기만 넣으세요. 비어 있으면 후기 섹션이 숨겨집니다.

## Vercel 자동 배포 연결

대표 주소는 **https://www.pvclean.kr/** 입니다. 구매하신 `www.pvclean.kr`은 `pvclean.kr` 도메인의 `www` 서브도메인입니다. 현재 DNS 해석은 아직 확인되지 않아 Vercel 연결·DNS 설정이 완료된 상태는 아닙니다.

1. Vercel에서 **Add New → Project**를 선택합니다.
2. 저장소 `leedlqhdk/PVC`를 가져옵니다. 첫 연결은 GitHub 및 Vercel 계정 권한이 필요합니다.
3. Framework Preset은 **Other**, Root Directory는 저장소 루트로 둡니다. 별도 Build Command와 Output Directory가 필요 없는 정적 사이트입니다.
4. 프로젝트를 배포합니다. 연결 후 `main` 브랜치 커밋은 Production으로 자동 배포됩니다.
5. Vercel 프로젝트의 **Settings → Domains**에서 `www.pvclean.kr`을 추가합니다. 루트 주소 `pvclean.kr`도 사용할 계획이면 함께 추가하고, Vercel에서 루트 도메인이 `www.pvclean.kr`로 리디렉션되도록 설정합니다.
6. Vercel이 해당 프로젝트 화면에 표시하는 DNS 레코드를 확인합니다. `www` 서브도메인은 CNAME으로 안내되며, `pvclean.kr` 루트 도메인은 사용할 경우 A 레코드 값이 별도로 안내됩니다. 고정값을 복사하지 말고 해당 프로젝트에 표시되는 최신 값을 사용하세요.
7. 가비아 로그인 후 **서비스 관리 → DNS 관리툴 → pvclean.kr 선택 → DNS 설정 → 레코드 추가**에서 Vercel 값을 입력하고 저장합니다. `www`의 호스트는 `www`, 루트 주소의 호스트는 `@`로 설정합니다. 이미 등록된 이메일(MX)이나 다른 서비스 레코드는 삭제·변경하지 마세요.
8. Vercel의 Domains 화면에서 도메인이 검증되고 HTTPS가 활성화되는지 확인합니다. DNS 반영에는 시간이 걸릴 수 있습니다.

공식 안내: [Vercel 도메인 추가](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [가비아 DNS 레코드 설정](https://customer.gabia.com/manual/38/3041/3040).

## 로컬 확인

저장소 루트에서 아래 명령을 실행한 뒤 `http://localhost:8000`을 엽니다.

```bash
python3 -m http.server 8000
```

## 콘텐츠 원칙

디자인 시안의 예시용 사업자번호·주소와 "후기 내용 자리" 후기는 실제 정보가 아니므로 게시하지 않습니다. 실제 고객 후기와 작업 사진이 준비되면 추가하세요. 서비스 범위·지역·일정도 운영자 확인 후 설정하세요.
