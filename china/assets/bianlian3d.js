/* 변검 3D: 옻칠한 듯한 곡면 가면 + 부채가 지나가는 순간 얼굴이 바뀜 (three.js r128)
   initBian3D(box, faces, faceSVG) → {change(i), ready}
   faceSVG(f)는 viewBox 0 0 300 360 기준의 얼굴 그림(SVG 조각)을 돌려준다. */
window.initBian3D=function(box,faces,faceSVG){
  const T=window.THREE;if(!T)return null;
  let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch(e){return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  box.appendChild(renderer.domElement);
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(28,1,.1,50);camera.position.set(0,.1,6.2);camera.lookAt(0,0,0);
  const lin=c=>new T.Color(c).convertSRGBToLinear();

  // 환경 반사(옻칠 광택용)
  (function(){const env=new T.Scene();const g=new T.SphereGeometry(10,32,16);const cols=[];const p=g.attributes.position;
    for(let i=0;i<p.count;i++){const y=p.getY(i)/10;const c=new T.Color().lerpColors(new T.Color(0x080606),new T.Color(0xffe6c8),Math.pow(Math.max(0,y*.5+.5),2));cols.push(c.r,c.g,c.b);}
    g.setAttribute('color',new T.Float32BufferAttribute(cols,3));env.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
    const l1=new T.Mesh(new T.PlaneGeometry(5,2),new T.MeshBasicMaterial({color:0xffffff}));l1.position.set(-3,5,4);l1.lookAt(0,0,0);env.add(l1);
    scene.environment=new T.PMREMGenerator(renderer).fromScene(env,.03).texture;})();

  // 무대 조명: 위에서 떨어지는 스포트라이트 + 붉은 역광
  scene.add(new T.AmbientLight(0xffffff,.12));
  const spot=new T.SpotLight(0xffe2c0,2.4,20,.5,.6,1.2);spot.position.set(1.5,5,5);spot.target.position.set(0,0,0);spot.castShadow=true;spot.shadow.mapSize.set(1024,1024);scene.add(spot,spot.target);
  const rimL=new T.DirectionalLight(0xff4a20,1.1);rimL.position.set(-4,1.5,-3);scene.add(rimL);
  const rimR=new T.DirectionalLight(0xffb070,.5);rimR.position.set(4,-1,-2);scene.add(rimR);

  /* 가면 곡면: 반구를 얼굴 비율로 늘이고 이마·코·광대·턱을 조형 */
  function maskGeo(){
    const g=new T.SphereGeometry(1,96,96,0,Math.PI,.12,Math.PI-.24);
    const p=g.attributes.position,uv=g.attributes.uv;
    for(let i=0;i<p.count;i++){
      let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      x*=.82;y*=1.0;z*=.62;
      if(y<-.35){const k=(-y-.35);x*=1-k*.55;z*=1-k*.25;}          // 갸름한 턱
      if(y>.55){z*=1-(y-.55)*.35;}                                  // 이마 뒤로
      const g2=(cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));
      z+=.16*g2(0,-.12,.09,.28);                                    // 콧대
      z+=.05*g2(0,.32,.5,.08);                                      // 눈썹뼈
      z-=.06*g2(-.3,.08,.13,.08)+.06*g2(.3,.08,.13,.08);             // 눈두덩
      z+=.05*g2(-.38,-.22,.16,.14)+.05*g2(.38,-.22,.16,.14);         // 광대
      z+=.04*g2(0,-.55,.2,.1);                                      // 입술
      p.setXYZ(i,x,y,z);
    }
    // 평면 투영 UV: 가면 가장자리가 그림의 얼굴 윤곽(x 30~270, y 20~344)과 맞도록
    for(let i=0;i<p.count;i++)uv.setXY(i,.5+(p.getX(i)/.82)*.4,.494+p.getY(i)*.45);
    g.computeVertexNormals();return g;
  }
  const geo=maskGeo();
  const front=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.38,clearcoat:.8,clearcoatRoughness:.22,envMapIntensity:.9});
  const back=new T.MeshStandardMaterial({color:lin(0x1a1311),roughness:.8,side:T.BackSide});
  const mask=new T.Group();
  const face=new T.Mesh(geo,front);face.castShadow=true;mask.add(face);
  mask.add(new T.Mesh(geo,back));
  mask.scale.set(1.35,1.35,1.35);
  scene.add(mask);

  // 그림자를 받는 어두운 바닥
  const floor=new T.Mesh(new T.PlaneGeometry(12,12),new T.ShadowMaterial({opacity:.5}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.9;floor.receiveShadow=true;scene.add(floor);

  /* 부채: 비단 면 + 금빛 살 */
  const fan=new T.Group();
  (function(){
    const R=2.6,r=.5,a0=-Math.PI*.42,a1=Math.PI*.42;
    const s=new T.Shape();s.moveTo(Math.sin(a0)*r,Math.cos(a0)*r);
    for(let k=0;k<=40;k++){const a=a0+(a1-a0)*k/40;s.lineTo(Math.sin(a)*R,Math.cos(a)*R);}
    for(let k=40;k>=0;k--){const a=a0+(a1-a0)*k/40;s.lineTo(Math.sin(a)*r,Math.cos(a)*r);}
    const silkTex=(function(){const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');
      const gr=x.createRadialGradient(256,512,60,256,512,520);gr.addColorStop(0,'#5c0e08');gr.addColorStop(.6,'#a3201a');gr.addColorStop(1,'#6e120c');x.fillStyle=gr;x.fillRect(0,0,512,512);
      x.strokeStyle='rgba(201,162,74,.85)';x.lineWidth=6;x.beginPath();x.arc(256,512,470,Math.PI*1.08,Math.PI*1.92);x.stroke();x.lineWidth=2;x.beginPath();x.arc(256,512,430,Math.PI*1.08,Math.PI*1.92);x.stroke();
      const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;})();
    const silkGeo=new T.ShapeGeometry(s,40);
    const pp=silkGeo.attributes.position,uv=silkGeo.attributes.uv;
    for(let i=0;i<pp.count;i++){const x=pp.getX(i),y=pp.getY(i);uv.setXY(i,x/(2*R)+.5,y/(2*R));
      const a=Math.atan2(x,y);pp.setZ(i,Math.sin((a-a0)/(a1-a0)*Math.PI*12)*.025);} // 접힌 주름
    silkGeo.computeVertexNormals();
    fan.add(new T.Mesh(silkGeo,new T.MeshStandardMaterial({map:silkTex,roughness:.55,side:T.DoubleSide})));
    const ribM=new T.MeshStandardMaterial({color:lin(0xc9a24a),metalness:.8,roughness:.3});
    for(let k=0;k<=12;k++){const a=a0+(a1-a0)*k/12;const rib=new T.Mesh(new T.BoxGeometry(.035,R,.03),ribM);rib.position.set(Math.sin(a)*R/2,Math.cos(a)*R/2,.03);rib.rotation.z=-a;fan.add(rib);}
    const pin=new T.Mesh(new T.CylinderGeometry(.08,.08,.08,20),ribM);pin.rotation.x=Math.PI/2;fan.add(pin);
  })();
  fan.position.set(0,-2.4,1.6);fan.visible=false;scene.add(fan);

  /* 얼굴 텍스처: SVG 얼굴 그림 → 캔버스 */
  const texCache={};
  function faceTex(i){
    if(texCache[i])return Promise.resolve(texCache[i]);
    const f=faces[i];
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="1024" height="1229"><rect width="300" height="360" fill="${f.base}"/>${faceSVG(f)}</svg>`;
    return new Promise(res=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=1229;const x=c.getContext('2d');x.drawImage(img,0,0,1024,1229);
      const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;texCache[i]=t;res(t);};
      img.onerror=()=>res(null);img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
  }
  function apply(i){return faceTex(i).then(t=>{if(t){front.map=t;front.needsUpdate=true;}});}
  faces.forEach((_,i)=>faceTex(i));

  /* 드래그로 살짝 돌려 보기 */
  let tYaw=0,tPitch=0,yaw=0,pitch=0,drag=null;
  box.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:tYaw,pitch:tPitch,moved:false};});
  addEventListener('pointermove',e=>{if(!drag)return;const w=box.clientWidth;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;
    tYaw=Math.max(-.5,Math.min(.5,drag.yaw+dx/w*1.6));tPitch=Math.max(-.22,Math.min(.22,drag.pitch+dy/w*1.2));});
  addEventListener('pointerup',()=>{if(drag){box.dataset.dragged=drag.moved?'1':'';}drag=null;});

  function resize(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  addEventListener('resize',resize);resize();

  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=true;if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;},{rootMargin:'100px'}).observe(box);
  let anim=null;const clock=new T.Clock();
  function change(i){
    if(anim)return false;
    if(RM){apply(i);return true;}
    anim={t0:clock.getElapsedTime(),i,swapped:false};fan.visible=true;return true;
  }
  (function loop(){
    requestAnimationFrame(loop);if(!visible)return;
    const t=clock.getElapsedTime();
    if(!drag){tYaw*=.95;tPitch*=.95;}
    yaw+=(tYaw-yaw)*.1;pitch+=(tPitch-pitch)*.1;
    let turn=0;
    if(anim){
      const k=Math.min(1,(t-anim.t0)/1.0);
      // 부채가 왼쪽 아래에서 올라와 얼굴을 가리고 오른쪽으로 빠져나감
      const a=-1.9+3.8*(k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2);
      fan.rotation.z=-a;fan.position.x=Math.sin(a)*.25;
      turn=Math.sin(k*Math.PI)*.55;
      if(!anim.swapped&&k>=.5){anim.swapped=true;apply(anim.i);}
      if(k>=1){anim=null;fan.visible=false;}
    }
    mask.rotation.y=yaw+turn+(RM?0:Math.sin(t*.7)*.06);
    mask.rotation.x=pitch+(RM?0:Math.sin(t*.5)*.03);
    mask.position.y=RM?0:Math.sin(t*.9)*.04;
    renderer.render(scene,camera);
  })();
  return {change,ready:apply(0)};
};
