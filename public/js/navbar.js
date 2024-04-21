const header = document.querySelector("header");
  // window.addEventListener("scroll", () => {
  //   const navItemsLinks = document.querySelectorAll(".nav-item-links");
  //   const scrolled = window.scrollY > 30;

  //   if (scrolled) {
  //     header.classList.add("scrolled");
  //     for (const eachLink of navItemsLinks) {
  //       eachLink.classList.add("scrolled-color");
  //     }
  //   } else {
  //     header.classList.remove("scrolled");
  //     for (const eachLink of navItemsLinks) {
  //       eachLink.classList.remove("scrolled-color");
  //     }
  //   }
  // });


// Navigation on/off
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarItemsWrapper = document.querySelector(".nav-items-wrapper");
navbarToggler.addEventListener("click", () => {
  navbarToggler.classList.toggle("active");
  navbarItemsWrapper.classList.toggle("add-nav-item");
  header.classList.add("scrolled");
});

const navbarItemsLinks = document.querySelectorAll(".nav-item-links");
for (const eachLinks of navbarItemsLinks) {
  eachLinks.addEventListener("click", () => {
    eachLinks.classList.remove("activeLink");
    navbarToggler.classList.remove("active");
    navbarItemsWrapper.classList.remove("add-nav-item");
  });
}
