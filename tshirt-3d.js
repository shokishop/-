// Simple 3D T-Shirt Animation for Hero Section
const canvas = document.getElementById('tshirt-canvas');

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true, 
    antialias: true 
  });

  // Get container size
  const container = canvas.parentElement;
  const size = Math.min(container.offsetWidth, container.offsetHeight);
  
  renderer.setSize(size, size);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create T-shirt shape
  const tshirtGroup = new THREE.Group();

  // Main body of t-shirt
  const bodyGeometry = new THREE.BoxGeometry(3, 4, 0.3);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xA761FF,
    metalness: 0.2,
    roughness: 0.7,
    emissive: 0xA761FF,
    emissiveIntensity: 0.1
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  tshirtGroup.add(body);

  // Left sleeve
  const leftSleeveGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.3);
  const sleeveMaterial = new THREE.MeshStandardMaterial({
    color: 0xA761FF,
    metalness: 0.2,
    roughness: 0.7,
    emissive: 0xA761FF,
    emissiveIntensity: 0.1
  });
  const leftSleeve = new THREE.Mesh(leftSleeveGeometry, sleeveMaterial);
  leftSleeve.position.set(-2.2, 1.5, 0);
  leftSleeve.rotation.z = 0.3;
  tshirtGroup.add(leftSleeve);

  // Right sleeve
  const rightSleeve = new THREE.Mesh(leftSleeveGeometry.clone(), sleeveMaterial.clone());
  rightSleeve.position.set(2.2, 1.5, 0);
  rightSleeve.rotation.z = -0.3;
  tshirtGroup.add(rightSleeve);

  // Collar/Neck area
  const collarGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
  const collarMaterial = new THREE.MeshStandardMaterial({
    color: 0x00C8FF,
    metalness: 0.3,
    roughness: 0.6,
    emissive: 0x00C8FF,
    emissiveIntensity: 0.1
  });
  const collar = new THREE.Mesh(collarGeometry, collarMaterial);
  collar.position.set(0, 2.2, 0);
  tshirtGroup.add(collar);

  scene.add(tshirtGroup);

  // Lighting setup
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xA761FF, 0.6);
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);

  const backLight = new THREE.PointLight(0x00C8FF, 1, 20);
  backLight.position.set(0, 0, -5);
  scene.add(backLight);

  const rimLight = new THREE.PointLight(0xFF6B9D, 0.8, 15);
  rimLight.position.set(3, 3, 3);
  scene.add(rimLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  camera.position.z = 8;
  camera.position.y = 0;

  // Mouse interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isHovering = false;

  // Mouse move handler
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    targetRotationY = mouseX * 0.8;
    targetRotationX = mouseY * 0.5;
    isHovering = true;
  });

  canvas.addEventListener('mouseleave', () => {
    isHovering = false;
    targetRotationX = 0;
    targetRotationY = 0;
  });

  // Touch support for mobile
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    
    targetRotationY = mouseX * 0.8;
    targetRotationX = mouseY * 0.5;
  });

  // Animation loop
  let autoRotation = 0;

  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation with lerp
    tshirtGroup.rotation.y += (targetRotationY - tshirtGroup.rotation.y) * 0.05;
    tshirtGroup.rotation.x += (targetRotationX - tshirtGroup.rotation.x) * 0.05;
    
    // Auto-rotate when not hovering
    if (!isHovering) {
      autoRotation += 0.005;
      tshirtGroup.rotation.y = Math.sin(autoRotation) * 0.3;
    }
    
    // Animate lights for dynamic effect
    const time = Date.now() * 0.001;
    backLight.position.x = Math.sin(time) * 3;
    backLight.position.z = Math.cos(time) * 3 - 5;
    
    rimLight.position.x = Math.cos(time * 0.7) * 4;
    rimLight.position.y = Math.sin(time * 0.5) * 2 + 2;
    
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    const newSize = Math.min(container.offsetWidth, container.offsetHeight);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(newSize, newSize);
  });

  // Scroll-based animation
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        tshirtGroup.position.y = -progress * 2;
        tshirtGroup.rotation.z = progress * Math.PI * 0.1;
        
        // Change color as you scroll
        const color1 = new THREE.Color(0xA761FF);
        const color2 = new THREE.Color(0x00C8FF);
        const color3 = new THREE.Color(0xFF6B9D);
        
        let currentColor;
        if (progress < 0.5) {
          currentColor = color1.clone().lerp(color2, progress * 2);
        } else {
          currentColor = color2.clone().lerp(color3, (progress - 0.5) * 2);
        }
        
        bodyMaterial.color = currentColor;
        sleeveMaterial.color = currentColor;
      }
    });
  }
                                             }
