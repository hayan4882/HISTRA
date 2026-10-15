/* CULTURE THAT LIVES ON — 분류별 3D 오브젝트 (three.js r128)
   0 언어와 문자: 반쯤 말린 죽간(竹簡) — 『논어』 학이편 첫 구절
   1 문학과 예술: 문방사우 — 붓·먹·벼루·화선지와 붓걸이
   2 종교: 처마 끝이 들린 5층 불탑
   3 생활문화: 춘절 홍등 한 쌍
   드래그로 좌우 ±28°, 상하 ±12°만 돌아가며, 손을 떼면 제자리로 돌아온다. */
(function(){
  const box=document.getElementById('c3dBox');
  if(!box||!window.THREE)return;
  const T=THREE;
  let renderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch(e){box.style.display='none';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputEncoding=T.sRGBEncoding;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  box.appendChild(renderer.domElement);

  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(30,4/3,.1,100);
  camera.position.set(0,1.6,8.2);camera.lookAt(0,.15,0);

  /* 은은한 반사를 위한 환경광 (따뜻한 위쪽, 어두운 아래쪽) */
  (function(){
    const env=new T.Scene();
    const g=new T.SphereGeometry(10,32,16);const cols=[];const p=g.attributes.position;
    for(let i=0;i<p.count;i++){const y=p.getY(i)/10;const c=new T.Color().lerpColors(new T.Color(0x0b0908),new T.Color(0xf3dcc0),Math.pow(Math.max(0,y*.5+.5),1.6));cols.push(c.r,c.g,c.b);}
    g.setAttribute('color',new T.Float32BufferAttribute(cols,3));
    env.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
    const lamp=new T.Mesh(new T.PlaneGeometry(6,3),new T.MeshBasicMaterial({color:0xffffff}));lamp.position.set(4,6,3);lamp.lookAt(0,0,0);env.add(lamp);
    const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(env,.04).texture;
  })();

  scene.add(new T.HemisphereLight(0xfff1dc,0x14100c,.35));
  const key=new T.DirectionalLight(0xffe4c4,1.6);key.position.set(3.5,6,4.5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4});key.shadow.radius=6;key.shadow.bias=-.0008;scene.add(key);
  const rim=new T.DirectionalLight(0xf0642a,.9);rim.position.set(-5,2.5,-4);scene.add(rim);
  const fill=new T.DirectionalLight(0x9fb4ff,.18);fill.position.set(-4,1,5);scene.add(fill);
  const ground=new T.Mesh(new T.PlaneGeometry(20,20),new T.ShadowMaterial({opacity:.38}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.5;ground.receiveShadow=true;scene.add(ground);

  const lin=c=>new T.Color(c).convertSRGBToLinear();
  function mat(c,o={}){const m=new T.MeshStandardMaterial(Object.assign({roughness:.7,metalness:0,envMapIntensity:.8},o));m.color=lin(c);if(o.emissive!==undefined)m.emissive=lin(o.emissive);return m;}
  const gold=()=>mat(0xc9a24a,{metalness:.85,roughness:.3});
  const fontStack='\"Noto Sans KR\",\"Apple SD Gothic Neo\",\"Malgun Gothic\",sans-serif';
  function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;return t;}
  const shadowed=o=>{o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});return o;};
  const rand=(a,b)=>a+Math.random()*(b-a);

  /* ───────── 0. 죽간 ───────── */
  function bambooTex(tone){return canvasTex(128,1024,(x,w,h)=>{
    const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,tone[0]);g.addColorStop(.5,tone[1]);g.addColorStop(1,tone[0]);x.fillStyle=g;x.fillRect(0,0,w,h);
    for(let i=0;i<40;i++){x.strokeStyle=`rgba(90,62,28,${rand(.05,.16)})`;x.lineWidth=rand(.5,1.6);const X=rand(0,w);x.beginPath();x.moveTo(X,0);x.lineTo(X+rand(-3,3),h);x.stroke();}
    [.18,.82].forEach(v=>{x.fillStyle='rgba(80,52,20,.35)';x.fillRect(0,h*v-3,w,6);x.fillStyle='rgba(255,240,210,.25)';x.fillRect(0,h*v+3,w,2);});
  });}
  function inkTex(text){return canvasTex(128,1024,(x,w,h)=>{
    x.clearRect(0,0,w,h);if(!text)return;x.fillStyle='rgba(22,16,10,.92)';x.font=`700 78px ${fontStack}`;x.textAlign='center';x.textBaseline='middle';
    const step=(h*.62)/Math.max(text.length,5);[...text].forEach((ch,i)=>x.fillText(ch,w/2,h*.23+step*(i+.5)));
  });}
  function makeSlips(){
    const g=new T.Group();
    // 오른쪽 줄부터 읽는다: 學而時習之 / 不亦說乎 / 有朋自遠方來 / 不亦樂乎
    const text={13:'學而時習之',12:'不亦說乎',11:'有朋自遠方來',10:'不亦樂乎'};
    const tones=[['#b98f55','#d6b479'],['#c09659','#dcbb82'],['#b28750','#cfac70']];
    const N=14,flatStart=5,pitch=.29,slipH=2.9;
    const cordPts=[[],[]];
    for(let i=0;i<N;i++){
      const tone=tones[i%3];
      const body=new T.Mesh(new T.BoxGeometry(.25,slipH+rand(-.04,.04),.045),[
        mat(0x8e6a3a),mat(0x8e6a3a),mat(0x9c7745),mat(0x9c7745),
        mat(0xffffff,{map:bambooTex(tone),roughness:.62}),mat(0xa47f4b,{roughness:.75})]);
      const ink=new T.Mesh(new T.PlaneGeometry(.25,slipH),new T.MeshStandardMaterial({map:inkTex(text[i]),transparent:true,roughness:.9}));ink.position.z=.0235;
      const s=new T.Group();s.add(body,ink);
      if(i<flatStart){ // 왼쪽 끝은 둘둘 말린 상태
        const a=(flatStart-i)*.95,R=.42;
        s.position.set(-1.62-Math.sin(a)*R,0,-R+Math.cos(a)*R);s.rotation.y=-a;
      }else{
        const k=i-flatStart;
        s.position.set(-1.62+k*pitch,0,Math.sin(k*.35)*.04);s.rotation.y=rand(-.025,.025);
      }
      s.rotation.z=rand(-.008,.008);g.add(s);
      [-.95,.95].forEach((y,j)=>{const wv=(i%2?1:-1)*.035;cordPts[j].push(new T.Vector3(s.position.x,y,s.position.z+.03+wv));});
    }
    cordPts.forEach((pts,j)=>{
      const end=pts[pts.length-1],y0=pts[0].y;
      pts.push(new T.Vector3(end.x+.25,y0+(j?-.02:.02),end.z+.05),new T.Vector3(end.x+.42,y0-.35,end.z+.1),new T.Vector3(end.x+.38,y0-.75,end.z+.12));
      g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),140,.017,6,false),mat(0x3b2a18,{roughness:.95})));
    });
    g.position.set(.1,.05,.2);
    return shadowed(g);
  }

  /* ───────── 1. 문방사우 ───────── */
  function makeStudio(){
    const g=new T.Group();
    // 화선지 + '詩' + 낙관
    const paperTex=canvasTex(1024,768,(x,w,h)=>{
      x.fillStyle='#efe6d2';x.fillRect(0,0,w,h);
      for(let i=0;i<500;i++){x.strokeStyle=`rgba(150,130,100,${rand(.03,.09)})`;x.lineWidth=rand(.3,1);x.beginPath();const X=rand(0,w),Y=rand(0,h);x.moveTo(X,Y);x.lineTo(X+rand(-30,30),Y+rand(-30,30));x.stroke();}
      x.fillStyle='rgba(18,14,10,.93)';x.font=`900 430px ${fontStack}`;x.textAlign='center';x.textBaseline='middle';
      x.shadowColor='rgba(18,14,10,.35)';x.shadowBlur=10;x.fillText('詩',w*.45,h*.52);x.shadowBlur=0;
      x.fillStyle='#b3261a';x.fillRect(w*.78,h*.66,90,90);x.fillStyle='#efe6d2';x.font=`700 34px ${fontStack}`;x.fillText('文',w*.78+45,h*.66+28);x.fillText('房',w*.78+45,h*.66+64);
    });
    const pg=new T.PlaneGeometry(3.7,2.75,40,1);const pp=pg.attributes.position;
    for(let i=0;i<pp.count;i++){const X=pp.getX(i);const e=Math.max(0,(X-1.4)/.45);pp.setZ(i,e*e*.18);} pg.computeVertexNormals();
    const paper=new T.Mesh(pg,mat(0xffffff,{map:paperTex,roughness:.95,side:T.DoubleSide}));paper.rotation.x=-Math.PI/2;paper.rotation.z=.08;paper.position.set(-.55,-1.48,.15);g.add(paper);
    // 벼루
    const rs=new T.Shape();const W=.62,Hh=.92,r=.16;
    rs.moveTo(-W+r,-Hh);rs.lineTo(W-r,-Hh);rs.quadraticCurveTo(W,-Hh,W,-Hh+r);rs.lineTo(W,Hh-r);rs.quadraticCurveTo(W,Hh,W-r,Hh);rs.lineTo(-W+r,Hh);rs.quadraticCurveTo(-W,Hh,-W,Hh-r);rs.lineTo(-W,-Hh+r);rs.quadraticCurveTo(-W,-Hh,-W+r,-Hh);
    const stone=new T.Mesh(new T.ExtrudeGeometry(rs,{depth:.2,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:4,curveSegments:16}),mat(0x2a2623,{roughness:.55}));
    stone.rotation.x=-Math.PI/2;stone.position.set(1.85,-1.5,.2);g.add(stone);
    const face=new T.Mesh(new T.PlaneGeometry(1.0,1.15),mat(0x1d1a18,{roughness:.35}));face.rotation.x=-Math.PI/2;face.position.set(1.85,-1.255,.42);g.add(face);
    const pool=new T.Mesh(new T.CircleGeometry(.36,48),new T.MeshPhysicalMaterial({color:lin(0x050403),roughness:.05,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.4}));
    pool.scale.set(1.2,.62,1);pool.rotation.x=-Math.PI/2;pool.position.set(1.85,-1.25,-.38);g.add(pool);
    const lip=new T.Mesh(new T.TorusGeometry(.36,.03,10,48),mat(0x2a2623,{roughness:.5}));lip.scale.set(1.2,.62,1);lip.rotation.x=-Math.PI/2;lip.position.copy(pool.position);g.add(lip);
    // 먹
    const inkStickTex=canvasTex(128,512,(x,w,h)=>{x.fillStyle='#141210';x.fillRect(0,0,w,h);x.fillStyle='#c9a24a';x.font=`700 70px ${fontStack}`;x.textAlign='center';x.textBaseline='middle';['墨','香'].forEach((c,i)=>x.fillText(c,w/2,h*.35+i*110));x.strokeStyle='#c9a24a';x.lineWidth=4;x.strokeRect(14,40,w-28,h-80);});
    const stick=new T.Mesh(new T.BoxGeometry(.22,.11,1.0),[mat(0x141210),mat(0x141210),mat(0xffffff,{map:inkStickTex,roughness:.5,metalness:.1}),mat(0x141210),mat(0x141210),mat(0x141210)]);
    stick.position.set(1.85,-1.18,.62);stick.rotation.y=.35;stick.rotation.z=.03;g.add(stick);
    // 붓걸이(산 모양)
    const ms=new T.Shape();ms.moveTo(-.95,0);ms.quadraticCurveTo(-.8,.3,-.6,.42);ms.quadraticCurveTo(-.45,.18,-.3,.2);ms.quadraticCurveTo(-.15,.62,0,.7);ms.quadraticCurveTo(.15,.62,.3,.2);ms.quadraticCurveTo(.45,.18,.6,.42);ms.quadraticCurveTo(.8,.3,.95,0);ms.lineTo(-.95,0);
    const rest=new T.Mesh(new T.ExtrudeGeometry(ms,{depth:.16,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:3,curveSegments:20}),mat(0x2d4a43,{roughness:.35,metalness:.1}));
    rest.position.set(-.4,-1.5,-1.0);g.add(rest);
    // 붓
    function brush(len,color){
      const b=new T.Group();
      b.add(new T.Mesh(new T.CylinderGeometry(.052,.058,len,24),mat(color,{roughness:.45})));
      for(let k=1;k<4;k++){const n=new T.Mesh(new T.TorusGeometry(.056,.008,6,24),mat(0x5a3d22,{roughness:.5}));n.rotation.x=Math.PI/2;n.position.y=-len/2+k*len/4;b.add(n);}
      const fer=new T.Mesh(new T.CylinderGeometry(.068,.06,.16,24),mat(0x2a1a12,{roughness:.35}));fer.position.y=-len/2-.08;b.add(fer);
      const prof=[];for(let k=0;k<=20;k++){const t=k/20;prof.push(new T.Vector2(.064*Math.sin(Math.PI*Math.pow(1-t,.75))*(1+.5*(1-t))+.002,-t*.62));}
      const tip=new T.Mesh(new T.LatheGeometry(prof,24),mat(0x15110e,{roughness:.55}));tip.position.y=-len/2-.16;b.add(tip);
      const loop=new T.Mesh(new T.TorusGeometry(.05,.01,8,20),mat(0x7a1c12));loop.position.y=len/2+.05;b.add(loop);
      return b;
    }
    const b1=brush(2.3,0xb08a52);b1.rotation.z=Math.PI/2;b1.rotation.y=.08;b1.position.set(-.35,-.74,-1.0);g.add(b1);
    const b2=brush(1.9,0x6b4a2b);b2.rotation.z=Math.PI/2-.05;b2.rotation.y=-.5;b2.position.set(.2,-1.38,1.05);g.add(b2);
    g.position.y=.25;
    return shadowed(g);
  }

  /* ───────── 2. 불탑 ───────── */
  function roofGeo(r,h,lift){
    const g=new T.ConeGeometry(r,h,48,12,true);const p=g.attributes.position;
    for(let i=0;i<p.count;i++){
      let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=(h/2-y)/h;const ang=Math.atan2(z,x);
      const s=1/Math.max(Math.abs(Math.cos(ang)),Math.abs(Math.sin(ang)));const c=(s-1)/(Math.SQRT2-1);
      x*=s;z*=s;y=y-h*.22*Math.sin(Math.PI*t)+lift*Math.pow(c,2.2)*Math.pow(t,3);
      p.setXYZ(i,x,y,z);
    }
    g.computeVertexNormals();return g;
  }
  const tileTex=canvasTex(512,64,(x,w,h)=>{x.fillStyle='#3d4f4a';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=8){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(i,0,2,h);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(i+3,0,2,h);}});
  tileTex.wrapS=T.RepeatWrapping;tileTex.repeat.set(4,1);
  function makePagoda(){
    const g=new T.Group();
    const base1=new T.Mesh(new T.BoxGeometry(2.6,.2,2.6),mat(0x8a8378,{roughness:.9}));base1.position.y=-1.4;g.add(base1);
    const base2=new T.Mesh(new T.BoxGeometry(2.1,.2,2.1),mat(0x9b9488,{roughness:.9}));base2.position.y=-1.2;g.add(base2);
    const stairs=new T.Mesh(new T.BoxGeometry(.5,.3,.45),mat(0x8a8378,{roughness:.9}));stairs.position.set(0,-1.35,1.45);g.add(stairs);
    const red=mat(0xa3281c,{roughness:.55}),dark=mat(0x5e1610,{roughness:.6}),roofM=mat(0xffffff,{map:tileTex,roughness:.42,metalness:.15,side:T.DoubleSide}),wood=mat(0x3a2418,{roughness:.6});
    let y=-1.1,w=1.35;
    for(let i=0;i<5;i++){
      const hgt=.5-i*.035;
      const body=new T.Mesh(new T.BoxGeometry(w,hgt,w),red);body.position.y=y+hgt/2;g.add(body);
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>{const c=new T.Mesh(new T.CylinderGeometry(.035,.035,hgt,10),dark);c.position.set(a*w/2,y+hgt/2,b*w/2);g.add(c);});
      for(let k=0;k<4;k++){const a=k*Math.PI/2;
        const win=new T.Mesh(new T.BoxGeometry(w*.38,hgt*.55,.02),mat(0x2a1a12,{roughness:.5}));win.position.set(Math.sin(a)*(w/2+.005),y+hgt*.52,Math.cos(a)*(w/2+.005));win.rotation.y=a;g.add(win);
        const lat=new T.Mesh(new T.BoxGeometry(w*.42,.025,.03),mat(0xc9a24a,{metalness:.6,roughness:.4}));lat.position.copy(win.position);lat.position.y+=hgt*.3;lat.rotation.y=a;g.add(lat);}
      const rail=new T.Mesh(new T.BoxGeometry(w+.22,.04,w+.22),wood);rail.position.y=y+.02;g.add(rail);
      const rr=w/2*1.55,rh=.42;
      const roof=new T.Mesh(roofGeo(rr,rh,.22),roofM);roof.position.y=y+hgt+rh/2-.06;g.add(roof);
      const eave=new T.Mesh(new T.BoxGeometry(w+.1,.07,w+.1),wood);eave.position.y=y+hgt;g.add(eave);
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>{const d=rr*.98;const bell=new T.Mesh(new T.SphereGeometry(.035,10,8),gold());bell.position.set(a*d,y+hgt+.11,b*d);g.add(bell);
        const str=new T.Mesh(new T.CylinderGeometry(.004,.004,.08,4),wood);str.position.set(a*d,y+hgt+.16,b*d);g.add(str);});
      y+=hgt+rh*.62;w*=.8;
    }
    const finialBase=new T.Mesh(new T.CylinderGeometry(.12,.16,.12,16),gold());finialBase.position.y=y+.02;g.add(finialBase);
    const spire=new T.Mesh(new T.CylinderGeometry(.025,.04,1.0,12),gold());spire.position.y=y+.55;g.add(spire);
    for(let k=0;k<7;k++){const r=new T.Mesh(new T.TorusGeometry(.12-k*.012,.016,8,24),gold());r.rotation.x=Math.PI/2;r.position.y=y+.18+k*.1;g.add(r);}
    const pearl=new T.Mesh(new T.SphereGeometry(.07,20,14),gold());pearl.position.y=y+1.1;g.add(pearl);
    g.position.y=-.32;g.scale.setScalar(.8);
    return shadowed(g);
  }

  /* ───────── 3. 홍등 한 쌍 ───────── */
  function lanternTex(emissive){return canvasTex(1024,512,(x,w,h)=>{
    const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,emissive?'#5a0d06':'#7d140c');g.addColorStop(.5,emissive?'#ff5a2a':'#c8281a');g.addColorStop(1,emissive?'#5a0d06':'#7d140c');
    x.fillStyle=g;x.fillRect(0,0,w,h);
    for(let i=0;i<16;i++){x.fillStyle=emissive?'rgba(0,0,0,.55)':'rgba(60,6,2,.45)';x.fillRect(i*w/16-2,0,4,h);}
    [.25,.75].forEach(u=>{x.save();x.translate(u*w,h/2);
      x.fillStyle=emissive?'rgba(255,200,90,.9)':'#d9a93a';x.beginPath();x.arc(0,0,92,0,Math.PI*2);x.fill();
      x.fillStyle=emissive?'#801a08':'#a3241a';x.beginPath();x.arc(0,0,80,0,Math.PI*2);x.fill();
      x.fillStyle=emissive?'rgba(255,215,110,1)':'#e8c25a';x.font=`900 112px ${fontStack}`;x.textAlign='center';x.textBaseline='middle';x.fillText('福',0,6);x.restore();});
  });}
  function lantern(s){
    const g=new T.Group();
    const prof=[];for(let k=0;k<=32;k++){const t=k/32;prof.push(new T.Vector2(.5+.62*Math.pow(Math.sin(Math.PI*t),.85),(-1+2*t)*.95));}
    const body=new T.Mesh(new T.LatheGeometry(prof,64),new T.MeshStandardMaterial({map:lanternTex(false),emissiveMap:lanternTex(true),emissive:new T.Color(1,1,1),emissiveIntensity:.55,roughness:.55,envMapIntensity:.6}));
    g.add(body);
    g.add(new T.PointLight(0xff7a3a,1.1,5,2));
    [[.95,1],[-.95,-1]].forEach(([y,d])=>{
      let capP=[new T.Vector2(.5,0),new T.Vector2(.62,0),new T.Vector2(.64,.05*d),new T.Vector2(.56,.1*d),new T.Vector2(.5,.18*d),new T.Vector2(.3,.2*d),new T.Vector2(.001,.2*d)];
      if(d<0)capP=capP.reverse();
      const cap=new T.Mesh(new T.LatheGeometry(capP,48),gold());cap.material.side=T.DoubleSide;cap.position.y=y;g.add(cap);
      const band=new T.Mesh(new T.TorusGeometry(.6,.025,8,48),gold());band.rotation.x=Math.PI/2;band.position.y=y;g.add(band);
    });
    const cord=new T.Mesh(new T.CylinderGeometry(.014,.014,3,8),mat(0x3a1a10));cord.position.y=2.6;g.add(cord);
    const hook=new T.Mesh(new T.TorusGeometry(.08,.02,8,20),gold());hook.position.y=1.25;g.add(hook);
    const knot=new T.Group();for(let k=0;k<4;k++){const t=new T.Mesh(new T.TorusGeometry(.09,.03,8,20),mat(0xb8261a,{roughness:.6}));t.rotation.z=k*Math.PI/4;knot.add(t);}knot.position.y=-1.42;g.add(knot);
    const bead=new T.Mesh(new T.SphereGeometry(.07,16,12),gold());bead.position.y=-1.62;g.add(bead);
    const tm=mat(0xc0281a,{roughness:.8});
    for(let k=0;k<48;k++){const a=k/48*Math.PI*2,rr=rand(.01,.075),L=rand(.85,1.0);const t=new T.Mesh(new T.CylinderGeometry(.007,.007,L,4),tm);t.position.set(Math.cos(a)*rr,-1.7-L/2,Math.sin(a)*rr);t.rotation.set(Math.sin(a)*rr*.6,0,-Math.cos(a)*rr*.6);g.add(t);}
    g.scale.setScalar(s);return g;
  }
  function makeLanterns(){
    const g=new T.Group();
    const a=lantern(.78);a.position.set(-.85,.45,0);const b=lantern(.62);b.position.set(1.0,.85,-.6);
    g.add(a,b);g.userData.sway=[a,b];
    return shadowed(g);
  }

  const builders=[makeSlips,makeStudio,makePagoda,makeLanterns];
  const objs=builders.map(f=>{const o=f();o.visible=false;scene.add(o);return o;});
  let cur=-1,appear=1;
  const LIM_Y=.49,LIM_P=.21;let yaw=0,pitch=0,tYaw=0,tPitch=0,drag=null;
  function show(i){if(i===cur)return;if(cur>=0)objs[cur].visible=false;cur=i;objs[i].visible=true;appear=0;tYaw=0;tPitch=0;}

  /* 드래그로 살짝만 회전 */
  box.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:tYaw,pitch:tPitch};box.setPointerCapture(e.pointerId);});
  box.addEventListener('pointermove',e=>{if(!drag)return;const w=box.clientWidth;
    tYaw=Math.max(-LIM_Y,Math.min(LIM_Y,drag.yaw+(e.clientX-drag.x)/w*1.6));
    tPitch=Math.max(-LIM_P,Math.min(LIM_P,drag.pitch+(e.clientY-drag.y)/w*1.2));});
  const end=()=>{drag=null;};
  box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);box.addEventListener('pointerleave',end);

  function resize(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  addEventListener('resize',resize);resize();

  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=true;
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;},{rootMargin:'100px'}).observe(box);
  const baseYaw=[-.15,.25,.55,0];
  const clock=new T.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    if(!visible||cur<0)return;
    const t=clock.getElapsedTime();
    if(!drag){tYaw*=.94;tPitch*=.94;}
    yaw+=(tYaw-yaw)*.12;pitch+=(tPitch-pitch)*.12;
    appear=Math.min(1,appear+.04);const a=RM?1:1-Math.pow(1-appear,3);
    const o=objs[cur];
    const idle=RM?0:Math.sin(t*.5)*.1;
    o.rotation.y=baseYaw[cur]+yaw+idle;o.rotation.x=pitch;
    o.scale.setScalar(.88+.12*a);o.position.y=(1-a)*-.25;
    if(o.userData.sway&&!RM)o.userData.sway.forEach((l,k)=>{l.rotation.z=Math.sin(t*1.1+k*1.7)*.05;});
    renderer.render(scene,camera);
  })();

  // 폰트가 늦게 로드되면 글자 텍스처가 든 오브젝트를 다시 만든다
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{
    [0,1,3].forEach(i=>{const n=builders[i]();n.visible=objs[i].visible;scene.remove(objs[i]);objs[i]=n;scene.add(n);});
  });
  window.Culture3D={show};
  show(0);
})();
