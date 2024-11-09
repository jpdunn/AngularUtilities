import { SpaceCasePipe } from './space-case.pipe';

describe('SpaceCasePipe', () => {
    let pipe: SpaceCasePipe;

    beforeEach(() => {
        pipe = new SpaceCasePipe();
    });

    it('should return spaced', () => {
        expect(pipe.transform('NotSet')).toEqual('Not Set');
        expect(pipe.transform('FullRack')).toEqual('Full Rack');
    });

    it('should not modify first letter', () => {
        expect(pipe.transform('fullRack')).toEqual('full Rack');
    });

    it('should return string if no capitals', () => {
        expect(pipe.transform('fullrack')).toEqual('fullrack');
    });

    it('should map null to null', () => {
        expect(pipe.transform(null)).toEqual(null);
    });

    it('should map undefined to null', () => {
        expect(pipe.transform(undefined)).toEqual(null);
    });

    it('should not support numbers', () => {
        expect(() => pipe.transform(0 as any)).toThrowError();
    });

    it('should not support other objects', () => {
        expect(() => pipe.transform({} as any)).toThrowError();
    });
});
