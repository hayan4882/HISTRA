(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV : 스크롤 시 배경 ---------- */
  var nav = document.getElementById('nav');
  function navState(){ nav.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.9); }
  window.addEventListener('scroll', navState, {passive:true}); navState();

  /* ---------- HERO : 스크롤 시퀀스 (캔버스) ---------- */
  var FRAME_COUNT = 121, PATH = 'assets/frames/f', EXT = '.jpg';
  var canvas = document.getElementById('seq'), ctx = canvas.getContext('2d');
  var track = document.querySelector('.hero__track');
  var frames = new Array(FRAME_COUNT), loaded = 0;
  var current = 0, target = 0, drawn = -1;

  function src(i){ return PATH + String(i + 1).padStart(3,'0') + EXT; }
  function load(i){
    var img = new Image();
    img.onload = function(){ frames[i] = img; loaded++; if (i === 0 || i === Math.round(current)) draw(true); };
    img.src = src(i);
  }
  load(0);
  // 나머지 프레임은 첫 화면 표시 후 순차 로드
  window.addEventListener('load', function(){ for (var i = 1; i < FRAME_COUNT; i++) load(i); });

  function resize(){
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw(true);
  }
  function nearest(i){
    if (frames[i]) return frames[i];
    for (var d = 1; d < FRAME_COUNT; d++){
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return null;
  }
  function draw(force){
    var i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(current)));
    if (!force && i === drawn) return;
    var img = nearest(i); if (!img) return;
    drawn = i;
    var cw = canvas.width, ch = canvas.height;
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);   // cover
    var w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  function progress(){
    var r = track.getBoundingClientRect();
    var total = track.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / total));
  }
  var fade = document.getElementById('heroFade'), copy = document.querySelector('.hero__copy');
  function smooth(a, b, x){ var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function tick(){
    var p = progress();
    target = p * (FRAME_COUNT - 1);
    // 시퀀스가 끝날 때 화면이 검정으로 잦아들며 다음 섹션(검정 배경)으로 이어짐
    fade.style.opacity = smooth(0.86, 1, p).toFixed(3);
    copy.style.opacity = (1 - smooth(0.80, 0.96, p)).toFixed(3);
    current = reduce ? target : current + (target - current) * 0.18;
    if (Math.abs(target - current) < 0.01) current = target;
    draw(false);
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  resize(); requestAnimationFrame(tick);

  /* ---------- 주요 사건 팝업 ---------- */
  var EVENTS = {
    magna: {
      img:'assets/img/magna-carta.jpg', alt:'마그나 카르타 문서',
      period:'1215년', title:'마그나 카르타 체결',
      desc:'잉글랜드의 존 왕은 귀족들의 반발에 직면해 마그나 카르타에 서명했다. 이 문서는 왕도 법의 적용을 받는다는 원칙을 담았으며, 이후 법치주의 발전의 상징이 되었다.',
      rel:'관련 인물: 존 왕 · 관련 장소: 러니미드'
    },
    industry: {
      img:'assets/img/industrial-revolution.jpg', alt:'방직 공장에서 일하는 사람들을 그린 삽화',
      period:'18세기 후반~19세기', title:'산업혁명',
      desc:'영국에서 방직 기계와 증기기관 등이 널리 사용되면서 공장 중심의 생산 방식이 발전했다. 생산량과 도시 인구가 증가했고, 세계 경제와 노동 환경에도 큰 변화가 일어났다.',
      rel:'관련 인물: 제임스 와트 · 관련 유적: 아이언브리지'
    },
    empire: {
      img:'assets/img/british-empire-1920s.jpg', alt:'1920년대 대영제국의 영토를 붉은색으로 표시한 세계지도', map:true,
      period:'17~20세기', title:'대영제국의 팽창',
      desc:'영국은 무역과 군사력을 바탕으로 아시아, 아프리카, 아메리카 등 여러 지역에 식민지를 확장했다. 식민지에서 자원과 노동력을 착취하는 과정에서 현지 사회에 큰 영향을 미쳤으며, 저항과 독립운동도 이어졌다.',
      rel:'관련 인물: 빅토리아 여왕 · 관련 유적: 런던 타워'
    }
  };
  var modal = document.getElementById('modal'), lastFocus = null;
  function openEvent(key, trigger){
    var e = EVENTS[key]; if (!e) return;
    lastFocus = trigger;
    var wrap = modal.querySelector('.modal__img');
    wrap.classList.toggle('is-map', !!e.map);
    var img = document.getElementById('modal-img'); img.src = e.img; img.alt = e.alt;
    document.getElementById('modal-period').textContent = e.period;
    document.getElementById('modal-title').textContent = e.title;
    document.getElementById('modal-desc').textContent = e.desc;
    document.getElementById('modal-rel').textContent = e.rel;
    modal.showModal(); document.documentElement.classList.add('is-locked');
    modal.scrollTop = 0;
  }
  function closeEvent(){ if (modal.open) modal.close(); }
  document.querySelectorAll('[data-event]').forEach(function(b){
    b.addEventListener('click', function(){ openEvent(b.getAttribute('data-event'), b); });
  });
  document.getElementById('modal-close').addEventListener('click', closeEvent);
  modal.addEventListener('click', function(ev){ if (ev.target === modal) closeEvent(); });
  modal.addEventListener('close', function(){
    document.documentElement.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  });

  /* ---------- 역사 타임라인 탭 ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tl__tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tl__panel'));
  function select(i, focus){
    tabs.forEach(function(t, k){
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(i); });
    t.addEventListener('keydown', function(ev){
      var n = tabs.length, k = null;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') k = (i + 1) % n;
      if (ev.key === 'ArrowLeft'  || ev.key === 'ArrowUp')   k = (i - 1 + n) % n;
      if (ev.key === 'Home') k = 0;
      if (ev.key === 'End')  k = n - 1;
      if (k !== null){ ev.preventDefault(); select(k, true); }
    });
  });
})();

/* ---------- 영국 왕실 : 버튼 → 전체 화면 (액자 갤러리) ---------- */
(function(){
  'use strict';
  var MONARCHS = [
    { name:'존 왕', role:'잉글랜드의 왕', years:'재위 1199~1216', img:'assets/img/people-john.jpg',
      desc:'귀족들의 반발에 직면해 마그나 카르타에 서명한 왕이다. 왕도 법의 적용을 받는다는 원칙이 이때 문서로 남았다.', rel:'관련 사건: 마그나 카르타 체결' },
    { name:'헨리 8세', role:'잉글랜드의 왕', years:'재위 1509~1547', img:'assets/img/royal-henry-viii.jpg',
      desc:'로마 가톨릭교회와 결별하고 잉글랜드 국교회(성공회)가 만들어지는 길을 연 왕이다. 종교개혁 과정에서 왕권이 크게 강해졌다.', rel:'관련 주제: 성공회 · 종교개혁' },
    { name:'엘리자베스 1세', role:'잉글랜드의 여왕', years:'재위 1558~1603', img:'assets/img/royal-elizabeth-i.jpg',
      desc:'1588년 스페인 무적함대를 물리친 시기의 여왕이다. 이후 영국이 바다를 무대로 성장하는 발판이 되었다.', rel:'관련 주제: 해양 강국의 성장' },
    { name:'빅토리아 여왕', role:'영국의 여왕', years:'재위 1837~1901', img:'assets/img/people-queen-victoria.jpg',
      desc:'산업혁명과 식민지 확장으로 대영제국이 가장 넓어진 시기에 재위한 여왕이다. 이 시기를 흔히 빅토리아 시대라고 부른다.', rel:'관련 사건: 산업혁명 · 대영제국의 팽창' },
    { name:'엘리자베스 2세', role:'영국의 여왕', years:'재위 1952~2022', img:'assets/img/royal-elizabeth-ii.jpg',
      desc:'70년 동안 재위하며 영국 역사상 가장 오래 왕위를 지킨 여왕이다. 제국이 해체되고 영연방이 자리 잡는 과정을 함께했다.', rel:'관련 주제: 현대 영국 · 영연방' },
    { name:'찰스 3세', role:'영국의 국왕 (현재)', years:'재위 2022~현재', img:'assets/img/royal-charles-iii.jpg',
      desc:'2022년 어머니 엘리자베스 2세의 뒤를 이어 즉위한 현재의 국왕이다. 2023년 5월 웨스트민스터 사원에서 대관식을 치렀다.', rel:'관련 장소: 웨스트민스터 사원' }
  ];
  var FAMILY = [
    { name:'필립공', role:'에든버러 공작', years:'1921~2021', img:'assets/img/member-philip.jpg',
      desc:'엘리자베스 2세의 남편으로, 70년 넘게 여왕의 곁을 지켰다. 2021년 99세의 나이로 세상을 떠났다.', rel:'관련 인물: 엘리자베스 2세' },
    { name:'다이애나', role:'왕세자비', years:'1961~1997', img:'assets/img/member-diana.jpg',
      desc:'찰스 3세의 첫 번째 부인으로, 왕세자비로서 큰 사랑을 받았다. 자선 활동에 힘썼으며 1997년 세상을 떠났다.', rel:'관련 인물: 찰스 3세 · 윌리엄 왕세자' },
    { name:'윌리엄 왕세자', role:'웨일스 공 (왕세자)', years:'1982년생', img:'assets/img/member-william.jpg',
      desc:'찰스 3세의 맏아들로, 왕위 계승 1순위이다. 2022년 아버지가 즉위하면서 왕세자가 되었다.', rel:'관련 인물: 찰스 3세 · 케이트 왕세자비' },
    { name:'케이트 왕세자비', role:'웨일스 공비 (왕세자비)', years:'1982년생', img:'assets/img/member-kate.jpg',
      desc:'윌리엄 왕세자의 부인으로, 2011년에 결혼했다. 유아기 발달을 돕는 활동에 힘쓰고 있다.', rel:'관련 인물: 윌리엄 왕세자 · 샬럿 공주' },
    { name:'샬럿 공주', role:'공주', years:'2015년생', img:'assets/img/member-charlotte.jpg',
      desc:'윌리엄 왕세자 부부의 둘째로 태어난 공주이다. 영국 왕위 계승 순위에 올라 있다.', rel:'관련 인물: 윌리엄 왕세자 · 케이트 왕세자비' }
  ];
  var SETS = [MONARCHS, FAMILY], setIdx = 0, ROYALS = MONARCHS;
  var openBtn = document.getElementById('royal-open'), dlg = document.getElementById('royal-dialog');
  if (!openBtn || !dlg) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rail = document.getElementById('royal-rail'), text = document.getElementById('royal-text'),
      count = document.getElementById('royal-count');
  var slots = [], cur = -1, raf = 0, swapTimer = 0;

  function buildRail(){
    rail.innerHTML = ''; slots = [];
    ROYALS.forEach(function(r, i){
      var li = document.createElement('li'); li.className = 'royal__slot';
      li.innerHTML = '<button type="button" class="royal__frame"><span class="royal__mat"><img alt="" draggable="false">' +
        '<svg class="royal__crown" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 46l-3-24 14 12 13-18 13 18 14-12-3 24z M10 52h44v4H10z" fill="currentColor"/></svg></span></button>' +
        '<span class="royal__plate t-caption"></span>';
      var btn = li.querySelector('button'), im = li.querySelector('img');
      btn.setAttribute('aria-label', r.name);
      im.alt = r.name + (setIdx ? ' 사진' : ' 초상');
      im.addEventListener('error', function(){ li.classList.add('is-empty'); });
      im.src = r.img;
      li.querySelector('.royal__plate').textContent = r.name;
      btn.addEventListener('click', function(){ if (!dragged) go(i); });
      rail.appendChild(li); slots.push(li);
    });
  }
  buildRail();

  function targetLeft(i){ var s = slots[i]; return s.offsetLeft + s.offsetWidth / 2 - rail.clientWidth / 2; }
  function go(i, instant){
    i = Math.max(0, Math.min(ROYALS.length - 1, i));
    rail.scrollTo({ left: targetLeft(i), behavior: (instant || reduce) ? 'auto' : 'smooth' });
  }
  function fillDesc(str){
    var box = document.getElementById('royal-desc');
    box.textContent = '';
    (str.match(/[^.]+\.?/g) || [str]).forEach(function(s){
      s = s.trim(); if (!s) return;
      var line = document.createElement('span'); line.className = 'royal__line'; line.textContent = s; box.appendChild(line);
    });
  }
  function setText(i){
    var r = ROYALS[i];
    document.getElementById('royal-role').textContent  = r.role;
    document.getElementById('royal-name').textContent  = r.name;
    document.getElementById('royal-years').textContent = r.years;
    fillDesc(r.desc);
    document.getElementById('royal-rel').textContent   = r.rel;
    count.textContent = (i + 1) + ' / ' + ROYALS.length;
  }
  function update(){
    raf = 0;
    var mid = rail.scrollLeft + rail.clientWidth / 2, best = 0, bd = 1e9;
    slots.forEach(function(s, i){
      var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid), n = Math.min(1, d / (s.offsetWidth * 1.7));
      s.style.setProperty('--s', (1 - 0.24 * n).toFixed(3));
      s.style.setProperty('--o', (1 - 0.5 * n).toFixed(3));
      if (d < bd){ bd = d; best = i; }
    });
    if (best !== cur){
      cur = best;
      slots.forEach(function(s, i){ s.classList.toggle('is-active', i === best); });
      if (reduce){ setText(best); return; }
      text.classList.add('is-swap'); clearTimeout(swapTimer);
      swapTimer = setTimeout(function(){ setText(cur); text.classList.remove('is-swap'); }, 200);
    }
  }
  function queue(){ if (!raf) raf = requestAnimationFrame(update); }
  rail.addEventListener('scroll', queue, {passive:true});
  window.addEventListener('resize', function(){ if (dlg.open && !treeOn){ go(Math.max(cur,0), true); queue(); } });

  /* 마우스 휠(세로) → 가로 스크롤 */
  rail.addEventListener('wheel', function(e){
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)){ e.preventDefault(); rail.scrollLeft += e.deltaY; }
  }, {passive:false});

  /* 마우스 드래그로 넘기기 */
  var down = false, dragged = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', function(e){
    if (e.pointerType !== 'mouse') return;
    down = true; dragged = false; sx = e.clientX; sl = rail.scrollLeft;
  });
  window.addEventListener('pointermove', function(e){
    if (!down) return;
    var dx = e.clientX - sx;
    if (!dragged && Math.abs(dx) > 5){ dragged = true; rail.classList.add('is-drag'); }
    if (dragged) rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', function(){
    if (!down) return; down = false;
    if (dragged){ rail.classList.remove('is-drag'); go(cur); setTimeout(function(){ dragged = false; }, 0); }
  });

  document.getElementById('royal-prev').addEventListener('click', function(){ go(cur - 1); });
  document.getElementById('royal-next').addEventListener('click', function(){ go(cur + 1); });
  var tabs = [].slice.call(dlg.querySelectorAll('.royal__tab')),
      bgs = [document.getElementById('royal-bg-0'), document.getElementById('royal-bg-1')],
      gallery = dlg.querySelector('.royal__gallery'), tree = document.getElementById('royal-tree'), swTimer = 0;
  var treeOn = false, crest = document.getElementById('royal-crest');
  function showTree(on){
    treeOn = on; dlg.classList.toggle('is-tree', on); tree.hidden = !on; tree.classList.remove('is-swap');
    tabs.forEach(function(t, x){ t.setAttribute('aria-selected', (!on && x === setIdx) ? 'true' : 'false'); });
    crest.setAttribute('aria-pressed', on ? 'true' : 'false');
    crest.setAttribute('aria-label', on ? '왕실 가계도 닫고 초상화로 돌아가기' : '왕실 가계도 보기');
    if (on){ stage.scrollTop = 0; tree.scrollLeft = (tree.scrollWidth - tree.clientWidth) / 2; }
    else { var c = Math.max(0, cur); cur = -1; go(c, true); update(); }
  }
  crest.addEventListener('click', function(){ showTree(!treeOn); });
  function applySet(k){
    setIdx = k;
    tabs.forEach(function(t, x){ t.setAttribute('aria-selected', x === k ? 'true' : 'false'); t.tabIndex = x === k ? 0 : -1; });
    bgs.forEach(function(b, x){ b.classList.toggle('is-on', x === k); });
    ROYALS = SETS[k];
    buildRail(); cur = -1; go(0, true); update();
  }
  function selectSet(k, instant){
    if (treeOn){ showTree(false); }
    if (k === setIdx) return;
    clearTimeout(swTimer);
    if (instant || reduce){ applySet(k); return; }
    gallery.classList.add('is-swap'); text.classList.add('is-swap'); tree.classList.add('is-swap');
    swTimer = setTimeout(function(){ applySet(k); gallery.classList.remove('is-swap'); }, 320);
  }
  tabs.forEach(function(t, x){ t.addEventListener('click', function(){ selectSet(x); }); });

  dlg.addEventListener('keydown', function(e){
    if (e.target.closest && e.target.closest('.royal__tabs')){
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); var k = (setIdx + 1) % 2; selectSet(k); tabs[k].focus(); }
      return;
    }
    if (treeOn) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp'){   e.preventDefault(); go(cur - 1); }
  });

  /* ----- 인트로 영상 : 재생 → 끝나기 직전부터 스르륵 사라지며 갤러리로 ----- */
  var intro = document.getElementById('royal-intro'), video = document.getElementById('royal-video'),
      stage = dlg.querySelector('.royal__stage');
  var FADE = 1.6, introRaf = 0, introDone = true;

  function finishIntro(quick){
    if (introDone) return;
    introDone = true; cancelAnimationFrame(introRaf);
    intro.classList.toggle('is-quick', !!quick);
    intro.classList.add('is-done');
    stage.removeAttribute('inert');
    var v = video, t0 = performance.now(), v0 = v.volume, ms = quick ? 600 : FADE * 1000;
    (function fadeAudio(now){
      var k = Math.min(1, ((now || performance.now()) - t0) / ms);
      try { v.volume = Math.max(0, v0 * (1 - k)); } catch(e){}
      if (k < 1) requestAnimationFrame(fadeAudio); else v.pause();
    })();
    setTimeout(function(){ document.getElementById('royal-close').focus(); }, 50);
  }
  function watch(){
    if (introDone) return;
    var left = (video.duration || 0) - video.currentTime;
    if (video.duration && left <= FADE) finishIntro(false);
    else introRaf = requestAnimationFrame(watch);
  }
  function startIntro(){
    introDone = false;
    intro.classList.remove('is-done', 'is-quick');
    stage.setAttribute('inert', '');
    video.currentTime = 0; video.volume = 1; video.muted = false;
    var p = video.play();
    if (p && p.catch) p.catch(function(){
      video.muted = true;
      var q = video.play(); if (q && q.catch) q.catch(function(){ finishIntro(true); });
    });
    introRaf = requestAnimationFrame(watch);
  }
  video.addEventListener('ended', function(){ finishIntro(false); });
  video.addEventListener('error', function(){ finishIntro(true); });
  document.getElementById('royal-skip').addEventListener('click', function(){ finishIntro(true); });

  var lastTrigger = openBtn;
  function openRoyal(start, trigger){
    lastTrigger = trigger || openBtn;
    dlg.showModal();
    document.documentElement.classList.add('is-locked');
    clearTimeout(swTimer); gallery.classList.remove('is-swap'); tree.classList.remove('is-swap');
    if (treeOn) showTree(false);
    if (setIdx !== 0) applySet(0);
    cur = -1; go(start || 0, true); update();
    if (reduce) { introDone = true; intro.classList.add('is-done', 'is-quick'); stage.removeAttribute('inert'); document.getElementById('royal-close').focus(); }
    else startIntro();
  }
  openBtn.addEventListener('click', function(){ openRoyal(0, openBtn); });
  document.querySelectorAll('[data-royal]').forEach(function(b){
    b.addEventListener('click', function(){ openRoyal(parseInt(b.getAttribute('data-royal'), 10), b); });
  });
  document.getElementById('royal-close').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('close', function(){
    cancelAnimationFrame(introRaf); introDone = true; video.pause();
    document.documentElement.classList.remove('is-locked'); lastTrigger.focus();
  });
})();

