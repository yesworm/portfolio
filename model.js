// Variables for Three.js components
let scene, camera, renderer, controls, model;

// Initialize the 3D viewer
function initModelViewer() {
    // Get the container element
    const container = document.getElementById('head-model');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background

    // Set up camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of view
        container.clientWidth / container.clientHeight, // Aspect ratio
        0.1, // Near plane
        1000 // Far plane
    );
    camera.position.z = 1; // Move camera back

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smooth damping
    controls.dampingFactor = 0.05;
    controls.minDistance = 0; // Minimum zoom
    controls.maxDistance = 85; // Maximum zoom

    // Load your 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        '/model/3dscan.glb', // Replace with your model path
        function (gltf) {
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            // adjusting the center point to be closre to my face instead of chest
            center.y -= -0.9;
            model.position.sub(center);
            
            // adjusting initial camera position
            camera.position.y = 0.1;
            camera.lookAt(0, 0.5, 0);

            model.scale.set(3, 3, 3);
            
            // Add model to scene
            scene.add(model);
        },
        // Loading progress
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Error handler
        function (error) {
            console.error('An error occurred loading the model:', error);
        }
    );

    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('head-model');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Add event listeners
window.addEventListener('resize', onWindowResize);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initModelViewer);