import { Interaction } from "./interaction";
import * as THREE from "three";
import { Audio } from "./audio";

export class Toy {
    public interaction: Interaction;

    public audio: Audio;
    public renderer: THREE.WebGLRenderer;
    public animationId: number | null = null;
    public camera: THREE.OrthographicCamera;
    public scene: THREE.Scene;

    public raycaster: THREE.Raycaster;
    private containerElement: HTMLDivElement;

    // Scene objects
    private cube: THREE.Mesh;

    constructor(container: HTMLDivElement) {
        this.containerElement = container;
        this.interaction = new Interaction(container);
        this.audio = new Audio();
        this.audio.init();

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const aspect = width / height;
        this.camera = new THREE.OrthographicCamera(
            -aspect,
            aspect,
            1,
            -1,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Raycaster setup
        this.raycaster = new THREE.Raycaster();

        // Scene setup
        this.scene = new THREE.Scene();

        // Add lighting
        const directionalLight = new THREE.DirectionalLight("#fff", 3);
        directionalLight.position.set(-2, 2, 2);
        this.scene.add(directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        // Create cube with light-responsive material
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: THREE.Color.NAMES.white,
        });
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.set(0, 0, 0);
        this.scene.add(this.cube);
    }

    public render() {
        if (!this.renderer || !this.scene || !this.camera) return;

        // Update loop (physics, animations, etc.)
        this.update();

        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.render());
    }

    private update() {
        // Check for input
        this.interaction.poll();

        this.raycaster.setFromCamera(
            this.interaction.normalizedMouse,
            this.camera
        );
        const intersects = this.raycaster.intersectObjects([this.cube]);

        // Update cursor based on whether we're hovering over clickable objects
        this.interaction.setCursor(intersects.length > 0);

        if (intersects.length > 0) {
            if (this.interaction.didMouseClick) {
                this.audio.playPluck();
            }
        }

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
    }

    public handleResize(): void {
        if (!this.containerElement || !this.renderer || !this.camera) return;

        const width = this.containerElement.clientWidth;
        const height = this.containerElement.clientHeight;
        const aspect = width / height;

        // Update camera
        this.camera.left = -aspect;
        this.camera.right = aspect;
        this.camera.top = 1;
        this.camera.bottom = -1;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    public dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
        this.scene.clear();
        this.camera = null as any;
    }
}
