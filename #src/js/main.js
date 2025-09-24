if (document.querySelector(".preloader")) {
    window.addEventListener("load", (event) => {
        setTimeout(() => {
            enableScroll()
            document.body.classList.add('loaded');
        }, 100);
    });
}
const header = document.querySelector(".header")
const mobMenu = document.querySelector(".header__bottom")
const iconMenu = document.querySelector('.icon-menu');
const modal = document.querySelectorAll(".modal")
let animSpd = 400
let bp = {
    largeDesktop: 1450.98,
    desktop: 1250.98,
    laptop: 1000.98,
    tablet: 767.98,
    phone: 575.98
}
//debounce
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}
//scroll pos
function scrollPos() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
}
function checkIOS() {
    let platform = navigator.platform;
    let userAgent = navigator.userAgent;
    return (
        // iPhone, iPod, iPad
        /(iPhone|iPod|iPad)/i.test(platform) ||
        // iPad на iOS 13+
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
        // User agent проверка
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
}
let isIOS = checkIOS()
//enable scroll
function enableScroll() {
    if (!document.querySelector(".modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")

        // для IOS
        if (isIOS) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            let scrollY = document.body.dataset.scrollY;
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");

        // для IOS
        if (isIOS) {
            let scrollY = scrollPos();
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
            document.body.dataset.scrollY = scrollY;
        }
    }
}
//smoothdrop
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `height ${animDur}ms ease`;
    body.style['-webkit-transition'] = `height ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        header.parentNode.setAttribute('aria-expanded', true)
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        body.setAttribute('aria-hidden', false)
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        header.parentNode.setAttribute('aria-expanded', false)
        let height = body.clientHeight + 'px';
        body.style.height = height
        body.setAttribute('aria-hidden', true)
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
            }, animDur);
        }, 0);
    }
}
//tabSwitch
function tabSwitch(nav, block) {
    nav.forEach((item, idx) => {
        item.addEventListener("click", () => {
            nav.forEach(el => {
                el.classList.remove("active")
                el.setAttribute("aria-selected", false)
            })
            item.classList.add("active")
            item.setAttribute("aria-selected", true)
            block.forEach(el => {
                if (el.dataset.block === item.dataset.tab) {
                    if (!el.classList.contains("active")) {
                        el.classList.add("active")
                        el.style.opacity = "0"
                        setTimeout(() => {
                            el.style.opacity = "1"
                        }, 0);
                    }
                } else {
                    el.classList.remove("active")
                }
            })
        })
    });
}
// custom scroll FF
const customScroll = document.querySelectorAll(".custom-scroll")
let isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
    document.documentElement.style.scrollbarColor = "#8a2a2b #f1f2f2"
}
if (isFirefox && customScroll) {
    customScroll.forEach(item => { item.style.scrollbarColor = "#8a2a2b #f1f2f2" })
}
//anchor
const anchorLinks = document.querySelectorAll(".js-anchor")
if (anchorLinks.length) {
    anchorLinks.forEach(item => {
        item.addEventListener("click", e => {
            let idx = item.getAttribute("href").indexOf("#")
            const href = item.getAttribute("href").substring(idx)
            let dest = document.querySelector(href)
            if (dest) {
                e.preventDefault()
                let destPos = dest.getBoundingClientRect().top < 0 ? dest.getBoundingClientRect().top - header.clientHeight - 10 : dest.getBoundingClientRect().top - 10
                if (iconMenu.classList.contains("active")) {
                    iconMenu.click()
                    setTimeout(() => {
                        window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                    }, 300);
                } else {
                    window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                }
            }
        })
    })
}
//fixed header
let lastScroll = scrollPos();
window.addEventListener("scroll", () => {
    if (scrollPos() > 1) {
        header.classList.add("scroll")
        if (header.classList.contains("header--main")) {
            header.classList.remove("header--light")
        }
        if ((scrollPos() > lastScroll && scrollPos() > 150 && !header.classList.contains("unshow"))) {
            header.classList.add("unshow")
        } else if (scrollPos() < lastScroll && header.classList.contains("unshow")) {
            header.classList.remove("unshow")
        }
    } else {
        header.classList.remove("scroll")
        header.classList.remove("unshow")
        if (header.classList.contains("header--main")) {
            header.classList.add("header--light")
        }
    }
    lastScroll = scrollPos()
})
//switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block")
if (switchBlock) {
    switchBlock.forEach(item => {
        tabSwitch(item.querySelectorAll("[data-tab]"), item.querySelectorAll("[data-block]"))
    })
}
//open modal
function openModal(modal) {
    let activeModal = document.querySelector(".modal.open")
    disableScroll()
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    modal.classList.remove("open")
    setTimeout(() => {
        enableScroll()
    }, animSpd);
}
// modal click outside
if (modal) {
    modal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".modal__content").contains(e.target)) {
                closeModal(mod);
            }
        });
        mod.querySelectorAll(".modal__close").forEach(btn => {
            btn.addEventListener("click", () => {
                closeModal(mod)
            })
        })
    });
}
// modal button on click
function modalShowBtns() {
    const modOpenBtn = document.querySelectorAll(".mod-open-btn")
    if (modOpenBtn.length) {
        modOpenBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                openModal(document.getElementById(href))
            })
        })
    }
}
modalShowBtns()
// modal close button on click
function modalUnshowBtns() {
    const modCloseBtn = document.querySelectorAll(".mod-close-btn")
    if (modCloseBtn.length) {
        modCloseBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                closeModal(document.getElementById(href))
            })
        })
    }
}
modalUnshowBtns()
//accordion
const accordion = document.querySelectorAll(".accordion")
if (accordion.length) {
    accordion.forEach(item => {
        item.querySelector(".accordion__header").addEventListener("click", () => {
            if (!item.classList.contains("no-close")) {
                let collection = item.classList.contains("marathon-acc") ? document.querySelectorAll(".marathon-acc") : item.parentNode.querySelectorAll(".accordion")
                collection.forEach(el => {
                    if (el.querySelector(".accordion__header").classList.contains("active")) {
                        smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
                        if (el.getBoundingClientRect().top < 0) {
                            let pos = scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                            window.scrollTo(0, pos)
                        }
                    }
                })
            }
            smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
        })
    })
}
//menu
if (iconMenu && mobMenu) {
    iconMenu.addEventListener("click", () => {
        if (!iconMenu.classList.contains("active")) {
            iconMenu.setAttribute("aria-expanded", true)
            iconMenu.setAttribute("aria-label", "Закрыть меню")
            iconMenu.classList.add("active")
            mobMenu.classList.add("open")
            disableScroll()
        } else {
            iconMenu.setAttribute("aria-expanded", false)
            iconMenu.setAttribute("aria-label", "Открыть меню")
            iconMenu.classList.remove("active")
            mobMenu.classList.remove("open")
            enableScroll()
        }
    })
    window.addEventListener("resize", () => {
        if (window.innerWidth > bp.laptop && iconMenu.classList.contains("active")) {
            iconMenu.click()
        }
    })
}
//swiper 1 items
const swiper1 = document.querySelectorAll('.swiper1')
if (swiper1.length) {
    swiper1.forEach(item => {
        let itemSwiper = new Swiper(item.querySelector(".swiper"), {
            slidesPerView: 1,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            effect: "fade",
            fadeEffect: { crossFade: true },
            navigation: {
                prevEl: item.querySelector(".nav-btn--prev"),
                nextEl: item.querySelector(".nav-btn--next"),
            },
            speed: 500,
        });
    })
}
//authors swiper
const authorsSticky = document.querySelector(".authors__sticky")
let authorsMainSwiper
if (document.querySelector(".authors__swiper")) {
    const authorsThumbs = new Swiper(".authors__thumbswiper", {
        slidesPerView: 'auto',
        spaceBetween: 9,
        direction: "horizontal",
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        speed: 800,
        scrollbar: {
            el: document.querySelector(".authors .swiper-scrollbar"),
            draggable: true,
        },
        breakpoints: {
            575.98: {
                direction: "vertical"
            }
        }
    })
    authorsMainSwiper = new Swiper(".authors__mainswiper", {
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        thumbs: {
            swiper: authorsThumbs
        },
        speed: 500
    })
}
// institutions on hover || click
const instItem = document.querySelectorAll('.item-inst')
if (instItem.length) {
    instItem.forEach(item => {
        item.addEventListener("click", () => {
            document.querySelector("#inst-modal .inst-modal__inner").innerHTML = item.innerHTML
            openModal(document.querySelector("#inst-modal"))
        })
    })
}
// fadeUp animation
function animate() {
    const elements = document.querySelectorAll('[data-animation]');
    elements.forEach(async item => {
        const itemTop = item.getBoundingClientRect().top;
        const itemPoint = Math.abs(window.innerHeight - item.offsetHeight * 0.1);
        const itemScrolled = itemPoint > 100 ? itemPoint : 100;
        if (itemTop - itemScrolled < 0) {
            const animName = item.getAttribute("data-animation");
            item.classList.add(animName);
            item.removeAttribute("data-animation");
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    ScrollTrigger.refresh(true)
    animate()
    window.addEventListener("scroll", animate)
    // authors animation
    if (authorsSticky && authorsMainSwiper) {
        let slideCount = document.querySelectorAll(".authors__mainswiper .swiper-slide").length
        let activeIndex = { value: 0 }
        gsap.to(activeIndex, {
            value: slideCount - 1,
            scrollTrigger: {
                trigger: ".authors__sticky",
                start: "center center",
                end: "+=" + 300 * slideCount,
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: () => {
                    authorsMainSwiper.slideTo(Math.round(activeIndex.value))
                },
            }
        })
    }
});
window.addEventListener("load", () => {
    ScrollTrigger.refresh(true)
});
window.addEventListener("resize", debounce(() => ScrollTrigger.refresh(true), 500));
function imgLazyLoad(timeout) {
    let lazyImages = document.querySelectorAll("img[loading='lazy']")
    let debouncedLog = debounce(() => ScrollTrigger.refresh(true), timeout || 1000);
    function onImgLoad() {
        debouncedLog()
    }
    lazyImages.forEach(img => {
        img.complete ? onImgLoad() : img.addEventListener("load", onImgLoad);
    });
}
imgLazyLoad();
//individ swiper
const individSec = document.querySelector(".individ-sec")
if (individSec) {
    new Swiper(individSec.querySelector(".swiper"), {
        slidesPerView: 2,
        spaceBetween: 16,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        speed: 800,
        grid: {
            rows: 10,
            fill: 'row'
        },
        navigation: {
            prevEl: individSec.querySelector(".nav-btn--prev"),
            nextEl: individSec.querySelector(".nav-btn--next"),
        },
        breakpoints: {
            1250.98: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            767.98: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            575.98: {
                slidesPerView: 3,
                spaceBetween: 16,
            },
        },
    })
}
//org swiper
const orgSec = document.querySelector(".org-sec")
if (orgSec) {
    new Swiper(orgSec.querySelector(".swiper"), {
        slidesPerView: 1,
        spaceBetween: 16,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        speed: 800,
        grid: {
            rows: 3,
            fill: 'row'
        },
        navigation: {
            prevEl: orgSec.querySelector(".nav-btn--prev"),
            nextEl: orgSec.querySelector(".nav-btn--next"),
        },
        breakpoints: {
            767.98: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            480.98: {
                slidesPerView: 2,
                spaceBetween: 16,
            },
        },
    })
}
//gallery swiper
const gallery = document.querySelector(".gallery")
if (gallery) {
    const gallCurrent = gallery.querySelector("[data-slide-current]")
    const gallTotal = gallery.querySelector("[data-slide-total]")
    let gallSlidesCount = gallery.querySelectorAll(".swiper-slide").length
    new Swiper(gallery.querySelector(".swiper"), {
        slidesPerView: 1,
        spaceBetween: 16,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        speed: 800,
        navigation: {
            prevEl: gallery.querySelector(".nav-btn--prev"),
            nextEl: gallery.querySelector(".nav-btn--next"),
        },
        breakpoints: {
            1250.98: {
                slidesPerView: "auto",
                spaceBetween: 20,
            },
            767.98: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            480.98: {
                slidesPerView: 2,
                spaceBetween: 16,
            },
        },
        on: {
            slideChange: (swiper) => {
                let thisSlide = swiper.activeIndex + 1
                if (gallCurrent) {
                    gallCurrent.textContent = thisSlide < 10 ? "0" + thisSlide : thisSlide
                }
            }
        }

    })
    if (gallTotal) {
        gallTotal.textContent = gallSlidesCount < 10 ? "0" + gallSlidesCount : gallSlidesCount
    }

}
//editions line
const editionRow = document.querySelector(".editions__row")
const itemEdition = document.querySelectorAll(".item-edition")
const line = document.querySelector('.editions__line');
if (editionRow && line && itemEdition.length && itemEdition.length % 3 === 0 && itemEdition.length % 2 !== 0) {
    function editionsLine() {
        let winW = window.innerWidth
        if (winW < bp.desktop && winW > bp.phone) {
            editionRow.classList.add("extra-item")
            const lastItem = itemEdition[itemEdition.length - 1];
            const rectBounds = lastItem.getBoundingClientRect();
            let topLeft = { x: rectBounds.left, y: rectBounds.top };
            let bottomRight = { x: rectBounds.right, y: rectBounds.bottom };
            let length = Math.sqrt(
                Math.pow(bottomRight.x - topLeft.x, 2) +
                Math.pow(bottomRight.y - topLeft.y, 2)
            );
            const angle = Math.atan2(
                bottomRight.y - topLeft.y,
                bottomRight.x - topLeft.x
            ) * 180 / Math.PI;
            line.style.width = length + 'px';
            line.style.transform = `rotate(${-angle}deg) translateY(-100%)`;

        } else {
            editionRow.classList.remove("extra-item")
        }
    }
    editionsLine()
    const editionDebounce = debounce(editionsLine, 300)
    window.addEventListener("resize", editionDebounce);
}
// pageUp
const pageUp = document.querySelector(".page-up")
if (pageUp) {
    pageUp.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
