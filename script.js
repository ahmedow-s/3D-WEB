import *  as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';




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


const material = new THREE.MeshStandardMaterial({color: 'red'})

const cube =  new THREE.Mesh(geometry, material)

cube.position.set(0 ,0 ,0)

scene.add(cube)






const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()


function MouseEvent (event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)

    const intersects =  raycaster.intersectObjects(scene.children)

    if(intersects.length > 0)
        intersects[0].object.material.color.set('blue')

}

window.addEventListener('mousemove',MouseEvent)



const sphereGeometry = new THREE.SphereGeometry(1, 32 , 10)
const sphereMaterial = new THREE.MeshPhongMaterial({
    color:"green",
    shininess:100,
})

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(2,0,0)
scene.add(sphere)


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


function animate(){
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01


    // sphere.rotation.x += 0.01
    // sphere.rotation.y += 0.01
    
    // torus.rotation.x += 0.01
    // torus.rotation.y += 0.01
    
    controls.update()
    renderer.render(scene, camera)
}

animate()