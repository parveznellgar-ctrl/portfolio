/* ==========================================================================
   THREE.JS NEON BLUE CYBER BACKGROUND
   Deep space with neon cyan & purple particles + 3D floating objects
   ========================================================================== */

let scene, camera, renderer, particles, particles2;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// 3D Object references
let torusKnot, icosahedron, octahedron1, octahedron2, wireframeSphere, floatingCube;
let objects3D = [];
let time = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function initThree() {
  const container = document.getElementById('canvas3d');
  if (!container) return;

  // 1. Scene & Camera
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020b18, 0.0009);
  scene.background = new THREE.Color(0x020b18);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 600;

  // 2. Neon CYAN particle texture
  const makeTexture = (r, g, b) => {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0,   `rgba(255,255,255,1)`);
    grad.addColorStop(0.2, `rgba(${r},${g},${b},0.95)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.4)`);
    grad.addColorStop(1,   `rgba(0,0,0,0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  };

  const cyanTex   = makeTexture(0, 212, 255);   // neon cyan
  const purpleTex = makeTexture(123, 47, 255);  // neon purple
  const whiteTex  = makeTexture(180, 220, 255); // cool white-blue

  // 3. Main cyan particle cloud
  const count1 = window.innerWidth < 768 ? 600 : 1600;
  const geo1 = new THREE.BufferGeometry();
  const pos1 = new Float32Array(count1 * 3);
  for (let i = 0; i < count1 * 3; i += 3) {
    pos1[i]     = (Math.random() - 0.5) * 1400;
    pos1[i + 1] = (Math.random() - 0.5) * 1400;
    pos1[i + 2] = (Math.random() - 0.5) * 900;
  }
  geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
  const mat1 = new THREE.PointsMaterial({
    size: 5,
    map: cyanTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.85
  });
  particles = new THREE.Points(geo1, mat1);
  scene.add(particles);

  // 4. Secondary purple/violet particles
  const count2 = window.innerWidth < 768 ? 300 : 700;
  const geo2 = new THREE.BufferGeometry();
  const pos2 = new Float32Array(count2 * 3);
  for (let i = 0; i < count2 * 3; i += 3) {
    pos2[i]     = (Math.random() - 0.5) * 1200;
    pos2[i + 1] = (Math.random() - 0.5) * 1200;
    pos2[i + 2] = (Math.random() - 0.5) * 800;
  }
  geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
  const mat2 = new THREE.PointsMaterial({
    size: 4,
    map: purpleTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.6
  });
  particles2 = new THREE.Points(geo2, mat2);
  scene.add(particles2);

  // 5. Star field (small cool-white dots far back)
  const countS = 500;
  const geoS = new THREE.BufferGeometry();
  const posS = new Float32Array(countS * 3);
  for (let i = 0; i < countS * 3; i += 3) {
    posS[i]     = (Math.random() - 0.5) * 2000;
    posS[i + 1] = (Math.random() - 0.5) * 2000;
    posS[i + 2] = (Math.random() - 0.5) * 500 - 300;
  }
  geoS.setAttribute('position', new THREE.BufferAttribute(posS, 3));
  const matS = new THREE.PointsMaterial({
    size: 2.5,
    map: whiteTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.5
  });
  const stars = new THREE.Points(geoS, matS);
  scene.add(stars);

  // ============================================================
  // 6. 3D FLOATING GEOMETRIC OBJECTS
  // ============================================================

  // Helper: Create glowing wireframe material
  const makeWireMat = (color, opacity = 0.7) => new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: opacity
  });

  // Helper: Create solid glowing material
  const makeGlowMat = (color, opacity = 0.18) => new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  // -- A) TORUS KNOT (Hero right side) --
  const tkGeo = new THREE.TorusKnotGeometry(55, 14, 120, 18, 2, 3);
  // Solid inner glow
  const tkSolid = new THREE.Mesh(tkGeo, makeGlowMat(0x00d4ff, 0.08));
  // Wireframe outer
  const tkWire = new THREE.Mesh(tkGeo, makeWireMat(0x00d4ff, 0.55));
  torusKnot = new THREE.Group();
  torusKnot.add(tkSolid);
  torusKnot.add(tkWire);
  torusKnot.position.set(window.innerWidth < 768 ? 0 : 320, 30, -100);
  scene.add(torusKnot);
  objects3D.push({ mesh: torusKnot, speedY: 0.004, speedX: 0.002, floatAmp: 18, floatSpeed: 1.1, floatOffset: 0 });

  // -- B) LARGE ICOSAHEDRON (Left floating) --
  const icoGeo = new THREE.IcosahedronGeometry(65, 1);
  const icoSolid = new THREE.Mesh(icoGeo, makeGlowMat(0x7b2fff, 0.1));
  const icoWire = new THREE.Mesh(icoGeo, makeWireMat(0x7b2fff, 0.45));
  icosahedron = new THREE.Group();
  icosahedron.add(icoSolid);
  icosahedron.add(icoWire);
  icosahedron.position.set(-340, -60, -180);
  scene.add(icosahedron);
  objects3D.push({ mesh: icosahedron, speedY: -0.003, speedX: 0.0015, floatAmp: 22, floatSpeed: 0.8, floatOffset: 1.2 });

  // -- C) SMALL OCTAHEDRON (Top-right) --
  const oct1Geo = new THREE.OctahedronGeometry(38, 0);
  const oct1Solid = new THREE.Mesh(oct1Geo, makeGlowMat(0x00d4ff, 0.12));
  const oct1Wire = new THREE.Mesh(oct1Geo, makeWireMat(0x00ffcc, 0.6));
  octahedron1 = new THREE.Group();
  octahedron1.add(oct1Solid);
  octahedron1.add(oct1Wire);
  octahedron1.position.set(260, 180, -250);
  scene.add(octahedron1);
  objects3D.push({ mesh: octahedron1, speedY: 0.005, speedX: -0.003, floatAmp: 14, floatSpeed: 1.5, floatOffset: 2.5 });

  // -- D) MEDIUM OCTAHEDRON (Bottom-left) --
  const oct2Geo = new THREE.OctahedronGeometry(50, 1);
  const oct2Solid = new THREE.Mesh(oct2Geo, makeGlowMat(0xff6b35, 0.08));
  const oct2Wire = new THREE.Mesh(oct2Geo, makeWireMat(0x7b2fff, 0.4));
  octahedron2 = new THREE.Group();
  octahedron2.add(oct2Solid);
  octahedron2.add(oct2Wire);
  octahedron2.position.set(-180, -220, -150);
  scene.add(octahedron2);
  objects3D.push({ mesh: octahedron2, speedY: -0.004, speedX: 0.002, floatAmp: 25, floatSpeed: 0.65, floatOffset: 4.1 });

  // -- E) WIREFRAME SPHERE (Center-background subtle) --
  const sphereGeo = new THREE.SphereGeometry(90, 16, 12);
  wireframeSphere = new THREE.Mesh(sphereGeo, makeWireMat(0x00d4ff, 0.08));
  wireframeSphere.position.set(0, 0, -400);
  scene.add(wireframeSphere);
  objects3D.push({ mesh: wireframeSphere, speedY: 0.0015, speedX: 0.0008, floatAmp: 8, floatSpeed: 0.4, floatOffset: 6 });

  // -- F) FLOATING TETRAHEDRON (far right, small) --
  const tetraGeo = new THREE.TetrahedronGeometry(30, 0);
  const tetraSolid = new THREE.Mesh(tetraGeo, makeGlowMat(0x00d4ff, 0.15));
  const tetraWire = new THREE.Mesh(tetraGeo, makeWireMat(0x00ffff, 0.65));
  floatingCube = new THREE.Group();
  floatingCube.add(tetraSolid);
  floatingCube.add(tetraWire);
  floatingCube.position.set(400, -120, -200);
  scene.add(floatingCube);
  objects3D.push({ mesh: floatingCube, speedY: 0.006, speedX: 0.004, floatAmp: 16, floatSpeed: 1.8, floatOffset: 3.3 });

  // 7. Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: container,
    alpha: false,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x020b18, 1);

  // 8. Events
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);

  animate();
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 0.25;
  mouseY = (event.clientY - windowHalfY) * 0.25;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  targetX += (mouseX - targetX) * 0.04;
  targetY += (mouseY - targetY) * 0.04;

  // Cyan particles rotate one way
  particles.rotation.y  += 0.0006;
  particles.rotation.x  += 0.0002;

  // Purple particles counter-rotate for depth
  particles2.rotation.y -= 0.0004;
  particles2.rotation.z += 0.0003;

  // Subtle breathing pulsation
  particles.material.opacity  = 0.75 + Math.sin(time * 0.25) * 0.1;
  particles2.material.opacity = 0.45 + Math.sin(time * 0.19 + 1) * 0.1;

  // ============================================================
  // Animate 3D Geometric Objects
  // ============================================================
  objects3D.forEach(obj => {
    // Self-rotation
    obj.mesh.rotation.y += obj.speedY;
    obj.mesh.rotation.x += obj.speedX;

    // Floating up-down sine wave
    obj.mesh.position.y += Math.sin(time * obj.floatSpeed * 0.125 + obj.floatOffset) * 0.12 * obj.floatAmp * 0.015;

    // Mouse parallax — gentle push
    obj.mesh.position.x += (targetX * 0.015 - obj.mesh.position.x * 0.001) * 0.01;
  });

  // Torus knot gets a breathing scale pulse
  if (torusKnot) {
    const pulse = 1 + Math.sin(time * 0.18) * 0.035;
    torusKnot.scale.setScalar(pulse);
  }

  // Wireframe sphere slow breathe
  if (wireframeSphere) {
    const sphPulse = 1 + Math.sin(time * 0.12 + 1.5) * 0.06;
    wireframeSphere.scale.setScalar(sphPulse);
  }

  camera.position.x += (targetX - camera.position.x) * 0.04;
  camera.position.y += (-targetY - camera.position.y) * 0.04;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', initThree);
