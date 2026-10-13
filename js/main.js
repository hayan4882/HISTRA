/* HISTRA main — 지구본(콘텐츠 제공 5개국만 선택 가능) + 세로형 국가 선택 */
const C=[
 {id:'uk',en:'UK',ko:'영국',sub:'왕실과 산업혁명의 나라',lat:51.5,lon:-0.1,side:'l',
  t:'스톤헨지',d:'거대한 돌기둥을 원형으로 배치한 선사시대 유적이다. 약 5,000년 전부터 조성되기 시작했다.',ic:'stone'},
 {id:'china',en:'China',ko:'중국',sub:'갑골문에서 마지막 왕조까지',lat:39.9,lon:116.4,side:'l',
  t:'만리장성',d:'중국을 대표하는 유적·문화유산 가운데 하나로, 긴 성벽과 망루로 이루어져 있어요.',ic:'wall'},
 {id:'korea',en:'Korea',ko:'한국',sub:'고조선에서 조선까지',lat:37.5,lon:127,side:'r',
  t:'경주 첨성대',d:'신라 선덕여왕 때 세운 천문대로, 동아시아에 남아 있는 가장 오래된 천문대 가운데 하나예요.',ic:'tower'},
 {id:'italy',en:'Italy',ko:'이탈리아',sub:'로마 건국에서 르네상스까지',lat:41.9,lon:12.5,side:'r',
  t:'콜로세움',d:'고대 로마 시대에 지은 원형 경기장으로, 로마를 대표하는 유적이에요.',ic:'colo'},
 {id:'egypt',en:'Egypt',ko:'이집트',sub:'첫 파라오에서 클레오파트라까지',lat:30,lon:31.2,side:'r',
  t:'기자의 피라미드',d:'고대 이집트 파라오의 무덤으로 지어진 피라미드로, 이집트를 대표하는 유적이에요.',ic:'pyr'}];
const href=c=>`${c.id}/index.html`;
const ICON={
 tower:'<path d="M30 100H170M58 96h84v4H58zM72 96L80 38h40l8 58M77 74h46M75 85h50M79 52h42M92 60h16v13H92zM82 38v-10h36v10M86 28v-8h28v8"/>',
 pyr:'<path d="M20 100H180M30 100L82 42l52 58M102 100l36-40 42 40M82 42L98 100"/>',
 colo:'<path d="M26 100H174M34 100V44q66-14 132 0v56M34 62H166M34 80H166"/>'+[0,1,2,3,4,5].map(i=>`<path d="M${46+i*20} 80v-9a6 6 0 0112 0v9M${46+i*20} 100v-9a6 6 0 0112 0v9"/>`).join(''),
 stone:'<path d="M20 100H180"/>'+[0,1,2].map(i=>`<path d="M${34+i*50} 100V52h12v48M${64+i*50} 100V52h12v48M${30+i*50} 52h50v-10h-50z"/>`).join('').replace(/M\d+ 100V52h12v48M(\d+)/g,'$&'),
 wall:'<path d="M14 100H186M14 100V70h60l22-10M96 60V44h44v16M90 44h56M96 44v-8h44v8M140 60l46 10v30M20 70v-6h8v6M36 70v-6h8v6M52 70v-6h8v6M156 66v-6h8v6M172 68v-6h8v6"/>'};
const rows=document.getElementById('rows'),card=document.getElementById('card'),stage=card.parentElement,sel=document.getElementById('select');
rows.innerHTML=C.map((c,i)=>`<li data-i="${i}"><a href="${href(c)}"><span class="en">${c.en}</span><span class="ko"><b>${c.ko}</b><span>${c.sub}</span></span></a></li>`).join('');
let cur=-1,hoverLock=false;
function select(i){
  if(i===cur)return;cur=i;const c=C[i];
  [...rows.children].forEach((li,k)=>li.classList.toggle('on',k===i));
  document.getElementById('cardIc').innerHTML=`<svg viewBox="0 0 200 120" aria-hidden="true">${ICON[c.ic]}</svg>`;
  document.getElementById('cardT').textContent=c.t;document.getElementById('cardD').textContent=c.d;
  const li=rows.children[i],sr=stage.getBoundingClientRect(),lr=li.getBoundingClientRect();
  card.style.top=(lr.top-sr.top+lr.height*.82)+'px';
}
function byScroll(){
  if(hoverLock)return;const r=sel.getBoundingClientRect(),p=Math.min(.999,Math.max(0,-r.top/(r.height-innerHeight)));
  select(Math.floor(p*C.length));
}
[...rows.children].forEach((li,i)=>{li.addEventListener('pointerenter',()=>{hoverLock=true;select(i)});li.addEventListener('focusin',()=>select(i))});
rows.addEventListener('pointerleave',()=>{hoverLock=false});
addEventListener('scroll',()=>{hoverLock=false;byScroll()},{passive:true});addEventListener('resize',()=>{const k=cur;cur=-1;select(k<0?0:k)});
select(0);byScroll();

