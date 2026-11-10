import * as THREE from 'three';

const $ = (id) => document.getElementById(id);
const canvas = $('world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d1b1d);
scene.fog = new THREE.FogExp2(0x201e20, 0.019);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 8.4, 10.5);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.38;
scene.add(new THREE.HemisphereLight(0xc9d1df, 0x3b302b, 1.9));
const moon = new THREE.DirectionalLight(0xc8d4ed, 3.1);
moon.position.set(-7, 13, 5); moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.left = -17; moon.shadow.camera.right = 17;
moon.shadow.camera.top = 18; moon.shadow.camera.bottom = -18; moon.shadow.bias = -0.0007;
scene.add(moon);
const warm = new THREE.PointLight(0xff9f61, 18, 12, 2); warm.position.set(2.2, 2.5, -4.5); scene.add(warm);
const world = new THREE.Group(); scene.add(world);
const mat = (color, roughness = .85, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const stone = mat(0x414044), stoneLight = mat(0x625a58), darkStone = mat(0x302e31), gold = mat(0x9a7950, .45, .55);
const groundMat = mat(0x353336), moss = mat(0x34392f), cloth = mat(0x29232a), white = mat(0xe4ddd0), skin = mat(0xe0c2aa), hair = mat(0x272027), metal = mat(0x6f7077, .33, .72), red = mat(0x572d2d);
const boxGeo = new THREE.BoxGeometry(1,1,1);
function box(parent, material, x,y,z,sx,sy,sz, cast=true){const o=new THREE.Mesh(boxGeo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=cast;o.receiveShadow=true;parent.add(o);return o;}
function sphere(parent,material,x,y,z,sx,sy,sz){const o=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cylinder(parent,material,x,y,z,r1,r2,h,segments=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function torus(parent,material,x,y,z,r,t,rx=Math.PI/2){const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,32),material);o.position.set(x,y,z);o.rotation.x=rx;o.castShadow=true;parent.add(o);return o;}

// A moonlit, enclosed courtyard: flagstones, ruined cloisters, lanterns and a sealed arch.
box(world,groundMat,0,-.34,0,26,.55,30,false);
for(let x=-12;x<=12;x+=2) for(let z=-13;z<=13;z+=2){
  const tile=box(world,(Math.abs(x+z)%4===0)?stone:darkStone,x,-.035,z,1.94,.11,1.94,false);
  tile.position.y=-.12 + ((Math.sin(x*4+z*2)*.018));
  if(Math.abs(x)>8 || z<-8){ if((Math.floor(x+z)&3)===0) box(world,moss,x+.3,-.05,z+.25,.38,.04,.28,false); }
}
// side walls and broken parapets
box(world,darkStone,-12,.5,0,.8,2,27); box(world,darkStone,12,.5,0,.8,2,27);
for(let side of [-1,1]){
  for(let z=-10;z<=10;z+=4){
    box(world,stoneLight,side*10.4,1.05,z,1.05,2.1,1.05);
    box(world,stone,side*10.4,2.2,z,.2,.26,1.2);
    // small warm lanterns on the inner face
    const lamp=cylinder(world,gold,side*9.75,1.45,z,.12,.17,.34,8);
    const flame=sphere(world,new THREE.MeshBasicMaterial({color:0xffa45d}),side*9.68,1.75,z,.12,.17,.12);
    const glow=new THREE.PointLight(0xff914a,7,5,2);glow.position.set(side*9.6,1.85,z);world.add(glow);
  }
  for(let z=-12;z<=12;z+=2.6){
    const rubble=box(world,stone,side*(8.4+Math.random()*1.1),-.02,z+(Math.random()-.5),.5+Math.random()*.6,.35,.45+Math.random()*.5);
    rubble.rotation.y=Math.random()*1.3;
  }
}
// Far wall, open archway sealed by spectral iron lattice.
box(world,darkStone,0,1.7,-13,25,4,1.1);
for(let side of [-1,1]){
 box(world,stoneLight,side*2.35,2.2,-12.1,.65,4.4,1.25);
 box(world,stone,side*2.35,4.45,-12.1,.95,.48,1.6);
 box(world,gold,side*2.35,2.35,-11.42,.09,3.8,.08);
}
box(world,stoneLight,0,4.25,-12.1,4.5,.4,1.3);
const gate=new THREE.Group();world.add(gate);
const gateMat=new THREE.MeshStandardMaterial({color:0x9d6352,emissive:0x351114,emissiveIntensity:1.2,metalness:.65,roughness:.35,transparent:true,opacity:.88});
for(let x=-1.85;x<=1.9;x+=.62) box(gate,gateMat,x,1.8,-11.75,.075,3.4,.11);
for(let y=.4;y<3.1;y+=.8) box(gate,gateMat,0,y,-11.75,3.8,.07,.12);
// Carved broken columns, gravestones and little flower lights.
for(let i=0;i<8;i++){
 let x=(i%2?1:-1)*(4.3+Math.random()*3),z=-9.6+Math.floor(i/2)*5.5;
 cylinder(world,stone,x,.45,z,.35,.5,.9,8); cylinder(world,stoneLight,x,.95,z,.48,.38,.18,8);
 const rune=sphere(world,new THREE.MeshBasicMaterial({color:0x9a6570}),x,.9,z,.07,.07,.07);
}
// checkpoint shrine
const shrine=new THREE.Group();shrine.position.set(0,0,-10.25);world.add(shrine);
cylinder(shrine,stoneLight,0,.25,0,.75,.9,.5,8);cylinder(shrine,gold,0,.58,0,.55,.65,.16,8);
torus(shrine,gold,0,.8,0,.42,.035); const shrineFlame=sphere(shrine,new THREE.MeshBasicMaterial({color:0xffd69a}),0,1.2,0,.17,.3,.17);
const shrineLight=new THREE.PointLight(0xffbd75,13,8,2);shrineLight.position.set(0,1.35,0);shrine.add(shrineLight);
// A few floor inlays guide the eye toward the arch.
for(let z=8;z>-10;z-=2){torus(world,gold,0,-.02,z,.34,.018);}

// Handmade stylized character models from primitive geometry.
function makeMaid(){
 const g=new THREE.Group();
 const body=new THREE.Group();g.add(body);
 cylinder(body,cloth,0,.98,0,.32,.23,.55,12);
 const skirt=cylinder(body,white,0,.66,0,.53,.27,.55,16); skirt.material=white;
 // dark underskirt hem
 cylinder(body,cloth,0,.42,0,.48,.46,.12,16);
 // white apron, bib and pleated front panel
 box(body,white,0,.76,-.3,.38,.49,.055);
 box(body,white,0,1.18,-.03,.39,.39,.28);
 const collar=cylinder(body,white,0,1.38,0,.16,.2,.12,12);
 // head, hair and maid headband
 sphere(body,skin,0,1.67,-.025,.25,.29,.24);
 sphere(body,hair,0,1.82,.015,.27,.24,.25);
 sphere(body,hair,-.2,1.68,.03,.1,.2,.15); sphere(body,hair,.2,1.68,.03,.1,.2,.15);
 // tiny eyes visible from the front (-Z)
 sphere(body,mat(0x38252a,.4),-.09,1.68,-.238,.025,.035,.015);sphere(body,mat(0x38252a,.4),.09,1.68,-.238,.025,.035,.015);
 torus(body,white,0,1.91,-.01,.22,.045);
 sphere(body,white,-.25,1.92,-.01,.09,.07,.07);sphere(body,white,.25,1.92,-.01,.09,.07,.07);
 // arms and gloves
 const left=new THREE.Group();left.position.set(-.34,1.18,0);body.add(left);cylinder(left,white,0,-.14,0,.1,.1,.38,8).rotation.z=-.42;sphere(left,skin,-.08,-.32,-.02,.1,.09,.1);
 const arm=new THREE.Group();arm.position.set(.34,1.2,0);body.add(arm);cylinder(arm,white,0,-.14,0,.11,.095,.38,8).rotation.z=.42;
 sphere(arm,skin,.08,-.32,-.02,.1,.09,.1);
 // short silver service blade
 const blade=new THREE.Group();blade.position.set(.1,-.38,-.04);arm.add(blade);
 cylinder(blade,gold,0,-.05,0,.045,.045,.17,8);
 const sword=cylinder(blade,metal,0,-.31,0,.045,.012,.48,6);sword.rotation.x=Math.PI/2;
 const edge=box(blade,mat(0xd7d8d1,.2,.8),0,-.31,-.035,.035,.45,.025);edge.rotation.z=0;
 sphere(blade,mat(0x8fd6da,.2,.4),0,-.04,-.03,.09,.09,.08);
 // legs and shoes
 for(let s of [-1,1]){cylinder(body,cloth,s*.18,.24,0,.11,.1,.32,8);sphere(body,mat(0x171619),s*.18,.08,-.075,.14,.08,.23);}
 const aura=new THREE.PointLight(0xb0cad4,1.5,2.2,2);aura.position.set(0,1.5,.4);g.add(aura);
 g.userData={body,arm,blade,skirt,baseY:0};return g;
}
function makeWarden(boss=true){
 const g=new THREE.Group();const armor=mat(boss?0x35383d:0x4b3938,.55,.38),edge=mat(0x8b7b68,.35,.6),glowmat=new THREE.MeshStandardMaterial({color:0xc34c42,emissive:0x8c1f24,emissiveIntensity:2});
 cylinder(g,armor,0,1.12,0,boss?.48:.35,boss?.4:.3,1.1,10);
 const head=sphere(g,armor,0,1.95,0,.35,.42,.32);
 // crown/helm and ember eyes
 box(g,edge,0,2.22,0,boss?.64:.48,.13,.48);
 for(let s of [-1,1]){const horn=cylinder(g,edge,s*.27,2.45,0,.05,.16,.5,6);horn.rotation.z=-s*.48;sphere(g,glowmat,s*.13,1.98,-.28,.07,.045,.035);
  cylinder(g,armor,s*.54,1.38,0,.17,.13,.58,8).rotation.z=-s*.16;
  cylinder(g,armor,s*.2,.48,0,.17,.13,.58,8);
 }
 // enormous cleaver in right hand
 const weapon=new THREE.Group();weapon.position.set(.78,1.42,-.08);g.add(weapon);
 cylinder(weapon,edge,0,-.4,0,.055,.05,.95,8);
 const blade=box(weapon,edge,0,-1.03,-.02,boss?.62:.44,.7,.13);blade.rotation.z=.12;
 box(weapon,glowmat,0,-1.03,-.095,.4,.06,.025);
 const aura=new THREE.PointLight(0xb83c3b,boss?3:1.5,3,2);aura.position.set(0,1.8,-.4);g.add(aura);
 g.userData={weapon,glowmat,armor,baseY:0};return g;
}
const player=makeMaid();player.position.set(0,0,8);world.add(player);
const enemies=[];
function addEnemy(x,z,boss=false){const model=makeWarden(boss);model.position.set(x,0,z);world.add(model);const e={model,x,z,boss,hp:boss?8:3,maxHp:boss?8:3,alive:true,aggro:false,attackTimer:0,attackWind:0,stagger:0,hitCd:0,phase:Math.random()*6};enemies.push(e);return e;}
addEnemy(-3.2,2.2,false);addEnemy(3.4,-.2,false);
const boss=addEnemy(0,-4.6,true);

const state={hp:100,stamina:100,embers:0,attackCd:0,attackTime:0,dodge:0,dodgeCd:0,iframes:0,dead:false,deadTimer:0,checkpoint:new THREE.Vector3(0,0,8),bossWon:false,completed:false,restUsed:false,moveX:0,moveZ:0,toastTimer:0,shake:0};
const keys=new Set();
const down=(...k)=>k.some(x=>keys.has(x));
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='Space'||e.code==='KeyJ')attack();if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyK')dodge();if(e.code==='KeyE'||e.code==='Enter')interact();});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>keys.clear());

// Touch stick is analog; action pads are deliberately large and work with one thumb.
const stickZone=$('stick-zone'), stickKnob=$('stick-knob');let stickPointer=null,stickOrigin={x:0,y:0};
function setStick(e){const dx=e.clientX-stickOrigin.x,dy=e.clientY-stickOrigin.y,len=Math.hypot(dx,dy),max=31,scale=len>max?max/len:1;state.moveX=dx*scale/max;state.moveZ=dy*scale/max;stickKnob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
stickZone.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stickZone.setPointerCapture(e.pointerId);const r=stickZone.getBoundingClientRect();stickOrigin={x:r.left+r.width/2,y:r.top+r.height/2};setStick(e);});
stickZone.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)setStick(e);});
function releaseStick(e){if(e.pointerId!==stickPointer)return;stickPointer=null;state.moveX=state.moveZ=0;stickKnob.style.transform='translate(0,0)';}
stickZone.addEventListener('pointerup',releaseStick);stickZone.addEventListener('pointercancel',releaseStick);
$('attack-btn').addEventListener('pointerdown',e=>{e.preventDefault();attack();});$('dodge-btn').addEventListener('pointerdown',e=>{e.preventDefault();dodge();});$('interact-btn').addEventListener('pointerdown',e=>{e.preventDefault();interact();});

