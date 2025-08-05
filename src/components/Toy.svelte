<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import * as Tone from "tone";

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let isInitialized = false;

    // 3D objects and audio
    let cube: THREE.Mesh;
    let sphere: THREE.Mesh;
    let torus: THREE.Mesh;
    let pluck: Tone.MonoSynth;

    // Raycasting and hover effects
    let raycaster: THREE.Raycaster;
    let mouse: THREE.Vector2;
    let hoveredObject: THREE.Mesh | null = null;
    let originalMaterials: Map<THREE.Mesh, THREE.Material> = new Map();

    function initThree() {
        // Create scene
        scene = new THREE.Scene();

        // Create camera
        camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // Transparent background

        // Add renderer to container
        container.appendChild(renderer.domElement);

        // Initialize raycaster and mouse vector
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Add some basic 3D objects
        // Cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-3, 0, 0);
        scene.add(cube);
        originalMaterials.set(cube, cubeMaterial.clone());

        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x4ecdc4 });
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
        originalMaterials.set(sphere, sphereMaterial.clone());

        // Torus
        const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xffe66d });
        torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(3, 0, 0);
        scene.add(torus);
        originalMaterials.set(torus, torusMaterial.clone());

        return true;
    }

    async function initTone() {
        // Start Tone.js audio context
        Tone.setContext(new Tone.Context({ latencyHint: "interactive" }));
        await Tone.start();

        const limiter = new Tone.Limiter(-12).toDestination();
        const reverb = new Tone.Reverb({
            decay: 5,
            preDelay: 0.01,
            wet: 0.5,
        }).connect(limiter);
        pluck = new Tone.MonoSynth({
            volume: -3,
            oscillator: {
                type: "sine",
            },
            envelope: {
                attack: 0.001,
                decay: 0.7,
                sustain: 0,
                release: 1,
            },
        }).connect(reverb);
    }

    function updateHover() {
        if (!raycaster || !camera || !scene) return;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects([cube, sphere, torus]);

        if (intersects.length > 0) {
            const newHoveredObject = intersects[0].object as THREE.Mesh;

            // If we're hovering over a different object
            if (hoveredObject !== newHoveredObject) {
                // Reset the previous hovered object
                if (hoveredObject && originalMaterials.has(hoveredObject)) {
                    const originalMaterial =
                        originalMaterials.get(hoveredObject)!;
                    hoveredObject.material = originalMaterial;
                }

                // Light up the new hovered object
                hoveredObject = newHoveredObject;
                const originalMaterial = originalMaterials.get(
                    hoveredObject
                )! as THREE.MeshBasicMaterial;
                const originalColor = new THREE.Color(originalMaterial.color);
                const litColor = originalColor
                    .clone()
                    .lerp(new THREE.Color(0xffffff), 0.4);
                const litMaterial = new THREE.MeshBasicMaterial({
                    color: litColor,
                });
                hoveredObject.material = litMaterial;
            }
        } else {
            // No objects hovered, reset any previously hovered object
            if (hoveredObject && originalMaterials.has(hoveredObject)) {
                const originalMaterial = originalMaterials.get(hoveredObject)!;
                hoveredObject.material = originalMaterial;
                hoveredObject = null;
            }
        }
    }

    function render() {
        if (!renderer || !scene || !camera) return;

        // Update hover effects
        updateHover();

        // Animate the objects
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        if (sphere) {
            sphere.rotation.y += 0.005;
            sphere.position.y = Math.sin(Date.now() * 0.001) * 0.5;
        }

        if (torus) {
            torus.rotation.x += 0.01;
            torus.rotation.z += 0.005;
        }

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(render);
    }

    async function handleMouseDown(event: MouseEvent) {
        if (!isInitialized) {
            await initTone();
            isInitialized = true;
        }

        const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
        const note = notes[Math.floor(Math.random() * notes.length)];
        pluck.triggerAttackRelease(
            note,
            "8n",
            Tone.getContext().currentTime + 0.005
        );
    }

    function handleMouseMove(event: MouseEvent) {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update mouse coordinates for raycasting
        if (mouse) {
            mouse.x = mouseX;
            mouse.y = mouseY;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            // Simulate a click in the center of the container
            const rect = container.getBoundingClientRect();
            const fakeEvent = {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
            } as MouseEvent;
            handleMouseDown(fakeEvent);
        }
    }

    function handleResize() {
        if (!camera || !renderer || !container) return;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    onMount(() => {
        if (initThree()) {
            render();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (renderer) {
                renderer.dispose();
            }
            window.removeEventListener("resize", handleResize);
        };
    });
</script>

<div class="toy">
    <div
        bind:this={container}
        on:mousemove={handleMouseMove}
        on:mousedown={handleMouseDown}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
        class="h-64 w-full cursor-pointer rounded-lg"
        aria-label="Interactive 3D audio visualizer."
    ></div>
</div>

<style>
</style>
