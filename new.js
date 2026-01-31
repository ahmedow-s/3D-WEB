import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

/* =======================
   SCENE
======================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f19);
scene.fog = new THREE.Fog(0x0b0f19, 6, 25);

/* =======================
   CAMERA
======================= */
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 6);

/* =======================
   RENDERER
======================= */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

/* =======================
   CONTROLS
======================= */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 10;

/* =======================
   LIGHTS
======================= */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(6, 8, 5);
scene.add(dirLight);

const rimLight = new THREE.PointLight(0x00ffff, 1.5, 15);
rimLight.position.set(-4, 2, -3);
scene.add(rimLight);

/* =======================
   POSTPROCESSING
======================= */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.9,
  0.6,
  0.85
);
composer.addPass(bloomPass);

/* =======================
   GROUND
======================= */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({
    color: 0x05080f,
    roughness: 0.85,
    metalness: 0.2,
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.6;
scene.add(ground);

/* =======================
   CITY
======================= */
function createCity() {
  const city = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 160; i++) {
    const height = Math.random() * 5 + 1;

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.6, 0.5, Math.random() * 0.3 + 0.2),
      emissive: new THREE.Color(0x0a1a2f),
      emissiveIntensity: 0.5,
      roughness: 0.6,
      metalness: 0.3,
    });

    const building = new THREE.Mesh(geo, mat);
    building.scale.y = height;
    building.position.set(
      (Math.random() - 0.5) * 24,
      height / 2 - 1.6,
      (Math.random() - 0.5) * 24
    );

    city.add(building);
  }

  scene.add(city);
}
createCity();

/* =======================
   RAYCASTER
======================= */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

/* =======================
   ROBOT (GLTF)
======================= */
let model = null;
let hovered = false;

const loader = new GLTFLoader();
loader.load(
  "models/robot/scene.gltf",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.set(0, -0.9, 0);
    scene.add(model);
  },
  undefined,
  (err) => console.error(err)
);

/* =======================
   RESIZE
======================= */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

/* =======================
   ANIMATE
======================= */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.002;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0 && !hovered) {
      hovered = true;
      gsap.to(model.scale, {
        x: 2.2,
        y: 2.2,
        z: 2.2,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    if (intersects.length === 0 && hovered) {
      hovered = false;
      gsap.to(model.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }

  controls.update();
  composer.render();
}

animate();
