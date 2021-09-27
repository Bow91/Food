function modalOpen(modalSelector, modalTimeOpen, modalByScroll) {
    const modal = document.querySelector(modalSelector);    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; 
    if (modalTimeOpen) {
        clearInterval(modalTimeOpen);
    }
    window.removeEventListener('scroll', modalByScroll);
}   

function modalClose(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modalWindow(dataSelector, modalSelector, modalTimeOpen, modalByScroll) {
    const modalOpenBtns = document.querySelectorAll(dataSelector),
          modal = document.querySelector(modalSelector);


    modalOpenBtns.forEach(btn  => {
        btn.addEventListener('click', () => {
            modalOpen(modalSelector, modalTimeOpen);
            window.removeEventListener('scroll', modalByScroll);
        });
    });

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.classList.contains('modal__close')) {
            modalClose(modalSelector);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === "Escape" && modal.classList.contains('show')) {
            modalClose(modalSelector);
        }
    });

    window.addEventListener('scroll', modalByScroll);
}
export default modalWindow;
export {modalOpen, modalClose};