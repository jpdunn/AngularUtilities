import { Component, Inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-pending-changes',
    templateUrl: './pending-changes-dialog.component.html',
    styleUrls: ['./pending-changes-dialog.component.scss'],
    imports: [MatDivider, MatDialogModule, MatButton],
    standalone: true,
})
export class PendingChangesDialogComponent implements OnInit {
    public title = `Discard unsaved changes?`;
    public text = `Are you sure you want to discard unsaved changes? Any changes not previously saved will be lost.`;
    public cancelText = `Cancel`;
    public discardText = `Yes, discard changes`;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly dialogData: PendingChangesData,
        private readonly dialogRef: MatDialogRef<PendingChangesDialogComponent>
    ) {}

    public ngOnInit(): void {
        this.title = this.dialogData?.title ?? this.title;
        this.text = this.dialogData?.text ?? this.text;
        this.cancelText = this.dialogData?.cancelText ?? this.cancelText;
        this.discardText = this.dialogData?.discardText ?? this.discardText;
    }

    public onDiscardClicked() {
        this.dialogRef.close(true);
    }

    public onCancelClicked() {
        this.dialogRef.close(false);
    }
}

export interface PendingChangesData {
    title?: string;
    text?: string;
    cancelText?: string;
    discardText?: string;
}
