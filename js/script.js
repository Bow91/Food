"use strict";

window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', event => {
                
        if(event.target && event.target.classList.contains('tabheader__item')) {
            tabs.forEach((item, index) => {
                if(item.textContent === event.target.innerText) {
                    hideTabContent();
                    showTabContent(index);
                }
            });            
        }
    });
   
    hideTabContent();
    showTabContent();

    // Timer

    const deadLine = '2021-11-31';

    function getTimeRemaining(endtime) {
        const time = Date.parse(endtime) - new Date(),
              days = Math.floor(time / (1000 * 60 * 60 * 24)),
              hours = Math.floor((time / (1000 * 60 *60)-3) % 24),
              minutes = Math.floor(time / (1000 * 60) % 60),
              seconds = Math.floor(time / 1000 % 60);

        return {
            time,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'), 
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
             
        function updateClock() {
            const timeRemaining = getTimeRemaining(endtime);
            
            days.textContent = getZero(timeRemaining.days);
            hours.textContent = getZero(timeRemaining.hours);
            minutes.textContent = getZero(timeRemaining.minutes);
            seconds.textContent = getZero(timeRemaining.seconds);
                       
            if (timeRemaining.total < 0) {
                clearInterval(timeInterval);
            }            
        }
        updateClock();  
    }
 
    setClock('.timer', deadLine);

    // Modal window

    const modalOpenBtns = document.querySelectorAll('[data-openmodal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-closemodal]');

    function modalOpen() {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden'; 
        clearTimeout(modalTimeOpen);
        window.removeEventListener('scroll', modalByScroll);
    }   

    function modalClose() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }
    
    modalOpenBtns.forEach(btn  => {
        btn.addEventListener('click', modalOpen);
    });

    modalCloseBtn.addEventListener('click', modalClose);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            modalClose();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === "Escape" && modal.classList.contains('show')) {
            modalClose();
        }
    });

    const modalTimeOpen = setTimeout(modalOpen, 15000);

    function modalByScroll()  {
        const ddE = document.documentElement; 
        if (ddE.scrollTop == (ddE.scrollHeight - ddE.clientHeight)) {
            modalOpen();
            window.removeEventListener('scroll', modalByScroll);
        }
    }

    window.addEventListener('scroll', modalByScroll);

    //  Cards menu class

    class AddNewCards {
        constructor(imgSrc, altText, menuSubtitle, menuDescr, menuPrice, parent, ...classes) {
            this.imgSrc = imgSrc;
            this.altText = altText;
            this.menuSubtitle = menuSubtitle;
            this.menuDescr = menuDescr;
            this.menuPrice = menuPrice;
            this.classes = classes;
            this.parent = document.querySelector(parent);
            this.transfer = 70;
            this.changeToRUB();
        }

        changeToRUB() {
            this.menuPrice *= this.transfer;
        }
        
        cardsAdd(){
            const element = document.createElement('div');
            if (this.classes.length < 1) {
                this.classes = ['menu__item'];
            }
            this.classes.forEach(className => element.classList.add(className));
            element.innerHTML += `
                <img src=${this.imgSrc} alt=${this.altText}>
                <h3 class="menu__item-subtitle">${this.menuSubtitle}</h3>
                <div class="menu__item-descr">${this.menuDescr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.menuPrice}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new AddNewCards(
        "img/tabs/vegy.jpg", 
        'vegy', 
        'Меню "Фитнес"', 
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 
        7, 
        '.menu .container',        
    ).cardsAdd();

    new AddNewCards(
        "img/tabs/elite.jpg", 
        'elite', 
        'Меню “Премиум”', 
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 
        15, 
        '.menu .container',
        'menu__item',
        'big'
    ).cardsAdd(); 

    new AddNewCards(
        "img/tabs/post.jpg", 
        'post', 
        'Меню "Постное"', 
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 
        3, 
        '.menu .container',        
    ).cardsAdd();   

});