import { NgIf } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { fabric } from 'fabric';
import { ActiveSelection } from 'fabric/fabric-impl';

const ZOOM_DELTA = 138; // This is the equivalent value to a single scroll using a mouse scroll wheel.
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 18;

@Component({
    standalone: true,
    templateUrl: './floorplan-canvas.component.html',
    styleUrl: './floorplan-canvas.component.scss',
    selector: 'app-floorplan-canvas',
    imports: [MatIcon, MatIconButton, MatSnackBarModule, MatProgressSpinner, NgIf],
})
export class FloorplanCanvasComponent implements AfterViewInit, OnDestroy {
    private grid = 50;
    private isDragging = false;
    private lastPosX = 0;
    private lastPosY = 0;
    private canvas?: fabric.Canvas;

    @ViewChild('floorplanContainer')
    private container!: ElementRef;

    protected loading = true;
    protected saving = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        if (this.canvas) {
            this.canvas.width = (event.target as Window).innerWidth;
            this.canvas.height = (event.target as Window).innerHeight;
        }
    }

    /**
     * Whether or not the canvas is in 'view' only mode, which will disable element interaction.
     *
     * @default false
     */
    @Input()
    public isViewOnlyMode = false;

    /**
     * Input to enable drag mode when the component initializes.
     *
     * To enter or exit drag mode use the `enterDragMode()` and `exitDragMode()` respectively.
     *
     * @default false
     */
    @Input()
    public isInDragMode = false;

    /**
     * Whether or not zooming of the canvas is enabled.
     *
     * @default true
     */
    @Input()
    public zoomEnabled = true;

    /**
     * The JSON data to load the canvas with.
     */
    @Input()
    public initialData: string = '';

    /**
     * Whether or not to snap elements to a pre-defined grid.
     * This also includes snapping resized elements to match the grid size.
     *
     * @default false
     */
    @Input()
    public snappingEnabled: boolean = false;

    /**
     * Whether or not to display a background grid on the canvas.
     *
     * Note: This is currently experimental.
     *
     * @default false
     */
    @Input()
    public displayGrid: boolean = false;

    @Output()
    public mouseUpFired: EventEmitter<fabric.IEvent<MouseEvent>> = new EventEmitter<fabric.IEvent<MouseEvent>>();

    public ngAfterViewInit(): void {
        this.constructCanvas();
    }

    public ngOnDestroy(): void {
        this.canvas?.dispose();
    }

    /**
     * Forces a refresh of the entire canvas by disposing of the old one and re-setting everything up.
     *
     * This isn't ideal but it's the only way that fabricjs can handle
     * situations where the DOM is conditional, such as using an NgIf.
     */
    public forceRefresh(): void {
        this.canvas?.dispose();

        this.constructCanvas();
    }

    /**
     * Updates the height of the canvas to the given value, or the container height if one is not provided.
     * @param height The new height value to use.
     */
    public updateHeight(height?: number): void {
        if (this.canvas) {
            const calculatedheight = (this.container.nativeElement as HTMLDivElement).clientHeight;

            const heightValue = height !== undefined ? height : calculatedheight;

            this.canvas.setHeight(heightValue);
        }
    }

    /**
     * Updates the width of the canvas to the given value, or the container width if one is not provided.
     * @param width The new width value to use.
     */
    public updateWidth(width?: number): void {
        if (this.canvas) {
            const calculatedWidth = (this.container.nativeElement as HTMLDivElement).clientWidth;

            const widthValue = width !== undefined ? width : calculatedWidth;

            this.canvas.setWidth(widthValue);
        }
    }

    /**
     * Enters drag mode for the canvas.
     */
    public enterDragMode(): void {
        this.isInDragMode = true;
    }

    /**
     * Exits drag mode for the canvas.
     */
    public exitDragMode(): void {
        if (this.isInDragMode) {
            this.isInDragMode = false;
        }
    }

    /**
     * Adds an entity to the Fabric canvas.
     * @param entity The entity to add to the canvas.
     * @param bringToFront Whether to bring the entity to the front after adding it. Default is true.
     * @param sendToBack Whether to send the entity to the back after adding it. Default is false.
     *
     * Note: ESLint complains about using the `Object` type but it's a base type
     * from Fabric rather than the actual TypeScript `Object` or `object`.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public addItemToCanvas(entity: fabric.Object, bringToFront: boolean = true, sendToBack: boolean = false): void {
        if (this.canvas) {
            this.canvas.add(entity);
            if (bringToFront) {
                entity.bringToFront();
            } else if (sendToBack) {
                entity.sendToBack();
            }
        }
    }

    /**
     * Saves the current canvas state to a JSON string using the inbuilt Fabric methods.
     * @returns A JSON string of the current canvas state.
     */
    public saveToJSON(): string {
        return JSON.stringify(this.canvas?.toJSON());
    }

    /**
     * Loads the given JSON string to the canvas.
     * @param inputJSON The JSON string to load.
     */
    public loadFromJSON(inputJSON: string): void {
        if (this.canvas && inputJSON !== '') {
            this.loading = true;

            this.canvas.loadFromJSON(inputJSON, () => {
                this.loading = false;
                this.canvas!.renderAll();
            });
        }
    }

    /**
     * Zooms the canvas in.
     */
    public zoomIn(): void {
        let zoom = this.canvas!.getZoom();
        zoom *= 0.999 ** -ZOOM_DELTA;

        // Set the min and max zoom.
        if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
        if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;

        const center = this.canvas?.getCenter();

        if (center) {
            this.canvas!.zoomToPoint({ x: center?.left, y: center?.top }, zoom);
        }
    }

    /**
     * Zooms the canvas out.
     */
    public zoomOut(): void {
        let zoom = this.canvas!.getZoom();
        zoom *= 0.999 ** ZOOM_DELTA;

        // Set the min and max zoom.
        if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
        if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;

        const center = this.canvas?.getCenter();

        if (center) {
            this.canvas!.zoomToPoint({ x: center?.left, y: center?.top }, zoom);
        }
    }

    /**
     * Zooms the fit all objects.
     */
    zoomToFit(): void {
        if (!this.canvas) {
            console.warn('Canvas is not initialized');
            return;
        }

        const objects = this.canvas.getObjects();
        if (objects.length === 0) {
            console.warn('No objects on canvas to fit');
            return;
        }

        // Reset the viewport transform before calculating bounds
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

        const canvasElement = this.canvas.getElement();
        const canvasWidth = canvasElement.width;
        const canvasHeight = canvasElement.height;

        const groupBoundingRect = this.canvas.getObjects().reduce(
            (acc, obj) => {
                const objBoundingRect = obj.getBoundingRect(true, true);
                acc.left = Math.min(acc.left, objBoundingRect.left);
                acc.top = Math.min(acc.top, objBoundingRect.top);
                acc.right = Math.max(acc.right, objBoundingRect.left + objBoundingRect.width);
                acc.bottom = Math.max(acc.bottom, objBoundingRect.top + objBoundingRect.height);
                return acc;
            },
            { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
        );

        const boundingWidth = groupBoundingRect.right - groupBoundingRect.left;
        const boundingHeight = groupBoundingRect.bottom - groupBoundingRect.top;

        const scaleX = canvasWidth / boundingWidth;
        const scaleY = canvasHeight / boundingHeight;
        const scale = Math.min(scaleX, scaleY) * 0.66; // to add some margin

        const center = {
            x: groupBoundingRect.left + boundingWidth / 2,
            y: groupBoundingRect.top + boundingHeight / 2,
        };

        this.canvas.setViewportTransform([
            scale,
            0,
            0,
            scale,
            canvasWidth / 2 - center.x * scale,
            canvasHeight / 2 - center.y * scale,
        ]);

        this.canvas.renderAll();
    }

    /**
     * Groups the currently selected elements on the canvas.
     */
    public groupSelectedObjects(): void {
        if (!this.canvas!.getActiveObject()) {
            return;
        }

        if (this.canvas!.getActiveObject()!.type !== 'activeSelection') {
            return;
        }

        fabric.ActiveSelection.fromObject(this.canvas?.getActiveObject(), (x: ActiveSelection) => {
            x.toGroup();
            this.canvas!.requestRenderAll();
        });
    }

    /**
     * Ungroups the currently selected elements on the canvas.
     */
    public ungroupSelectedObjects(): void {
        if (this.canvas) {
            if (!this.canvas.getActiveObject()) {
                return;
            }
            if (this.canvas.getActiveObject()!.type !== 'group') {
                return;
            }

            // There's no typings for the `toActiveSelection` but this example comes
            // straight from the docs http://fabricjs.com/manage-selection.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (this.canvas.getActiveObject() as any).toActiveSelection();
            this.canvas.requestRenderAll();
        }
    }

    /**
     * Sends the currently selected element to the back of the stack.
     */
    public sendSelectedItemToBack(): void {
        this.canvas?.getActiveObject()?.sendToBack();
    }

    /**
     * Removes the currently selected elements from the canvas.
     */
    public removeSelectedElements(): void {
        if (this.canvas) {
            const activeObjects = this.canvas.getActiveObjects();

            activeObjects.forEach((x) => {
                this.canvas!.remove(x);
            });

            this.canvas.discardActiveObject().renderAll();
        }
    }

    /**
     * Brings the currently selected element to the front of the stack.
     */
    public bringSelectedItemToFront(): void {
        this.canvas?.getActiveObject()?.bringToFront();
    }

    public enableGridSnapping(): void {
        if (this.canvas) {
            this.canvas.on('object:moving', (e) => {
                if (e.target) {
                    if (e.target.type !== 'textbox') {
                        this.snapToGrid(e.target);
                    }
                }
            });

            this.canvas.on('object:modified', (options) => {
                // TODO: This still gives some weird behaviour at times.
                if (options.target) {
                    const newWidth = Math.round(options.target.getScaledWidth() / this.grid) * this.grid;
                    const newHeight = Math.round(options.target.getScaledHeight() / this.grid) * this.grid;
                    options.target.set({
                        width: newWidth,
                        height: newHeight,
                        scaleX: 1,
                        scaleY: 1,
                    });
                }
            });
        }
    }

    public disableGridSnapping(): void {
        if (this.canvas) {
            this.canvas.off('object:moving');
            this.canvas.off('object:modified');
        }
    }

    public getPointer(e: Event, ignoreZoom?: boolean): { x: number; y: number } {
        return this.canvas!.getPointer(e, ignoreZoom);
    }

    private constructCanvas(): void {
        const width = (this.container.nativeElement as HTMLDivElement).clientWidth;
        const height = (this.container.nativeElement as HTMLDivElement).clientHeight;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.canvas = new fabric.Canvas('floorplan', {
            width: width,
            height: height,
            allowTouchScrolling: false,
            interactive: !this.isViewOnlyMode,
            selection: !this.isViewOnlyMode,
            // The `enablePointerEvents` option is not in the typings because the default fabric library is built
            // without gestures (touch events) so we need to use a custom build but there's no typings for that build.
            enablePointerEvents: true,
            skipTargetFind: this.isViewOnlyMode, // Apparently this is the only way to disable selection of the whole canvas https://github.com/fabricjs/fabric.js/discussions/9439
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        if (this.initialData !== '') {
            this.canvas.loadFromJSON(this.initialData, () => {
                this.loading = false;
            });
        } else {
            this.loading = false;
        }

        this.setupPanning();

        if (this.displayGrid) {
            this.createGrid();
        }

        if (this.zoomEnabled) {
            this.canvas.on('mouse:wheel', (opt) => {
                const delta = opt.e.deltaY;
                let zoom = this.canvas!.getZoom();
                zoom *= 0.999 ** delta;

                // Set the min and max zoom.
                if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
                if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;

                this.canvas!.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            });
        }

        if (this.snappingEnabled) {
            this.canvas.on('object:moving', (e) => {
                if (e.target) {
                    if (e.target.type !== 'textbox') {
                        this.snapToGrid(e.target);
                    }
                }
            });

            this.canvas.on('object:modified', (options) => {
                // TODO: This still gives some weird behaviour at times.
                if (options.target) {
                    const newWidth = Math.round(options.target.getScaledWidth() / this.grid) * this.grid;
                    const newHeight = Math.round(options.target.getScaledHeight() / this.grid) * this.grid;
                    options.target.set({
                        width: newWidth,
                        height: newHeight,
                        scaleX: 1,
                        scaleY: 1,
                    });
                }
            });
        }
    }

    private snapToGrid(target: fabric.Object): void {
        target.set({
            left: Math.round(target.left! / this.grid) * this.grid,
            top: Math.round(target.top! / this.grid) * this.grid,
        });
    }

    private setupPanning(): void {
        if (this.canvas) {
            this.canvas.on('mouse:down', (opt) => {
                const evt = opt.e;

                if (this.isInDragMode) {
                    this.isDragging = true;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
            });

            this.canvas.on('mouse:move', (opt) => {
                if (this.isDragging) {
                    const e = opt.e;
                    const vpt = this.canvas!.viewportTransform!;
                    vpt[4] += e.clientX - this.lastPosX;
                    vpt[5] += e.clientY - this.lastPosY;
                    this.canvas!.requestRenderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }
            });

            this.canvas.on('mouse:up', (e) => {
                this.mouseUpFired.emit(e);
                // On mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.canvas!.setViewportTransform(this.canvas!.viewportTransform!);
                this.isDragging = false;
            });
        }
    }

    private createGrid(): void {
        const lineStroke = '#ebebeb';
        const canvasHeight = this.canvas?.height !== undefined ? this.canvas.height : 1;
        if (this.canvas) {
            for (let i = 0; i < canvasHeight / this.grid; i++) {
                const lineX = new fabric.Line([0, i * this.grid, canvasHeight, i * this.grid], {
                    stroke: lineStroke,
                    selectable: false,
                    type: 'line',
                    data: 'grid',
                    excludeFromExport: true,
                });
                const lineY = new fabric.Line([i * this.grid, 0, i * this.grid, canvasHeight], {
                    stroke: lineStroke,
                    selectable: false,
                    type: 'line',
                    data: 'grid',
                    excludeFromExport: true,
                });
                this.canvas.add(lineX);
                this.canvas.add(lineY);
            }

            for (let i = 0; i < this.canvas.width! / this.grid; i++) {
                this.canvas.add(
                    new fabric.Line([i * this.grid, 0, i * this.grid, this.canvas.height!], {
                        type: 'line',
                        stroke: '#ccc',
                        selectable: false,
                    })
                );
                this.canvas.add(
                    new fabric.Line([0, i * this.grid, this.canvas.width!, i * this.grid], {
                        type: 'line',
                        stroke: '#ccc',
                        selectable: false,
                    })
                );
            }
            this.sendLinesToBack();
        }
    }

    private sendLinesToBack(): void {
        if (this.canvas) {
            this.canvas.getObjects().map((o) => {
                if (o.type === 'line') {
                    this.canvas!.sendToBack(o);
                }
            });
        }
    }
}
