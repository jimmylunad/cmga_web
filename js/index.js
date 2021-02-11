/** Variables y Selectores */
const btnBurger = document.querySelector('.header__btnBurger');
const navBar = document.querySelector('.navBar');
const navVertical = document.querySelector('.header__navVertical');
const optionsNavBar = document.querySelector('.header__options');
const optionsNavBarVertical = document.querySelector('.header__navVertical');
const allOptions = document.querySelectorAll('.option');
const allSections = document.querySelectorAll('div[id*="__divider"]');
const wrapperSlider = document.querySelector('.wrapper');

/** Funciones */
AOS.init();

const handleOpenMenu = () => {
	const { classList: classListBtn } = btnBurger;
	const { classList: classListNav } = navVertical;
	classListBtn.toggle('header__btnBurger--active');
	classListNav.toggle('header__navVertical--active')
};

const handleScrollToSection = (e) => {
	const { target } = e;
	const sectionNumber = Array.prototype.indexOf.call(target.parentNode.children, target);
	const sectionPositionY = allSections[sectionNumber].getBoundingClientRect().top;
	const documentTop = document.body.getBoundingClientRect().top;
	const offset = sectionPositionY - documentTop;
	window.scroll(0, offset);

	if (window.innerWidth <= 768) {
		handleOpenMenu();	
	}
};

const handleMenuSticky = () => {
	const { classList } = navBar;
	const windowTop = window.pageYOffset;
	const firstSection = allSections[0].getBoundingClientRect().top + windowTop;
	if (firstSection <= windowTop && !classList.contains('navBar--active')) {
		classList.add('navBar--active');
	} else if (firstSection > windowTop && classList.contains('navBar--active')) {
		classList.remove('navBar--active');
	}
};

const handleOptionsActive = () => {
	const lengthOps = allOptions.length;
	const windowTop = window.pageYOffset;
	const sectionsPosition = [...allSections].map((section) => (
		Math.floor(section.getBoundingClientRect().top + windowTop)
	));

	[...allOptions].forEach((option, idx) => {
		const { classList } = option;
		if (idx + 1 < lengthOps) {
			windowTop >= sectionsPosition[idx] && windowTop < sectionsPosition[idx + 1]
			? classList.add('option--active')
			: classList.remove('option--active')
		} else {
			windowTop >= sectionsPosition[idx]
			? classList.add('option--active')
			: classList.remove('option--active')
		}
	});
};

const handleDataImages = (() => {
    let array;
    const windowWidth = window.innerWidth;
    const imgWidth = 80/3;
    array = Array(30).fill(30).map((e, i) => ({ img: `https://picsum.photos/200/200?ramdom=${i}` }));

    while ((array.length % 3) !== 0 || (array.length * imgWidth) <= windowWidth) {
      array.push(array[Math.floor(Math.random() * array.length)]);
    }

    /**
     * Desde aca se ordenan las imagenes para 
     * renderizar por columnas.
     */
    let col = 0;
    const objectDataImages = {};
    const imagesDividen = array.map((e, i) => {
      if ((i) % 3 == 0) col += 1;
      return ({
        col,
        img: e.img,
      })
    });
    imagesDividen.forEach((obj) => {
      objectDataImages[obj.col] = imagesDividen
        .filter((e) => e.col == obj.col)
        .map((e) => e.img);
		});
		
		/**Armar html slider */
		Object.keys(objectDataImages).forEach((col) => {
			const column = document.createElement('div');
			column.className = 'column';
			objectDataImages[col].forEach((e) => {
				column.innerHTML = column.innerHTML + `<div class="partner"><img src="${e}" /></div>`
			});
			wrapperSlider.appendChild(column);
		})
		Object.keys(objectDataImages).forEach((col) => {
			const column = document.createElement('div');
			column.className = 'column';
			objectDataImages[col].forEach((e) => {
				column.innerHTML = column.innerHTML + `<div class="partner"><img src="${e}" /></div>`
			});
			wrapperSlider.appendChild(column);
		})
  })();

/** Eventos */
const eventListeners = (() => {
	/** Abrir y cerrar menú lateral */
	btnBurger.addEventListener('click', handleOpenMenu);

	/** Hacer scroll a las secciones */
	optionsNavBar.addEventListener('click', handleScrollToSection);

	/** Hacer scroll a las secciones Nav Vertical */
	optionsNavBarVertical.addEventListener('click', handleScrollToSection);

	window.addEventListener('scroll', () => {
		handleMenuSticky();
		handleOptionsActive();
	});
})();