/* ---- 3D 지구본 ---- */
(function(){
  const box=document.getElementById('globe');
  const fallback=()=>{box.innerHTML='<ul class="fb">'+C.map(c=>`<li><a href="${href(c)}">${c.en} · ${c.ko}</a></li>`).join('')+'</ul>'};
  try{
    const ren=new THREE.WebGLRenderer({antialias:true,alpha:true});
    ren.setPixelRatio(Math.min(2,devicePixelRatio||1));box.appendChild(ren.domElement);
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,20);cam.position.z=4.1;
    const loader=new THREE.TextureLoader(),tex=k=>{const t=loader.load(HISTRA_TEX[k]);return t};
    const globe=new THREE.Group();scene.add(globe);
    const earth=new THREE.Mesh(new THREE.SphereGeometry(1,64,64),new THREE.MeshPhongMaterial({map:tex('atmos'),color:0x9fb2c6,emissiveMap:tex('lights'),emissive:0xffc57a,emissiveIntensity:1.1,shininess:6}));
    globe.add(earth);
    scene.add(new THREE.AmbientLight(0x6f86a8,.35));const sun=new THREE.DirectionalLight(0xdfe8ff,1.1);sun.position.set(-3,2,4);scene.add(sun);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(1.06,64,64),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,
      vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0,0,1.)),3.);gl_FragColor=vec4(.25,.5,1.,1.)*i;}'}));scene.add(glow);
    const pos=(lat,lon,r)=>{const p=(90-lat)*Math.PI/180,t=(lon+180)*Math.PI/180;return new THREE.Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t))};
    const hits=[],labels=[];
    C.forEach((c,i)=>{
      const p=pos(c.lat,c.lon,1.012),dot=new THREE.Mesh(new THREE.SphereGeometry(.016,16,16),new THREE.MeshBasicMaterial({color:0xfeb952}));dot.position.copy(p);globe.add(dot);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.026,.032,32),new THREE.MeshBasicMaterial({color:0xfeb952,transparent:true,side:THREE.DoubleSide}));ring.position.copy(p);ring.lookAt(p.clone().multiplyScalar(2));globe.add(ring);c.ring=ring;
      const hit=new THREE.Mesh(new THREE.SphereGeometry(.055,12,12),new THREE.MeshBasicMaterial({visible:false}));hit.position.copy(p);hit.userData.i=i;globe.add(hit);hits.push(hit);
      const l=document.createElement('div');l.className='pl';l.textContent=c.en;box.appendChild(l);labels.push(l);c.p=p;
    });
    globe.rotation.set(.42,-Math.PI/2-65*Math.PI/180,0);
    const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let drag=null,moved=0,hov=-1;
    const pick=e=>{const r=ren.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,cam);
      const h=ray.intersectObjects([earth,...hits])[0];return h&&h.object.userData.i!==undefined?h.object.userData.i:-1};
    const cv=ren.domElement;
    cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};moved=0;cv.setPointerCapture(e.pointerId)});
    cv.addEventListener('pointermove',e=>{
      if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);globe.rotation.y+=dx*.006;globe.rotation.x=Math.max(-.9,Math.min(1.1,globe.rotation.x+dy*.004));drag={x:e.clientX,y:e.clientY}}
      hov=pick(e);cv.style.cursor=hov>=0?'pointer':(drag?'grabbing':'grab')});
    cv.addEventListener('pointerup',e=>{const was=moved<6;drag=null;if(was){const i=pick(e);if(i>=0)location.href=href(C[i])}});
    cv.addEventListener('pointerleave',()=>{hov=-1});
    const size=()=>{const w=box.clientWidth;ren.setSize(w,w,false);cam.aspect=1;cam.updateProjectionMatrix()};size();addEventListener('resize',size);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,v=new THREE.Vector3(),camDir=new THREE.Vector3();
    (function loop(t){
      if(!drag&&hov<0&&!reduce)globe.rotation.y+=.0014;
      globe.updateMatrixWorld();
      C.forEach((c,i)=>{
        v.copy(c.p).applyMatrix4(globe.matrixWorld);const front=v.z>.25;
        const s=1+.35*Math.sin(t/500+i);c.ring.scale.setScalar(s);c.ring.material.opacity=.9-.5*((s-.65)/.7);
        const q=v.clone().project(cam),w=box.clientWidth,l=labels[i];
        l.style.opacity=front?1:0;l.classList.toggle('on',i===hov);
        const x=(q.x+1)/2*w,y=(1-q.y)/2*w;l.style.top=(y-9)+'px';
        if(C[i].side==='l'){l.style.left='';l.style.right=(w-x+12)+'px'}else{l.style.right='';l.style.left=(x+12)+'px'}
      });
      ren.render(scene,cam);requestAnimationFrame(loop);
    })(0);
  }catch(err){console.warn('WebGL를 사용할 수 없어 국가 링크로 대체합니다.',err);fallback()}
})();
