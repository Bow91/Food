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
          modal = document.querySelector('.modal');

    function modalOpen() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
        clearInterval(modalTimeOpen);
        window.removeEventListener('scroll', modalByScroll);
    }   

    function modalClose() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    modalOpenBtns.forEach(btn  => {
        btn.addEventListener('click', modalOpen);
    });

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.classList.contains('modal__close')) {
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

    axios.get('http://localhost:3000/menu')
    .then(result => result.data.forEach(item => new AddNewCards(
      item.img, 
      item.altimg, 
      item.title, 
      item.descr, 
      item.price, 
      '.menu .container'       
    ).cardsAdd()));
     

    // Form for sending to the server

    const forms = document.querySelectorAll('form'),
          message = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Скоро мы с вами свяжемся',
              failure: 'Произошла ошибка...'
          };

    forms.forEach(item => {
        bindData(item);
    });

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method: 'POST',               
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
        });

        return await result.json();
    };

    function bindData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto
                `;
            form.insertAdjacentElement('afterend', statusMessage);
          
            const formData = new FormData(form);

            const object = Object.fromEntries(formData.entries());
            
            postData('http://localhost:3000/requests', object)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);                  
                statusMessage.remove();
            }).catch(() => showThanksModal(message.failure))
            .finally(() => form.reset());
        });
    }

    function showThanksModal(message) {
        const modalDialog = document.querySelector('.modal__dialog');
        modalDialog.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-closemodal>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {            
            thanksModal.remove();
            modalDialog.classList.add('show');
            modalDialog.classList.remove('hide');
            modalClose();
        },4000);
    }

    // Sliders

    const buttonsSliderLeft = document.querySelector('.offer__slider-prev'),
          buttonsSliderRight = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
          currentSlider = document.querySelector('#current'),
          totalSlides = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = slidesWrapper.querySelector('.offer__slider-iner'),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let offset = 0;
    currentSlider.textContent = '01';

    console.log(width);
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.6s ';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    buttonsSliderRight.addEventListener('click', () => {
        console.log('tik');
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(1);
    });

    buttonsSliderLeft.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(-1);
    });
    
    if (slides.length < 10) {
        totalSlides.textContent = `0${slides.length}`;
    } else {
        totalSlides.textContent = slides.length;
    }
    
    function flipSlide (n){
        currentSlider.textContent = +currentSlider.textContent + n;
        if (currentSlider.textContent > slides.length) {
            currentSlider.textContent = 1;
        }
        if (currentSlider.textContent < 1) {
            currentSlider.textContent = slides.length;
        }
        if (currentSlider.textContent < 10 && currentSlider.textContent.length < 2) {
            currentSlider.textContent = `0${currentSlider.textContent}`;
        }
    }
});

//npx json-server --watch db.json