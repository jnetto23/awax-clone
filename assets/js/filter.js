export default class Filter {

    constructor(el) {
        this.navs = el.querySelectorAll('#our-projects-nav .nav-item');
        this.projects = el.querySelector('#our-projects-cards');
        this.handler();
    };

    handler() {
        Array.prototype.forEach.call(this.navs, nav => {
            nav.addEventListener('click', () => {
                this.projectHandler(nav.getAttribute('data-filter'));
            });
        });
    };

    projectHandler(filter) {
        this.clear();
        Array.prototype.forEach.call(this.projects.querySelectorAll('.card'), project => {
            if (filter !== '') {
                if (project.getAttribute('data-filter') !== filter) {
                    project.classList.add('d-none');
                }                
            };
        });
    };

    clear() {
        Array.prototype.forEach.call(this.projects.querySelectorAll('.card.d-none'), project => {
            project.classList.remove('d-none');
        });
    };
}

Object.prototype.filter = function() {
    new Filter(this);
}