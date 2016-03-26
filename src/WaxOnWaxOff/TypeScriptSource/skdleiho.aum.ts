class a {
    
};

                                    describe('Product class', function () {
                                        it('should return yikes', function() {
                                            let product = new Product();
                                            expect(product.doSomething()).toBe('yikes');
                                        });
                                    });
                                