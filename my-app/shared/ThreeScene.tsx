'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    /* =======================
       SCENE
    ======================= */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0f19)
    scene.fog = new THREE.Fog(0x0b0f19, 6, 25)

    /* =======================
       CAMERA
    ======================= */
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.set(0, 2, 6)

    /* =======================
       RENDERER
    ======================= */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    /* =======================
       CONTROLS
    ======================= */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 3
    controls.maxDistance = 10

    /* =======================
       LIGHTS
    ======================= */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(6, 8, 5)
    scene.add(dirLight)

    const rimLight = new THREE.PointLight(0x00ffff, 1.5, 15)
    rimLight.position.set(-4, 2, -3)
    scene.add(rimLight)

    /* =======================
       POSTPROCESSING
    ======================= */
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.9,
      0.6,
      0.85
    )
    composer.addPass(bloomPass)

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
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.6
    scene.add(ground)

    /* =======================
       CITY
    ======================= */
    const city = new THREE.Group()
    const geo = new THREE.BoxGeometry(1, 1, 1)

    for (let i = 0; i < 160; i++) {
      const height = Math.random() * 5 + 1

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.6, 0.5, Math.random() * 0.3 + 0.2),
        emissive: new THREE.Color(0x0a1a2f),
        emissiveIntensity: 0.5,
        roughness: 0.6,
        metalness: 0.3,
      })

      const building = new THREE.Mesh(geo, mat)
      building.scale.y = height
      building.position.set(
        (Math.random() - 0.5) * 24,
        height / 2 - 1.6,
        (Math.random() - 0.5) * 24
      )

      city.add(building)
    }
    scene.add(city)

    /* =======================
       RAYCASTER
    ======================= */
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    /* =======================
       ROBOT
    ======================= */
    let model: THREE.Object3D | null = null
    let hovered = false

    const loader = new GLTFLoader()
    loader.load('@/shared/models/robot/scene.gltf', (gltf) => {
      model = gltf.scene
      model.scale.set(2, 2, 2)
      model.position.set(0, -0.9, 0)
      scene.add(model)
    })

    /* =======================
       RESIZE
    ======================= */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    /* =======================
       ANIMATE
    ======================= */
    const animate = () => {
      requestAnimationFrame(animate)

      if (model) {
        model.rotation.y += 0.002

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(model, true)

        if (intersects.length && !hovered) {
          hovered = true
          gsap.to(model.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 0.4 })
        }

        if (!intersects.length && hovered) {
          hovered = false
          gsap.to(model.scale, { x: 2, y: 2, z: 2, duration: 0.4 })
        }
      }

      controls.update()
      composer.render()
    }

    animate()

    /* =======================
       CLEANUP
    ======================= */
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-0" />
}
