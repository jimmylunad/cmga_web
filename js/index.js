/** Variables y Selectores */
const API = 'https://api.acmga.org/v1';
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const loadingPage = document.querySelector('#loadingPage');
const btnBurger = document.querySelector('.header__btnBurger');
const navBar = document.querySelector('.navBar');
const navVertical = document.querySelector('.header__navVertical');
const optionsNavBar = document.querySelector('.header__options');
const optionsNavBarVertical = document.querySelector('.header__navVertical');
const allOptions = document.querySelectorAll('.option');
const allSections = document.querySelectorAll('div[id*="__divider"]');
const wrapperSlider = document.querySelector('.wrapper');
const form = document.querySelector('#formContactUs');
const allFields = form.querySelectorAll('input, textarea');
const btnTeamRepresentative = document.querySelector('.wrapperLeft__btnTeam');
const popupRepresentative = document.querySelector('.teamRepresentative');
const popupIconCloseRepresentative = popupRepresentative.querySelector('.popUp__close');
const formTakePart = document.querySelector('#formTakePart');
const allTakePartFields = formTakePart.querySelectorAll('input');

const tabsTakePart = document.querySelectorAll('.formSteps__content');
const takePartButton = document.querySelectorAll('.formSteps__button');

const fileDeposit = document.querySelector('#file_deposit');

let objTakePart = {
	file_deposit: '',
	operation_number: '',
	document_number: '',
	names: '',
	lastnames: '',
	mobile_phone: '',
	mail: ''
};

let formDataTakePart = new FormData();

let formValues = {
	fullname: '',
	email: '',
	phone: '',
	message: '',
};

/** Funciones */
AOS.init();

const setLoadingPage = (activate) => {
	if (activate) {
		loadingPage.style.display = 'flex';
		document.body.style.overflowY = 'hidden';
	} else {
		loadingPage.style.display = 'none'
		document.body.style.overflowY = 'auto';
	}
}

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

const handleDataImages = () => {
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
};

const openClosePopupTeamRepresentative = () => {
	const { classList } = popupRepresentative;
	classList.toggle('teamRepresentative--active');
}

const takePartSelected = (e) => {
	const { step } = e.target.dataset;

	tabsTakePart.forEach(function(el, i, a) {
		if(step == i) {
			el.className += ' active';
		} else {
			el.className = el.className.replace(" active", "");
		}

	})
}

const removeMessageError = (nameField) => {
  const field = [...allFields].filter((e) => e.id == nameField)[0];
  const error = field.parentNode.querySelector('p.error');

	if (error) {
    field.classList.remove('error');
    error.remove();
  }
};

const removeMessageErrorTakePart = (nameField) => {
  const field = [...allTakePartFields].filter((e) => e.id == nameField)[0];
  const error = field.parentNode.querySelector('p.error');

	if (error) {
    field.classList.remove('error');
    error.remove();
  }
};

const setMessageError = (nameField, msg = "Este campo es requerido") => {
  const mensajeError = document.createElement('p');
	mensajeError.textContent = msg;
	mensajeError.classList.add('error');

  const field = [...allFields].filter((e) => e.id == nameField)[0];
  const fieldParent = field.parentNode;
  const error = fieldParent.querySelectorAll('p.error');

	if (error.length === 0) {
		fieldParent.appendChild(mensajeError);
    field.classList.add('error');
	}
}

const setMessageErrorTakePart = (nameField, msg = "Este campo es requerido") => {
  const mensajeError = document.createElement('p');
	mensajeError.textContent = msg;
	mensajeError.classList.add('error');

  const field = [...allTakePartFields].filter((e) => e.id == nameField)[0];
  const fieldParent = field.parentNode;
  const error = fieldParent.querySelectorAll('p.error');

	if (error.length === 0) {
		fieldParent.appendChild(mensajeError);
    field.classList.add('error');
	}
}

const handleOnChange = (e) => {
  const { name, value } = e.target;

  formValues = {
    ...formValues,
    [name]: value,
  };

  if (value.length) { removeMessageError(name); }
};

const handleOnChangeTakePart = (e) => {
  const { name, value } = e.target;

  objTakePart = {
    ...objTakePart,
    [name]: value,
  };

	document.querySelector('#btnStepOne').disabled = (!objTakePart.file_deposit || !objTakePart.operation_number);
	
	document.querySelector('#btnStepTwo').disabled = (!objTakePart.document_number || !objTakePart.names || !objTakePart.lastnames || !objTakePart.mobile_phone || !objTakePart.mail);

  if (value.length) { removeMessageErrorTakePart(name); }
};

const handleValidateForm = (e) => {
  const { value, name: nameField, type } = e.target;
  if (value.length > 0) {
    if(type === 'email') {
			if (!emailRegex.test(value)) {
				setMessageError(nameField, 'Email inválido');
			}
		}
  } else {
    setMessageError(nameField);
  }
}

const handleValidateFormTakePart = (e) => {
  const { value, name: nameField, type } = e.target;
  if (value.length > 0) {
    if(type === 'email') {
			if (!emailRegex.test(value)) {
				setMessageErrorTakePart(nameField, 'Email inválido');
			}
		}
  } else {
    setMessageErrorTakePart(nameField);
  }
}

