# 원본 대비 변경 사항 (국가 페이지)
원본 콘텐츠·이미지·영상·데이터·3D 모델은 수정/삭제하지 않았습니다. 바꾼 것은 링크뿐입니다.
- UK: 로고 → ../index.html, 메뉴·다른 국가로 이동 링크 → ../china|korea|italy|egypt/index.html
- China / Egypt: 진입 파일 china.html·egypt.html → index.html 로 이름 변경, 메뉴·로고 href를 새 경로로 변경
- Italy: 로고 `/` → ../index.html, JS로 만드는 메뉴(상·하단)의 링크를 각 국가 index.html로 변경
- Korea: 로고·메뉴 링크 변경 (README는 docs/로 이동)
- 이탈리아 README는 docs/README_italy_original.md 로 이동(내용 변경 없음)

# 테스트 결과
| 항목 | 결과 | 근거 |
|---|---|---|
| 정적 링크·이미지 경로(HTML 92개) | 통과 | 스크립트로 파일 존재 확인, 누락 0 |
| main.js 문법 | 통과 | node --check |
| 지구본·국가 선택·스크롤 연동·카드 | 미검증 | 브라우저 실행 환경이 없어 실행하지 못함 |
| 국가별 영상/프레임/3D/팝업 | 미검증 | 위와 동일 |
| 반응형 | 미검증 | CSS만 작성 |

# 미해결 / 결정 필요
- 메인 국가명(Cormorant Garamond)은 시안 글꼴을 알 수 없어 추정한 값입니다. 크기(약 150px)도 가이드의 Display 64px보다 큽니다(시안 우선).
- 국가 선택 카드의 금색 선 아이콘(한국 외 4개)과 설명은 새로 만든 것입니다.
- "다른 국가로 이동" 섹션은 UK·Italy에만 있습니다(China·Egypt·Korea는 상단 메뉴로 이동).
- 영국 미사용 파일(scroll-sequence.mp4, nv/reign.png), 이탈리아 augustus .glb 및 중복 glb는 삭제하지 않고 그대로 두었습니다.
- 국가별 강조색·폰트(UK Playfair, Egypt Fraunces)는 통일하지 않았습니다.

# 2차 수정 (HISTRA_웹사이트_수정하기.pdf 반영)
- 메인 국가 선택 섹션: 금색 선 아이콘 카드(제목·설명 포함) 및 관련 CSS/JS 제거.
- History is more than dates: 카드1 → 이집트 지도 이미지, 카드4 → 콜로세움 이미지로 교체. 호버 시 상승·확대·흑백/망점 제거(원래 색 표시). 키보드 포커스·reduced-motion 대응.
- 로고: assets/main/logo.png(흰색 투명 histra) 1개로 6개 페이지 통일, 높이 32px(모바일 24px). 이집트 인라인 SVG 로고는 PNG로 교체.
- 한국 페이지: 3D 회전 지도 → 새 이미지를 기존 지도 레이아웃(어두운 옛 지도, 반투명 박스, 반투명 한반도)으로 변환한 korea/images/map_korea_layout.jpg 로 교체.
- 글꼴: 영문 Fraunces, 한글 Noto Sans KR (font-family: "Fraunces","Noto Sans KR",…). 전 페이지 Google Fonts 링크 교체(Cormorant·Playfair 제거).
- 테스트: 헤드리스 Chromium으로 6개 페이지 로드, 404 없음, 로고 높이 32px 확인. Google Fonts는 샌드박스 네트워크 제한으로 실제 글꼴 렌더링은 미확인(대체 글꼴로 표시됨).
- 유의: 카드4 이미지에 글자가 포함돼 카드 문구와 겹침, 이집트·콜로세움 이미지는 해상도가 낮음, 이집트 숫자(#numEA)는 아랍 글꼴 유지.
