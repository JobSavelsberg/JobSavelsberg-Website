import * as THREE from "three";

export class Interaction {
    public didMouseClick: boolean = false;
    private handledMouseClick: boolean = false;

    public isMouseDown: boolean = false;
    public normalizedMouse: THREE.Vector2 = new THREE.Vector2();
    private containerElement: HTMLElement | null = null;

    constructor(container?: HTMLElement) {
        this.containerElement = container || null;
    }

    public setContainer(container: HTMLElement): void {
        this.containerElement = container;
    }

    public keydown = (event: KeyboardEvent): void => {
        console.log("Key down event:", event.key);
    };

    public mousemove = (event: MouseEvent): void => {
        // Calculate normalized coordinates for THREE.js (-1 to 1)
        if (this.containerElement) {
            const rect = this.containerElement.getBoundingClientRect();
            this.normalizedMouse.x =
                ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.normalizedMouse.y =
                -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }
    };

    public mousedown = (event: MouseEvent): void => {
        this.isMouseDown = true;
    };

    public mouseup = (event: MouseEvent): void => {
        this.isMouseDown = false;
    };

    public keyup = (event: KeyboardEvent): void => {
        console.log("Key up event:", event.key);
    };

    // Refreshes the interaction state (should set didMouseClick to true for one call of poll after a click)
    public poll(): void {
        if (this.isMouseDown && !this.handledMouseClick) {
            this.didMouseClick = true;
            this.handledMouseClick = true;
        } else if (this.isMouseDown && this.handledMouseClick) {
            this.didMouseClick = false;
        } else if (!this.isMouseDown) {
            this.handledMouseClick = false;
        }
    }
}
