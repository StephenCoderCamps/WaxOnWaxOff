namespace App.Models {

    export class Answer {
        public javascript: string = "";
        public typescript: string = "";
        public html: string = "";
        public css: string = "";
        public csharp: string = "";
    }

    export class Lab {
        public lessonId: number;
        public labType: number = 0;
        public test = 
`describe('addNumbers', function () {
    it('should add positive numbers', function() {
        var result = addNumbers(1,3);
        expect(result).toBe(4);
    });
    it('should add negative numbers', function() {
        var result = addNumbers(-1,-3);
        expect(result).toBe(-4);
    });
});`;

    }

}