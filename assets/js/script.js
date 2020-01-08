import './amv.js';
import './carousel.js';
import './count.js';
import './filter.js';

let collapses = document.querySelectorAll("[data-toggle=collapse]");
collapses.forEach( collapse => {
    collapse.addEventListener('click', () => {
        let target = document.querySelector(collapse.getAttribute('data-target'));
        target.classList.toggle('d-block');
    });
});

let menuProjects = document.querySelector('#our-projects-nav ul');
menuProjects.querySelectorAll('li').forEach(link => {
    link.addEventListener('click', () => {
        menuProjects.querySelector('li.active').classList.remove('active');
        link.classList.add('active');
    });
});


document.querySelector('#menu ul').amv();
document.getElementById('carousel').carousel();
document.getElementById('carousel-team').carousel({
    autoplay: false,
    responsive: {
        '600': 2,
        '900': 3
    }
});
document.getElementById('carousel-happy-clients').carousel({
    autoplay:false
});
document.getElementById('some-facts').counter();
document.getElementById('our-projects').filter();