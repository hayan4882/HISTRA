/* HISTRA 글로벌 네비게이션 바 — 스크롤하면 검정 배경 (6개 페이지 공통) */
(function(){
  var bar = document.querySelector('.histra-gnb');
  if (!bar) return;
  function update(){ bar.classList.toggle('histra-gnb--solid', window.scrollY > 10); }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();