function showToast(text,duration=2500){$('toast-text').textContent=text;$('toast').classList.add('show');state.toastTimer=duration;}
let audio=null,mute=true;
$('sound-toggle').addEventListener('click',()=>{mute=!mute;$('sound-toggle').innerHTML=mute?'♫ <span>SOUND</span>':'♫ <span>ON</span>';if(!mute){audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();playTone(196,.12,.02);}});
function playTone(freq=220,dur=.08,vol=.035){if(mute||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+dur);}

const particles=[];
function burst(pos,color=0xe5bd78,count=12,power=2){for(let i=0;i<count;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.035,6,6),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9}));m.position.copy(pos);world.add(m);particles.push({m,v:new THREE.Vector3((Math.random()-.5)*power,Math.random()*power*.8,(Math.random()-.5)*power),life:.45+Math.random()*.55,max:1});}}
const motes=[];
for(let i=0;i<48;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.025,6,6),new THREE.MeshBasicMaterial({color:i%4===0?0xffbd72:0x9ca9a5,transparent:true,opacity:.35+Math.random()*.35}));m.position.set((Math.random()-.5)*18,.3+Math.random()*4,-13+Math.random()*26);world.add(m);motes.push({m,phase:Math.random()*6,speed:.2+Math.random()*.4});}

