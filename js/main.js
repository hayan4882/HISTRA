/* HISTRA main — 지구본(콘텐츠 제공 5개국만 선택 가능) + 세로형 국가 선택 */
const C=[
 {id:'uk',en:'UK',ko:'영국',sub:'왕실과 산업혁명의 나라',lat:51.5,lon:-0.1,side:'l'},
 {id:'china',en:'China',ko:'중국',sub:'갑골문에서 마지막 왕조까지',lat:39.9,lon:116.4,side:'l'},
 {id:'korea',en:'Korea',ko:'한국',sub:'고조선에서 조선까지',lat:37.5,lon:127,side:'r'},
 {id:'italy',en:'Italy',ko:'이탈리아',sub:'로마 건국에서 르네상스까지',lat:41.9,lon:12.5,side:'r'},
 {id:'egypt',en:'Egypt',ko:'이집트',sub:'첫 파라오에서 클레오파트라까지',lat:30,lon:31.2,side:'r'}];
const href=c=>`${c.id}/index.html`;
const rows=document.getElementById('rows'),sel=document.getElementById('select');
rows.innerHTML=C.map((c,i)=>`<li data-i="${i}"><a href="${href(c)}"><span class="en">${c.en}</span><span class="ko"><b>${c.ko}</b><span>${c.sub}</span></span></a></li>`).join('');
let cur=-1,hoverLock=false;
function select(i){
  if(i===cur)return;cur=i;
  [...rows.children].forEach((li,k)=>li.classList.toggle('on',k===i));
}
function byScroll(){
  if(hoverLock)return;const r=sel.getBoundingClientRect(),p=Math.min(.999,Math.max(0,-r.top/(r.height-innerHeight)));
  select(Math.floor(p*C.length));
}
[...rows.children].forEach((li,i)=>{li.addEventListener('pointerenter',()=>{hoverLock=true;select(i)});li.addEventListener('focusin',()=>select(i))});
rows.addEventListener('pointerleave',()=>{hoverLock=false});
addEventListener('scroll',()=>{hoverLock=false;byScroll()},{passive:true});
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
