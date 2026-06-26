const filterControls = document.querySelectorAll(".brand-filter-wrap [data-filter]");
const productCards = document.querySelectorAll(".product-card[data-brand]");
const viewAllButton = document.querySelector(".view-all-btn[data-filter='all']");
const productsRow = document.querySelector(".order-brand-section .products-row");
const seeMoreButton = document.querySelector(".see-more-btn");
const seeMoreWrap = document.querySelector(".see-more-wrap");
let currentFilter = "all";
let isExpanded = false;

function updateViewAllButton(filter) {
  if (!viewAllButton) {
    return;
  }

  const shouldShow = filter !== "all";

  viewAllButton.classList.toggle("is-visible", shouldShow);
  viewAllButton.setAttribute("aria-hidden", String(!shouldShow));
  viewAllButton.tabIndex = shouldShow ? 0 : -1;
}

function setActiveFilter(selectedControl) {
  const selectedFilter = selectedControl.dataset.filter;

  filterControls.forEach((control) => {
    control.classList.toggle("active", control.dataset.filter === selectedFilter);
  });
}

function getVisibleCardLimit() {
  if (!productsRow || !productCards.length) {
    return productCards.length;
  }

  const firstCard = productCards[0];
  const rowStyles = window.getComputedStyle(productsRow);
  const cardStyles = window.getComputedStyle(firstCard);
  const rowGap = parseFloat(rowStyles.columnGap) || 0;
  const cardWidth = firstCard.getBoundingClientRect().width || parseFloat(cardStyles.width) || 320;
  const rowWidth = productsRow.getBoundingClientRect().width;
  const cardsPerRow = Math.max(1, Math.floor((rowWidth + rowGap) / (cardWidth + rowGap)));

  return cardsPerRow * 2;
}

function updateSeeMoreButton(hasHiddenProducts) {
  if (!seeMoreButton) {
    return;
  }

  if (seeMoreWrap) {
    seeMoreWrap.classList.toggle("is-visible", hasHiddenProducts);
  }

  seeMoreButton.classList.toggle("is-visible", hasHiddenProducts);
  seeMoreButton.hidden = !hasHiddenProducts;
  seeMoreButton.setAttribute("aria-expanded", String(isExpanded));
}

function filterProducts(filter) {
  currentFilter = filter;
  isExpanded = false;
  updateViewAllButton(filter);
  renderProducts();
}

function renderProducts() {
  const visibleLimit = getVisibleCardLimit();
  const matchingCards = Array.from(productCards).filter((card) => {
    return currentFilter === "all" || card.dataset.brand === currentFilter;
  });
  const cardsToShow = isExpanded ? matchingCards : matchingCards.slice(0, visibleLimit);
  const hasHiddenProducts = matchingCards.length > cardsToShow.length;

  productCards.forEach((card) => {
    const shouldShow = cardsToShow.includes(card);

    if (shouldShow) {
      card.classList.remove("is-hidden");
      requestAnimationFrame(() => {
        card.classList.remove("is-hiding");
      });
      return;
    }

    card.classList.add("is-hiding");
    setTimeout(() => {
      const currentMatchingCards = Array.from(productCards).filter((item) => {
        return currentFilter === "all" || item.dataset.brand === currentFilter;
      });
      const currentLimit = getVisibleCardLimit();
      const currentCardsToShow = isExpanded ? currentMatchingCards : currentMatchingCards.slice(0, currentLimit);

      if (!currentCardsToShow.includes(card)) {
        card.classList.add("is-hidden");
      }
    }, 240);
  });

  updateSeeMoreButton(hasHiddenProducts);
}

filterControls.forEach((control) => {
  control.addEventListener("click", () => {
    setActiveFilter(control);
    filterProducts(control.dataset.filter);
  });
});

if (seeMoreButton) {
  seeMoreButton.addEventListener("click", () => {
    isExpanded = true;
    renderProducts();
  });
}

window.addEventListener("resize", () => {
  if (!isExpanded) {
    renderProducts();
  }
});

filterProducts("all");



  const backToTop = document.getElementById("backToTop");
        const navToggler = document.querySelector(".custom-toggler");
        const navMenu = document.getElementById("navbarSupportedContent");
        const navOverlay = document.querySelector(".nav-overlay");

        if (navToggler && navMenu && navOverlay) {
            const openMenu = () => {
                navMenu.classList.add("show");
                navOverlay.classList.add("is-open");
                navToggler.classList.add("is-open");
                navToggler.setAttribute("aria-expanded", "true");
                document.body.classList.add("nav-open");
            };

            const closeMenu = () => {
                navMenu.classList.remove("show");
                navOverlay.classList.remove("is-open");
                navToggler.classList.remove("is-open");
                navToggler.setAttribute("aria-expanded", "false");
                document.body.classList.remove("nav-open");
            };

            navToggler.addEventListener("click", (event) => {
                event.stopPropagation();

                if (navMenu.classList.contains("show")) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            navOverlay.addEventListener("click", closeMenu);

            navMenu.querySelectorAll(".nav-link:not(.dropdown-toggle), .dropdown-item").forEach((link) => {
                link.addEventListener("click", closeMenu);
            });

            document.addEventListener("click", (event) => {
                if (!navMenu.classList.contains("show")) {
                    return;
                }

                const clickedInsideNavbar = event.target.closest(".navbar");

                if (!clickedInsideNavbar) {
                    closeMenu();
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth >= 992) {
                    closeMenu();
                }
            });
        }

        if (backToTop) {

            window.addEventListener("scroll", () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add("show");
                } else {
                    backToTop.classList.remove("show");
                }
            });

            backToTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

        }