function attack(){if(state.dead||state.attackCd>0||state.dodge>0)return;state.attackCd=.42;state.attackTime=.3;player.userData.arm.rotation.x=-.2;playTone(330,.07,.025);
 const forward=new THREE.Vector3(0,0,-1).applyQuaternion(player.quaternion);
 let hits=0;
 for(const e of enemies){if(!e.alive)continue;const dx=e.model.position.x-player.position.x,dz=e.model.position.z-player.position.z,dist=Math.hypot(dx,dz);const dot=(dx*forward.x+dz*forward.z)/(dist||1);if(dist<(e.boss?2.45:2.2)&&dot>-.22){damageEnemy(e,1);hits++;}}
 // quick, clean silver arc on the blade
 if(hits===0)burst(player.position.clone().add(new THREE.Vector3(0,1.05,-.65).applyQuaternion(player.quaternion)),0xd6e8ed,5,1.2);
}
function damageEnemy(e,amount){if(!e.alive)return;e.hp=Math.max(0,e.hp-amount);e.stagger=.32;e.hitCd=.18;e.model.userData.glowmat.emissiveIntensity=3.8;state.shake=.1;burst(e.model.position.clone().add(new THREE.Vector3(0,1.5,0)),e.boss?0xe67868:0xc2b7a3,10,2.6);playTone(e.boss?145:185,.1,.045);
 if(e.boss){$('boss-fill').style.width=`${e.hp/e.maxHp*100}%`;}
 if(e.hp<=0){e.alive=false;e.model.visible=false;state.embers+=e.boss?30:8;$('soul-count').textContent=state.embers;burst(e.model.position.clone().add(new THREE.Vector3(0,1,0)),e.boss?0xffa45d:0xc9a775,30,3.8);
  if(e.boss){state.bossWon=true;state.bossWonAt=performance.now();gate.visible=false;showToast('The Veil Key is yours. The northern arch is open.',4300);$('objective-text').textContent='Pass through the northern arch';setTimeout(()=>{if(!state.dead)$('boss-hud').classList.remove('visible');},2200);}
  else showToast('Warden silenced  ·  +8 ember',1700);
 }
}
function dodge(){if(state.dead||state.dodgeCd>0||state.stamina<28)return;state.stamina-=28;state.dodge=.42;state.dodgeCd=.56;state.iframes=.34;playTone(420,.09,.024);burst(player.position.clone().add(new THREE.Vector3(0,.8,0)),0xb4c4c6,7,1.3);}
function hurt(dmg){if(state.iframes>0||state.dead)return;state.hp=Math.max(0,state.hp-dmg);state.iframes=.65;state.shake=.22;playTone(80,.22,.07);burst(player.position.clone().add(new THREE.Vector3(0,1,0)),0xb74342,14,2.2);if(state.hp<=0){state.dead=true;state.deadTimer=1.8;$('center-message').classList.add('visible');}}

