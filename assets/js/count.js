export default class Counter {
    constructor(el) {
        this.el = el;
        this.counts = el.querySelectorAll('[data-count]');
        window.addEventListener('scroll', () => this.handler());
    }

    handler() {
        this.counts.forEach(c => {
            if (c.getBoundingClientRect().top < (window.innerHeight * .8)) {
                let total = parseInt(c.getAttribute('data-count'));
                let speed = 1000 / total; 
    
                let interval = setInterval(function() {
                    if(parseInt(c.innerHTML) === total) {
                        clearInterval(interval);
                    } else {
                        c.innerHTML = parseInt(c.innerHTML) + 1;
                    }
                }, speed);
            };

        });
    }
}

Object.prototype.counter = function () {   
    new Counter(this);
}; 