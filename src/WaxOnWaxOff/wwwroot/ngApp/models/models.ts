namespace App.Models {

    export class Answer {
        public javascript: string = "";
        public typescript: string = "";
        public html: string = "";
        public css: string = "";
        public csharp: string = "";
        public plain: string = "";
    }

    export class Lab {
        public lessonId: number;
        public labType: number = 0;
        public setupScript: string;
        public test = 
`describe('doSomething', function () {
    it('doSomething() function should exist.', function() {
        expect(doSomething).not.toBeNull();
    });
    it('doSomething() function should return "Do Something!"', function() {
        var result = doSomething();
        expect(result).toBe("Do Something!");
    });
});`;

    }

}