/* ---------- 영국 왕실 티저 : 사진 전환 + 인물 목록 강조 ---------- */
(function(){
  'use strict';
  var photos = [].slice.call(document.querySelectorAll('.reign__photo')),
      thumbs = [].slice.call(document.querySelectorAll('.reign__thumb')), n = photos.length, i = 0;
  if (!n) return;
  function set(k){
    i = (k + n) % n;
    photos.forEach(function(p, x){ p.classList.toggle('is-on', x === i); });
    thumbs.forEach(function(t, x){ t.classList.toggle('is-on', x === i); });
  }
  thumbs.forEach(function(t, x){ t.addEventListener('click', function(){ set(x); }); });
  document.getElementById('reign-prev').addEventListener('click', function(){ set(i - 1); });
  document.getElementById('reign-next').addEventListener('click', function(){ set(i + 1); });

  var items = [].slice.call(document.querySelectorAll('.reign__list li'));
  function mark(li){ items.forEach(function(x){ x.classList.toggle('is-active', x === li); }); }
  items.forEach(function(li){
    var b = li.querySelector('button');
    li.addEventListener('mouseenter', function(){ mark(li); });
    b.addEventListener('focus', function(){ mark(li); });
  });
})();

/* ---------- 영국 주요 관광지 : 목록 선택 → 사진 패널 ---------- */
(function(){
  'use strict';
  var items = [].slice.call(document.querySelectorAll('.spots__item'));
  if (!items.length) return;
  var img = document.getElementById('spots-img'), ph = document.getElementById('spots-ph'),
      phEn = document.getElementById('spots-ph-en'), shot = img.parentNode;
  function pick(b){
    items.forEach(function(x){ x.classList.toggle('is-on', x === b); });
    var src = b.getAttribute('data-img');
    document.getElementById('spots-reg').textContent  = b.getAttribute('data-reg');
    document.getElementById('spots-ko').textContent   = b.getAttribute('data-ko');
    document.getElementById('spots-desc').textContent = b.getAttribute('data-desc');
    phEn.textContent = b.getAttribute('data-en');
    if (src){ img.onload = function(){ shot.classList.add('has-img'); img.hidden = false; img.style.opacity = 1; };
      img.src = src; img.alt = b.getAttribute('data-alt'); if (img.complete) img.onload(); }
    else { shot.classList.remove('has-img'); img.hidden = true; img.removeAttribute('src'); img.alt = ''; }
  }
  items.forEach(function(b){
    b.addEventListener('click', function(){ pick(b); });
    b.addEventListener('mouseenter', function(){ pick(b); });
    b.addEventListener('focus', function(){ pick(b); });
  });
  pick(items[0]);
})();
