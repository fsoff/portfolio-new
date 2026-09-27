const host=document.querySelector('[data-model-viewer]');
if(host) initialise();
async function initialise(){
 const status=host.querySelector('.model-status');
 const buttons=[...document.querySelectorAll('.model-controls button')];buttons.forEach(b=>b.disabled=true);
 try{
  const THREE=await import('./assets/vendor/three.module.js');
  const {OBJLoader}=await import('./assets/vendor/OBJLoader.js');
  const {OrbitControls}=await import('./assets/vendor/OrbitControls.js');
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x050505);
  const camera=new THREE.PerspectiveCamera(35,1,.01,100);camera.position.set(2.4,.55,5.2);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x050505);renderer.domElement.setAttribute('aria-label','Three-dimensional view of Resting Diana');
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=2.5;controls.maxDistance=10;controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI-.2;controls.target.set(0,0,0);controls.update();controls.saveState();
  scene.add(new THREE.HemisphereLight(0xffffff,0x55504a,2.3));const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(4,6,5);scene.add(key);const rim=new THREE.DirectionalLight(0xdbe6ff,2.2);rim.position.set(-4,2,-4);scene.add(rim);
  const model=await new OBJLoader().loadAsync(new URL('./assets/diana.obj',import.meta.url).href);
  const bounds=new THREE.Box3().setFromObject(model);const centre=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const scale=3/Math.max(size.x,size.y,size.z);
  model.scale.setScalar(scale);model.position.copy(centre).multiplyScalar(-scale);
  model.traverse(node=>{if(node.isMesh){node.material=new THREE.MeshStandardMaterial({color:0xd5d0c5,roughness:.82,metalness:0,side:THREE.DoubleSide});if(!node.geometry.attributes.normal)node.geometry.computeVertexNormals();}});
  const pivot=new THREE.Group();pivot.add(model);scene.add(pivot);host.append(renderer.domElement);host.classList.add('model-ready');host.querySelector('.model-fallback').hidden=true;status.textContent='';status.hidden=true;
  const render=()=>renderer.render(scene,camera);controls.addEventListener('change',render);
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render()};new ResizeObserver(resize).observe(host);resize();
  const rotate=delta=>{pivot.rotation.y+=delta;render()};const zoom=factor=>{const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update();render()};const reset=()=>{pivot.rotation.set(0,0,0);controls.reset();render()};
  document.querySelector('[data-model-left]').addEventListener('click',()=>rotate(-Math.PI/12));document.querySelector('[data-model-right]').addEventListener('click',()=>rotate(Math.PI/12));document.querySelector('[data-model-zoom-in]').addEventListener('click',()=>zoom(.85));document.querySelector('[data-model-zoom-out]').addEventListener('click',()=>zoom(1.15));document.querySelector('[data-model-reset]').addEventListener('click',reset);buttons.forEach(b=>b.disabled=false);
  host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')rotate(-Math.PI/18);if(e.key==='ArrowRight')rotate(Math.PI/18);if(e.key==='ArrowUp'){pivot.rotation.x-=Math.PI/36;render()}if(e.key==='ArrowDown'){pivot.rotation.x+=Math.PI/36;render()}if(e.key==='+'||e.key==='=')zoom(.85);if(e.key==='-')zoom(1.15);if(e.key==='Home')reset();}});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='The 3D view was interrupted. Reload the page to restore it.';host.querySelector('.model-fallback').hidden=false;});
 }catch(error){status.hidden=false;status.textContent='The interactive 3D view could not load in this browser. The sculpture photograph remains available.';buttons.forEach(b=>b.disabled=true);console.error('Sculpture viewer:',error);}
}
