let autoRotate = true;
const rotationSpeed = 0.005;
let scene, camera, renderer, controls, model;
let hasClicked = false;
let container;

// Add inversion animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes invertIn {
        from { 
            filter: invert(0);
            background-color: white;
        }
        to { 
            filter: invert(1);
            background-color: black;
        }
    }
    @keyframes invertOut {
        from { 
            filter: invert(1);
            background-color: black;
        }
        to { 
            filter: invert(0);
            background-color: white;
        }
    }
`;
document.head.appendChild(style);

function initModelViewer() {
    container = document.getElementById('head-model');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0;
    controls.maxDistance = 85;

    const loader = new THREE.GLTFLoader();
    loader.load(
        '/model/3dscan.glb',
        function (gltf) {
            model = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            center.y -= -0.9;
            model.position.sub(center);
            
            camera.position.y = 0.1;
            camera.lookAt(0, 0.5, 0);

            model.scale.set(3, 3, 3);
            
            scene.add(model);

            // New click event listener for color inversion
            container.addEventListener('click', function() {
                if (!hasClicked) {
                    // Invert the whole site
                    document.body.style.animation = 'invertIn 0.3s forwards';
                    scene.background = new THREE.Color(0x000000); // Change to black
                    
                    // Revert back after a delay
                    setTimeout(() => {
                        document.body.style.animation = 'invertOut 0.3s forwards';
                        scene.background = new THREE.Color(0xffffff); // Change back to white
                    }, 2000);
            
                    hasClicked = true;
                    setTimeout(() => hasClicked = false, 5000);
                }
            });

            controls.addEventListener('start', function() {
                autoRotate = false;
            });

            controls.addEventListener('end', function() {
                setTimeout(() => {
                    autoRotate = true;
                }, 3000);
            });
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error occurred loading the model:', error);
        }
    );

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model && autoRotate) {
        model.rotation.y += rotationSpeed;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('head-model');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);
document.addEventListener('DOMContentLoaded', initModelViewer);