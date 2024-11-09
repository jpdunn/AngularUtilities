import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import SignaturePad from 'signature_pad';

@Component({
    selector: 'app-signature-pad',
    templateUrl: './signature-pad.component.html',
    styleUrls: ['./signature-pad.component.scss'],
    standalone: true,
    imports: [MatButton, NgIf],
})
export class SignaturePadComponent implements AfterViewInit {
    private signaturePad!: SignaturePad;
    protected displayEmptyError = false;

    @ViewChild('canvas')
    protected canvasEl!: ElementRef;

    public ngAfterViewInit(): void {
        this.signaturePad = new SignaturePad(this.canvasEl.nativeElement as HTMLCanvasElement);
    }

    protected clearPad() {
        this.signaturePad.clear();
    }

    public isValid(): boolean {
        if (this.signaturePad.isEmpty()) {
            this.displayEmptyError = true;
            (this.canvasEl.nativeElement as HTMLCanvasElement).classList.add('has-error');
            return false;
        } else {
            this.displayEmptyError = false;
            (this.canvasEl.nativeElement as HTMLCanvasElement).classList.remove('has-error');
            return true;
        }
    }

    public getSignatureData(): string {
        const base64Data = this.signaturePad.toDataURL();
        return base64Data;
    }
}
