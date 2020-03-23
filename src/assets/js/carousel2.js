export default class Carousel {
  constructor(carousel, params) {
    let config_default = {
      indicators: true,
      autoplay: true,
      interval: 10000,
      pause: false,
      responsive: {}
    };

    this._carousel = carousel;
    this._carouselId = carousel.getAttribute("id");
    this._carouselInner = carousel.querySelector(".carousel-inner");
    this._carouselSlides = carousel.querySelectorAll(
      ".carousel-inner .carousel-item"
    );
    this._interval = [];
    this._items = 1;
    this._active = "";
    this._params = Object.assign(config_default, params);
    this._w = 0;

    // Config Carousel
    if (!this._params.responsive["0"]) this._params.responsive["0"] = 1;
    this._interval.push(this.carouselId);

    if (this._carouselInner.querySelector(".carousel-item.active")) {
      for (let index = 0; index <= this._carouselSlides.length - 1; index++) {
        if (this._carouselSlides[index].classList.contains("active"))
          this._active = index;
      }
    } else {
      this._active = 0;
      this._carouselSlides[0].classList.add("active");
    }

    // Config Dots
    this._nDots = 0;

    // Handle
    this._carousel_handler();
    return;
  }

  _carousel_handler() {
    this._width_handler();
    if (this._params.autoplay) this._start();
    if (this._params.indicators) this._setIndicators();

    window.addEventListener("resize", () => {
      if (this._params.autoplay) this._stop();

      this._width_handler();
      if (this._params.indicators) {
        this._removeIndicators();
        this._setIndicators();
      }

      if (this._params.autoplay) this._start();
    });
    return;
  }

  _width_handler() {
    let responsive = Object.keys(this._params.responsive);
    if (responsive.length > 0) {
      let widthDOM = window.innerWidth;
      responsive.forEach(resp => {
        if (resp <= widthDOM) this._items = this._params.responsive[resp];
      });
    }
    this._w = this._getWidthContainer(this._items);
    // seta o width nos slides
    this._carouselSlides.forEach(slide => {
      slide.style.cssText = `
        width:${this._w}px; 
      `;
    });
    // seta o width e margin-left do inner
    this._inner_width_and_margin();
    return;
  }

  _getWidthContainer(n) {
    let b =
      parseFloat(getComputedStyle(this._carousel).borderLeft) +
      parseFloat(getComputedStyle(this._carousel).borderRight);
    let p =
      parseFloat(getComputedStyle(this._carousel).paddingLeft) +
      parseFloat(getComputedStyle(this._carousel).paddingRight);
    let w = parseFloat(getComputedStyle(this._carousel).width);
    return (w - (b + p)) / n;
  }

  _start() {
    this._interval[this._carouselId] = setInterval(() => {
      this._active =
        this._active === this._carouselSlides.length - 1 ? 0 : this._active + 1;
      this._handler();
    }, this._params.interval);
    return;
  }

  _stop() {
    clearInterval(this._interval[this._carouselId]);
    return;
  }

  _handler() {
    // Carousel
    if (this._carouselInner.querySelector(".carousel-item.active"))
      this._carouselInner
        .querySelector(".carousel-item.active")
        .classList.remove("active");

    // Dots
    if (this._params.indicators) {
      // remove o active
      if (this._carousel.querySelector(".carousel-indicators li.active"))
        this._carousel
          .querySelector(".carousel-indicators li.active")
          .classList.remove("active");
      // seta o active
      this._carousel
        .querySelectorAll(".carousel-indicators li")
        [this._active].classList.add("active");
    }

    this._carouselSlides[this._active].classList.add("active");
    // Seta a margem
    this._inner_width_and_margin();
    return;
  }

  _inner_width_and_margin() {
    this._carouselInner.style.cssText = `
      width: ${this._w * this._carouselSlides.length}px;
      margin-left: -${this._w * this._active}px
    `;
    return;
  }

  _setIndicators() {
    this._nDots = this._carouselSlides.length - this._items + 1;

    if (this._nDots > 1) {
      let ol = document.createElement("ol");
      ol.classList.add("carousel-indicators");

      for (let index = 0; index < this._nDots; index++) {
        let li = document.createElement("li");
        li.setAttribute("data-target", `#${this._carouselId}`);
        li.setAttribute("data-slide-to", index);

        if (this._carouselSlides[index].classList.contains("active")) {
          li.classList.add("active");
        }

        li.addEventListener("click", () => {
          this._indicators_handler(index);
        });
        ol.appendChild(li);
      }
      this._carousel.appendChild(ol);
    }
    return;
  }

  _removeIndicators() {
    if (this._carousel.querySelector(".carousel-indicators"))
      this._carousel.querySelector(".carousel-indicators").remove();
    return;
  }

  _indicators_handler(index) {
    if (this._params.autoplay) this._stop();
    this._active = index;
    this._handler();
    if (this._params.autoplay) this._start();
    return;
  }
}

Object.prototype.carousel = function(config) {
  new Carousel(this, config);
};
