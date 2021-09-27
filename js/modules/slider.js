function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    const buttonsSliderLeft = document.querySelector(prevArrow),
          buttonsSliderRight = document.querySelector(nextArrow),
          slides = document.querySelectorAll(slide),
          slider = document.querySelector(container),
          currentSlider = document.querySelector(currentCounter),
          totalSlides = document.querySelector(totalCounter),
          slidesWrapper = document.querySelector(wrapper),
          slidesField = slidesWrapper.querySelector(field),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let offset = 0;
    const widthNumber = +width.replace(/\D/g, '');
    currentSlider.textContent = '01';

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.6s ';
    slidesWrapper.style.overflow = 'hidden';
    
    slider.style.position = 'relative';

    slides.forEach(slide => {
        slide.style.width = width;
    });   

    buttonsSliderRight.addEventListener('click', () => {
        if (offset == widthNumber * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += widthNumber;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(1);
    });

    buttonsSliderLeft.addEventListener('click', () => {
        if (offset == 0) {
            offset = widthNumber * (slides.length - 1);
        } else {
            offset -= widthNumber;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(-1);
    });
    
    if (slides.length < 10) {
        totalSlides.textContent = `0${slides.length}`;
    } else {
        totalSlides.textContent = slides.length;
    }
    
    function flipSlide(n){
        currentSlider.textContent = +currentSlider.textContent + n;
        if (currentSlider.textContent > slides.length) {
            currentSlider.textContent = 1;
        }
        if (currentSlider.textContent < 1) {
            currentSlider.textContent = slides.length;
        }
        tapSlide();
    }

    function tapSlide() {
        if (currentSlider.textContent < 10 && currentSlider.textContent.length < 2) {
            currentSlider.textContent = `0${currentSlider.textContent}`;
        }
        dotsArr.forEach(dot => dot.style.opacity = 0.5);
        dotsArr[+currentSlider.textContent - 1].style.opacity = 1;
    }

    const indicators = document.createElement('ol'),
          dotsArr = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 1; i <= slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i);
        dot.classList.add('dot');
        if (i == +currentSlider.textContent) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dotsArr.push(dot);
    }

    dotsArr.forEach(dot => {
        dot.addEventListener('click', event => {
            offset = (event.target.getAttribute('data-slide-to') - 1) * widthNumber;
            slidesField.style.transform = `translateX(-${offset}px)`;
            
            currentSlider.textContent = event.target.getAttribute('data-slide-to');
            tapSlide();
        });
    });
}
export default slider;