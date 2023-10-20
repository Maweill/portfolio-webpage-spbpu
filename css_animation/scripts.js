document.querySelector('.brand-box').addEventListener('mouseleave', function () {
    this.classList.add('active');

    const self = this;

    setTimeout(function () {
        self.classList.remove('active');
    }, 1000);
});

document.querySelector('.brand-box').addEventListener('click', function () {
    this.classList.toggle('active-name');
    this.classList.toggle('background-change');
});
