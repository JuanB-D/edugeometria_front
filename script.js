const main = document.querySelector('.main')
const menuBar = document.querySelector('.menu_bar')
const menu = document.querySelector('.menu')


let menuIsOpen = false;
menuBar.addEventListener('click', () =>{
    menuIsOpen = !menuIsOpen;
    if(menuIsOpen){
        menu.style.display = 'block'
    }else{
        menu.style.display = 'none'
    }
  })

  
const Scene = new THREE.Scene();
const Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const Renderer = new THREE.WebGLRenderer();
Renderer.setSize(window.innerWidth/2, window.innerHeight/2);
Renderer.setClearColor(0xffffff)
main.appendChild(Renderer.domElement);

const loader = new THREE.TextureLoader();
const texture = loader.load('./images/cubeBackground.png')
const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial({map: texture})
const cube = new THREE.Mesh(geometry, material);
Scene.add( cube );

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({color:  0x800080})
const line = new THREE.LineSegments(edges, lineMaterial)
cube.add(line)


Camera.position.z = 5;

function animate(){
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  Renderer.render(Scene, Camera);
}

Renderer.setAnimationLoop(animate);