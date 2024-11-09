import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nullable',
    standalone: true,
})
export class NullablePipe implements PipeTransform {
    transform(value: string): string;
    transform(value: null | undefined): null;
    transform(value: string | null | undefined): string | null;
    transform(value: string | null | undefined): string | null {
        if (value === null || value === undefined) {
            return '-';
        }

        return value;
    }
}
