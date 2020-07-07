export default class ActiveMenuView {
  constructor(el) {
    this.el = el;
    this.links = el.querySelectorAll("li a");
    this.pos = [];
    this.scrollHandler();
  }

  scrollHandler() {
    window.addEventListener("scroll", () => {
      for (let index = 0; index < this.links.length; index++) {
        this.pos[index] = this.getTopPosition(this.links[index]);
      }
      let currentLink = this.getLastVisibleLink();
      if (this.el.querySelector(".active"))
        this.el.querySelector(".active").classList.remove("active");
      currentLink.parentNode.classList.add("active");
    });
  }

  getTopPosition(link) {
    let target = document.querySelector(link.getAttribute("href"));
    return target.getBoundingClientRect().top;
  }

  getLastVisibleLink() {
    let qtd = this.pos.length;
    while (qtd) {
      qtd--;
      if (this.pos[qtd] < innerHeight / 2) {
        return this.links[qtd];
      }
    }
    return this.links[0];
  }
}

Object.prototype.amv = function () {
  new ActiveMenuView(this);
};
