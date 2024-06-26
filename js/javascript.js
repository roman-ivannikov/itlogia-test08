window.onload = () => {

    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const ERROR_COLOR = 'palevioletred';
    const SUCCESS_COLOR = 'greenyellow';


    const funcShared = (element) => {
        return document.getElementById(element);
    }

    const form = funcShared('form');
    const checkboxAgree = funcShared('agree');
    const modal = funcShared('modal');
    const btnForm = funcShared('form-btn-action');
    const linkSwitchForm = funcShared('link-switch-form');
    const formInputs = form.querySelectorAll('input');


    /*
    // Обработчик изменения значений в полях формы
     */
    function handleInputChange(event) {
        const input = event.target;

        if (input.id === 'full-name') {
            input.value = input.value.replace(/[0-9]/g, "");
        } else if (input.id === 'username') {
            input.value = input.value.replace(/[/.,]/g, "");
        }

        input.value !== '' ?
            input.style.borderColor = SUCCESS_COLOR :
            input.style.borderColor = '';

    }

    /*
    // Валидация полей формы
    // Логика проверки зависит от текущей роли формы - Регистрация (SignUp) или Авторизация (Login)
    */
    const validateInputs = () => {

        const inputElements = form.querySelectorAll('input:not([hidden]).js-required');
        let password = null;
        let confirmPassword = null;
        for (let i = 0; i < inputElements.length; i++) {
            const input = inputElements[i];

            if (input.value === '') {
                alert(`Заполните поле "${input.previousElementSibling.innerText}"`);
                input.style.borderColor = ERROR_COLOR;
                return false;
            }

            if (input.id === 'email' && ! EMAIL_REGEXP.test(input.value)) {
                alert('Введен некорректный Email');
                input.style.borderColor = ERROR_COLOR;
                return false;
            }

            if (input.id === 'password') {
                password = input.value;
            }

            if (input.id === 'repeat-password') {
                confirmPassword = input.value;
            }
        }

        if (password !== null && confirmPassword !== null) {
            if (password.length < 8) {
                alert('Пароль должен содержать не менее 8-ми символов');
                return false;
            }
            if (password !== confirmPassword) {
                alert('Введенные пароли не совпадают!');
                return false;
            }
        }

        if (!checkboxAgree.hidden && !checkboxAgree.checked) {
            alert('Не отмечен чекбокс Agree!');
            return false;
        }

        return true;

    }

    /*
    // Обработчик нажатия кнопки формы в роли Регистрации (SignUp)
     */
    function handleClickSignUp(e) {
        e.preventDefault();

        const validate = validateInputs();

        if (!validate) {
            return false;
        }

        modal.classList.add('modal_show');

        modal.onclick = (e) => {
            if (null === e.target.closest('.modal__body') || null !== e.target.closest('.modal__btn')) {
                switchForm();
                modal.classList.remove('modal_show');
            }
        }
    }

    /*
    // Обработчик нажатия кнопки формы в роли Авторизации (Login)
     */
    function handleClickLogin(e) {
        e.preventDefault();

        const validate = validateInputs();
        if (!validate) {
            return false;
        }
        alert(`Добро пожаловать, ${funcShared('username').value}!`);
        switchForm();

    }

    /*
    // Изменение внешнего вида формы в зависимости от текущей роли
     */
    const switchForm = () => {

        const type = 'signup' === form.dataset.role ? 'login' : 'signup' ;

        document.getElementById('form-title').innerText = ('login' === type ? 'Log in to the system' : 'Get your free account');

        form.reset();

        const hideInputsId = ['full-name', 'email', 'repeat-password', 'agree'];

        formInputs.forEach((input) => {
            if (hideInputsId.includes(input.id.toLowerCase())) {
                if ('login' === type) {
                    input.setAttribute('hidden', 'hidden');
                    input.parentElement.style.display = 'none';
                } else {
                    input.removeAttribute('hidden');
                    input.parentElement.style.display = '';
                }
            }

            input.style.borderColor = '';

        });

        linkSwitchForm.innerText = ('login' === type ? 'No account yet?' : 'Already have an account?');
        btnForm.innerText = ('login' === type ? 'Sign In' : 'Sign Up');
        form.dataset.role = type;
        btnForm.onclick = ('login' === type ? handleClickLogin : handleClickSignUp);
    }


    // Проверяем поля на вводимые значения с клавиаутры
    form.onkeydown = (e) => {
        const targetId = e.target.id;
        const key = e.key;

        if (targetId === 'full-name') {
            // Поле Full Name. Запрет ввода цифр
            return (key < '0' || key > '9');
        } else if (targetId === 'username') {
            // Поле Username. Запрет ввода точки и запятой
            return !(key === '.' || key === ',');
        }
    }


    formInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });


    // Действия на изменения чекбокса Agree
    checkboxAgree.onchange = (e) => {
        console.log(e.target.checked ? 'Согласен' : 'Не согласен');
    }

    linkSwitchForm.onclick = () => {
        switchForm();
    }

    // Начальные установки для формы
    form.dataset.role = 'signup';
    btnForm.onclick = handleClickSignUp;

}
