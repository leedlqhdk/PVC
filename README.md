# 평택빌라클린 PVC 공식 홈페이지

평택 지역 빌라 계단청소 전문업체 **평택빌라클린(PVC)**의 공식 홈페이지입니다. GitHub에 공개된 `PVC 홈 와이어프레임`과 `PVC 홈 1d 디자인` 파일을 바탕으로, 별도 프레임워크나 빌드 없이 Vercel에서 호스팅할 수 있는 반응형 정적 사이트로 구현했습니다.

## 사이트 구성

- `index.html` — 사이트 콘텐츠, 지역 선택 UI, 견적 문의 폼, 검색·공유 메타데이터
- `styles.css` — 업로드된 Nocturne 디자인 시스템에 맞춘 다크/보라 테마와 반응형 스타일
- `app.js` — 지역 선택, 문의 문구 복사, 전화·카카오톡 채널 연결, 모바일 메뉴
- `site-config.js` — 실제 전화번호·카카오톡 URL·확인된 서비스 지역 설정
- `assets/pvc-stair-hero.webp` — 홈페이지 히어로용 생성 연출 이미지
- `assets/pvc-care-detail.webp` — 청소 관리 방식용 생성 연출 이미지
- `robots.txt`, `sitemap.xml` — `www.pvclean.kr` 검색 크롤링 설정
- `favicon.svg` — PVC 심볼
- `vercel.json` — 정적 사이트 URL 규칙

## 사업 정보 설정

배포 전에 `site-config.js`의 실제 사업자 정보를 확인하세요. 확인되지 않은 값은 공개하지 않도록 기본값이 비어 있습니다.

```js
window.PVC_CONFIG = {
  phone: '실제 전화번호',
  kakaoUrl: '실제 카카오톡 채널 URL',
  serviceAreas: ['확인된 지역']
};
```

`serviceAreas`는 실제 방문 가능한 지역을 확인한 뒤에만 입력합니다. 입력하지 않은 지역은 사이트에서 “위치와 일정 확인 후 안내”로 표시됩니다. 전화번호·카카오톡 주소를 비워두면 해당 버튼은 연결되지 않습니다.

문의 양식은 서버로 정보를 전송하지 않습니다. 방문자가 입력한 값으로 문의 문구를 만들어 클립보드에 복사합니다. 카카오톡 채널 링크는 양식 아래 별도 버튼에 설정됩니다.

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

시안에 있던 예시용 전화번호·대표자명·사업자번호와 작성 예시 후기는 실제 정보가 아니므로 게시하지 않습니다. 서비스 범위·지역·일정도 운영자 확인 후 설정하세요.
