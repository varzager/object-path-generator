const { pathgen } = require("../src/pathGen/pathGen");

describe('pathgen - javascript', () => {

    it('should support typeless', () => {
        const Simple = pathgen();
        expect(Simple.blah.blah()).toBe('blah.blah');
        expect(Simple.blah.blah.blah()).toBe('blah.blah.blah');
        expect(Simple['testing'].something[9][2].run()).toBe('testing.something.9.2.run');
        expect(Simple.Down.The.Rabbit.Hole('Alice', {In: 'Wonderland'})).toBe('Down.The.Rabbit.Hole Alice In-Wonderland');
    })
});