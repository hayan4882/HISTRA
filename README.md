# HISTRA 통합 사이트

영국·중국·한국·이탈리아·이집트 5개국 역사·문화 웹사이트를 하나로 연결한 폴더입니다.

## 실행 방법
- 가장 확실한 방법: 이 폴더에서 로컬 서버 실행 → `python3 -m http.server 8000` 후 http://localhost:8000
- `index.html`을 더블클릭(file://)해도 메인 지구본은 동작하도록 만들었지만(텍스처·three.js 내장), 국가별 페이지 중 일부(3D 모델, 프레임 시퀀스 등)는 브라우저 정책에 따라 서버가 필요할 수 있습니다. **실제 실행은 아직 검증하지 못했습니다.**
- 인터넷 연결 필요: Google Fonts(이집트 상형문자만, 나머지 글꼴은 assets/fonts 내장), Three.js CDN(중국), Wikimedia Commons 이미지(이집트).

## 폴더 구조
```
index.html            메인(지구본·국가 선택·소개)
css/main.css, css/gnb.css(공통 네비게이션), js/main.js, js/gnb.js, js/globe-textures.js, js/vendor/three.min.js (r128)
assets/main/          공통 로고(histra_log.png), 메인 카드 이미지
uk/ china/ korea/ italy/ egypt/   각 국가 원본 (내부 상대 경로 그대로 유지, 진입 파일은 모두 index.html)
docs/                 원본 README, 변경·테스트 기록
```
각 국가 폴더 안의 구조를 바꾸지 않아서 이미지·영상·프레임·데이터·3D 모델 경로가 원본과 동일합니다.

## 메인 페이지 구성 (Main_page.png 기준)
상단 로고·5개국 메뉴 → 3D 지구본(빛나는 점 5개만 클릭 가능, 드래그 회전) → Scroll → 세로형 국가 선택(스크롤·호버로 강조, 카드 변경, 국가명 클릭 시 이동) → History is more than dates(4개 카드) → 서비스 소개(기획서의 프로젝트 목적·이용 방법).


## 2차 수정 요약
로고 통일(assets/main/logo.png), 글꼴 Fraunces(영문)+Noto Sans KR(한글), 메인 금색 카드 제거, History 카드 1·4 이미지 교체 및 호버 컬러 복원, 한국 지도 이미지 교체(3D 회전 제거). 자세한 내용은 docs/CHANGES_AND_TESTS.md.

## 3차 수정 요약
글로벌 네비게이션 바를 6개 페이지 공통(css/gnb.css, js/gnb.js)으로 통일(Global Navigation Bar.png 기준), 이탈리아 선택 메뉴 밑줄 제거, 로고를 assets/main/histra_log.png로 교체, 전체 글꼴을 Noto Sans KR로 통일. 자세한 내용은 docs/CHANGES_AND_TESTS.md.

## 4차 수정 요약
글꼴을 영문 Fraunces + 한글 Noto Sans KR로 통일하고 폰트 파일을 사이트에 내장(assets/fonts, css/fonts.css). 자세한 내용은 docs/CHANGES_AND_TESTS.md.
