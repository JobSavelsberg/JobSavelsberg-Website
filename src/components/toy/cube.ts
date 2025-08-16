import * as THREE from "three";

export class Cube {
    public mesh: THREE.Mesh;

    // Visual state management
    private isHovering: boolean = false;
    private isFlashing: boolean = false;
    private flashStartTime: number = 0;
    private readonly FLASH_DURATION: number = 200; // ms

    // Colors
    private readonly baseColor = new THREE.Color(0xffffff); // white
    private readonly hoverColor = new THREE.Color(0xdddddd); // lighter gray
    private readonly flashColor = new THREE.Color(0x4a90e2); // blue flash

    constructor() {
        // Create cube geometry and material
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            color: this.baseColor.clone(),
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
    }

    public update(): void {
        // Update flash state
        if (this.isFlashing) {
            const elapsed = Date.now() - this.flashStartTime;
            if (elapsed >= this.FLASH_DURATION) {
                this.isFlashing = false;
            }
        }

        // Update color based on current state
        this.updateColor();

        // Rotate the cube
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }

    public setHoverState(isHovering: boolean): void {
        this.isHovering = isHovering;
    }

    public flash(): void {
        this.isFlashing = true;
        this.flashStartTime = Date.now();
    }

    private updateColor(): void {
        let targetColor: THREE.Color;

        if (this.isFlashing) {
            // Flash effect - interpolate between current color and flash color
            const elapsed = Date.now() - this.flashStartTime;
            const progress = elapsed / this.FLASH_DURATION;
            const flashIntensity = Math.sin(progress * Math.PI); // Sine wave for smooth flash

            targetColor = this.isHovering
                ? this.hoverColor.clone()
                : this.baseColor.clone();
            targetColor.lerp(this.flashColor, flashIntensity * 0.7); // 70% flash intensity
        } else if (this.isHovering) {
            targetColor = this.hoverColor;
        } else {
            targetColor = this.baseColor;
        }

        // Update the material color
        (this.mesh.material as THREE.MeshLambertMaterial).color.copy(
            targetColor
        );
    }

    public dispose(): void {
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.MeshLambertMaterial).dispose();
    }
}
