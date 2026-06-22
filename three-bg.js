/* ==========================================================================
   THREE.JS INTERACTIVE 3D BACKGROUND
   Creates a smooth, floating particle storm that responds to mouse cursor.
   ========================================================================== */

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function initThree() {
  const container = document.getElementById('canvas3d');
  if (!container) return;

  // 1. Create Scene & Camera
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05050a, 0.0015);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;

  // 2. Generate Custom Glow Texture for particles (circular gradient)
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 16;
  pCanvas.height = 16;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
  grad.addColorStop(0.6, 'rgba(124, 58, 237, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 16, 16);
  const pTexture = new THREE.CanvasTexture(pCanvas);

  // 3. Create Particle System
  // Optimize count based on device performance (mobile vs desktop)
  const particleCount = window.innerWidth < 768 ? 400 : 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const randomSpeed = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Distribute particles in a spherical/cloud structure
    positions[i] = (Math.random() - 0.5) * 1000;
    positions[i + 1] = (Math.random() - 0.5) * 1000;
    positions[i + 2] = (Math.random() - 0.5) * 1000;
    randomSpeed[i / 3] = Math.random() * 0.5 + 0.1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    map: pTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.8
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 4. Setup Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: container,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 5. Event Listeners
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);

  // Start loop
  animate();
}

function onDocumentMouseMove(event) {
  // Normalize coordinates relative to window center
  mouseX = (event.clientX - windowHalfX) * 0.3;
  mouseY = (event.clientY - windowHalfY) * 0.3;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse interpolation (lerp)
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  // Gentle background auto-rotation
  particles.rotation.y += 0.0008;
  particles.rotation.x += 0.0003;

  // Interactive camera rotation following mouse
  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (-targetY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

// Initialise when script is loaded
window.addEventListener('DOMContentLoaded', initThree);