function interact(){if(state.dead)return;const d=player.position.distanceTo(shrine.position);if(d<2.1){if(!state.bossWon){showToast('The shrine is beyond a veil you cannot yet pass.',2000);return;}state.hp=100;state.stamina=100;state.checkpoint.set(shrine.position.x,0,shrine.position.z+1.5);state.restUsed=true;showToast('Rested at the last light. Vitality restored.',2700);playTone(523,.22,.035);if(!state.completed){state.completed=true;$('objective-text').textContent='The house is quiet—for now';setTimeout(()=>showToast('CHAPTER COMPLETE  ·  The Hollow House remembers you.',4500),900);}return;}showToast('Nothing answers from here.',1100);}
function setHUD(){const hp=Math.max(0,state.hp),st=Math.max(0,state.stamina);$('hp-fill').style.width=`${hp}%`;$('hp-text').textContent=`${Math.ceil(hp)} / 100`;$('st-fill').style.width=`${st}%`;$('st-text').textContent=`${Math.ceil(st)}`;}

const clock=new THREE.Clock();let elapsed=0;
function update(dt){elapsed+=dt;
 if(state.toastTimer>0){state.toastTimer-=dt*1000;if(state.toastTimer<=0)$('toast').classList.remove('show');}
 if(state.shake>0)state.shake=Math.max(0,state.shake-dt);
 for(const m of motes){m.phase+=dt*m.speed;m.m.position.y+=Math.sin(m.phase)*dt*.12;m.m.position.x+=Math.cos(m.phase*.7)*dt*.045;}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.m.position.addScaledVector(p.v,dt);p.v.y-=2.2*dt;p.m.material.opacity=Math.max(0,p.life);p.m.scale.setScalar(Math.max(.05,p.life));if(p.life<=0){world.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();particles.splice(i,1);}}
 if(state.dead){state.deadTimer-=dt;if(state.deadTimer<=0){state.dead=false;$('center-message').classList.remove('visible');state.hp=100;state.stamina=100;player.position.copy(state.checkpoint);player.position.x+=.6;state.iframes=1.2;showToast('The last light takes you in.',1800);}setHUD();return;}
 const kx=(down('KeyD','ArrowRight')?1:0)-(down('KeyA','ArrowLeft')?1:0),kz=(down('KeyS','ArrowDown')?1:0)-(down('KeyW','ArrowUp')?1:0);
 let mx=kx+state.moveX,mz=kz+state.moveZ;const ml=Math.hypot(mx,mz);if(ml>1){mx/=ml;mz/=ml;}
 state.attackCd=Math.max(0,state.attackCd-dt);state.attackTime=Math.max(0,state.attackTime-dt);state.dodgeCd=Math.max(0,state.dodgeCd-dt);state.dodge=Math.max(0,state.dodge-dt);state.iframes=Math.max(0,state.iframes-dt);
 state.stamina=Math.min(100,state.stamina+dt*(state.dodge>0?0:20));
 let speed=4.2;if(state.dodge>0)speed=11;
 if(ml>.08){let dx=mx,dz=mz;if(state.dodge>0){dx=mx||0;dz=mz||-1;}player.position.x+=dx*speed*dt;player.position.z+=dz*speed*dt;const targetYaw=Math.atan2(-dx,-dz);player.rotation.y=THREE.MathUtils.dampAngle(player.rotation.y,targetYaw,12,dt);}
 player.position.x=THREE.MathUtils.clamp(player.position.x,-9.6,9.6);player.position.z=THREE.MathUtils.clamp(player.position.z,-12.1,10.8);
 // The spectral lattice is impassable until its warden falls.
 if(!state.bossWon&&player.position.z<-7.15&&Math.abs(player.position.x)<2.05)player.position.z=-7.15;
 const moving=ml>.08;player.userData.body.position.y=moving?Math.sin(elapsed*13)*.045:Math.sin(elapsed*2)*.018;
 player.userData.body.rotation.z= moving?Math.sin(elapsed*13)*.035:0;
 player.userData.arm.rotation.x=state.attackTime>0?-Math.sin((state.attackTime/.3)*Math.PI)*1.5:THREE.MathUtils.damp(player.userData.arm.rotation.x,0,12,dt);
 player.userData.blade.rotation.z=state.attackTime>0?-Math.sin((state.attackTime/.3)*Math.PI)*.9:THREE.MathUtils.damp(player.userData.blade.rotation.z,0,12,dt);
 player.visible=state.iframes<=0||Math.floor(elapsed*18)%2===0;
 const nearShrine=player.position.distanceTo(shrine.position)<2.1;
 $('interact-hint').classList.toggle('visible',nearShrine);$('interact-btn').style.opacity=nearShrine?'1':'.62';
 for(const e of enemies){if(!e.alive)continue;const p=e.model.position,dx=player.position.x-p.x,dz=player.position.z-p.z,dist=Math.hypot(dx,dz);if(e.boss&&dist<8)e.aggro=true;if(!e.boss&&dist<5.4)e.aggro=true;
  if(e.boss&&e.aggro)$('boss-hud').classList.add('visible');
  e.hitCd=Math.max(0,e.hitCd-dt);e.stagger=Math.max(0,e.stagger-dt);e.attackTimer=Math.max(0,e.attackTimer-dt);
  if(e.stagger>0){e.model.userData.armor.emissive.setHex(0x592222);continue;}else e.model.userData.armor.emissive.setHex(0x000000);
  e.model.position.y=Math.sin(elapsed*2.7+e.phase)*.035;
  if(e.aggro&&dist>1.45){const s=e.boss?1.05:1.28;p.x+=dx/dist*s*dt;p.z+=dz/dist*s*dt;e.model.rotation.y=Math.atan2(-dx,-dz);}
  if(e.aggro&&dist<1.65&&e.attackTimer<=0&&e.attackWind<=0)e.attackWind=e.boss?.95:.72;
  if(e.attackWind>0){e.attackWind-=dt;e.model.userData.weapon.rotation.x=-.65*Math.sin((1-e.attackWind/(e.boss?.95:.72))*Math.PI);if(e.attackWind<=0){e.attackTimer=e.boss?1.5:1.9;if(dist<1.95)hurt(e.boss?17:11);}}
  else e.model.userData.weapon.rotation.x=THREE.MathUtils.damp(e.model.userData.weapon.rotation.x,0,7,dt);
 }
 // Camera trails the maid and frames a little more of the route on mobile.
 const target=new THREE.Vector3(player.position.x*.42,0,player.position.z-2.0);
 const camTarget=new THREE.Vector3(target.x,1.0,target.z);
 const cameraPos=new THREE.Vector3(target.x,8.4,target.z+11.6);
 if(window.innerWidth<700){cameraPos.y=9.5;cameraPos.z+=1.4;}
 camera.position.lerp(cameraPos,1-Math.exp(-dt*2.4));camera.lookAt(camTarget);
 if(state.shake>0){camera.position.x+=(Math.random()-.5)*state.shake;camera.position.y+=(Math.random()-.5)*state.shake;}
 shrineFlame.scale.y=.25+Math.sin(elapsed*4)*.06;shrineLight.intensity=11+Math.sin(elapsed*3)*2;
 warm.intensity=15+Math.sin(elapsed*2.5)*2;
 setHUD();
}
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<700?43:36;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);resize();
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04);update(dt);renderer.render(scene,camera);}

// Let Three.js settle for the first frame; the game begins immediately, no menu wall.
showToast('Find the Veil Key. The courtyard is not empty.',3400);
setTimeout(()=>{$('loading').classList.add('done');},350);
frame();
