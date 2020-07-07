import "./amv.js";
import "./carousel2.js";
import "./count.js";
import "./filter.js";

let collapses = document.querySelectorAll("[data-toggle=collapse]");
collapses.forEach((collapse) => {
  collapse.addEventListener("click", () => {
    let target = document.querySelector(collapse.getAttribute("data-target"));
    target.classList.toggle("d-block");
    collapse.classList.toggle("collapse-open");
  });
});

let menuProjects = document.querySelector("#our-projects-nav ul");
menuProjects.querySelectorAll("li").forEach((link) => {
  link.addEventListener("click", () => {
    menuProjects.querySelector("li.active").classList.remove("active");
    link.classList.add("active");
  });
});

document.querySelector("#menu ul").amv();
document.getElementById("carousel").carousel();
document.getElementById("carousel-team").carousel({
  autoplay: false,
  responsive: {
    "600": 2,
    "900": 3,
  },
});
document.getElementById("carousel-happy-clients").carousel({
  autoplay: false,
});
document.getElementById("some-facts").counter();
document.getElementById("our-projects").filter();

document.querySelector("#contact-us form").addEventListener("submit", (e) => {
  e.preventDefault();
  let inputs = e.target.querySelectorAll("input,textarea");
});

validForm(document.querySelector("#contact-us form"));
validForm(document.querySelector("#newsletter"));

function validForm(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input, textarea");
    Array.prototype.forEach.call(inputs, (input) => ckInput(input));
    ckForm(form);
  });
}

function ckInput(input) {
  if (input.value.trim().length === 0) {
    input.classList.add("input-error");
    input.addEventListener("input", () => ckInput(input));
  } else {
    if (input.classList.contains("input-error"))
      input.classList.remove("input-error");
    input.removeEventListener("input", () => ckInput(input));
  }
  return;
}

function ckForm(form) {
  const e = form.querySelectorAll(".input-error").length;
  if (e === 0) {
    alert(`
      Parabéns, contato validado! \n
      Não enviado pois isto é um teste!      
      `);
    form.reset();
  }
  return;
}

const backToTop = document.getElementById("back-to-top");
backToTop.addEventListener("click", topFunction);
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
