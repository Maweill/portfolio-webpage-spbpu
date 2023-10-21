const brandBoxes = document.querySelectorAll('.brand-box');

// Добавляем обработчики событий каждому из выбранных элементов
brandBoxes.forEach(function(box) {
    box.addEventListener('mouseleave', function() {
        this.classList.add('active');

        const self = this;

        setTimeout(function() {
            self.classList.remove('active');
        }, 1000);
    });

    box.addEventListener('click', function() {
        this.classList.toggle('active-name');
        this.classList.toggle('background-change');
    });
});
