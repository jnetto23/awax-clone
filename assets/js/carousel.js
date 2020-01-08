export default class Carousel {
    constructor(carousel, params) {
        this.carousel       = carousel;
        this.carouselName   = carousel.getAttribute('id'); 
        this.carouselInner  = carousel.querySelector('.carousel-inner');
        this.slides         = this.carouselInner.querySelectorAll('.carousel-item');
        this.interval       = [];
        this.items          = 1;

        let config_default = {
            indicators: true,
            autoplay: true,
            interval: 10000,
            pause: false,
            responsive: {}
        };

        this.params = Object.assign(config_default, params);
        if (!this.params.responsive['0']) this.params.responsive['0'] = 1;
        this.interval.push(this.carouselName);
        
        this.width_handler();
        window.addEventListener('resize', () => {
            this.width_handler();
            this.removeIndicators();
            if (this.params.indicators) this.setIndicators();
        });

        let active = this.carouselInner.querySelector('.carousel-item.active');
        if (!active) this.slides[0].classList.add('active');

        (this.params.autoplay) ? this.start() : this.stop();
        (this.params.indicators) ? this.setIndicators() : this.removeIndicators();
        return;
    };
    
    setIndicators() {
        let nDots = this.slides.length - this.items + 1;
        if (nDots > 1) {
            let ol = document.createElement('ol');
            ol.classList.add('carousel-indicators');
            for (let index = 0; index < nDots; index++) {
                let li = document.createElement('li');
                li.setAttribute('data-target',`#${this.carousel.getAttribute('id')}`);
                li.setAttribute('data-slide-to',index);
    
                if (this.slides[index].classList.contains('active')) {
                    li.classList.add('active') 
                };
                
                li.addEventListener('click', () => {this.indicators_handler(index)});
                ol.appendChild(li);
            }
            this.carousel.appendChild(ol);
        }
        return;
    };

    removeIndicators() {
        if (this.carousel.querySelector('.carousel-indicators')) this.carousel.querySelector('.carousel-indicators').remove();
        return;
    }

    start() {
        let activeIndex;
        this.interval[this.carouselName] = setInterval(() => {                       
            for (let index = 0; index < this.slides.length; index++) {
                if (this.slides[index].classList.contains('active')) activeIndex = index;                
            }
            // Verifica o proximo
            let next = (activeIndex === (this.slides.length - 1)) ? 0 : activeIndex + 1;                        
            this.handler(next);

        }, this.params.interval);
        return;
    };

    stop() {
        clearInterval(this.interval[this.carouselName]);
        return;
    };

    handler(pos) {
        let inner = this.carousel.querySelector('.carousel-inner');
        // Limpa os active
        this.carousel.querySelector('.carousel-item.active').classList.remove('active');
        if (this.params.indicators) this.carousel.querySelector('.carousel-indicators li.active').classList.remove('active');
        
        // Seta os active
        this.carousel.querySelectorAll('.carousel-item')[pos].classList.add('active');
        if (this.params.indicators) this.carousel.querySelectorAll('.carousel-indicators li')[pos].classList.add('active');
        
        let s = (this.getWidthContainer() / this.items * pos)
        inner.setAttribute('style', `margin-left: -${ (pos === 0) ? 0 : s}px`);
        return;
    };

    indicators_handler(index) {
        if(this.params.autoplay) this.stop();
        this.handler(index);
        if(this.params.autoplay) this.start();
        return;
    };

    width_handler() {
        let responsive = Object.keys(this.params.responsive);
        if (responsive.length > 0) {
            let widthDOM = window.innerWidth;
            responsive.forEach(resp => {
                if (resp <= widthDOM) {
                    this.items = this.params.responsive[resp];
                };
            });
        };
        
        this.slides.forEach(slide => {
            slide.style.width = `${this.getWidthContainer() / this.items}px`;
        });
    };

    getWidthContainer () {
        let b = parseFloat(getComputedStyle(this.carousel).borderLeft) + parseFloat(getComputedStyle(this.carousel).borderRight);
        let p = parseFloat(getComputedStyle(this.carousel).paddingLeft) + parseFloat(getComputedStyle(this.carousel).paddingRight);
        let w = parseFloat(getComputedStyle(this.carousel).width);

        let r = w - (b + p);
        return r;
    }

};

Object.prototype.carousel = function (config) {   
    new Carousel(this, config);
}; 