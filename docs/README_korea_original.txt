HISTRA - 대한민국 페이지 (통합 작업용)

[파일 구성]
- index.html : HTML + CSS + JS가 한 파일에 모두 포함된 완성본 (게시된 웹사이트와 동일한 파일, 수정 없음)
- images/    : 사이트에 사용된 이미지·로고 원본 파일 (참고·교체용 보관본)
  ※ index.html 안에는 이미지가 base64로 이미 내장되어 있어 images 폴더와 연결하지 않아도 그대로 동작합니다.
     (기존 파일 연결 구조를 바꾸지 않기 위해 index.html은 그대로 두었습니다.)

[필요한 외부 라이브러리 / 리소스]
- 설치 필요한 라이브러리: 없음 (순수 HTML/CSS/JavaScript, 프레임워크 사용 안 함)
- 폰트: Noto Sans KR (Google Fonts CDN, 인터넷 연결 필요)
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
  오프라인 사용 시 Noto Sans KR을 직접 설치하면 됩니다. 없으면 기본 sans-serif로 표시됩니다.
- 아이콘: 별도 아이콘 파일/라이브러리 없음

[사용 방법]
index.html을 브라우저로 열면 됩니다. 배포(Netlify 등) 시 폴더째 올리면 index.html이 시작 페이지가 됩니다.

[통합 시 참고]
- 로고 클릭 시 맨 위(메인 홈)로 이동: <a class="logo" href="#top">  (통합할 때 메인 홈 주소로 바꿔 주세요)
- 상단 UK/China/Italy/Egypt 링크는 아직 href="#" 입니다. (통합할 때 각 나라 페이지로 연결)
- 이미지 출처·저작권은 기획서(PDF)에서 받은 파일을 그대로 사용했습니다.
