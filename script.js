import gsap from "gsap";
import *  as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';





//Scene
const scene = new THREE.Scene()

// Light
const ambienLight = new THREE.AmbientLight("red", 1)
scene.add(ambienLight)


const dirLight = new THREE.DirectionalLight("yellow",1)
dirLight.position.set(5,3,5)
scene.add(dirLight)


const pointLight = new THREE.PointLight('white',10, 80)
pointLight.position.set(0.5,1,1)
scene.add(pointLight)

// const pointLightHelper = new THREE.PointLightHelper(pointLight,1)
// scene.add(pointLightHelper)

const spotLight = new THREE.SpotLight('white' ,1)
spotLight.position.set(1,1,1)
scene.add(spotLight)

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100

)

camera.position.z = 5

//render
const renderer = new THREE.WebGLRenderer() 
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 2;
controls.maxDistance = 10





document.body.appendChild(renderer.domElement)

//Texture

// const texture = new THREE.TextureLoader().load('images/car.jpeg')
// const textureMaterial = new THREE.MeshBasicMaterial({
//     map:texture
// })


const geometry = new THREE.BoxGeometry()


// const material = new THREE.MeshStandardMaterial({color: 'red'})


const originalMaterial = new THREE.MeshStandardMaterial({color:'red'})
const highlightMaterial = new THREE.MeshStandardMaterial({color:'yellow ' ,emissive:"white" , emissiveIntensity:0.5})

const cube =  new THREE.Mesh(geometry, originalMaterial)

cube.position.set(0 ,0 ,0)

// scene.add(cube)






const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()


function MouseEvent (event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove',MouseEvent)



const sphereGeometry = new THREE.SphereGeometry(1, 32 , 10)
const sphereMaterial = new THREE.MeshPhongMaterial({
    color:"green",
    shininess:100,
})

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(2,0,0)
// scene.add(sphere)



//load


const loader = new GLTFLoader()

loader.load(
    'models/robot/scene.gltf',
    (gltf)=>{
        const  model = gltf.scene
        model.scale.set(2,2,2)
        model.position.set(1,0,1 )

        scene.add(model)
    },
    (xhr)=>{
        console.log((xhr.loaded / xhr.total * 100) + "% loaded")
    },
    (error)=>{
        console.error("Error")
    }
)

//Gsap

// gsap.to(cube.position,{
//     y:2,
//     x:1,
//     duration:1,
//     ease:'power1.inOut',
//     repeat:-1,
//     yoyo:true
// })

//end gsap





// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.7,0.2 , 16,100),
//     new THREE.MeshBasicMaterial({
//         color:"green"
//     })
// )

// torus.position.set(2,2,1)
// scene.add(torus)




// const plane = new THREE.Mesh( 
//     new THREE.PlaneGeometry(2,2),
//     textureMaterial
// )

// plane.position.set(-2,2,0)
// scene.add(plane)


let isHovered = false



function animate(){
    requestAnimationFrame(animate)


    raycaster.setFromCamera(mouse,camera)
    
    const intersects = raycaster.intersectObject(cube)

    if(intersects.length > 0 && !isHovered){

        cube.material = highlightMaterial
        isHovered = true

    gsap.to(cube.scale,{x:1.5, y:1.5 ,z:1.5,duration:0.5, ease:"power1.out"})
    }
        
    else if(intersects.length == 0 && isHovered){
        cube.material = originalMaterial
        isHovered = false

    gsap.to(cube.scale,{x:1, y:1,z:1, duration:0.5, ease:"power1.out"})

    }

    
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01


    // sphere.rotation.x += 0.01
    // sphere.rotation.y += 0.01
    
    // torus.rotation.x += 0.01
    // torus.rotation.y += 0.01
    renderer.setClearColor('lightblue')
    controls.update()
    renderer.render(scene, camera)
}

animate()