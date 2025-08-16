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

    private updatePosition(clientX: number, clientY: number): void {
        if (this.containerElement) {
            const rect = this.containerElement.getBoundingClientRect();
            this.normalizedMouse.x =
                ((clientX - rect.left) / rect.width) * 2 - 1;
            this.normalizedMouse.y =
                -((clientY - rect.top) / rect.height) * 2 + 1;
        }
    }

    public pointermove = (event: PointerEvent): void => {
        this.updatePosition(event.clientX, event.clientY);
    };

    public pointerdown = (event: PointerEvent): void => {
        this.isMouseDown = true;
        this.updatePosition(event.clientX, event.clientY);
    };

    public pointerup = (event: PointerEvent): void => {
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
