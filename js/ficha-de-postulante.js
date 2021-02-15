const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const today = new Date().toISOString().split("T")[0];
const datepicker = document.querySelector('#dateBirth');
const form = document.querySelector('#formPostulant');
const allFields = form.querySelectorAll('input');
const spinner = document.querySelector('#spinner');
let formValues = {
  names: '',
  address: '',
  district: '',
  province: '',
  department: '',
  country: '',
  telephone: '',
  document: '',
  email: '',
  dateBirth: '',
  placeBirth: '',
  state: '',
  university: '',
  profession: '',
  specialiy: '',
  currentJob: '',
  experiencie: '',
  partner: '',
  yearAttendance: '',
};

const removeMessageError = (nameField) => {
  const field = [...allFields].filter((e) => e.id == nameField)[0];
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

const handleOnChange = (e) => {
  const { name, value } = e.target;

  formValues = {
    ...formValues,
    [name]: value,
  };

  if (value.length) { removeMessageError(name); }
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
    window.scroll(0, offset);
    return false;
	}
  return true;
}

const handleSubmit = (e) => {
	e.preventDefault();

  const isValid = handleValidateSubmit();

  if (!isValid) return;

	spinner.style.display = 'flex';
	setTimeout(() => {
    spinner.style.display = 'none';
    form.reset();
    // crear mensaje en insertar despues de spoinner
    const messageSuccess = document.createElement('div');
    messageSuccess.textContent = 'Registro se realizado con éxito';
    messageSuccess.classList.add('success');
    document.body.appendChild(messageSuccess);
    setTimeout(() => {
      messageSuccess.remove();
    }, 3000);
	}, 3000);
};

/** Eventos */
const eventListeners = (() => {
	document.addEventListener('DOMContentLoaded', () => {
    datepicker.setAttribute("max", today);
    
    // campos del formulario
    allFields.forEach((field) => {
      field.addEventListener('blur', handleValidateForm);
      field.addEventListener('input', handleOnChange);
    });

    form.addEventListener('submit', handleSubmit);
  })
})();