const handleValidateSubmit = () => {
  const isFieldEmpty = [...allFields].some((field) => field.value == '');
  const isFormError = [...allFields].map((e) => e.parentNode.querySelector('.error')).some(error => error !== null);

  if(isFieldEmpty || isFormError) {
    const fields = [...allFields];
		fields.forEach(e => { if( e.value == '' ) setMessageError(e.name); });
    const firstField = fields.filter(e => e.value == '' || e.parentNode.querySelector('.error'))[0];
    const firstFieldPosition = firstField.parentNode.getBoundingClientRect().top;
    const documentTop = document.body.getBoundingClientRect().top;
    const offset = firstFieldPosition - documentTop;
    window.scroll(0, offset - 60);
    return false;
	}
  return true;
}

const handleSubmit = async (e) => {
	e.preventDefault();
  const isValid = handleValidateSubmit();
  if (!isValid) return;
	spinner.style.display = 'flex';

	const response = await fetch(`${API}/save_contact`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formValues)
  });
  const content = await response.json();

	spinner.style.display = 'none';
	form.reset();
	// crear mensaje en insertar despues de spoinner
	const messageSuccess = document.createElement('div');
	messageSuccess.textContent = content.body.successMessage;
	messageSuccess.classList.add('success');
	document.body.appendChild(messageSuccess);
	setTimeout(() => {
		messageSuccess.remove();
	}, 5000);
};

const handleValidateSubmitTakePart = () => {
  const isFieldEmpty = [...allTakePartFields].some((field) => field.value == '');
  const isFormError = [...allTakePartFields].map((e) => e.parentNode.querySelector('.error')).some(error => error !== null);

  if(isFieldEmpty || isFormError) {
    const fields = [...allTakePartFields];
		fields.forEach(e => { if( e.value == '' ) setMessageError(e.name); });
    const firstField = fields.filter(e => e.value == '' || e.parentNode.querySelector('.error'))[0];
    const firstFieldPosition = firstField.parentNode.getBoundingClientRect().top;
    const documentTop = document.body.getBoundingClientRect().top;
    const offset = firstFieldPosition - documentTop;
    window.scroll(0, offset - 60);
    return false;
	}
  return true;
}

const handleSubmitTakePart = async (e) => {
	e.preventDefault();
  const isValid = handleValidateSubmitTakePart();
  if (!isValid) return;
	spinner.style.display = 'flex';

	console.log(objTakePart);

	// const response = await fetch(`${API}/save_contact`, {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(formValues)
  // });
  // const content = await response.json();

	// spinner.style.display = 'none';
	// form.reset();
	// // crear mensaje en insertar despues de spoinner
	// const messageSuccess = document.createElement('div');
	// messageSuccess.textContent = content.body.successMessage;
	// messageSuccess.classList.add('success');
	// document.body.appendChild(messageSuccess);
	// setTimeout(() => {
	// 	messageSuccess.remove();
	// }, 5000);
};

/** Eventos */
const eventListeners = (() => {
	setLoadingPage(true);

	document.addEventListener('DOMContentLoaded', () => {
		window.scroll(0, 0);
		setTimeout(() => { setLoadingPage(false) }, 3000);

		handleDataImages();

		/** Abrir y cerrar menú lateral */
		btnBurger.addEventListener('click', handleOpenMenu);

		/** Hacer scroll a las secciones */
		optionsNavBar.addEventListener('click', handleScrollToSection);

		/** Hacer scroll a las secciones Nav Vertical */
		optionsNavBarVertical.addEventListener('click', handleScrollToSection);

		btnTeamRepresentative.addEventListener('click', openClosePopupTeamRepresentative);
		popupIconCloseRepresentative.addEventListener('click', openClosePopupTeamRepresentative);
		popupRepresentative.addEventListener('click', (e) => {
			const { classList } = e.target;
			if (classList.contains('teamRepresentative--active')) {
				popupRepresentative.classList.remove('teamRepresentative--active');
			}
		});

		// campos del formulario
    allFields.forEach((field) => {
      field.addEventListener('blur', handleValidateForm);
      field.addEventListener('input', handleOnChange);
    });

		allTakePartFields.forEach((field) => {
			field.addEventListener('blur', handleValidateFormTakePart);
			field.addEventListener('input', handleOnChangeTakePart);
		})

    form.addEventListener('submit', handleSubmit);
    
		formTakePart.addEventListener('submit', handleSubmitTakePart);

		window.addEventListener('scroll', () => {
			handleMenuSticky();
			handleOptionsActive();
		});
		
		/** click en el tab */
		takePartButton.forEach((field) => {
			field.addEventListener('click', takePartSelected);
		})

		/** validate ficha */
		fileDeposit.addEventListener('change', (e) => {
			if(e.target.files.length) {
				formDataTakePart.append('file_deposit',e.target.files[0], e.target.files[0].name);
				document.querySelector('.filesuccess').innerHTML = e.target.files[0].name;

				objTakePart = {
					...objTakePart,
					file_deposit: e.target.files[0].name
				}
			}
		})
	})
})();
