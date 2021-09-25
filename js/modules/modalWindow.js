function modalWindow() {
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
}
module.exports = modalWindow;