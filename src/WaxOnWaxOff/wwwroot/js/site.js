// prevent backspace

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 8) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }
});
