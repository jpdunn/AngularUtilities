import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { map, Observable, of } from 'rxjs';
import { FloorplanCanvasComponent } from '../floorplan-canvas/floorplan-canvas.component';
import { PendingChangesDialogComponent } from '../pending-changes-dialog/pending-changes-dialog.component';

@Component({
    standalone: true,
    templateUrl: './floorplan-designer.component.html',
    styleUrl: './floorplan-designer.component.scss',
    selector: 'app-floorplan-designer',
    imports: [
        MatIcon,
        MatIconButton,
        MatSnackBarModule,
        MatProgressSpinner,
        MatTooltipModule,
        NgIf,
        FloorplanCanvasComponent,
        NgClass,
    ],
})
export class FloorplanDesignerComponent implements AfterViewInit {
    private lastSaveData = '';

    @ViewChild('container')
    private floorplanContainer?: ElementRef;

    @ViewChild(FloorplanCanvasComponent)
    private floorplanCanvas?: FloorplanCanvasComponent;

    protected panActive = false;
    protected snappingEnabled = true;

    @HostListener('window:resize')
    public onResize(): void {
        this.resizeCanvas();
    }

    public constructor(private readonly router: Router, private readonly dialog: MatDialog) {}

    public ngAfterViewInit(): void {
        // TODO: This is where you would set the initial data after it's loaded from the server.
        // this.floorplanCanvas!.initialData = floorplanDetailsJSON;
        this.floorplanCanvas?.forceRefresh();

        // Set the last save data on load so that we know the initial state of the floorplan.
        // this.lastSaveData = floorplanDetailsJSON;
        this.resizeCanvas();
    }

    public canDeactivate(): boolean | Observable<boolean> {
        const json = this.floorplanCanvas!.saveToJSON();

        if (this.lastSaveData !== '' && this.lastSaveData !== json) {
            // There has been a change since the last save was made, prevent the user from leaving unless they confirm.
            return this.dialog
                .open(PendingChangesDialogComponent, {
                    width: '40%',
                })
                .afterClosed()
                .pipe(map((v: boolean) => v));
        } else {
            return of(true);
        }
    }

    protected onZoomInClicked(event: Event): void {
        if (this.floorplanCanvas) {
            this.floorplanCanvas.zoomIn();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    protected onZoomOutClicked(event: Event): void {
        if (this.floorplanCanvas) {
            this.floorplanCanvas.zoomOut();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    protected onPanClicked(): void {
        if (this.panActive) {
            this.endPan();
        } else {
            this.floorplanCanvas?.enterDragMode();
            this.panActive = true;
        }
    }

    public onGroupClicked(): void {
        this.endPan();

        this.floorplanCanvas?.groupSelectedObjects();
    }

    public onUngroupClicked(): void {
        this.endPan();

        this.floorplanCanvas?.ungroupSelectedObjects();
    }

    public onLabelClicked(): void {
        this.endPan();

        this.floorplanCanvas?.addItemToCanvas(
            new fabric.Textbox('Enter text here...', {
                width: 100,
                height: 100,
                borderColor: 'black',
                stroke: 'black',
                hasBorders: true,
                snapAngle: 45,
                top: 200,
                left: 200,
            })
        );
    }

    public onRoomClicked(): void {
        this.endPan();

        this.floorplanCanvas?.addItemToCanvas(
            new fabric.Rect({
                width: 200,
                height: 200,
                borderColor: 'black',
                fill: 'rgba(255, 255, 255, 0.5)',
                stroke: 'black',
                hasBorders: true,
                snapAngle: 45,
                top: 200,
                left: 200,
                strokeWidth: 10,
            }),
            false,
            true
        );
    }

    public onSaveClicked(): void {
        const json = this.floorplanCanvas!.saveToJSON();
        this.lastSaveData = json;

        // TODO: This is where you would send the JSON to the server for saving etc.
    }

    public onLeaveClicked(): void {
        void this.router.navigate(['/']);
    }

    public onWallClicked(): void {
        this.endPan();
        // Specify the starting and ending coordinates of the line which are in the sequence like
        // start x-coordinate, start y-coordinate, end x-coordinate and end y-coordinate.

        const lineOptions: fabric.ILineOptions & { targetFindTolerance?: number } = {
            borderColor: 'black',
            stroke: 'black',
            snapAngle: 45,
            strokeWidth: 10,
            perPixelTargetFind: true,
            targetFindTolerance: 10,
            hasControls: true,
            hasBorders: false,
            selectable: true,
            evented: true,
            padding: 10,
        };

        const line = new fabric.Line([200, 200, 400, 200], lineOptions);

        line.setControlsVisibility({
            mt: false,
            mb: false,
        });
        this.floorplanCanvas?.addItemToCanvas(line);
    }

    public onSendToFrontClicked(): void {
        this.floorplanCanvas?.bringSelectedItemToFront();
    }

    public onSendToBackClicked(): void {
        this.floorplanCanvas?.sendSelectedItemToBack();
    }

    public onDeleteClicked(): void {
        this.floorplanCanvas?.removeSelectedElements();
    }

    public onToggleSnappingClicked(): void {
        if (this.snappingEnabled) {
            this.snappingEnabled = false;
            this.floorplanCanvas?.disableGridSnapping();
        } else {
            this.snappingEnabled = true;
            this.floorplanCanvas?.enableGridSnapping();
        }
    }

    private endPan(): void {
        if (this.panActive) {
            this.panActive = false;
            this.floorplanCanvas?.exitDragMode();
        }
    }

    private resizeCanvas(): void {
        if (this.floorplanContainer) {
            const height = (this.floorplanContainer.nativeElement as HTMLDivElement).clientHeight;
            const width = (this.floorplanContainer.nativeElement as HTMLDivElement).clientWidth;

            this.floorplanCanvas?.updateHeight(height);
            this.floorplanCanvas?.updateWidth(width);
        }
    }
}
