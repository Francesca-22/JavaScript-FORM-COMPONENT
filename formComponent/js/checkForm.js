import * as colorPicker from "../components/colorPicker/colorPicker.js";
import * as dt from "../components/dateTimeSelect/dtsel.js";
import * as fade from "../components/modules/fade.js";
import * as scrollListWithArrows from "../components/modules/scrollListWithArrows.js";

// variabile per bloccare l'evento blur sul tag di input cambiando la visibilità della password
let clickInProgress_onLabelOpen_onPasswordVisibility = false;

/**
 * 
 * NON IN USO
 * 
 * @param {string} className esempio: '.class-name'
 * @returns {CSSStyleRuleObject} CSSStyleRuleObject che contiene la classe cercata e i suoi dettagli
 * @note si può modificare la classe, esempio: CSSSStyleRuleObject.style.color = "nuovo_colore";
 * @important rivedere document per shadow dom
 */
function getStyle(className) {
    var classes = document.querySelector('link[href*=' + 'content' + ']').sheet.cssRules;
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].selectorText == className) {
            return classes[x];
        }
    }
}

/**
 * CHE COLORE USO PER IL TESTO IN BASE AL BACKGROUND-COLOR?
 * @param {*} bgColor hex color
 * @param {*} lightColor hex color
 * @param {*} darkColor hex color
 * @returns verifica se il bgColor ha bisogno di colore scuro o chiaro per l'elemento sovrastante (es. testo) e ritorna il lightColor o il darkColor a seconda del risultato
 * @note in uso nel create component js
 */
export function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}

// non in uso
function countNumbers(nFrom, nTo) {
    let count = 0
    while (nFrom <= nTo) {
        count = count + 1
        nFrom++
    }
    return count - 1
}

// in uso in range
function getPositionOfElementInArray(elementToFind, arrayElements) {
    var i;
    for (i = 0; i < arrayElements.length; i += 1) {
        if (arrayElements[i] === elementToFind) {
            return i;
        }
    }
    return null;
}

// insert a string in another string at specific index (count characters before = index)
function stringInsertAtIndex(str, substring, index) {
    return str.slice(0, index) + substring + str.slice(index);
}

// create regex es value from server Fra3 --> [f|F][r|R][a|A]3 is case sensitive
function createRegexFromInputServerValueCaseSensitiveOnlyForUsername(inputTag) {
    let serverValue = inputTag.value.toLocaleLowerCase()
    let stringServerValue = ''
    serverValue.split('').forEach(it => {
        if (!it.match(/[0-9]/)) {
            stringServerValue += '[' + it + it.toLocaleUpperCase() + ']'
        } else {
            stringServerValue += it
        }
    })
    return stringServerValue
}

/**
 * @param {HTMLInputElement} inputTag
 * @returns rimuove e rimette velocissimo la value dell'input per sopstare il cursore alla fine
 */
function inputTagMoveCursorToEnd(inputTag) {
    window.setTimeout(function () {
        if (typeof inputTag.selectionStart == "number") {
            inputTag.selectionStart = inputTag.selectionEnd = inputTag.value.length;
        } else if (typeof inputTag.createTextRange != "undefined") {
            var range = inputTag.createTextRange();
            range.collapse(false);
            range.select();
        }
    }, 1);
}

/**
 * @param {HTMLInputElementPassword} inputPassword
 * @param {HTMLElement} feedbackContainer
 * @returns cambia l'innerHTML dell'elemento passato con il feedback sulla sicurezza della password inserita dall'utente e lo colora correttamente
 */
function passwordValidation(inputPassword, feedbackContainer, documentShadowRoot) {
    let inputPasswordValue = inputPassword.value
    let inputPasswordMessages = inputPassword.dataset.passwordMessages.split(';')
    let passwordMinLength = inputPassword.dataset.passwordMinLength
    let regexPasswordPatternWithoutMinLenght = inputPassword.getAttribute('pattern').replace(`{${passwordMinLength},}`, '*')
    let regexPasswordNotAllowedCharacters = ""
    if (inputPassword.dataset.passwordIncludesSpecialCharacters === 'true' || inputPassword.dataset.passwordIncludesSpecialCharacters === 'optional') {
        regexPasswordNotAllowedCharacters = "([^a-zA-Z0-9?!@#^$%&+=*._-])"
    } else if (inputPassword.dataset.passwordIncludesSpecialCharacters === 'false') {
        regexPasswordNotAllowedCharacters = "([^a-zA-Z0-9])"
    }

    if (inputPasswordValue.length === 0) {
        feedbackContainer.innerHTML = "<p class='input-feedback'>" + inputPassword.dataset.inputRequiredMessage + "</p>"
        feedbackContainer.classList.add('input-invalid-feedback-password')
    }
    if (new RegExp(regexPasswordPatternWithoutMinLenght, 'g').exec(inputPasswordValue) === null && inputPasswordValue.length > 0) {
        if (new RegExp(regexPasswordNotAllowedCharacters, 'g').exec(inputPasswordValue) !== null) {
            feedbackContainer.innerHTML = "<p class='input-feedback'>" + inputPasswordMessages[0] + "</p>"
            feedbackContainer.classList.add('input-invalid-feedback-password')
        } else {
            feedbackContainer.innerHTML = "<p class='input-feedback'>" + inputPasswordMessages[1] + "</p>"
            feedbackContainer.classList.add('input-invalid-feedback-password')
        }
    }
    if (new RegExp(regexPasswordPatternWithoutMinLenght, 'g').exec(inputPasswordValue) !== null && inputPasswordValue.length > 0 && inputPasswordValue.length < passwordMinLength) {
        feedbackContainer.innerHTML = "<p class='input-feedback'>" + inputPasswordMessages[2] + "</p>"
        feedbackContainer.classList.add('input-invalid-feedback-password')
    }
    if (new RegExp(regexPasswordPatternWithoutMinLenght, 'g').exec(inputPasswordValue) !== null && inputPasswordValue.length >= passwordMinLength) {
        feedbackContainer.innerHTML = "<p class='input-feedback'>" + inputPasswordMessages[3] + "</p>"
        if (inputPassword === documentShadowRoot.activeElement) {
            feedbackContainer.classList.remove('input-invalid-feedback-password')
            feedbackContainer.classList.remove('input-valid-feedback-password-no-focus')
        } else {
            if (clickInProgress_onLabelOpen_onPasswordVisibility === false) {
                feedbackContainer.classList.remove('input-invalid-feedback-password')
                feedbackContainer.classList.add('input-valid-feedback-password-no-focus')
            }
        }
    }
}

// validation message for count characters e textarea count characters
function changeInputValidationMessageForCountCharacters(inputTag, minCharacters, maxCharacters, invalidFeedbackContainer, inputTagValidationMessage) {
    if (minCharacters !== undefined && maxCharacters === undefined) {
        if (!inputTag.classList.contains('textarea')) {
            let inputPatternWithoutMaxLengthControll = inputTag.pattern.replace(`{${minCharacters},}`, '+')
            // se length maggiore e pattern corretto messaggio sulla lunghezza
            if (inputTag.value.length < minCharacters && new RegExp(inputPatternWithoutMaxLengthControll, '').exec(inputTag.value) !== null) {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Min " + minCharacters + ".</p>"
            } else {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagValidationMessage + "</p>"
            }
        } else if (inputTag.classList.contains('textarea')) {
            // se length maggiore
            if (inputTag.value.length < minCharacters) {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Min" + minCharacters + ".</p>"
            }
        }
    } else if (minCharacters === undefined && maxCharacters !== undefined) {
        if (!inputTag.classList.contains('textarea')) {
            let inputPatternWithoutMaxLengthControll = inputTag.pattern.replace(`{1,${maxCharacters}}`, '+')
            // se length maggiore e pattern corretto messaggio sulla lunghezza
            if (inputTag.value.length > maxCharacters && new RegExp(inputPatternWithoutMaxLengthControll, '').exec(inputTag.value) !== null) {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Max " + maxCharacters + ".</p>"
            } else {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagValidationMessage + "</p>"
            }
        } else if (inputTag.classList.contains('textarea')) {
            // se length maggiore
            if (inputTag.value.length > maxCharacters) {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Max " + maxCharacters + ".</p>"
            }
        }
    } else if (minCharacters !== undefined && maxCharacters !== undefined) {
        if (!inputTag.classList.contains('textarea')) {
            let inputPatternWithoutMinMaxLengthControll = inputTag.pattern.replace(`{${minCharacters},${maxCharacters}}`, '+')
            // se length non compresa tra min e max e pattern corretto messaggio sulla lunghezza
            if (inputTag.value.length < minCharacters && new RegExp(inputPatternWithoutMinMaxLengthControll, '').exec(inputTag.value) !== null || inputTag.value.length > maxCharacters && new RegExp(inputPatternWithoutMinMaxLengthControll, '').exec(inputTag.value) !== null) {
                if (inputTag.value.length < minCharacters) {
                    invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Min " + minCharacters + ".</p>"
                } else if (inputTag.value.length > maxCharacters) {
                    invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Max " + maxCharacters + ".</p>"
                }
            } else {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagValidationMessage + "</p>"
            }
        } else if (inputTag.classList.contains('textarea')) {
            // se length non compresa tra min e max
            if (inputTag.value.length < minCharacters || inputTag.value.length > maxCharacters) {
                if (inputTag.value.length < minCharacters) {
                    invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Min " + minCharacters + ".</p>"
                } else if (inputTag.value.length > maxCharacters) {
                    invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>Max " + maxCharacters + ".</p>"
                }
            }
        }
    }
}



/**
 * @param {HTMLInputElement} inputTag
 * @param {HTMLElement} invalidFeedbackContainer
 * @returns inserisce e cambia l'innerHTML dell'elemento passato il feedback sull'input inserito dall'utente
 * @function passwordValidation() la utizza per cambiare il feedback degli input type password
 */
function changeInputValidationMessage(inputTag, invalidFeedbackContainer, documentShadowRoot) {
    if (inputTag.dataset.password === "password") {
        passwordValidation(inputTag, invalidFeedbackContainer, documentShadowRoot)
    } else {
        if (inputTag.type !== 'file' && inputTag.dataset.range === undefined) {

            let inputTagRequiredMessage = inputTag.dataset.inputRequiredMessage
            let inputTagValidationMessage = inputTag.dataset.inputMessage

            if (inputTag.value === '') {
                invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagRequiredMessage + "</p>"
            } else {
                if (inputTag.dataset.minCharacters !== undefined || inputTag.dataset.maxCharacters !== undefined) {
                    // count characters
                    changeInputValidationMessageForCountCharacters(inputTag, inputTag.dataset.minCharacters, inputTag.dataset.maxCharacters, invalidFeedbackContainer, inputTagValidationMessage)
                }
                // se l'input è collegato a un datalist che obbgliga a selezionare un option identica
                if (inputTag.dataset.datalistOptionRequired !== undefined) {

                    // prendi il pattern e trasformalo in un array con le parole da cercare (option text)
                    let inputTagDatalistOptionRequiredPatternWordsArray = inputTag.pattern.replace('^', '').replace('$', '').replace('(', '').replace(')', '').toLowerCase().split('|')

                    // creazione variabile per ottenere la lista di quelle parzialmente trovate
                    let isOptionPartiallyFound = []

                    // per ogni parola se trovata viene aggiunta alla variabile
                    inputTagDatalistOptionRequiredPatternWordsArray.forEach(patternWord => {
                        if (patternWord.startsWith(inputTag.value.toLowerCase())) {
                            isOptionPartiallyFound.push(patternWord)
                        }
                        return isOptionPartiallyFound
                    });

                    // se la variabile delle parole parzialmente trovcate non è un array vouto allora metti l'errore del pattern altrim ci pensa la funzione del datalist obbligatorio
                    if (isOptionPartiallyFound.length > 0) {
                        invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + invalidFeedbackContainer.dataset.datalistMessages.split(";")[1] + "</p>"
                    } else {
                        invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagValidationMessage + "</p>"
                    }
                }
                // else
                if (inputTag.dataset.minCharacters === undefined && inputTag.dataset.maxCharacters === undefined && inputTag.dataset.datalistOptionRequired === undefined) {
                    invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTagValidationMessage + "</p>"
                }
            }
        }

    }
}

// with server message
function changeInputValidationMessageServer(inputTag, invalidFeedbackContainer, documentShadowRoot) {
    if (inputTag.dataset.inputTextType === 'username') {
        let usernameServerRegex = inputTag.dataset.inputUsernameServer
        if (new RegExp(`^${usernameServerRegex}$`, 'i').exec(inputTag.value)) {
            invalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + inputTag.dataset.inputMessageServer + "</p>"
        } else {
            changeInputValidationMessage(inputTag, invalidFeedbackContainer, documentShadowRoot)
        }
    } else {
        console.log('manca parte, solo server message per username')
    }
}

// add lenght to input pattern (for count-characters)
function addLengthToInputPattern(type, value, inputTag) {
    let pattern = inputTag.getAttribute('pattern').replace(/(\*\$|\+\$)$/, "$")
    if (type === 'min') {
        inputTag.setAttribute('pattern', stringInsertAtIndex(pattern, `{${value},}`, pattern.length - 1))
    }
    if (type === 'max') {
        inputTag.setAttribute('pattern', stringInsertAtIndex(pattern, `{1,${value}}`, pattern.length - 1))
    }
    if (type === 'minmax') {
        // value is array of string ['min','max']
        inputTag.setAttribute('pattern', stringInsertAtIndex(pattern, `{${value[0]},${value[1]}}`, pattern.length - 1))
    }
}

/**
 * @param {HTMLFormElement} formTag
 * @param {HTMLInputElement} inputTag
 * @returns accedende o spegne il feedback invalido in base alla validità dell'input inserito dall'utente
 * @function changeInputValidationMessage() seleziona l'elemento contenente il feedback invalido e glielo passa insieme al suo input tag per cambiarne il messaggio
 */
function checkInputLive(formTag, inputTag, documentShadowRoot) {
    let inputTagId = inputTag.id
    let formInputContainer = formTag.querySelector(`#form-input-container-${inputTagId}`)
    let invalidFeedbackContainer = formTag.querySelector(`#invalid-feedback-${inputTagId}`)

    if (inputTag.checkValidity() === false) {
        if (inputTag.dataset.inputMessageServer === undefined) {
            invalidFeedbackContainer.classList.add('show-input-feedback')
            formInputContainer.classList.add('form-input-container-invalid')
            changeInputValidationMessage(inputTag, invalidFeedbackContainer, documentShadowRoot);
        } else {
            invalidFeedbackContainer.classList.add('show-input-feedback')
            formInputContainer.classList.add('form-input-container-invalid')
            changeInputValidationMessageServer(inputTag, invalidFeedbackContainer, documentShadowRoot);
        }
    } else {
        if (inputTag.dataset.password !== "password") {
            invalidFeedbackContainer.classList.remove('show-input-feedback')
        } else {
            changeInputValidationMessage(inputTag, invalidFeedbackContainer, documentShadowRoot);
            invalidFeedbackContainer.classList.add('show-input-feedback')
        }
        formInputContainer.classList.remove('form-input-container-invalid')
    }
}

/**
 * @param {HTMLInputElementPassword} inputPasswordTag
 * @param {HTMLInputElementConfirmPassword} inputConfirmPasswordTag
 * @returns se la password inserita dall'utente è valida crea il pattern nel input tag di conferma della password altimenti inserisce il messaggio di errore per avvisare l'utente che prima deve inserire una password nel input password
 */
function setPatternForConfirmPassword(inputPasswordTag, inputConfirmPasswordTag) {
    let inputConfirmPasswordMessages = inputConfirmPasswordTag.dataset.confirmPasswordMessages.split(';')
    if (inputPasswordTag.checkValidity() === true) {
        let passwordWritedForConfirmPassword = inputPasswordTag.value
        let passwordWritedForConfirmPasswordEscaped = passwordWritedForConfirmPassword.replaceAll('?', '[?]').replaceAll('!', '[!]').replaceAll('@', '[@]').replaceAll('#', '[#]').replaceAll('$', '[$]').replaceAll('%', '[%]').replaceAll('&', '[&]').replaceAll('+', '[+]').replaceAll('=', '[=]').replaceAll('*', '[*]').replaceAll('.', '[.]').replaceAll('_', '[_]').replaceAll('^', '[^]').replaceAll('-', '[\\-]')
        let passwordPatternForConfirmPassword = '^' + passwordWritedForConfirmPasswordEscaped + '$'
        inputConfirmPasswordTag.setAttribute("pattern", passwordPatternForConfirmPassword)
        inputConfirmPasswordTag.dataset.inputMessage = inputConfirmPasswordMessages[1]
    } else {
        inputConfirmPasswordTag.setAttribute("pattern", "^$")
        inputConfirmPasswordTag.dataset.inputMessage = inputConfirmPasswordMessages[0]
    }
}

/**
 * @param {NodeListOf<HTMLInputElement>} inputTagNodeList
 * @returns inserisce il pattern corretto in base al tipo di tag input (data-input-text-type per tutti i campi e data-password per la password)
 * @function setPatternForConfirmPassword() oninput sul input password imposta il pattern di conferma della password, se esiste un tag input a lui collegato per la conferma della password
 */
function setInputPattern(formTag, inputTagNodeList, documentShadowRoot) {
    inputTagNodeList.forEach(inputTag => {
        let inputType = inputTag.type
        if (inputTag.classList.contains('textarea')) {
            if (inputTag.dataset.minCharacters !== undefined || inputTag.dataset.maxCharacters !== undefined) {
                inputTag.setAttribute('minlength', inputTag.dataset.minCharacters)
                inputTag.setAttribute('maxlength', inputTag.dataset.maxCharacters)
            }
        }
        if (inputType === 'text' && inputTag.dataset.inputTextType !== undefined) {
            if (inputTag.dataset.inputTextType === "username") {
                inputTag.setAttribute("pattern", `^[a-zA-Z0-9]*$`)
            }
            if (inputTag.dataset.inputTextType === "words") {
                inputTag.setAttribute("pattern", "^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$")
            }
            if (inputTag.dataset.inputTextType === "wordsWithNumbers") {
                inputTag.setAttribute("pattern", "^[a-zA-ZÀ-ü0-9][a-zA-Z' À-ü0-9\\-]*$")
            }
            if (inputTag.dataset.inputTextType === "range") { // INPUT-RANGE (da non modificare)
                inputTag.setAttribute("pattern", "^.*$")
            }
            if (inputTag.dataset.inputTextType === "address") {
                inputTag.setAttribute("pattern", "^[a-zA-ZÀ-ü][a-zA-Z'\\. À-ü\\-]*$")
            }
            if (inputTag.dataset.inputTextType === "addressComune") {
                inputTag.setAttribute("pattern", "^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$")
            }
            if (inputTag.dataset.inputTextType === "addressProvincia") {
                inputTag.setAttribute("pattern", "^[a-zA-Z]*$")
            }
            if (inputTag.dataset.inputTextType === "addressRegione") {
                inputTag.setAttribute("pattern", "^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-\\/]*$")
            }
            if (inputTag.dataset.inputTextType === "addressNumber") {
                inputTag.setAttribute("pattern", "^[0-9][0-9a-zA-Z\\-\\/]*$")
            }
            if (inputTag.dataset.inputTextType === "addressCap") {
                inputTag.setAttribute("pattern", `^[0-9]*$`)
            }
            if (inputTag.dataset.inputTextType === "tel") {
                inputTag.setAttribute("pattern", `^[0-9]*$`)
            }
            if (inputTag.dataset.inputTextType === "email") {
                // doppio escape prima del punto nella regex della mail perchè altrimenti nell'input pattern prima del punto non arriva l'escape
                inputTag.setAttribute("pattern", "^([a-z0-9]+(?:[\\._\\-][a-z0-9]+)*)@([a-z0-9]+(?:[\\.\\-][a-z0-9]+)*\\.[a-z]{2,6})$")
            }
            if (inputTag.dataset.inputTextType === "color") { // INPUT-COLOR (da non modificare)
                inputTag.setAttribute("pattern", `^#[a-fA-F0-9]{6}$`)
            }
            if (inputTag.dataset.inputTextType === "antispam") {
                inputTag.setAttribute("pattern", `^[0-9]*$`)
            }
            if (inputTag.dataset.inputTextType === "pattern") {
                inputTag.setAttribute("pattern", `${inputTag.dataset.pattern}`)
            }

            // min max for count-character
            if (inputTag.dataset.inputTextType !== "range" && inputTag.dataset.inputTextType !== "email" && inputTag.dataset.inputTextType !== "color") {
                if (inputTag.dataset.minCharacters !== undefined || inputTag.dataset.maxCharacters !== undefined) {
                    if (inputTag.dataset.minCharacters !== undefined && inputTag.dataset.maxCharacters === undefined) {
                        addLengthToInputPattern('min', inputTag.dataset.minCharacters, inputTag)
                    } else if (inputTag.dataset.minCharacters === undefined && inputTag.dataset.maxCharacters !== undefined) {
                        addLengthToInputPattern('max', inputTag.dataset.maxCharacters, inputTag)
                    } else if (inputTag.dataset.minCharacters !== undefined && inputTag.dataset.maxCharacters !== undefined) {
                        addLengthToInputPattern('minmax', [inputTag.dataset.minCharacters, inputTag.dataset.maxCharacters], inputTag)
                    }
                }
            }

            // if input invalid feedback from server for username
            if (inputTag.dataset.inputMessageServer !== undefined) {
                if (inputTag.dataset.inputTextType === "username") {
                    let inputServerValueRegex = createRegexFromInputServerValueCaseSensitiveOnlyForUsername(inputTag)
                    let pattern = inputTag.getAttribute('pattern')
                    let serverPattern = '(?!' + inputServerValueRegex + '$)'
                    let newPattern = stringInsertAtIndex(pattern, serverPattern, 1)
                    inputTag.setAttribute('pattern', newPattern)
                } else {
                    console.log('manca feedback server, solo per username')
                }
            }
        }

        if (inputTag.dataset.password === "password") {
            if (inputTag.dataset.passwordIncludesSpecialCharacters === "true") {
                inputTag.setAttribute("pattern", `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#^$%&+=*._\\-])([a-zA-Z0-9?!@#^$%&+=*._\\-]){${inputTag.dataset.passwordMinLength},}$`)
            } else if (inputTag.dataset.passwordIncludesSpecialCharacters === "false") {
                inputTag.setAttribute("pattern", `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]){${inputTag.dataset.passwordMinLength},}$`)
            } else if (inputTag.dataset.passwordIncludesSpecialCharacters === "optional") {
                inputTag.setAttribute("pattern", `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9?!@#^$%&+=*._\\-]){${inputTag.dataset.passwordMinLength},}$`)
            }
            // per la conferma della password oninput le cambia il pattern con la value scritta dall'utente e se già scritta ne segna l'errore
            const inputTagConfirmPassword = formTag.querySelector(`[data-confirm-password-for=${inputTag.id}]`)
            if (inputTagConfirmPassword !== null) {
                inputTag.addEventListener('input', () => {
                    setPatternForConfirmPassword(inputTag, inputTagConfirmPassword);
                    if (inputTagConfirmPassword.value !== '') {
                        checkInputLive(formTag, inputTagConfirmPassword, documentShadowRoot);
                    }
                })
            }
        }
        if (inputTag.dataset.password === "confirmPassword") {
            inputTag.setAttribute("pattern", "^$")
            inputTag.dataset.inputMessage = inputTag.dataset.confirmPasswordMessages.split(';')[0]
        }
        if (inputTag.dataset.password === "currentPassword") {
            if (inputTag.dataset.passwordIncludesSpecialCharacters === "true") {
                inputTag.setAttribute("pattern", `^[a-zA-Z0-9?!@#^$%&+=*._\\-]*$`)
            } else if (inputTag.dataset.passwordIncludesSpecialCharacters === "false") {
                inputTag.setAttribute("pattern", `^[a-zA-Z0-9]*$`)
            }
            inputTag.dataset.inputMessage = inputTag.dataset.currentPasswordMessage
        }
    });
}

// add input validation event
function addValidationInputEvent(formTag, inputTagNodeList, documentShadowRoot) {
    inputTagNodeList.forEach(inputTag => {
        inputTag.addEventListener('input', () => {
            checkInputLive(formTag, inputTag, documentShadowRoot);
        })
        inputTag.addEventListener('blur', () => {
            if (inputTag.dataset.inputDateTime === undefined) {
                checkInputLive(formTag, inputTag, documentShadowRoot);
            }
        })
        inputTag.addEventListener('focus', () => {
            if (inputTag.dataset.password === "password" && inputTag.checkValidity() === true) {
                checkInputLive(formTag, inputTag, documentShadowRoot);
            }
        })
    });
}

/**
 * @param {HTMLFormElement} formTag
 * @param {NodeListOf<HTMLInputElement>} inputTagNodeList
 * @function checkInputLive() la esegue per tutti gli input della nodeList
 */
function checkInput(formTag, inputTagNodeList, documentShadowRoot) {
    inputTagNodeList.forEach(inputTag => {
        checkInputLive(formTag, inputTag, documentShadowRoot)
    });
}


function addValidationFormEvent(formTag, inputTagNodeList, documentShadowRoot) {
    const formLoading = formTag.querySelector('[data-role="form-loading"]')
    // onsubmit invia la form solo se tutti gli input inseriti dall'utente sono validi e non ci sono più feedback del server
    // altrimenti esegue la validazione di ogni tag input e cancella l'evento submit
    formTag.addEventListener('submit', function (event) {
        if (formTag.querySelectorAll('input:invalid').length > 0 || formTag.querySelectorAll('textarea:invalid').length > 0) {
            checkInput(formTag, inputTagNodeList, documentShadowRoot);
            checkInputRadioCheckboxValidity(formTag.querySelectorAll('.form-input-container-radio-checkbox'))
            switchValidity(formTag.querySelectorAll('.form-input-switch-container'))
            event.preventDefault();
        } else {
            formLoading.classList.add('form-loading--show')
            fade.fadeIn(formLoading, 20)
            inputTagNodeList.forEach(inputTag => {
                if (inputTag.dataset.inputTextType === "tel") {
                    let selectedPrefixValueBox = formTag.querySelector(`[data-selected-prefix-box-for=${inputTag.id}]`)
                    if (selectedPrefixValueBox !== null) {
                        // poi rimette il valore dell'utente togliendo prefisso ecc dalla value con timeout
                        let oldValue = inputTag.value
                        inputTag.value = selectedPrefixValueBox.dataset.selectedCountryCode + ',' + selectedPrefixValueBox.dataset.selectedPrefixValue + ',' + inputTag.value
                        setTimeout(() => {
                            inputTag.value = oldValue
                        }, 1000);
                    }
                }
            });
        }
    })
}


//focus
function addInputFocusEvent(formTag, documentShadowRoot) {
    const formInputContainerNodeList = formTag.querySelectorAll('.form-input-container')
    formInputContainerNodeList.forEach(formInputContainer => {

        let input = formInputContainer.querySelector('.input')
        let inputLabel = formInputContainer.querySelector('.input-label')
        let inputUnderline = formInputContainer.querySelector('.input-underline')

        // se ci sono degli input pieni apre l'input
        // COMMENTATO QUI PERCHÈ SE RICARICATO IN FETCH NON APRIVA L'INPUT SE PIENO
        //window.addEventListener('load', () => {
            if (input.value !== "") {
                inputLabel.classList.add('input-label-focus')
            }
        //})

        // se aggiungo atomaticamente le credenziali apre l'input
        input.addEventListener('input', () => {
            if (input.value !== "" && !inputLabel.classList.contains('input-label-focus')) {
                inputLabel.classList.add('input-label-focus')
            }
        })

        // blocca il blur dell'input onclick sulla label se aperto e se è lui l'input attivo - mouse
        inputLabel.addEventListener('mousedown', () => {
            if (inputLabel.classList.contains('input-label-focus')) {
                if (documentShadowRoot.activeElement === input) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            }
        })

        // blocca il blur dell'input onclick sulla label se aperto e se è lui l'input attivo - touch
        inputLabel.addEventListener('touchstart', () => {
            if (inputLabel.classList.contains('input-label-focus')) {
                if (documentShadowRoot.activeElement === input) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            }
        }, {passive: true})

        // input on focus
        input.addEventListener('focus', () => {
            inputLabel.classList.add('input-label-focus')
            inputLabel.classList.add('input-label-focus-color')
            inputUnderline.classList.add('input-underline-focus')
            if (input.dataset.inputNoWrite === undefined && input.type !== 'file' && input.type !== 'checkbox' && input.type !== 'radio') {
                inputTagMoveCursorToEnd(input)
            }
        })

        // input on blur -- bloccabile se si clicca sulla label dell'input aperto o sul visualizza password se input password in focus
        input.addEventListener('blur', () => {
            if (clickInProgress_onLabelOpen_onPasswordVisibility === false) {
                inputLabel.classList.remove('input-label-focus-color')
                inputUnderline.classList.remove('input-underline-focus')
                if (input.value === "") {
                    inputLabel.classList.remove('input-label-focus')
                }
            }
        })

    });

    // fuori da foreach -- mouseup e touchend sbloccano l'evento on blur degli input
    window.addEventListener('mouseup', () => {
        if (clickInProgress_onLabelOpen_onPasswordVisibility === true) {
            clickInProgress_onLabelOpen_onPasswordVisibility = false
        }
    })
    window.addEventListener('touchend', () => {
        if (clickInProgress_onLabelOpen_onPasswordVisibility === true) {
            clickInProgress_onLabelOpen_onPasswordVisibility = false
        }
    })

}



//utility
function setInputPaddingForUtility(inputUtilityType, inputUtilityContainer, formTag) {
    if (inputUtilityType === "countCharacters" && !inputUtilityContainer.classList.contains('textarea-container') || inputUtilityType === "passwordVisibility" || inputUtilityType === "selectPrefix" || inputUtilityType === "antispam") {
        let inputUtilitySlotLeft = inputUtilityContainer.querySelector('.input-utility-slot-left')
        let inputUtilitySlotRight = inputUtilityContainer.querySelector('.input-utility-slot-right')
        let inputTag = inputUtilityContainer.querySelector('.input')

        if (inputUtilitySlotLeft !== null) {
            inputTag.style.paddingLeft = `${inputUtilitySlotLeft.clientWidth + 5}px`
        }
        if (inputUtilitySlotRight !== null) {
            inputTag.style.paddingRight = `${inputUtilitySlotRight.clientWidth + 5}px`
        }
    } else if (inputUtilityType === "countCharacters" && inputUtilityContainer.classList.contains('textarea-container')) {
        // textarea with count character
        let inputUtilitySlot = inputUtilityContainer.querySelector('.input-utility-slot')
        let textareaTag = inputUtilityContainer.querySelector('.textarea')
        let textareaTagId = textareaTag.id
        let textareaInvalidFeedbackContainer = formTag.querySelector(`#invalid-feedback-${textareaTagId}`)
        textareaInvalidFeedbackContainer.style.paddingRight = `${inputUtilitySlot.clientWidth + 5}px`
    } else {
        let inputUtilitySlot = inputUtilityContainer.querySelector('.input-utility-slot')
        inputUtilitySlot.style.width = getComputedStyle(inputUtilitySlot).minWidth
    }
}


// SELECT PREFIX TOOLS
// close listbox
function closeSelectPrefix(selectPrefixListboxContainer, selectPrefixButtonControls) {
    if (selectPrefixListboxContainer.classList.contains('input-utility-select-prefix-container-active')) {
        selectPrefixListboxContainer.classList.remove('input-utility-select-prefix-container-active')
        selectPrefixButtonControls.classList.remove('select-prefix-controls_up')
        selectPrefixButtonControls.classList.add('select-prefix-controls_down')
        fade.fadeOut(selectPrefixListboxContainer, 20)
    }
}
// load listbox
function getSelectPrefixOptionsListAndSetItsEvents(documentShadowRoot, inputTag, selectedPrefixBox, selectPrefixButtonControls, selectPrefixListboxContainer, selectPrefixListbox, inputUtilityContainer) {
    window.addEventListener('load', () => {
        let xmlhttp = new XMLHttpRequest()

        xmlhttp.onreadystatechange = function () {

            // se risposta php completata con successo
            if (this.readyState === 4 && this.status === 200) {
                selectPrefixListbox.innerHTML = this.responseText

                let allSelectPrefixOption = selectPrefixListbox.querySelectorAll('[data-select-prefix-option]')
                allSelectPrefixOption.forEach(selectPrefixOption => {

                    if (selectPrefixOption.classList.contains('select-prefix-option-active')) {
                        selectedPrefixBox.setAttribute('data-selected-prefix-value', selectPrefixOption.dataset.prefixValue)
                        selectedPrefixBox.setAttribute('data-selected-country-code', selectPrefixOption.dataset.countryCode)
                        selectedPrefixBox.innerHTML = selectPrefixOption.querySelector('.select-prefix-option-flag').innerHTML
                    }

                    selectPrefixOption.addEventListener('mousedown', () => {
                        // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                        if (documentShadowRoot.activeElement === inputTag) {
                            clickInProgress_onLabelOpen_onPasswordVisibility = true;
                        };
                    })
                    selectPrefixOption.addEventListener('touchstart', () => {
                        // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                        if (documentShadowRoot.activeElement === inputTag) {
                            clickInProgress_onLabelOpen_onPasswordVisibility = true;
                        };
                    }, {passive: true})
                    selectPrefixOption.addEventListener('click', () => {
                        let currentSelectPrefixOptionActive = selectPrefixListbox.querySelector('.select-prefix-option-active')
                        if (currentSelectPrefixOptionActive !== null) {
                            currentSelectPrefixOptionActive.classList.remove('select-prefix-option-active')
                        }
                        selectPrefixOption.classList.add('select-prefix-option-active')
                        selectedPrefixBox.setAttribute('data-selected-prefix-value', selectPrefixOption.dataset.prefixValue)
                        selectedPrefixBox.setAttribute('data-selected-country-code', selectPrefixOption.dataset.countryCode)
                        selectedPrefixBox.innerHTML = selectPrefixOption.querySelector('.select-prefix-option-flag').innerHTML
                        closeSelectPrefix(selectPrefixListboxContainer, selectPrefixButtonControls)
                        inputTag.focus()
                    })
                    selectPrefixOption.addEventListener('keydown', (e) => {
                        if (e.keyCode === 13) {
                            e.preventDefault()
                            clickInProgress_onLabelOpen_onPasswordVisibility = false
                            let currentSelectPrefixOptionActive = selectPrefixListbox.querySelector('.select-prefix-option-active')
                            if (currentSelectPrefixOptionActive !== null) {
                                currentSelectPrefixOptionActive.classList.remove('select-prefix-option-active')
                            }
                            selectPrefixOption.classList.add('select-prefix-option-active')
                            selectedPrefixBox.setAttribute('data-selected-prefix-value', selectPrefixOption.dataset.prefixValue)
                            selectedPrefixBox.setAttribute('data-selected-country-code', selectPrefixOption.dataset.countryCode)
                            selectedPrefixBox.innerHTML = selectPrefixOption.querySelector('.select-prefix-option-flag').innerHTML
                            closeSelectPrefix(selectPrefixListboxContainer, selectPrefixButtonControls)
                            inputTag.focus()
                        }
                    })
                });
            }
        }


        // onload if already submitted value became prefix value, else default prefix value
        let defaultPrefixValueOrServerPrefixValue = undefined
        if (inputTag.value === "") {
            defaultPrefixValueOrServerPrefixValue = selectPrefixListbox.dataset.defaultSelectedPrefixCountryCode
        } else {
            // value from server = countriCode,prefix,number
            defaultPrefixValueOrServerPrefixValue = inputTag.value.split(',')[0] // usare countryCode perchè univoco (prefisso non univoco es. canada e stati uniti entrambi 001)
            inputTag.value = inputTag.value.split(',')[2] // rimettere solo il numero nell'input value
            if (inputUtilityContainer.querySelector('[data-count-characters]') !== null) {
                let selectPrefixCountCharacters = inputUtilityContainer.querySelector('[data-count-characters]')
                inputCountCharacters(inputTag, selectPrefixCountCharacters)
            }
        }

        // invia richiesta a php
        xmlhttp.open("GET", `${selectPrefixListbox.dataset.selectPrefixFlagPhpFilePath}?selectPrefix=list&prefixList=${selectPrefixListbox.dataset.prefixList}&defaultSelectedPrefixCountryCode=${defaultPrefixValueOrServerPrefixValue}`, true)
        xmlhttp.send()
    })
}

// options livesearch on search input
function setSelectPrefixOptionsLivesearchOnInput(selectPrefixSearchInput, selectPrefixListbox) {
    selectPrefixSearchInput.addEventListener('input', () => {
        let xmlhttp = new XMLHttpRequest()

        xmlhttp.onreadystatechange = function () {

            // se risposta php completata con successo
            if (this.readyState === 4 && this.status === 200) {
                selectPrefixListbox.scrollTop = 0

                let countryCodeFound = this.responseText.split(',')

                let allSelectPrefixOption = selectPrefixListbox.querySelectorAll('[data-select-prefix-option]')
                allSelectPrefixOption.forEach(selectPrefixOption => {
                    if (!countryCodeFound.includes(selectPrefixOption.dataset.countryCode)) {
                        selectPrefixOption.classList.add('select-prefix-option-hide')
                    } else {
                        selectPrefixOption.classList.remove('select-prefix-option-hide')
                    }
                })
            }
        }

        let controlledSelectPrefixSearchInputValue = selectPrefixSearchInput.value.replaceAll('#','!').replaceAll('&','!').replaceAll('+','00').trim()
        // invia richiesta a php
        xmlhttp.open("GET", `${selectPrefixListbox.dataset.selectPrefixFlagPhpFilePath}?selectPrefix=search&userValue=${controlledSelectPrefixSearchInputValue}`, true)
        xmlhttp.send()
    })
}

// count characters
function inputCountCharacters(inputTag, countCharacters) {
    // input length
    let inputTagValueLength = inputTag.value.length

    if (inputTag.dataset.onlyCountCharacters === undefined) {

        let countCharactersMax = inputTag.dataset.maxCharacters
        let countCharactersMin = inputTag.dataset.minCharacters

        if (countCharactersMin === undefined && countCharactersMax !== undefined) {
            // solo max
            countCharacters.innerHTML = inputTagValueLength + "/" + countCharactersMax

            if (inputTagValueLength > countCharactersMax) {
                if (inputTagValueLength >= 1) {
                    countCharacters.classList.add('input-utility-count-characters-error')
                } else {
                    countCharacters.classList.remove('input-utility-count-characters-error')
                }
            } else {
                countCharacters.classList.remove('input-utility-count-characters-error')
            }
        } else if (countCharactersMax === undefined && countCharactersMin !== undefined) {
            // solo min
            countCharacters.innerHTML = inputTagValueLength

            if (inputTagValueLength < countCharactersMin) {
                if (inputTagValueLength >= 1) {
                    countCharacters.classList.add('input-utility-count-characters-error')
                } else {
                    countCharacters.classList.remove('input-utility-count-characters-error')
                }
            } else {
                countCharacters.classList.remove('input-utility-count-characters-error')
            }
        } else if (countCharactersMin !== undefined && countCharactersMax !== undefined) {
            // min e max
            countCharacters.innerHTML = inputTagValueLength + "/" + countCharactersMax

            if (inputTagValueLength < countCharactersMin || inputTagValueLength > countCharactersMax) {
                if (inputTagValueLength >= 1) {
                    countCharacters.classList.add('input-utility-count-characters-error')
                } else {
                    countCharacters.classList.remove('input-utility-count-characters-error')
                }
            } else {
                countCharacters.classList.remove('input-utility-count-characters-error')
            }
        }

    } else if (inputTag.dataset.onlyCountCharacters !== undefined) {
        // se conta solo i caratteri
        countCharacters.innerHTML = inputTagValueLength
    }
}


// password visibility
function togglePasswordVisibility(inputTag, passwordVisibility) {
    inputTag.focus()

    if (inputTag.type === "password") {
        passwordVisibility.classList.replace('input-utility-password-visibility', 'input-utility-password-visibility_off')
        inputTag.type = "text"
    } else if (inputTag.type === "text") {
        passwordVisibility.classList.replace('input-utility-password-visibility_off', 'input-utility-password-visibility')
        inputTag.type = "password"
    }

    clickInProgress_onLabelOpen_onPasswordVisibility = false;
}

// date time picker set min and/or max date
function setMinMaxDate(dtMinOrMaxDate) {
    if (dtMinOrMaxDate !== undefined) {
        let dtDate = ''

        let dtMinOrMaxDateArray = dtMinOrMaxDate.split(';')

        if (dtMinOrMaxDateArray[0] === 'current') {
            if (dtMinOrMaxDateArray.length === 1) {
                const currentDate = new Date();

                let currentDay = String(currentDate.getDate()).padStart(2, '0');
                let currentMonth = String(currentDate.getMonth()+1).padStart(2,"0");
                let currentYear = currentDate.getFullYear();

                dtDate = `${currentDay}-${currentMonth}-${currentYear}`

            } else if (dtMinOrMaxDateArray.length === 2) {
                const currentDateToModify = new Date();

                let symbol = dtMinOrMaxDateArray[1].split(',')[0]
                let number = parseFloat(dtMinOrMaxDateArray[1].split(',')[1])
                let subject = dtMinOrMaxDateArray[1].split(',')[2]

                if (subject === 'day') {
                    if (symbol === '+') {
                        currentDateToModify.setDate(currentDateToModify.getDate() + number)
                    } else if (symbol === '-') {
                        currentDateToModify.setDate(currentDateToModify.getDate() - number)
                    }
                } else if (subject === 'month') {
                    if (symbol === '+') {
                        currentDateToModify.setMonth(currentDateToModify.getMonth() + number)
                    } else if (symbol === '-') {
                        currentDateToModify.setMonth(currentDateToModify.getMonth() - number)
                    }
                } else if (subject === 'year') {
                    if (symbol === '+') {
                        currentDateToModify.setFullYear(currentDateToModify.getFullYear() + number)
                    } else if (symbol === '-') {
                        currentDateToModify.setFullYear(currentDateToModify.getFullYear() - number)
                    }
                }

                dtDate = `${String(currentDateToModify.getDate()).padStart(2, '0')}-${String(currentDateToModify.getMonth()+1).padStart(2,"0")}-${currentDateToModify.getFullYear()}`
            }
        } else {
            dtDate = dtMinOrMaxDateArray[0]
        }

        return dtDate
    } else {
        return ''
    }
}

// add utility event
function setInputUtility(formTag, documentShadowRoot) {
    const inputUtilityContainerNodeList = formTag.querySelectorAll('.input-utility-container')
    inputUtilityContainerNodeList.forEach(inputUtilityContainer => {

        let inputUtilityTypeArray = inputUtilityContainer.dataset.inputUtility.split(',')

        inputUtilityTypeArray.forEach(inputUtilityType => {
            if (inputUtilityType !== '') {

                // SELECT PREFIX
                if (inputUtilityType === "selectPrefix") {

                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let inputLabel = formTag.querySelector(`[data-input-label-select-prefix-for=${inputTag.id}]`)
                    let allSelectPrefixStopBlur = formTag.querySelectorAll(`[data-select-prefix-stop-blur=${inputTag.id}]`)

                    allSelectPrefixStopBlur.forEach(selectPrefixStopBlur => {
                        selectPrefixStopBlur.addEventListener('mousedown', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        })
                        selectPrefixStopBlur.addEventListener('touchstart', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        }, {passive: true})
                    });

                    let selectPrefixButton = inputUtilityContainer.querySelector('[data-select-prefix-button]')
                    let selectedPrefixBox = selectPrefixButton.querySelector(`[data-selected-prefix-box-for=${inputTag.id}]`)
                    let selectPrefixButtonControls = selectPrefixButton.querySelector('[data-select-prefix-controls]')
                    let selectPrefixListboxContainer = inputUtilityContainer.querySelector('.input-utility-select-prefix-container')
                    let selectPrefixSearchContainer = inputUtilityContainer.querySelector('.input-utility-select-prefix-search-container')
                    let selectPrefixSearchInput = inputUtilityContainer.querySelector('[data-select-prefix-search-input]')
                    let selectPrefixListbox = inputUtilityContainer.querySelector('[data-select-prefix-listbox]')

                    // scroll list with arrows
                    inputUtilityContainer.addEventListener('keydown', (e) => {
                        if (e.keyCode === 38 || e.keyCode === 40) {
                            if (selectPrefixListboxContainer.classList.contains('input-utility-select-prefix-container-active')) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true
                                if (selectPrefixSearchContainer.dataset.searchOnPrefixListbox === 'true') {
                                    scrollListWithArrows.changeFocusResultItem(e, selectPrefixListbox, inputTag, selectPrefixSearchInput, documentShadowRoot, 'selectPrefix')
                                } else {
                                    scrollListWithArrows.changeFocusResultItem(e, selectPrefixListbox, inputTag, null, documentShadowRoot, 'selectPrefix')
                                }
                            }
                        }
                    })

                    // set option events on load
                    getSelectPrefixOptionsListAndSetItsEvents(documentShadowRoot, inputTag, selectedPrefixBox, selectPrefixButtonControls, selectPrefixListboxContainer, selectPrefixListbox, inputUtilityContainer)
                    
                    // set livesearch se true
                    if (selectPrefixSearchContainer.dataset.searchOnPrefixListbox === 'true') {
                        setSelectPrefixOptionsLivesearchOnInput(selectPrefixSearchInput, selectPrefixListbox)
                    } else {
                        selectPrefixSearchContainer.style.display = "none"
                    }

                    // open listbox
                    selectPrefixButton.addEventListener('click', () => {
                        selectPrefixListboxContainer.classList.toggle('input-utility-select-prefix-container-active')
                        if (selectPrefixListboxContainer.classList.contains('input-utility-select-prefix-container-active')) {
                            fade.fadeIn(selectPrefixListboxContainer, 20)
                            selectPrefixButtonControls.classList.remove('select-prefix-controls_down')
                            selectPrefixButtonControls.classList.add('select-prefix-controls_up')
                            let activeOption = selectPrefixListbox.querySelector('.select-prefix-option-active')
                            activeOption.parentNode.scrollTop = activeOption.offsetTop - selectPrefixListbox.offsetTop
                        } else {
                            fade.fadeOut(selectPrefixListboxContainer, 20)
                            selectPrefixButtonControls.classList.remove('select-prefix-controls_up')
                            selectPrefixButtonControls.classList.add('select-prefix-controls_down')
                        }
                        inputTag.focus()
                    })
                    // lauch inputTag blur event on click anywhere but not on this inputTag and listbox components, it close listbox
                    window.addEventListener('click', (e) => {
                        if (selectPrefixListboxContainer.classList.contains('input-utility-select-prefix-container-active')) {
                            let noCloseSelectPrefixInputAndParents = Array.from(formTag.querySelectorAll(`[data-no-close-select-prefix-for=${inputTag.id}]`))
                            let selectPrefixContainerChildren = Array.from(selectPrefixListbox.children)
                            if (!selectPrefixContainerChildren.includes(e.composedPath()[0]) && !noCloseSelectPrefixInputAndParents.includes(e.composedPath()[0])) {
                                inputTag.dispatchEvent(new Event('blur', { bubbles: true }));
                            }
                        }
                    })
                    // close listbox on inputTag blur
                    inputTag.addEventListener('blur', () => {
                        if (!inputLabel.classList.contains('input-label-focus-color')) {
                            closeSelectPrefix(selectPrefixListboxContainer, selectPrefixButtonControls)
                        }
                    })
                    // close listbox on input on inputTag
                    inputTag.addEventListener('input', () => {
                        closeSelectPrefix(selectPrefixListboxContainer, selectPrefixButtonControls)
                    })
                }

                // COUNT CHARACTERS
                if (inputUtilityType === "countCharacters") {
                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let countCharacters = inputUtilityContainer.querySelector('[data-count-characters]')

                    inputUtilityContainer.addEventListener('input', () => {
                        inputCountCharacters(inputTag, countCharacters)
                        setInputPaddingForUtility(inputUtilityType, inputUtilityContainer, formTag)
                    })
                    window.addEventListener('load', () => {
                        inputCountCharacters(inputTag, countCharacters)
                    })
                }

                if (inputUtilityType === "passwordVisibility") {
                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let passwordVisibility = inputUtilityContainer.querySelector('[data-password-visibility]')

                    passwordVisibility.addEventListener('mousedown', () => {
                        // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                        if (documentShadowRoot.activeElement === inputTag) {
                            clickInProgress_onLabelOpen_onPasswordVisibility = true;
                        };
                    })
                    passwordVisibility.addEventListener('touchstart', () => {
                        // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                        if (documentShadowRoot.activeElement === inputTag) {
                            clickInProgress_onLabelOpen_onPasswordVisibility = true;
                        };
                    }, {passive: true})
                    passwordVisibility.addEventListener('click', () => {
                        togglePasswordVisibility(inputTag, passwordVisibility);
                    })
                }

                if (inputUtilityType === "colorPicker") {
                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let inputColorSelected = inputUtilityContainer.querySelector('[data-input-color-selected]')

                    let allInputColorInsideForm = formTag.querySelectorAll('[data-input-text-type=color]')
                    colorPicker.startColorPicker(documentShadowRoot, allInputColorInsideForm)

                    // comprende anche il color picker wrapper (è una label) per bloccare blur quando si sceglie il colore - attributo settato nel suo js preso da attributo sul tag input
                    let allColorPickerLabel = formTag.querySelectorAll(`[data-color-picker-label=${inputTag.id}]`)

                    allColorPickerLabel.forEach(colorPickerLabel => {
                        colorPickerLabel.addEventListener('mousedown', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        })
                        colorPickerLabel.addEventListener('touchstart', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        }, {passive: true})
                    });
                }

                if (inputUtilityType === "dateTime") {
                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let inputDateTimeContainer = inputUtilityContainer.querySelector('.input-date-time-container')
                    let inputDateTimeValueContainer = inputUtilityContainer.querySelector(`#input-date-time-value-container-${inputTag.id}`)
                    let allDateTimeLabel = inputUtilityContainer.querySelectorAll('[data-date-time-label]')

                    // min and max date
                    let dtMinDate = setMinMaxDate(inputTag.dataset.minDate)
                    let dtMaxDate = setMinMaxDate(inputTag.dataset.maxDate)
                    let dtMinMaxDateMessage = inputTag.dataset.minMaxDateMessage

                    // min and max time
                    let dtMinTime = inputTag.dataset.minTime
                    let dtMaxTime = inputTag.dataset.maxTime
                    let dtMiddleInvalidTime = inputTag.dataset.middleInvalidTime
                    let dtMinMaxTimeMessage = inputTag.dataset.minMaxTimeMessage

                    // time format
                    let dtTimeFormat = ''
                    if (inputTag.dataset.timePicker === 'no-seconds') {
                        dtTimeFormat = 'HH:MM'
                    } else {
                        dtTimeFormat = 'HH:MM:SS'
                    }

                    if (inputTag.dataset.inputTextType === "date") {
                        new dt.setDTSEL(inputTag, {
                            showTime: false,
                            showDate: true,
                            dateFormat: "dd-mm-yyyy",
                            timeFormat: "HH:MM:SS",
                            direction: "TOP",
                            defaultView: "DAYS",
                            paddingX: 0,
                            paddingY: 0,
                            minDate: `${dtMinDate}`,
                            maxDate: `${dtMaxDate}`,
                            dateMessage: `${dtMinMaxDateMessage}`
                        }, documentShadowRoot);
                    }
                    if (inputTag.dataset.inputTextType === "time") {
                        new dt.setDTSEL(inputTag, {
                            showTime: true,
                            showDate: false,
                            dateFormat: "dd-mm-yyyy",
                            timeFormat: `${dtTimeFormat}`,
                            direction: "TOP",
                            defaultView: "DAYS",
                            paddingX: 0,
                            paddingY: 0,
                            minTime: `${dtMinTime}`,
                            maxTime: `${dtMaxTime}`,
                            middleInvalidTime: `${dtMiddleInvalidTime}`,
                            timeMessage: `${dtMinMaxTimeMessage}`
                        }, documentShadowRoot);
                    }
                    if (inputTag.dataset.inputTextType === "dateTime") {
                        new dt.setDTSEL(inputTag, {
                            showTime: true,
                            showDate: true,
                            dateFormat: "dd-mm-yyyy",
                            timeFormat: `${dtTimeFormat}`,
                            direction: "TOP",
                            defaultView: "DAYS",
                            paddingX: 0,
                            paddingY: 0,
                            minDate: `${dtMinDate}`,
                            maxDate: `${dtMaxDate}`,
                            dateMessage: `${dtMinMaxDateMessage}`,
                            minTime: `${dtMinTime}`,
                            maxTime: `${dtMaxTime}`,
                            middleInvalidTime: `${dtMiddleInvalidTime}`,
                            timeMessage: `${dtMinMaxTimeMessage}`
                        }, documentShadowRoot);
                    }

                    inputDateTimeContainer.addEventListener('click', () => {
                        inputTag.focus()
                    })

                    allDateTimeLabel.forEach(dateTimeLabel => {
                        dateTimeLabel.addEventListener('mousedown', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        })
                        dateTimeLabel.addEventListener('touchstart', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        }, {passive: true})
                    });

                    var disableInputBlurEventWhenClickingDateTimePicker = function () {
                        // se è attivo un altro input ed è vuoto non blocco la sua chiusura on blur
                        if (documentShadowRoot.activeElement === inputTag) {
                            clickInProgress_onLabelOpen_onPasswordVisibility = true;
                        }
                    }

                    // open close date time picker
                    let dateTimePickerBoxIsOpen = false
                    let dateTimePickerInputIsntFirstTimeInFocus = true

                    inputTag.addEventListener('focus', () => {
                        if (dateTimePickerBoxIsOpen === false) {

                            dateTimePickerBoxIsOpen = true
                            let dateTimePickerBox = documentShadowRoot.querySelector(`#date-selector-wrapper-${inputTag.id}`)
                            if (dateTimePickerInputIsntFirstTimeInFocus === false) {
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                            } else {
                                if (dateTimePickerBox !== undefined) {
                                    dateTimePickerBox.addEventListener('mousedown', disableInputBlurEventWhenClickingDateTimePicker)
                                    dateTimePickerBox.addEventListener('touchstart', disableInputBlurEventWhenClickingDateTimePicker, {passive: true})
                                }
                            }
                        }
                    })

                    inputTag.addEventListener('blur', () => {
                        if (clickInProgress_onLabelOpen_onPasswordVisibility === false) {
                            let dateTimePickerBox = documentShadowRoot.querySelector(`#date-selector-wrapper-${inputTag.id}`)
                            if (dateTimePickerBox !== undefined) {
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                dateTimePickerBoxIsOpen = false
                                dateTimePickerInputIsntFirstTimeInFocus = false
                            }
                        }
                    })

                    // set value onload from php data
                    function dateTimeSetValueOnLoad() {
                        if (inputTag.value === '') {
                            inputDateTimeValueContainer.innerHTML = inputTag.dataset.dateTimeNotSelectedValue
                        } else {
                            inputDateTimeValueContainer.innerHTML = inputTag.value
                        }
                    }
                    window.addEventListener('load', () => {
                        dateTimeSetValueOnLoad()
                    })
                }

                if (inputUtilityType === "attachFile") {
                    let inputTag = inputUtilityContainer.querySelector('.input')
                    let inputTagNoneAttachedFileMessage = inputTag.dataset.noneAttachedFileInputMessage
                    let inputFileinvalidFeedbackContainer = formTag.querySelector(`#invalid-feedback-${inputTag.id}`)

                    let inputAttachFileLabels = formTag.querySelectorAll(`[data-input-attach-file-label-for=${inputTag.id}]`)
                    let inputAttachFileValueContainer = inputUtilityContainer.querySelector('[data-input-attach-file-value-container]')

                    let allAttachFileOnClickInputFocus = inputUtilityContainer.querySelectorAll('[data-attach-file-input-focus]')

                    let attachFileLabel = inputUtilityContainer.querySelector('[data-attach-file-label]')
                    let attachFileRemoveAllContainer = inputUtilityContainer.querySelector('[data-attach-file-remove-all-container]')
                    let attachFileRemoveAllButton = attachFileRemoveAllContainer.querySelector('[data-attach-file-remove-all]')

                    // MESSAGES
                    // size message
                    let fileSizeMessage = ''
                    if (inputTag.dataset.fileSizeMessage !== undefined) {
                        fileSizeMessage = inputTag.dataset.fileSizeMessage
                    }
                    // extension message
                    let fileExtensionMessage = ''
                    if (inputTag.dataset.fileExtensionMessage !== undefined) {
                        fileExtensionMessage = inputTag.dataset.fileExtensionMessage
                    }
                    // multiple max message
                    let fileMultipleMaxMessage = ''
                    if (inputTag.dataset.fileMultipleMaxMessage !== undefined) {
                        fileMultipleMaxMessage = inputTag.dataset.fileMultipleMaxMessage
                    }
                    // multiple min message
                    let fileMultipleMinMessage = ''
                    if (inputTag.dataset.fileMultipleMinMessage !== undefined) {
                        fileMultipleMinMessage = inputTag.dataset.fileMultipleMinMessage
                    }

                    // required message
                    let requiredMessage = ''
                    if (inputTag.dataset.inputRequiredMessage !== undefined) {
                        requiredMessage = inputTag.dataset.inputRequiredMessage
                    }

                    // global message
                    let fileMessage = []
                    if (fileSizeMessage !== '') {
                        fileMessage.push(fileSizeMessage)
                    }
                    if (fileExtensionMessage !== '') {
                        fileMessage.push(fileExtensionMessage)
                    }
                    if (fileMultipleMaxMessage !== '') {
                        fileMessage.push(fileMultipleMaxMessage)
                    }
                    if (fileMultipleMinMessage !== '') {
                        fileMessage.push(fileMultipleMinMessage)
                    }

                    // string global message without required message
                    let fileMessageWithoutRequired = fileMessage.join('<br>')
                    // END OF MESSAGES

                    allAttachFileOnClickInputFocus.forEach(attachFileOnClickInputFocus => {
                        attachFileOnClickInputFocus.addEventListener('mousedown', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        })
                        attachFileOnClickInputFocus.addEventListener('touchstart', () => {
                            // se è attivo un altro input ed è vouto non blocco la sua chiusura on blur
                            if (documentShadowRoot.activeElement === inputTag) {
                                clickInProgress_onLabelOpen_onPasswordVisibility = true;
                            };
                        }, {passive: true})
                    });

                    inputAttachFileLabels.forEach(inputAttachFileLabel => {
                        inputAttachFileLabel.addEventListener('click', () => {
                            inputTag.focus()
                        })
                    });


                    function clearAttachedFile() {
                        inputTag.value = ""
                        inputAttachFileValueContainer.innerHTML = `<label for='${inputTag.id}' class='input-attach-file-value input-none-file-selected'>` + inputTagNoneAttachedFileMessage + "</label>"
                        attachFileRemoveAllContainer.classList.remove('input-utility-slot-left-visible-always-show')
                        attachFileLabel.classList.add('input-utility-slot-left-visible-always-show')
                    }

                    // rimuove tutti i file allegati
                    attachFileRemoveAllButton.addEventListener('click', () => {
                        clearAttachedFile()
                        if (requiredMessage !== '') {
                            inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + requiredMessage + "<br>" + fileMessageWithoutRequired + "</p>"
                        } else {
                            inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMessageWithoutRequired + "</p>"
                        }
                        checkInputLive(formTag, inputTag, documentShadowRoot)
                        inputTag.focus()
                    })


                    // verifica che il file allegato abbia la corretta estensione richiesta in input.accept
                    function isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) {
                        let notContainsThisFileExtension = []
                        for (let i = 0; i < inputTagFilesArray.length; i++) {
                            let file = inputTagFilesArray[i];
                            let fileType = file.type

                            if (!inputTagFileAcceptExtensionArray.includes(fileType) && !inputTagFileAcceptExtensionArray.includes(`${fileType.split('/')[0]}/*`) && inputTagFileAcceptExtensionArray[0] !== '') {
                                notContainsThisFileExtension.push('false')
                            }
                        }

                        if (notContainsThisFileExtension.length === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    // verifica che il file allegato abbia la corretta dimensione richiesta in input.dataset.attachedFileMaxSizeMb (sempre in MB)
                    function isCorrectFileSize(inputTagFileMaxSize, inputTagFilesArray) {
                        // se al posto della size in MB è scritto none in html, return true
                        if (inputTagFileMaxSize !== "none") {
                            let attachedFileIsTooLarge = []
                            for (let i = 0; i < inputTagFilesArray.length; i++) {
                                let file = inputTagFilesArray[i];
                                let fileSize = parseFloat((file.size / 1000000).toFixed(2))

                                if (fileSize > parseFloat(inputTagFileMaxSize)) {
                                    attachedFileIsTooLarge.push('false')
                                }
                            }
                            if (attachedFileIsTooLarge.length === 0) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    }

                    function attachedFileOpenDetails(attachFileContainer) {
                        let allInputFileSelected = attachFileContainer.querySelectorAll('.input-file-selected')

                        allInputFileSelected.forEach(inputFileSelected => {
                            let inputFileSelectedClick = inputFileSelected.querySelector('.input-attach-file-selected-container')
                            let buttonDetailsAttachedFile = inputFileSelected.querySelector('[data-button-details-attached-file]')
                            let detailsAttachedFileContainer = inputFileSelected.querySelector('[data-details-attached-file-container]')

                            inputFileSelectedClick.addEventListener('click', () => {
                                if (!detailsAttachedFileContainer.classList.contains('input-attach-file-selected-details-container-show')) {
                                    buttonDetailsAttachedFile.classList.remove('attached-file-icon-show-details')
                                    buttonDetailsAttachedFile.classList.add('attached-file-icon-hide-details')
                                    detailsAttachedFileContainer.classList.add('input-attach-file-selected-details-container-show')
                                } else {
                                    buttonDetailsAttachedFile.classList.add('attached-file-icon-show-details')
                                    buttonDetailsAttachedFile.classList.remove('attached-file-icon-hide-details')
                                    detailsAttachedFileContainer.classList.remove('input-attach-file-selected-details-container-show')
                                }
                            })
                        });
                    }

                    // return file size data bytes a KB o MB a seconda della dimensione
                    function returnFileSize(number) {
                        if (number < 1000) {
                            return `<span>Dimensione: </span><span>${number} bytes;</span>`;
                        } else if (number >= 1000 && number < 1000000) {
                            return `<span>Dimensione: </span><span>${(number / 1000).toFixed(1)} KB;</span>`;
                        } else if (number >= 1000000) {
                            return `<span>Dimensione: </span><span>${(number / 1000000).toFixed(1)} MB;</span>`;
                        }
                    }

                    /**
                    * @param {DateConstructor} date 
                    * return file date formato g/m/aaaa h:mm
                    */
                    function returnFileLastModifiedDate(date) {
                        //let dayNumber = date.getDate()
                        let monthNumber = date.getMonth() + 1
                        let fullYear = date.getFullYear()
                        //let hoursNumber = date.getHours()
                        //let minutesNumber = date.getMinutes()
                        if (monthNumber.toString().length === 1) {
                            return "<span>Ultima Modifica: </span><span>0" + monthNumber + "/" + fullYear + ";</span>"
                        } else {
                            return "<span>Ultima Modifica: </span><span>" + monthNumber + "/" + fullYear + ";</span>"
                        }
                    }

                    // se non ci sono allegati mette la scritta scelta es. none, altrimenti se l'estensione è corretta fa vedere i files o il file allegati altrimenti li toglie e mette la scritta none
                    
                    // messa fuori dalla funzione per impedire il campio estensioni accettate modificando accept con gli strumenti di sviluppo
                    let inputTagFileAcceptExtensionArray = inputTag.accept.split(',')
                    
                    function setInputAttachFileVisible() {
                        let inputTagFilesArray = inputTag.files

                        let inputTagFileMaxSizeMB = inputTag.dataset.attachedFileMaxSizeMb
                        let inputTagFileMultipleMaxFiles = inputTag.dataset.multileMaxFiles
                        let inputTagFileMultipleMinFiles = inputTag.dataset.multileMinFiles

                        if (inputTagFileMultipleMaxFiles === 'none' || inputTagFileMultipleMaxFiles === undefined || inputTagFileMultipleMaxFiles === '') {
                            // se non impostato, numero massimo = numero dei files allegati dall'utente
                            inputTagFileMultipleMaxFiles = inputTagFilesArray.length
                        }
                        if (inputTagFileMultipleMinFiles === 'none' || inputTagFileMultipleMinFiles === undefined || inputTagFileMultipleMinFiles === '') {
                            // se non impostato, numero minimo = 0
                            inputTagFileMultipleMinFiles = '0'
                        }

                        if (inputTagFilesArray.length === 0) {
                            // solo on load setta il value di default
                            inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMessageWithoutRequired + "</p>"
                            clearAttachedFile()
                        } else {
                            if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === true && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === true && inputTagFileMultipleMaxFiles === undefined) {
                                // se estensione corretta, size corretta e non multiple
                                // aggiungo il file
                                inputAttachFileValueContainer.innerHTML = ""
                                for (let i = 0; i < inputTagFilesArray.length; i++) {
                                    let file = inputTagFilesArray[i];
                                    inputAttachFileValueContainer.innerHTML += `<div data-attached-file data-file-name='${file.name}' data-file-type='${file.type}' data-file-size='${file.size}' data-file-last-modified='${file.lastModified}' class='input-attach-file-value input-file-selected'><div class="input-attach-file-selected-container"><div class='input-attach-file-selected-name'>${file.name}</div><div data-button-details-attached-file class='input-attach-file-icon attached-file-icon-show-details'></div></div><div data-details-attached-file-container class="input-attach-file-selected-details-container"><a href='${URL.createObjectURL(file)}' target="_blanch" class="link-preview-attached-file"><div class="input-attach-file-selected-details-preview"><div class='button-preview-attached-file'></div></div></a><div class='input-attach-file-selected-details-text'><p>${returnFileSize(file.size)}</p><p><span>Tipo: </span><span>${file.type};</span></p><p>${returnFileLastModifiedDate(new Date(file.lastModified))}</p></div></div></div>`
                                }
                                attachedFileOpenDetails(inputAttachFileValueContainer)
                                attachFileLabel.classList.remove('input-utility-slot-left-visible-always-show')
                                attachFileRemoveAllContainer.classList.add('input-utility-slot-left-visible-always-show')
                                inputFileinvalidFeedbackContainer.innerHTML = ""
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === true && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === true && inputTagFileMultipleMaxFiles !== undefined) {
                                // se multiple
                                if (inputTagFilesArray.length >= parseFloat(inputTagFileMultipleMinFiles) && inputTagFilesArray.length <= parseFloat(inputTagFileMultipleMaxFiles)) {
                                    // se numero files selezionati dall'utente maggiore o uguale al numero minimo e minore o uguale al numero massimo - aggiungo il file o i files
                                    inputAttachFileValueContainer.innerHTML = ""
                                    for (let i = 0; i < inputTagFilesArray.length; i++) {
                                        let file = inputTagFilesArray[i];
                                        inputAttachFileValueContainer.innerHTML += `<div data-attached-file data-file-name='${file.name}' data-file-type='${file.type}' data-file-size='${file.size}' data-file-last-modified='${file.lastModified}' class='input-attach-file-value input-file-selected'><div class="input-attach-file-selected-container"><div class='input-attach-file-selected-name'>${file.name}</div><div data-button-details-attached-file class='input-attach-file-icon attached-file-icon-show-details'></div></div><div data-details-attached-file-container class="input-attach-file-selected-details-container"><a href='${URL.createObjectURL(file)}' target="_blanch" class="link-preview-attached-file"><div class="input-attach-file-selected-details-preview"><div class='button-preview-attached-file'></div></div></a><div class='input-attach-file-selected-details-text'><p>${returnFileSize(file.size)}</p><p><span>Tipo: </span><span>${file.type};</span></p><p>${returnFileLastModifiedDate(new Date(file.lastModified))}</p></div></div></div>`
                                    }
                                    attachedFileOpenDetails(inputAttachFileValueContainer)
                                    attachFileLabel.classList.remove('input-utility-slot-left-visible-always-show')
                                    attachFileRemoveAllContainer.classList.add('input-utility-slot-left-visible-always-show')
                                    inputFileinvalidFeedbackContainer.innerHTML = ""
                                } else {
                                    // se numero files selezionati dall'utente minore del numero minimo oppure maggiore del numero massimo - rimuovo tutto
                                    if (inputTagFilesArray.length < parseFloat(inputTagFileMultipleMinFiles)) {
                                        // se numero files selezionati dall'utente minore del numero minimo
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMinMessage + "</p>"
                                    }
                                    if (inputTagFilesArray.length > parseFloat(inputTagFileMultipleMaxFiles)) {
                                        // se numero files selezionati dall'utente maggiore del numero massimo
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMaxMessage + "</p>"
                                    }
                                    clearAttachedFile()
                                    checkInputLive(formTag, inputTag, documentShadowRoot)
                                    inputTag.focus()
                                }
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === false && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === true && inputTagFileMultipleMaxFiles === undefined) {
                                // se estensione sbagliata - rimuovo tutto
                                inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileExtensionMessage + "</p>"
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === true && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === false && inputTagFileMultipleMaxFiles === undefined) {
                                // se size sbagliata - rimuovo tutto
                                inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileSizeMessage + "</p>"
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === false && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === true && inputTagFileMultipleMaxFiles !== undefined) {
                                // se estensione sbagliata e multiple - rimuovo tutto
                                if (inputTagFilesArray.length >= parseFloat(inputTagFileMultipleMinFiles) && inputTagFilesArray.length <= parseFloat(inputTagFileMultipleMaxFiles)) {
                                    inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileExtensionMessage + "</p>"
                                } else {
                                    if (inputTagFilesArray.length < parseFloat(inputTagFileMultipleMinFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMinMessage + "<br>" + fileExtensionMessage + "</p>"
                                    }
                                    if (inputTagFilesArray.length > parseFloat(inputTagFileMultipleMaxFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMaxMessage + "<br>" + fileExtensionMessage + "</p>"
                                    }
                                }
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === true && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === false && inputTagFileMultipleMaxFiles !== undefined) {
                                // se size sbagliata e multiple - rimuovo tutto
                                if (inputTagFilesArray.length >= parseFloat(inputTagFileMultipleMinFiles) && inputTagFilesArray.length <= parseFloat(inputTagFileMultipleMaxFiles)) {
                                    inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileSizeMessage + "</p>"
                                } else {
                                    if (inputTagFilesArray.length < parseFloat(inputTagFileMultipleMinFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMinMessage + "<br>" + fileSizeMessage + "</p>"
                                    }
                                    if (inputTagFilesArray.length > parseFloat(inputTagFileMultipleMaxFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMaxMessage + "<br>" + fileSizeMessage + "</p>"
                                    }
                                }
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === false && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === false && inputTagFileMultipleMaxFiles === undefined) {
                                // se size ed extension sbagliate - rimuovo tutto
                                inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileSizeMessage + "<br>" + fileExtensionMessage + "</p>"
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            } else if (isCorrectFileExtension(inputTagFileAcceptExtensionArray, inputTagFilesArray) === false && isCorrectFileSize(inputTagFileMaxSizeMB, inputTagFilesArray) === false && inputTagFileMultipleMaxFiles !== undefined) {
                                // se size ed extension sbagliate e multiple - rimuovo tutto
                                if (inputTagFilesArray.length >= parseFloat(inputTagFileMultipleMinFiles) && inputTagFilesArray.length <= parseFloat(inputTagFileMultipleMaxFiles)) {
                                    inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileSizeMessage + "<br>" + fileExtensionMessage + "</p>"
                                } else {
                                    if (inputTagFilesArray.length < parseFloat(inputTagFileMultipleMinFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMinMessage + "<br>" + fileSizeMessage + "<br>" + fileExtensionMessage + "</p>"
                                    }
                                    if (inputTagFilesArray.length > parseFloat(inputTagFileMultipleMaxFiles)) {
                                        inputFileinvalidFeedbackContainer.innerHTML = "<p class='input-feedback'>" + fileMultipleMaxMessage + "<br>" + fileSizeMessage + "<br>" + fileExtensionMessage + "</p>"
                                    }
                                }
                                clearAttachedFile()
                                checkInputLive(formTag, inputTag, documentShadowRoot)
                                inputTag.focus()
                            }
                        }
                    }

                    // on load
                    window.addEventListener('load', () => {
                        setInputAttachFileVisible()
                    })

                    // on change sull'inputTag
                    inputTag.addEventListener('change', () => {
                        setInputAttachFileVisible()
                    })
                }

                // padding input for utility, width utility container for icon and feedback padding for textarea with utility
                window.addEventListener('load', () => {
                    setTimeout(function () {setInputPaddingForUtility(inputUtilityType, inputUtilityContainer, formTag)}, 500)
                })
            }
        });

    });
}


/**
 * @param {HTMLFormElement} formTag
 * @returns non permette all'utente di scrive nell'input type text e mette inputmode=none per la tastiera a schermo touch
 * @note non interromepe lo scorrimento con tab e shift+tab degli inputs della form
 */
function setInputNoWrite(formTag) {
    let allInputTagNoWrite = formTag.querySelectorAll('[data-input-no-write]')

    allInputTagNoWrite.forEach(inputTagNoWrite => {
        inputTagNoWrite.setAttribute('inputmode', 'none')
        inputTagNoWrite.addEventListener('keydown', (e) => {
            if (e.keyCode === 9 || e.shiftKey && e.keyCode === 9) {
                return
            } else {
                e.preventDefault()
            }
        })
    })
}





// RANGE

// create array da es nFrom 0 e nTo 10 crea [0,1,2,3,4,5,6,7,8,9,10]
function* createArrayFromRange(nFrom, nTo) {
    for (var i = nFrom; i <= nTo; ++i) yield i;
}

// data-range-valid-value="10-90;95" --> is valid all numbers from 10 to 90 and number 95 --> return array with them
function createArrayFromInputRangeDatasetRangeValidValue(inputRange) {
    let validValueArray = []

    let valuesBlockArray = inputRange.dataset.rangeValidValue.split(';')
    valuesBlockArray.forEach(valueBlock => {
        if (valueBlock.includes(':')) {
            let valueBlockRangeNumbersArray = valueBlock.split(":")
            Array.from(createArrayFromRange(parseFloat(valueBlockRangeNumbersArray[0]), parseFloat(valueBlockRangeNumbersArray[1]))).forEach(rangeNumber => {
                validValueArray.push(rangeNumber)
            });
        } else {
            validValueArray.push(parseFloat(valueBlock))
        }
    })

    return validValueArray
}



function setInputTypeRange(formTag, documentShadowRoot) {
    const allFormInputRangeContainer = formTag.querySelectorAll('.form-input-range-container')

    allFormInputRangeContainer.forEach(formInputRangeContainer => {

        let inputRangeLabel = formTag.querySelector('.input-label')
        let inputRangeContainer = formInputRangeContainer.querySelector('.input-range-container')
        let inputRange = inputRangeContainer.querySelector('.input-range')
        let inputRangeInvalidFeedbackContainer = formTag.querySelector(`#invalid-feedback-${inputRange.id}`)

        if (inputRange.dataset.doubleRange === undefined) {

            let inputRangePredefinedValue = inputRange.dataset.rangeArrayValue
            let inputRangePredefinedValueArray = undefined
            let inputRangeInvalidPredefinedValueArray = undefined
            let defaultRangeValue = parseFloat(inputRange.dataset.defaultRangeValue)
            let rangeMin = undefined
            let rangeMax = undefined
            let rangeMinToMaxArray = undefined
            let rangeValidValueArray = undefined
            let inputRangeInvalidFeedbackMessage = ''

            let inputRangeStepLength = 0

            if (inputRangePredefinedValue !== undefined) {
                inputRangePredefinedValueArray = inputRangePredefinedValue.split(";")
                inputRangeInvalidPredefinedValueArray = inputRange.dataset.invalidRangeArrayValue.split(';')
                inputRangeStepLength = inputRangePredefinedValueArray.length - 1
            } else if (inputRangePredefinedValue === undefined) {
                rangeMin = parseFloat(inputRange.dataset.rangeMin)
                rangeMax = parseFloat(inputRange.dataset.rangeMax)
                rangeMinToMaxArray = Array.from(createArrayFromRange(rangeMin, rangeMax))
                rangeValidValueArray = createArrayFromInputRangeDatasetRangeValidValue(inputRange)
                inputRangeStepLength = rangeMinToMaxArray.length - 1
                inputRangeInvalidFeedbackMessage = inputRange.dataset.inputMessage
            }


            let inputRangeValuePreview = inputRangeContainer.querySelector('.input-range-value-preview')
            let inputRangePredefinedValueSelectedBox = undefined
            if (inputRangePredefinedValue !== undefined) {
                inputRangePredefinedValueSelectedBox = formInputRangeContainer.querySelector('.input-range-predefined-value-show-selected')
            }


            let inputRangeThumb = inputRangeContainer.querySelector('.input-range-thumb')
            let inputRangeTrackBeforeThumb = inputRangeContainer.querySelector('.input-range-track-before-thumb')
            let inputRangeTrack = inputRangeContainer.querySelector('.input-range-track')


            inputRangeContainer.addEventListener('mousedown', () => {
                inputRange.focus()
                if (documentShadowRoot.activeElement === inputRange) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            })

            inputRangeContainer.addEventListener('touchstart', () => {
                inputRange.focus()
                if (documentShadowRoot.activeElement === inputRange) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            }, {passive: true})


            // KEY EVENT

            var inputRangeThumbActive = false

            // DRAG EVENT

            var isDownOnRangeThumb = false

            var dragRangeDistLeft = 0

            var inputRangeContainerDistLeft = 0
            var dragRangeMaxDistLeft = 0
            var inputRangeSingleStepWidth = 0

            var rangeActiveStepNumber = 0


            // PREVIEW

            function showInputRangeValuePreview() {
                if (inputRangePredefinedValue === undefined && !inputRangeValuePreview.classList.contains('input-range-value-preview-show')) {
                    inputRangeValuePreview.classList.add('input-range-value-preview-show')
                }
            }

            function hideInputRangeValuePreview() {
                if (clickInProgress_onLabelOpen_onPasswordVisibility === false && inputRangePredefinedValue === undefined && inputRangeValuePreview.classList.contains('input-range-value-preview-show')) {
                    inputRangeValuePreview.classList.remove('input-range-value-preview-show')
                }
            }


            inputRange.addEventListener('focus', () => {
                showInputRangeValuePreview()
            })

            inputRange.addEventListener('blur', () => {
                hideInputRangeValuePreview()
            })




            function setValueFromRangeStep(e) {
                if (inputRangePredefinedValue === undefined) {

                    let rangeActiveStepValue = rangeActiveStepNumber
                    if (rangeMin !== 0) {
                        rangeActiveStepValue += rangeMin
                    }

                    if (rangeValidValueArray.includes(rangeActiveStepValue)) {
                        inputRange.value = rangeActiveStepValue
                        inputRangeValuePreview.innerHTML = `<span>${rangeActiveStepValue}</span>`
                    } else {
                        inputRange.value = ""
                        inputRangeValuePreview.innerHTML = `<span>${rangeActiveStepValue}</span>`
                        inputRangeInvalidFeedbackContainer.innerHTML = `<p class='input-feedback'>${inputRangeInvalidFeedbackMessage}</p>`
                    }
                } else if (inputRangePredefinedValue !== undefined) {
                    if (inputRangeInvalidPredefinedValueArray.includes(inputRangePredefinedValueArray[rangeActiveStepNumber])) {
                        inputRange.value = ""
                        inputRangePredefinedValueSelectedBox.innerHTML = inputRangePredefinedValueArray[rangeActiveStepNumber]
                    } else {
                        inputRange.value = inputRangePredefinedValueArray[rangeActiveStepNumber]
                        inputRangePredefinedValueSelectedBox.innerHTML = inputRangePredefinedValueArray[rangeActiveStepNumber]
                    }
                }

                if (e.type !== 'load' && e.type !== 'resize') {
                    checkInputLive(formTag, inputRange, documentShadowRoot)
                }
            }


            function setRangeOnResize(e) {
                inputRangeContainerDistLeft = inputRangeContainer.getBoundingClientRect().left
                dragRangeMaxDistLeft = inputRangeTrack.clientWidth - inputRangeThumb.clientWidth
                inputRangeSingleStepWidth = dragRangeMaxDistLeft / inputRangeStepLength
                dragRangeDistLeft = inputRangeSingleStepWidth * rangeActiveStepNumber
                applyMoveRange(e, dragRangeDistLeft)
            }



            function setPositionOfPredefinedValueSelectedBox(dragRangeDistLeft) {
                if (inputRangePredefinedValueSelectedBox !== undefined) {
                    inputRangePredefinedValueSelectedBox.style.left = dragRangeDistLeft + 'px'
                    if (inputRangePredefinedValueSelectedBox.offsetLeft < inputRangePredefinedValueSelectedBox.clientWidth / 2) {
                        inputRangePredefinedValueSelectedBox.style.transform = 'translateX(0%)'
                    } else if (inputRangePredefinedValueSelectedBox.offsetLeft + (inputRangePredefinedValueSelectedBox.clientWidth / 2) > inputRangeInvalidFeedbackContainer.clientWidth) {
                        inputRangePredefinedValueSelectedBox.style.transform = `translateX(calc(-100% + ${inputRangeThumb.clientWidth + 'px'}))`
                    } else {
                        inputRangePredefinedValueSelectedBox.style.transform = `translateX(calc(-50% + ${inputRangeThumb.clientWidth / 2 + 'px'}))`
                    }
                }
            }


            function applyMoveRange(e, dragRangeDistLeft) {
                if (dragRangeDistLeft <= 0) {
                    inputRangeThumb.style.left = 0 + 'px'
                    inputRangeTrackBeforeThumb.style.width = 0 + 'px'
                    dragRangeDistLeft = 0
                    rangeActiveStepNumber = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0))
                } else if (dragRangeDistLeft >= dragRangeMaxDistLeft) {
                    inputRangeThumb.style.left = dragRangeMaxDistLeft + 'px'
                    inputRangeTrackBeforeThumb.style.width = dragRangeMaxDistLeft + 'px'
                    dragRangeDistLeft = dragRangeMaxDistLeft
                    rangeActiveStepNumber = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0))
                } else {
                    if (e.type === 'keydown') {
                        inputRangeThumb.style.left = dragRangeDistLeft + 'px'
                        inputRangeTrackBeforeThumb.style.width = dragRangeDistLeft + 'px'
                        rangeActiveStepNumber = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0))
                    } else {
                        inputRangeThumb.style.left = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth + 'px'
                        inputRangeTrackBeforeThumb.style.width = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth + 'px'
                        dragRangeDistLeft = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth
                        rangeActiveStepNumber = parseFloat((dragRangeDistLeft / inputRangeSingleStepWidth).toFixed(0))
                    }
                }
                if (inputRangePredefinedValue !== undefined) {
                    setPositionOfPredefinedValueSelectedBox(dragRangeDistLeft)
                }
                setValueFromRangeStep(e)
            }


            function startDragThumbOnInputTypeRange() {
                // key
                inputRangeThumbActive = false

                isDownOnRangeThumb = true
                formInputRangeContainer.classList.add('input-range-cursor-ondrag')
            }

            function dragThumbOnInputTypeRange(e) {
                if (isDownOnRangeThumb === true) {
                    if (e.type === 'mousemove') {
                        dragRangeDistLeft = e.clientX - inputRangeContainerDistLeft
                    }
                    if (e.type === 'touchmove') {
                        dragRangeDistLeft = e.touches[0].clientX - inputRangeContainerDistLeft
                    }
                    applyMoveRange(e, dragRangeDistLeft)
                } else {
                    return;
                }
            }

            function endDragThumbOnInputTypeRange() {
                if (isDownOnRangeThumb === true) {
                    isDownOnRangeThumb = false
                    formInputRangeContainer.classList.remove('input-range-cursor-ondrag')

                    // key
                    inputRangeThumbActive = true
                    if (documentShadowRoot.activeElement !== inputRange) {
                        inputRange.focus()
                    }
                }
            }

            function moveThumbOnClickOnInputTypeRange(e) {
                if (e.composedPath()[0] !== inputRangeThumb) {
                    dragRangeDistLeft = e.clientX - inputRangeContainerDistLeft
                    applyMoveRange(e, dragRangeDistLeft)

                    // key
                    inputRangeThumbActive = true
                    if (documentShadowRoot.activeElement !== inputRange) {
                        inputRange.focus()
                    }
                }
            }

            function moveThumbOnKeydownOnInputTypeRange(e) {
                if (inputRangeThumbActive === true) {
                    if (e.keyCode === 39 || e.keyCode === 37) {
                        if (e.keyCode === 39) {
                            dragRangeDistLeft = inputRangeThumb.offsetLeft + inputRangeSingleStepWidth
                        } else if (e.keyCode === 37) {
                            dragRangeDistLeft = inputRangeThumb.offsetLeft - inputRangeSingleStepWidth
                        }
                        applyMoveRange(e, dragRangeDistLeft)
                    }
                }
            }

            function inputRangeDragOnLoadToValue(e) {
                if (inputRangePredefinedValue === undefined) {
                    if (inputRange.value === '') {
                        if (rangeMin !== 0) {
                            dragRangeDistLeft = inputRangeSingleStepWidth * (defaultRangeValue - rangeMin)
                        } else {
                            dragRangeDistLeft = inputRangeSingleStepWidth * defaultRangeValue
                        }
                        applyMoveRange(e, dragRangeDistLeft)
                    } else {
                        if (rangeMin !== 0) {
                            dragRangeDistLeft = inputRangeSingleStepWidth * (parseFloat(inputRange.value) - rangeMin)
                        } else {
                            dragRangeDistLeft = inputRangeSingleStepWidth * parseFloat(inputRange.value)
                        }
                        applyMoveRange(e, dragRangeDistLeft)
                    }
                } else if (inputRangePredefinedValue !== undefined) {
                    if (inputRange.value === '') {
                        dragRangeDistLeft = inputRangeSingleStepWidth * defaultRangeValue
                        applyMoveRange(e, dragRangeDistLeft)
                    } else {
                        dragRangeDistLeft = inputRangeSingleStepWidth * getPositionOfElementInArray(inputRange.value, inputRangePredefinedValueArray)
                        applyMoveRange(e, dragRangeDistLeft)
                    }
                }
            }


            window.addEventListener('load', (e) => {
                inputRangeContainerDistLeft = inputRangeContainer.getBoundingClientRect().left
                dragRangeMaxDistLeft = inputRangeTrack.clientWidth - inputRangeThumb.clientWidth
                inputRangeSingleStepWidth = dragRangeMaxDistLeft / inputRangeStepLength

                inputRangeDragOnLoadToValue(e)
            })

            inputRangeContainer.addEventListener("touchstart", startDragThumbOnInputTypeRange, {passive: true})
            window.addEventListener("touchmove", dragThumbOnInputTypeRange)
            window.addEventListener("touchend", endDragThumbOnInputTypeRange)

            inputRangeContainer.addEventListener("mousedown", startDragThumbOnInputTypeRange)
            window.addEventListener("mousemove", dragThumbOnInputTypeRange)
            window.addEventListener("mouseup", endDragThumbOnInputTypeRange)

            window.addEventListener('resize', setRangeOnResize)

            inputRangeTrack.addEventListener('click', moveThumbOnClickOnInputTypeRange)

            inputRange.addEventListener('keydown', moveThumbOnKeydownOnInputTypeRange)

        } else if (inputRange.dataset.doubleRange === "true") {

            let defaultRangeValueMin = parseFloat(inputRange.dataset.defaultRangeValue.split(':')[0])
            let defaultRangeValueMax = parseFloat(inputRange.dataset.defaultRangeValue.split(':')[1])
            let rangeMin = parseFloat(inputRange.dataset.rangeMin)
            let rangeMax = parseFloat(inputRange.dataset.rangeMax)
            let rangeMinToMaxArray = Array.from(createArrayFromRange(rangeMin, rangeMax))
            let rangeValidValueArray = createArrayFromInputRangeDatasetRangeValidValue(inputRange)
            let inputRangeStepLength = rangeMinToMaxArray.length - 1

            let inputRangeInvalidFeedbackMessage = inputRange.dataset.inputMessage

            let inputDoubleRangeValuesPreview = inputRangeContainer.querySelector('.input-double-range-values-preview')

            let inputRangeThumbMin = inputRangeContainer.querySelector('.input-double-range-thumb--min')
            let inputRangeThumbMax = inputRangeContainer.querySelector('.input-double-range-thumb--max')

            let inputRangeTrackBetweenThumbs = inputRangeContainer.querySelector('.input-double-range-track-between-thumbs')
            let inputRangeTrack = inputRangeContainer.querySelector('.input-range-track')

            let inputDoubleRangeMinStepBetweenMinMax = parseInt(inputRange.dataset.doubleRangeMinStepBetweenMinMax, 10)


            inputRangeContainer.addEventListener('mousedown', () => {
                inputRange.focus()
                if (documentShadowRoot.activeElement === inputRange) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            })

            inputRangeContainer.addEventListener('touchstart', () => {
                inputRange.focus()
                if (documentShadowRoot.activeElement === inputRange) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                }
            }, {passive: true})

            
            // KEY EVENT

            var inputRangeThumbMinActive = false
            var inputRangeThumbMaxActive = false

            // DRAG EVENT

            var isDownOnRangeThumbMin = false
            var isDownOnRangeThumbMax = false

            var dragRangeDistLeftMin = 0
            var dragRangeDistLeftMax = 0

            var inputRangeContainerDistLeft = 0
            var dragRangeMaxDistLeft = 0

            var inputRangeSingleStepWidth = 0

            var rangeActiveStepNumberMin = 0
            var rangeActiveStepNumberMax = 0


            // PREVIEW

            function showInputDoubleRangeValuesPreview() {
                if (!inputDoubleRangeValuesPreview.classList.contains('input-double-range-values-preview-show')) {
                    inputDoubleRangeValuesPreview.classList.add('input-double-range-values-preview-show')
                }
            }

            function hideInputDoubleRangeValuesPreview() {
                if (clickInProgress_onLabelOpen_onPasswordVisibility === false && inputDoubleRangeValuesPreview.classList.contains('input-double-range-values-preview-show')) {
                    inputDoubleRangeValuesPreview.classList.remove('input-double-range-values-preview-show')
                }
            }


            inputRange.addEventListener('focus', () => {
                showInputDoubleRangeValuesPreview()
            })

            inputRange.addEventListener('blur', () => {
                hideInputDoubleRangeValuesPreview()
            })


            function setValueFromRangeStep(e) {
                let rangeActiveStepValueMin = rangeActiveStepNumberMin
                let rangeActiveStepValueMax = rangeActiveStepNumberMax

                if (rangeMin !== 0) {
                    rangeActiveStepValueMin += rangeMin
                    rangeActiveStepValueMax += rangeMin
                }

                if (rangeValidValueArray.includes(rangeActiveStepValueMin) && rangeValidValueArray.includes(rangeActiveStepValueMax)) {
                    inputRange.value = rangeActiveStepValueMin + ":" + rangeActiveStepValueMax
                    inputDoubleRangeValuesPreview.innerHTML = `<span>${rangeActiveStepValueMin}</span><span style="font-weight:900;">-</span><span>${rangeActiveStepValueMax}</span>`
                } else {
                    inputRange.value = ""
                    inputDoubleRangeValuesPreview.innerHTML = `<span>${rangeActiveStepValueMin}</span><span style="font-weight:900;">-</span><span>${rangeActiveStepValueMax}</span>`
                    inputRangeInvalidFeedbackContainer.innerHTML = `<p class='input-feedback'>${inputRangeInvalidFeedbackMessage}</p>`
                }

                if (e.type !== 'load' && e.type !== 'resize') {
                    checkInputLive(formTag, inputRange, documentShadowRoot)
                }
            }


            function setRangeOnResize(e) {
                inputRangeContainerDistLeft = inputRangeContainer.getBoundingClientRect().left
                dragRangeMaxDistLeft = inputRangeTrack.clientWidth - inputRangeThumbMax.clientWidth
                inputRangeSingleStepWidth = dragRangeMaxDistLeft / inputRangeStepLength
                dragRangeDistLeftMin = inputRangeSingleStepWidth * rangeActiveStepNumberMin
                dragRangeDistLeftMax = inputRangeSingleStepWidth * rangeActiveStepNumberMax
                applyMoveRange(e, dragRangeDistLeftMin, dragRangeDistLeftMax)
            }


            function applyMoveRange(e, newDragRangeDistLeftMin = undefined, newDragRangeDistLeftMax = undefined) {
                if (newDragRangeDistLeftMin !== undefined) {
                    newDragRangeDistLeftMin = parseFloat(newDragRangeDistLeftMin/inputRangeSingleStepWidth).toFixed(0) * inputRangeSingleStepWidth
                    if (newDragRangeDistLeftMin <= 0) {
                        inputRangeThumbMin.style.left = 0 + 'px'
                        dragRangeDistLeftMin = 0
                        rangeActiveStepNumberMin = parseFloat((dragRangeDistLeftMin / inputRangeSingleStepWidth).toFixed(0))
                    } else if (newDragRangeDistLeftMin >= dragRangeDistLeftMax - (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax)) {
                        inputRangeThumbMin.style.left = dragRangeDistLeftMax - (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax) + 'px'
                        dragRangeDistLeftMin = dragRangeDistLeftMax - (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax)
                        rangeActiveStepNumberMin = parseFloat((dragRangeDistLeftMin / inputRangeSingleStepWidth).toFixed(0))
                    } else {
                        inputRangeThumbMin.style.left = parseFloat((newDragRangeDistLeftMin / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth + 'px'
                        dragRangeDistLeftMin = parseFloat((newDragRangeDistLeftMin / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth
                        rangeActiveStepNumberMin = parseFloat((newDragRangeDistLeftMin / inputRangeSingleStepWidth).toFixed(0))
                    }
                }

                if (newDragRangeDistLeftMax !== undefined) {
                    newDragRangeDistLeftMax = (parseFloat((newDragRangeDistLeftMax)/inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth
                    if (newDragRangeDistLeftMax <= dragRangeDistLeftMin + (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax)) {
                        inputRangeThumbMax.style.left = dragRangeDistLeftMin + (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax) + 'px'
                        dragRangeDistLeftMax = dragRangeDistLeftMin + (inputRangeSingleStepWidth * inputDoubleRangeMinStepBetweenMinMax)
                        rangeActiveStepNumberMax = parseFloat((dragRangeDistLeftMax / inputRangeSingleStepWidth).toFixed(0))
                    } else if (newDragRangeDistLeftMax >= dragRangeMaxDistLeft) {
                        inputRangeThumbMax.style.left = dragRangeMaxDistLeft + 'px'
                        dragRangeDistLeftMax = dragRangeMaxDistLeft
                        rangeActiveStepNumberMax = parseFloat((dragRangeMaxDistLeft / inputRangeSingleStepWidth).toFixed(0))
                    } else {
                        inputRangeThumbMax.style.left = parseFloat((newDragRangeDistLeftMax / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth + 'px'
                        dragRangeDistLeftMax = parseFloat((newDragRangeDistLeftMax / inputRangeSingleStepWidth).toFixed(0)) * inputRangeSingleStepWidth
                        rangeActiveStepNumberMax = parseFloat((newDragRangeDistLeftMax / inputRangeSingleStepWidth).toFixed(0))
                    }
                }

                /* linea colorata tra i due pallini */
                inputRangeTrackBetweenThumbs.style.width = (dragRangeDistLeftMax - dragRangeDistLeftMin) - inputRangeThumbMin.clientWidth + 'px'
                inputRangeTrackBetweenThumbs.style.maxWidth = (dragRangeDistLeftMax - dragRangeDistLeftMin) - inputRangeThumbMin.clientWidth + 'px'
                inputRangeTrackBetweenThumbs.style.left = dragRangeDistLeftMin + inputRangeThumbMin.clientWidth + 'px'

                inputDoubleRangeValuesPreview.style.left = dragRangeDistLeftMin + inputRangeThumbMin.clientWidth + (inputRangeTrackBetweenThumbs.clientWidth / 2) + 'px'

                setValueFromRangeStep(e)
            }


            function startDragThumbOnInputTypeRange(e) {
                // key
                inputRangeThumbMaxActive = false
                inputRangeThumbMinActive = false

                if (e.composedPath()[0] === inputRangeThumbMin) {
                    isDownOnRangeThumbMin = true
                    isDownOnRangeThumbMax = false
                } else if (e.composedPath()[0] === inputRangeThumbMax) {
                    isDownOnRangeThumbMax = true
                    isDownOnRangeThumbMin = false
                }

                formInputRangeContainer.classList.add('input-range-cursor-ondrag')
            }

            function dragThumbOnInputTypeRange(e) {
                if (isDownOnRangeThumbMin === true) {
                    if (e.type === 'mousemove') {
                        dragRangeDistLeftMin = e.clientX - inputRangeContainerDistLeft
                    }
                    if (e.type === 'touchmove') {
                        dragRangeDistLeftMin = e.touches[0].clientX - inputRangeContainerDistLeft
                    }
                    applyMoveRange(e, dragRangeDistLeftMin, undefined)
                } else if (isDownOnRangeThumbMax === true) {
                    if (e.type === 'mousemove') {
                        dragRangeDistLeftMax = e.clientX - inputRangeContainerDistLeft
                    }
                    if (e.type === 'touchmove') {
                        dragRangeDistLeftMax = e.touches[0].clientX - inputRangeContainerDistLeft
                    }
                    applyMoveRange(e, undefined, dragRangeDistLeftMax)
                } else {
                    return;
                }
            }

            function endDragThumbOnInputTypeRange() {
                if (isDownOnRangeThumbMin === true) {
                    isDownOnRangeThumbMin = false
                    isDownOnRangeThumbMax = false
                    formInputRangeContainer.classList.remove('input-range-cursor-ondrag')

                    // key
                    inputRangeThumbMaxActive = false
                    inputRangeThumbMinActive = true

                    if (documentShadowRoot.activeElement !== inputRange) {
                        inputRange.focus()
                    }
                } else if (isDownOnRangeThumbMax === true) {
                    isDownOnRangeThumbMin = false
                    isDownOnRangeThumbMax = false
                    formInputRangeContainer.classList.remove('input-range-cursor-ondrag')

                    // key
                    inputRangeThumbMinActive = false
                    inputRangeThumbMaxActive = true

                    if (documentShadowRoot.activeElement !== inputRange) {
                        inputRange.focus()
                    }
                }
            }

            function moveThumbOnClickOnInputTypeRange(e) {
                if (e.composedPath()[0] !== inputRangeThumbMin && e.composedPath()[0] !== inputRangeThumbMax) {
                    let clickPositionOnTrack = e.clientX - inputRangeContainerDistLeft
                    let mediumPointBetweenDistLeftMinAndDistLeftMax = (dragRangeDistLeftMin + dragRangeDistLeftMax) / 2
                    if (clickPositionOnTrack < mediumPointBetweenDistLeftMinAndDistLeftMax) {
                        dragRangeDistLeftMin = e.clientX - inputRangeContainerDistLeft
                        applyMoveRange(e, dragRangeDistLeftMin, undefined)

                        // key
                        inputRangeThumbMaxActive = false
                        inputRangeThumbMinActive = true

                        if (documentShadowRoot.activeElement !== inputRange) {
                            inputRange.focus()
                        }

                    } else {
                        dragRangeDistLeftMax = e.clientX - inputRangeContainerDistLeft
                        applyMoveRange(e, undefined, dragRangeDistLeftMax)

                        // key
                        inputRangeThumbMinActive = false
                        inputRangeThumbMaxActive = true

                        if (documentShadowRoot.activeElement !== inputRange) {
                            inputRange.focus()
                        }
                    }
                }
            }

            function moveThumbOnKeydownOnInputTypeRange(e) {
                if (e.keyCode === 39 || e.keyCode === 37) {
                    if (e.keyCode === 39) {
                        if (inputRangeThumbMinActive === true && inputRangeThumbMaxActive === false) {
                            dragRangeDistLeftMin = parseFloat(getComputedStyle(inputRangeThumbMin).left) + inputRangeSingleStepWidth
                            applyMoveRange(e, dragRangeDistLeftMin, undefined)
                        } else if (inputRangeThumbMinActive === false && inputRangeThumbMaxActive === true) {
                            dragRangeDistLeftMax = parseFloat(getComputedStyle(inputRangeThumbMax).left) + inputRangeSingleStepWidth
                            applyMoveRange(e, undefined, dragRangeDistLeftMax)
                        }
                    } else if (e.keyCode === 37) {
                        if (inputRangeThumbMinActive === true && inputRangeThumbMaxActive === false) {
                            dragRangeDistLeftMin = parseFloat(getComputedStyle(inputRangeThumbMin).left) - inputRangeSingleStepWidth
                            applyMoveRange(e, dragRangeDistLeftMin, undefined)
                        } else if (inputRangeThumbMinActive === false && inputRangeThumbMaxActive === true) {
                            dragRangeDistLeftMax = parseFloat(getComputedStyle(inputRangeThumbMax).left) - inputRangeSingleStepWidth
                            applyMoveRange(e, undefined, dragRangeDistLeftMax)
                        }
                    }
                }
            }

            function inputRangeDragOnLoadToValue(e) {
                if (inputRange.value === '') {
                    if (rangeMin !== 0) {
                        dragRangeDistLeftMin = inputRangeSingleStepWidth * (defaultRangeValueMin - rangeMin)
                        dragRangeDistLeftMax = inputRangeSingleStepWidth * (defaultRangeValueMax - rangeMin)
                    } else {
                        dragRangeDistLeftMin = inputRangeSingleStepWidth * defaultRangeValueMin
                        dragRangeDistLeftMax = inputRangeSingleStepWidth * defaultRangeValueMax
                    }
                    applyMoveRange(e, dragRangeDistLeftMin, dragRangeDistLeftMax)
                } else {
                    if (rangeMin !== 0) {
                        dragRangeDistLeftMin = inputRangeSingleStepWidth * (parseFloat(inputRange.value.split(':')[0]) - rangeMin)
                        dragRangeDistLeftMax = inputRangeSingleStepWidth * (parseFloat(inputRange.value.split(':')[1]) - rangeMin)
                    } else {
                        dragRangeDistLeftMin = inputRangeSingleStepWidth * parseFloat(inputRange.value.split(':')[0])
                        dragRangeDistLeftMax = inputRangeSingleStepWidth * parseFloat(inputRange.value.split(':')[1])
                    }
                    applyMoveRange(e, dragRangeDistLeftMin, dragRangeDistLeftMax)
                }
            }


            window.addEventListener('load', (e) => {
                inputRangeContainerDistLeft = inputRangeContainer.getBoundingClientRect().left
                dragRangeMaxDistLeft = inputRangeTrack.clientWidth - inputRangeThumbMax.clientWidth
                inputRangeSingleStepWidth = dragRangeMaxDistLeft / inputRangeStepLength

                inputRangeDragOnLoadToValue(e)
            })

            inputRangeThumbMin.addEventListener("touchstart", startDragThumbOnInputTypeRange, {passive: true})
            inputRangeThumbMax.addEventListener("touchstart", startDragThumbOnInputTypeRange, {passive: true})
            window.addEventListener("touchmove", dragThumbOnInputTypeRange)
            window.addEventListener("touchend", endDragThumbOnInputTypeRange)

            inputRangeThumbMin.addEventListener("mousedown", startDragThumbOnInputTypeRange)
            inputRangeThumbMax.addEventListener("mousedown", startDragThumbOnInputTypeRange)
            window.addEventListener("mousemove", dragThumbOnInputTypeRange)
            window.addEventListener("mouseup", endDragThumbOnInputTypeRange)

            window.addEventListener('resize', setRangeOnResize)

            inputRangeTrack.addEventListener('click', moveThumbOnClickOnInputTypeRange)

            inputRange.addEventListener('keydown', moveThumbOnKeydownOnInputTypeRange)

        }

    })
}

// fine range







// validazione di un input radio-checkbox del suo campo e checkbox
function checkInputRadioCheckboxValidityLive(formInputContainerRadioCheckbox, inputRadioCheckbox) {
    let invalidFeedbackContainerRadioCheckbox = formInputContainerRadioCheckbox.querySelector('.input-feedback-container-radio-checkbox')

    if (inputRadioCheckbox.type === "checkbox") {
        let allInputCheckbox = formInputContainerRadioCheckbox.querySelectorAll('.input-radio-checkbox')
        let allInputCheckboxChecked = formInputContainerRadioCheckbox.querySelectorAll('.input-radio-checkbox:checked')
        let checkboxRequiredNumber = formInputContainerRadioCheckbox.dataset.checkboxRequired
        if (allInputCheckboxChecked.length >= checkboxRequiredNumber) {
            allInputCheckbox.forEach(inputCheckbox => {
                inputCheckbox.removeAttribute('required')
                invalidFeedbackContainerRadioCheckbox.classList.remove('show-input-feedback')
                formInputContainerRadioCheckbox.classList.remove('form-input-container-radio-checkbox-invalid')
            });
        } else {
            allInputCheckbox.forEach(inputCheckbox => {
                inputCheckbox.setAttribute('required', '')
                invalidFeedbackContainerRadioCheckbox.classList.add('show-input-feedback')
                formInputContainerRadioCheckbox.classList.add('form-input-container-radio-checkbox-invalid')
            });
        }
    } else if (inputRadioCheckbox.type === "radio") {
        if (inputRadioCheckbox.checkValidity() === true) {
            invalidFeedbackContainerRadioCheckbox.classList.remove('show-input-feedback')
            formInputContainerRadioCheckbox.classList.remove('form-input-container-radio-checkbox-invalid')
        } else {
            invalidFeedbackContainerRadioCheckbox.classList.add('show-input-feedback')
            formInputContainerRadioCheckbox.classList.add('form-input-container-radio-checkbox-invalid')
        }
    }

}

// validazione di tutti gli input radio-checkbox anche in campi diversi
function checkInputRadioCheckboxValidity(allFormInputContainerRadioCheckbox) {
    allFormInputContainerRadioCheckbox.forEach(formInputContainerRadioCheckbox => {
        let allInputRadioCheckbox = formInputContainerRadioCheckbox.querySelectorAll('.input-radio-checkbox')
        allInputRadioCheckbox.forEach(inputRadioCheckbox => {
            checkInputRadioCheckboxValidityLive(formInputContainerRadioCheckbox, inputRadioCheckbox)
        });
    });
}

// attivazione label input ceccato
function inputRadioCheckboxChechedActiveLabel(inputRadioCheckboxContainer) {
    let inputRadioCheckboxChecked = inputRadioCheckboxContainer.querySelectorAll('.input-radio-checkbox:checked')
    let inputRadioCheckboxNotChecked = inputRadioCheckboxContainer.querySelectorAll('.input-radio-checkbox:not(:checked)')

    inputRadioCheckboxChecked.forEach(checked => {
        let checkedLabel = inputRadioCheckboxContainer.querySelector(`[for=${checked.id}]`)
        if (!checkedLabel.classList.contains('input-label-radio-checkbox-active')) {
            checkedLabel.classList.add('input-label-radio-checkbox-active')
        }
    });

    inputRadioCheckboxNotChecked.forEach(notChecked => {
        let notCheckedLabel = inputRadioCheckboxContainer.querySelector(`[for=${notChecked.id}]`)
        if (notCheckedLabel.classList.contains('input-label-radio-checkbox-active')) {
            notCheckedLabel.classList.remove('input-label-radio-checkbox-active')
        }
    });
}

/**
 * @param {nodeListOfHTMLElements} nodeListOfElements
 * @param {HTMLElement} activeElement
 * @returns true se uno degli elementi della NodeList è quello attivo, altrimenti false se nessun elemento è quello attivo
 */
function findActiveElementFromNodeList(nodeListOfElements, activeElement) {
    let activeElementResult = false
    nodeListOfElements.forEach(element => {
        if (element === activeElement) {
            activeElementResult = true
        }
    });
    return activeElementResult
}



/**
 * @param {HTMLFormElement} formTag
 * @returns valida i radio-checkbox button della form passata alla funzione
 */
function checkRadioCheckbox(formTag, documentShadowRoot) {
    const allFormInputContainerRadioCheckbox = formTag.querySelectorAll('.form-input-container-radio-checkbox')
    let clickInProgress_onInputRatio = false

    allFormInputContainerRadioCheckbox.forEach(formInputContainerRadioCheckbox => {

        let inputLegend = formInputContainerRadioCheckbox.querySelector('.input-legend')
        let inputUnderlineRadioCheckbox = formInputContainerRadioCheckbox.querySelector('.input-underline-radio-checkbox')
        let invalidFeedbackContainerRadioCheckbox = formInputContainerRadioCheckbox.querySelector('.input-feedback-container-radio-checkbox')
        let inputRadioCheckboxContainer = formInputContainerRadioCheckbox.querySelector('.input-radio-checkbox-container')
        let allInputLabelRadioCheckbox = inputRadioCheckboxContainer.querySelectorAll('.input-label-radio-checkbox')
        let allInputRadioCheckbox = inputRadioCheckboxContainer.querySelectorAll('.input-radio-checkbox')


        // input e label container click event
        inputRadioCheckboxContainer.addEventListener('click', (e) => {
            if (e.x !== 0 && e.y !== 0) {
                inputLegend.classList.add('input-legend-focus')
                inputUnderlineRadioCheckbox.classList.add('input-underline-focus-radio-checkbox')
                allInputRadioCheckbox[0].focus()
            }
        })
        // blocca il blur - mouse
        inputRadioCheckboxContainer.addEventListener('mousedown', () => {
            if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                clickInProgress_onInputRatio = true
            }
        })
        // blocca il blur - touch
        inputRadioCheckboxContainer.addEventListener('touchstart', () => {
            if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                clickInProgress_onInputRatio = true
            }
        }, {passive: true})

        // legend click event
        inputLegend.addEventListener('click', () => {
            inputLegend.classList.add('input-legend-focus')
            inputUnderlineRadioCheckbox.classList.add('input-underline-focus-radio-checkbox')
            allInputRadioCheckbox[0].focus()
        })
        // blocca il blur - mouse
        inputLegend.addEventListener('mousedown', () => {
            if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                clickInProgress_onInputRatio = true
            }
        })
        // blocca il blur - touch
        inputLegend.addEventListener('touchstart', () => {
            if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                clickInProgress_onInputRatio = true
            }
        }, {passive: true})


        // input focus e blur event
        allInputRadioCheckbox.forEach(inputRadioCheckbox => {
            // input on focus
            inputRadioCheckbox.addEventListener('focus', () => {
                inputLegend.classList.add('input-legend-focus')
                inputUnderlineRadioCheckbox.classList.add('input-underline-focus-radio-checkbox')
            })
            // input on blur -- bloccabile se si clicca sulla label dell'input aperto o sul visualizza password se input password in focus
            inputRadioCheckbox.addEventListener('blur', () => {
                if (clickInProgress_onInputRatio === false) {
                    inputLegend.classList.remove('input-legend-focus')
                    inputUnderlineRadioCheckbox.classList.remove('input-underline-focus-radio-checkbox')
                    checkInputRadioCheckboxValidityLive(formInputContainerRadioCheckbox, inputRadioCheckbox)
                }
            })

            inputRadioCheckbox.addEventListener('click', () => {
                checkInputRadioCheckboxValidityLive(formInputContainerRadioCheckbox, inputRadioCheckbox)
            })


            // active label dell'input checked e disable label input not checked
            inputRadioCheckbox.addEventListener('change', () => {
                inputRadioCheckboxChechedActiveLabel(inputRadioCheckboxContainer)
            })

        });


        // label click event
        allInputLabelRadioCheckbox.forEach(inputLabelRadioCheckbox => {
            // blocca il blur - mouse
            inputLabelRadioCheckbox.addEventListener('mousedown', () => {
                if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                    clickInProgress_onInputRatio = true
                }
            })
            // blocca il blur - touch
            inputLabelRadioCheckbox.addEventListener('touchstart', () => {
                if (findActiveElementFromNodeList(allInputRadioCheckbox, documentShadowRoot.activeElement) === true) {
                    clickInProgress_onInputRatio = true
                }
            }, {passive: true})
        });

    });

    // fuori da foreach -- mouseup e touchend sbloccano l'evento on blur degli input
    window.addEventListener('mouseup', () => {
        if (clickInProgress_onInputRatio === true) {
            clickInProgress_onInputRatio = false
        }
    })
    window.addEventListener('touchend', () => {
        if (clickInProgress_onInputRatio === true) {
            clickInProgress_onInputRatio = false
        }
    })
}


// SWITCH
function setSwitch(formTag) {
    const allFormInputSwitchContainer = formTag.querySelectorAll('.form-input-switch-container')
    
    allFormInputSwitchContainer.forEach(formInputSwitchContainer => {
        const switchLegend = formInputSwitchContainer.querySelector('.switch-legend')
        const inputSwitchFeedbackContainer = formInputSwitchContainer.querySelector('.input-switch-feedback-container')
        const boxSwitch = formInputSwitchContainer.querySelector('.box-switch')
        const inputSwitch = boxSwitch.querySelector('.input-switch')

        const switchLabel = boxSwitch.querySelector('.switch')
        const switchDot = boxSwitch.querySelector('.switch-dot')
        const switchTrueText = boxSwitch.querySelector('.switch-before-dot')
        const switchFalseText = boxSwitch.querySelector('.switch-after-dot')

        inputSwitch.addEventListener('change', () => {
            switchValidationLive(formInputSwitchContainer, inputSwitch, inputSwitchFeedbackContainer)
        })

        inputSwitch.addEventListener('focus', () => {
            switchLegend.classList.add('switch-legend-focus')
        })

        inputSwitch.addEventListener('blur', () => {
            switchLegend.classList.remove('switch-legend-focus')
            switchValidationLive(formInputSwitchContainer, inputSwitch, inputSwitchFeedbackContainer)
        })

        window.addEventListener('load', () => {
            // value onload
            if (inputSwitch.value === '' || inputSwitch.value === 'false') {
                inputSwitch.value = 'false'
            } else {
                inputSwitch.value = 'true'
                inputSwitch.setAttribute('checked', '')
            }
            // size onload
            if (switchTrueText.clientWidth >= switchFalseText.clientWidth) {
                switchLabel.style.width = switchTrueText.clientWidth + switchDot.clientWidth + 2 + 'px'
                switchTrueText.style.width = `calc(100% - ${switchDot.clientWidth}px)`
                switchFalseText.style.width = `calc(100% - ${switchDot.clientWidth}px)`
            } else {
                switchLabel.style.width = switchFalseText.clientWidth + switchDot.clientWidth + 2 + 'px'
                switchTrueText.style.width = `calc(100% - ${switchDot.clientWidth}px)`
                switchFalseText.style.width = `calc(100% - ${switchDot.clientWidth}px)`
            }
        })
    });
}

// validazione di input-switch on change
function switchValidationLive(formInputSwitchContainer, inputSwitch, inputSwitchFeedbackContainer) {
    if (inputSwitch.checkValidity() === true) {
        formInputSwitchContainer.classList.remove('form-input-switch-container-invalid')
        inputSwitchFeedbackContainer.classList.remove('show-input-switch-feedback')
        if (inputSwitch.checked) {
            inputSwitch.value = 'true'
        } else {
            inputSwitch.value = 'false'
        }
    } else {
        formInputSwitchContainer.classList.add('form-input-switch-container-invalid')
        inputSwitchFeedbackContainer.classList.add('show-input-switch-feedback')
        inputSwitch.value = 'false'
    }
}

// validazione di tutti gli input-switch on submit
function switchValidity(allFormInputSwitchContainer) {
    allFormInputSwitchContainer.forEach(formInputSwitchContainer => {
        let inputSwitch = formInputSwitchContainer.querySelector('.input-switch')
        let inputSwitchFeedbackContainer = formInputSwitchContainer.querySelector('.input-switch-feedback-container')
        switchValidationLive(formInputSwitchContainer, inputSwitch, inputSwitchFeedbackContainer)
    });
}


// DATALIST FREE E DATALIST REQUIRED CHE SOSTITUISCE I TAG SELECT

// ADD TUTTE LE OPTION FREE DAL SERVER SE TROVATE DA PHP NELLA RICERCA ALTRIMENTI MESSAGGIO, METTE CLICK EVENT SULLE OPTION
function addDatalistFreeOptionLiversearch(formTag, inputDatalist, inputDatalistValue, datalistLabelContainer, datalistTag, datalistInvalidFeedback, datalistMessages, documentShadowRoot) {
    // nuova richiesta a php
    let xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {

        // se risposta php completata con successo
        if (this.readyState === 4 && this.status === 200) {

            if (this.responseText !== "") {
                datalistTag.innerHTML = this.responseText

                // seleziona tutte le option inserite da php
                let allDatalistOption = datalistTag.querySelectorAll('option')

                // option onclick
                allDatalistOption.forEach(datalistOption => {
                    let datalistOptionInnerText = datalistOption.innerText
                    datalistOption.addEventListener('click', () => {
                        inputDatalist.value = datalistOptionInnerText
                        datalistOption.classList.add('datalist-option-active')
                        // questa classe indica solo che l'utente ha selezionato un option
                        datalistTag.classList.add('datalist-option-selected')

                        datalistTag.querySelectorAll('option').forEach(option => {
                            if (!option.classList.contains('datalist-option-active')) {
                                option.remove()
                            }
                        });

                        // close datalist
                        if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                            datalistLabelContainer.classList.remove('datalist-label-container-active')
                            fade.fadeOut(datalistLabelContainer, 20)
                        }
                        checkInputLive(formTag, inputDatalist, documentShadowRoot)
                    })
                    datalistOption.addEventListener('keydown', (e) => {
                        if (e.keyCode === 13) {

                            e.preventDefault()

                            inputDatalist.focus()
                            clickInProgress_onLabelOpen_onPasswordVisibility = false

                            inputDatalist.value = datalistOptionInnerText
                            datalistOption.classList.add('datalist-option-active')
                            // questa classe indica solo che l'utente ha selezionato un option
                            datalistTag.classList.add('datalist-option-selected')

                            datalistTag.querySelectorAll('option').forEach(option => {
                                if (!option.classList.contains('datalist-option-active')) {
                                    option.remove()
                                }
                            });

                            // close datalist
                            if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                                datalistLabelContainer.classList.remove('datalist-label-container-active')
                                fade.fadeOut(datalistLabelContainer, 20)
                            }
                            checkInputLive(formTag, inputDatalist, documentShadowRoot)
                        }
                    })
                });

                // se inserisco il comune mi autocompleta provincia e regione sole se data-autocomplete-provincia-regione-da-comune in html input datalist del comune
                setformAutocompleteAddressOnClickOptions(formTag, inputDatalist, datalistTag, documentShadowRoot)
            } else {
                datalistTag.innerHTML = ""
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.remove('datalist-label-container-active')
                    fade.fadeOut(datalistLabelContainer, 20)
                }
                datalistInvalidFeedback.classList.add('show-input-feedback')
                datalistInvalidFeedback.innerHTML = "<p class='input-feedback'>" + datalistMessages[1] + "</p>"
            }
        }
    }

    // invia richiesta a php
    xmlhttp.open("GET", datalistTag.dataset.jsonDatalistPath + "?inputDatalistValue=" + inputDatalistValue, true)
    xmlhttp.send()
}

// DATALIST OPTION FREE WITH JSON (accetta anche una value diversa dalla lista purchè rispetti il pattern dell'inputTag)
function setDatalistOptionLivesearch(formTag, datalistLabelContainer, inputDatalist, datalistTag, documentShadowRoot) {
    // se non c'è già un option selezionata
    if (inputDatalist.dataset.datalistOptionRequired === undefined) {
        if (!datalistTag.classList.contains('datalist-option-selected')) {
            let datalistInvalidFeedback = formTag.querySelector(`#invalid-feedback-${inputDatalist.id}`)
            let datalistMessages = datalistInvalidFeedback.dataset.datalistMessages.split(';')

            let inputDatalistValueMinLenghtForShowSuggest = inputDatalist.dataset.minLengthForSuggest
            let inputDatalistValue = inputDatalist.value.toLowerCase().replaceAll('#','!').replaceAll('&','!').replaceAll('+','!').replaceAll(' ', '+')

            // se il pattern è rispettato o se non è rispettato ma è una datalist tipo select
            if (new RegExp(inputDatalist.pattern, '').exec(inputDatalist.value) !== null) {
                if (inputDatalistValue.length < inputDatalistValueMinLenghtForShowSuggest && datalistTag.dataset.jsonDatalist !== undefined) {
                    // SOLO SE RICHIESTA DATI AL SERVER
                    datalistTag.innerHTML = ""
                    if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                        datalistLabelContainer.classList.remove('datalist-label-container-active')
                        fade.fadeOut(datalistLabelContainer, 20)
                    }
                    if (inputDatalistValue.length > 0 || inputDatalistValue.length === 0 && datalistInvalidFeedback.innerHTML === "") {
                        datalistInvalidFeedback.classList.add('show-input-feedback')
                        datalistInvalidFeedback.innerHTML = "<p class='input-feedback'>" + datalistMessages[0] + "</p>"
                    }
                } else { // se value length maggiore min length for suggestions
                    if (datalistTag.dataset.jsonDatalist !== undefined) {
                        // CON RICHIESTA AL SERVER
                        if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                            datalistLabelContainer.classList.add('datalist-label-container-active')
                            fade.fadeIn(datalistLabelContainer, 20)
                        }
                        addDatalistFreeOptionLiversearch(formTag, inputDatalist, inputDatalistValue, datalistLabelContainer, datalistTag, datalistInvalidFeedback, datalistMessages, documentShadowRoot)
                    }
                }
            } else {
                if (datalistTag.dataset.jsonDatalist !== undefined) {
                    // CON RICHIESTA AL SERVER
                    datalistTag.innerHTML = ""
                    if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                        datalistLabelContainer.classList.remove('datalist-label-container-active')
                        fade.fadeOut(datalistLabelContainer, 20)
                    }
                }
            }
        }
    }
}

// EXEC LIVESEARCH - SELECT e DATALIST FREE
function execDatalistOptionLivesearch(formTag, datalistTag, allDatalistOption, inputTag, datalistLabelContainer, serverValue) {
    if (datalistTag.innerHTML !== "") {
        allDatalistOption.forEach(datalistOption => {
            datalistOption.classList.remove('datalist-option-active')
            if (inputTag.value === "") {
                datalistOption.classList.remove('datalist-option-hide')
            } else {
                let inputTagValue = inputTag.value.toLowerCase()

                if (datalistOption.innerText.toLowerCase().includes(inputTagValue)) {
                    datalistOption.classList.remove('datalist-option-hide')
                } else {
                    datalistOption.classList.add('datalist-option-hide')
                }
            }
        })

        if (serverValue === undefined) {
            let allDatalistOptionHide = datalistTag.querySelectorAll('option.datalist-option-hide')

            if (allDatalistOption.length === allDatalistOptionHide.length) {
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.remove('datalist-label-container-active')
                    fade.fadeOut(datalistLabelContainer, 20)
                }
            } else {
                if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.add('datalist-label-container-active')
                    fade.fadeIn(datalistLabelContainer, 20)
                }
            }

            // messaggio di non presente nella lista solo se datalist libera senza json o se datalist per autocomplete con json es.per il cap
            if (inputTag.dataset.freeDatalistWithoutJson !== undefined || inputTag.dataset.autocompleteWithDatalistFreeOptionJson !== undefined) {
                let datalistInvalidFeedback = formTag.querySelector(`#invalid-feedback-${inputTag.id}`)
                let datalistMessagesAllOptionHide = datalistInvalidFeedback.dataset.datalistMessages.split(';')[1]
                if (inputTag.checkValidity() === true && allDatalistOption.length === allDatalistOptionHide.length) {
                    datalistInvalidFeedback.classList.add('show-input-feedback')
                    datalistInvalidFeedback.innerHTML = "<p class='input-feedback'>" + datalistMessagesAllOptionHide + "</p>"
                }
            }
        }
    }
}

// ADD PATTERN and EVENT (option click, inputTag input focus blur) - SELECT
function addPatternEventInputDatalistOptionRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot) {

    let datalistPattern = []
    // seleziona tutte le option inserite
    let allDatalistOption = datalistTag.querySelectorAll('option')

    // option onclick
    allDatalistOption.forEach(datalistOption => {
        let datalistOptionInnerText = datalistOption.innerText

        datalistPattern.push(datalistOptionInnerText)

        datalistOption.addEventListener('click', () => {
            inputDatalist.value = datalistOptionInnerText
            // vi faccio avvenire l'evento di input per eseguire gli eventi on input del campo (es. countCharacters)
            inputDatalist.dispatchEvent(new Event('input', { bubbles: true }));

            datalistOption.classList.add('datalist-option-active')
            // questa classe indica solo che l'utente ha selezionato un option
            datalistTag.classList.add('datalist-option-selected')

            datalistTag.querySelectorAll('option').forEach(option => {
                if (!option.classList.contains('datalist-option-active')) {
                    option.classList.add('datalist-option-hide')
                }
            });

            // close datalist
            if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                datalistLabelContainer.classList.remove('datalist-label-container-active')
                fade.fadeOut(datalistLabelContainer, 20)
            }
            checkInputLive(formTag, inputDatalist, documentShadowRoot)
        })
        datalistOption.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {

                e.preventDefault()

                clickInProgress_onLabelOpen_onPasswordVisibility = false
                inputDatalist.focus()

                inputDatalist.value = datalistOptionInnerText
                // vi faccio avvenire l'evento di input per eseguire gli eventi on input del campo (es. countCharacters)
                inputDatalist.dispatchEvent(new Event('input', { bubbles: true }));

                datalistOption.classList.add('datalist-option-active')
                // questa classe indica solo che l'utente ha selezionato un option
                datalistTag.classList.add('datalist-option-selected')

                datalistTag.querySelectorAll('option').forEach(option => {
                    if (!option.classList.contains('datalist-option-active')) {
                        option.classList.add('datalist-option-hide')
                    }
                });

                // close datalist
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.remove('datalist-label-container-active')
                    fade.fadeOut(datalistLabelContainer, 20)
                }
                checkInputLive(formTag, inputDatalist, documentShadowRoot)
            }
        })
    });

    if (inputDatalist.dataset.freeDatalistWithoutJson === undefined && inputDatalist.dataset.pattern === undefined) {
        inputDatalist.pattern = "^(" + datalistPattern.join('|') + ")$"
    }

    inputDatalist.addEventListener('input', (e) => {
        // rimuove l'option selezionata se l'utente scrive nel campo
        datalistTag.classList.remove('datalist-option-selected')
        if (e.isTrusted === true) {
            if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                datalistLabelContainer.classList.add('datalist-label-container-active')
                fade.fadeIn(datalistLabelContainer, 20)
            }
        } else if (e.isTrusted === false) {
            if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                datalistLabelContainer.classList.add('datalist-label-container-active')
                datalistLabelContainer.style.display = 'block'
                datalistLabelContainer.style.opacity = 1
            }
        }

        execDatalistOptionLivesearch(formTag, datalistTag, allDatalistOption, inputDatalist, datalistLabelContainer)
    })
    inputDatalist.addEventListener('focus', () => {
        if (datalistTag.querySelector('.datalist-option-active') === null) {
            let allDatalistOption = datalistTag.querySelectorAll('option')
            let allDatalistOptionHide = datalistTag.querySelectorAll('option.datalist-option-hide')
            if (allDatalistOption.length !== allDatalistOptionHide.length) {
                if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.add('datalist-label-container-active')
                    fade.fadeIn(datalistLabelContainer, 20)
                }
            }
            if (inputDatalist.dataset.freeDatalistWithoutJson !== undefined) {
                let datalistInvalidFeedback = formTag.querySelector(`#invalid-feedback-${inputDatalist.id}`)
                if (inputDatalist.checkValidity() === true && allDatalistOption.length === allDatalistOptionHide.length) {
                    datalistInvalidFeedback.classList.add('show-input-feedback')
                }
            }
        }
    })
    inputDatalist.addEventListener('blur', (e) => {
        if (clickInProgress_onLabelOpen_onPasswordVisibility === false) {
            if (e.isTrusted === true) {
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.remove('datalist-label-container-active')
                    fade.fadeOut(datalistLabelContainer, 20)
                }
            } else if (e.isTrusted === false) {
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    datalistLabelContainer.classList.remove('datalist-label-container-active')
                    datalistLabelContainer.style.display = 'none'
                    datalistLabelContainer.style.opacity = 0
                }
            }
        }
    })
}

// ADD JSON OPTION - SELECT
function addDatalistOptionRequiredFromJSON(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot) {
    if (datalistTag.dataset.jsonDatalist !== undefined) {
        let xmlhttp = new XMLHttpRequest()

        xmlhttp.onreadystatechange = function () {

            // se risposta php completata con successo
            if (this.readyState === 4 && this.status === 200) {
                datalistTag.innerHTML = this.responseText
                addPatternEventInputDatalistOptionRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot)
            }
        }

        // invia richiesta a php
        xmlhttp.open("GET", datalistTag.dataset.jsonDatalistPath, true)
        xmlhttp.send()
    }
}

// SET SELECT (DATALIST WITH ONE OPTION REQUIRED) with json or without json AND FREE DATALIST OPTION without json
function setDatalistOptionFreeAndRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot) {
    if (datalistTag.dataset.jsonDatalist !== undefined) {
        // required with json
        addDatalistOptionRequiredFromJSON(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot)
    } else {
        // free and required without json
        addPatternEventInputDatalistOptionRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot)
    }
}

// SET DATALIST FREE AND DATALIST WITH ONE OPTION REQUIRED
function setDatalistAndDatalistOption(formTag, documentShadowRoot) {
    const allInputDatalist = formTag.querySelectorAll('[data-input=datalist]')

    allInputDatalist.forEach(inputDatalist => {
        let inputAndDatalistContainer = formTag.querySelector(`[data-input-datalist-container-for=${inputDatalist.id}]`)
        let datalistLabelContainer = formTag.querySelector(`#datalist-label-container-${inputDatalist.dataset.list}`)
        let datalistTag = formTag.querySelector(`#${inputDatalist.dataset.list}`)

        if (inputDatalist.value !== '') {
            execDatalistOptionLivesearch(formTag, datalistTag, datalistTag.querySelectorAll('option'), inputDatalist, datalistLabelContainer, 'server-value')
        }

        // scroll list with arrows
        inputAndDatalistContainer.addEventListener('keydown', (e) => {
            if (e.keyCode === 38 || e.keyCode === 40) {
                if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                    clickInProgress_onLabelOpen_onPasswordVisibility = true
                    scrollListWithArrows.changeFocusResultItem(e, datalistTag, inputDatalist, null, documentShadowRoot, 'datalist')
                }
            } else if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
                if (documentShadowRoot.activeElement !== inputDatalist) {
                    inputDatalist.focus()
                    clickInProgress_onLabelOpen_onPasswordVisibility = false
                }
            }
        })


        if (inputDatalist.dataset.datalistOptionRequired !== undefined) {            
            setDatalistOptionFreeAndRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot)
        } else if (inputDatalist.dataset.datalistOptionRequired === undefined) {

            // solo per datalist free options senza json
            if (inputDatalist.dataset.freeDatalistWithoutJson !== undefined) {
                setDatalistOptionFreeAndRequired(formTag, inputDatalist, datalistTag, datalistLabelContainer, documentShadowRoot)
            }
        
            inputDatalist.addEventListener('input', () => {
                // rimuove l'option selezionata se l'utente scrive nel campo
                datalistTag.classList.remove('datalist-option-selected')
                // blocca cap
                if (inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson !== undefined && datalistTag.innerHTML !== '') {
                    if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                        datalistLabelContainer.classList.add('datalist-label-container-active')
                        fade.fadeIn(datalistLabelContainer, 20)
                    }
                }

                if (inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson === undefined) {
                    let allDatalistOption = datalistTag.querySelectorAll('option')
                    let allDatalistOptionHide = datalistTag.querySelectorAll('option.datalist-option-hide')
                    if (allDatalistOption.length !== allDatalistOptionHide.length) {
                        if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                            datalistLabelContainer.classList.add('datalist-label-container-active')
                            fade.fadeIn(datalistLabelContainer, 20)
                        }
                    }
                }

                // così non esegue la funzione se autocomplete con json es. per i più cap e per le datalist free options senza json
                if (inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson === undefined && inputDatalist.dataset.freeDatalistWithoutJson === undefined) {
                    setDatalistOptionLivesearch(formTag, datalistLabelContainer, inputDatalist, datalistTag, documentShadowRoot)
                }
            })
            inputDatalist.addEventListener('focus', () => {
                if (datalistTag.querySelector('.datalist-option-active') === null) {
                    // blocca cap
                    if (inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson !== undefined && datalistTag.innerHTML !== '' || inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson === undefined) {
                        let allDatalistOption = datalistTag.querySelectorAll('option')
                        let allDatalistOptionHide = datalistTag.querySelectorAll('option.datalist-option-hide')
                        if (allDatalistOption.length !== allDatalistOptionHide.length) {
                            if (!datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                                datalistLabelContainer.classList.add('datalist-label-container-active')
                                fade.fadeIn(datalistLabelContainer, 20)
                            }
                        }
                    }
                    // così non esegue la funzione se autocomplete con json es. per i più cap e per le datalist free options senza json
                    if (inputDatalist.dataset.autocompleteWithDatalistFreeOptionJson === undefined && inputDatalist.dataset.freeDatalistWithoutJson === undefined) {
                        setDatalistOptionLivesearch(formTag, datalistLabelContainer, inputDatalist, datalistTag, documentShadowRoot)
                    }
                }
            })
            inputDatalist.addEventListener('blur', () => {
                if (clickInProgress_onLabelOpen_onPasswordVisibility === false) {
                    if (datalistLabelContainer.classList.contains('datalist-label-container-active')) {
                        datalistLabelContainer.classList.remove('datalist-label-container-active')
                        fade.fadeOut(datalistLabelContainer, 20)
                    }
                }
            })
        }

        // blocca il blur dell'input onclick sulla label se aperto e se è lui l'input attivo - mouse
        datalistLabelContainer.addEventListener('mousedown', () => {
            if (documentShadowRoot.activeElement === inputDatalist) {
                clickInProgress_onLabelOpen_onPasswordVisibility = true
            }
        })
        // blocca il blur dell'input onclick sulla label se aperto e se è lui l'input attivo - touch
        datalistLabelContainer.addEventListener('touchstart', () => {
            if (documentShadowRoot.activeElement === inputDatalist) {
                clickInProgress_onLabelOpen_onPasswordVisibility = true
            }
        }, {passive: true})

        // se autocompletamento provincia e regione da comune 
        setFormAutocompleteAddressOnInput(formTag, inputDatalist, documentShadowRoot)
    });
}



// AUTOCOMPLETE

// only for address dal comune inserisce sigla provincia e regione - oninput sul campo del comune se autocomplete
function setFormAutocompleteAddressOnInput(formTag, inputDatalist, documentShadowRoot) {
    if (inputDatalist.dataset.autocompleteAddressFields !== undefined) {

        let autocompleteId = inputDatalist.dataset.autocompleteAddressFields
        let allInputToAutocomplete = formTag.querySelectorAll(`[data-address-autocomplete=${autocompleteId}]`)

        inputDatalist.addEventListener('input', () => {
            if (inputDatalist.checkValidity() === true) {
                let datalistInputValue = inputDatalist.value
                formAutocompleteAddressInsertValue(formTag, datalistInputValue, allInputToAutocomplete, documentShadowRoot, inputDatalist)
            }
        })
    }
}

// only for address dal comune inserisce sigla provincia e regione - onclick su option
function setformAutocompleteAddressOnClickOptions(formTag, inputDatalist, datalistTag, documentShadowRoot) {
    if (inputDatalist.dataset.autocompleteAddressFields !== undefined) {

        let autocompleteId = inputDatalist.dataset.autocompleteAddressFields
        let allInputToAutocomplete = formTag.querySelectorAll(`[data-address-autocomplete=${autocompleteId}]`)

        let allDatalistOption = datalistTag.querySelectorAll('option')

        allDatalistOption.forEach(datalistOption => {
            datalistOption.addEventListener('click', () => {
                let datalistSelectedOptionValue = datalistOption.value
                formAutocompleteAddressInsertValue(formTag, datalistSelectedOptionValue, allInputToAutocomplete, documentShadowRoot, inputDatalist)
            })
            datalistOption.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {

                    e.preventDefault()
                    
                    inputDatalist.focus()
                    clickInProgress_onLabelOpen_onPasswordVisibility = false

                    let datalistSelectedOptionValue = datalistOption.value
                    formAutocompleteAddressInsertValue(formTag, datalistSelectedOptionValue, allInputToAutocomplete, documentShadowRoot, inputDatalist)
                }
            })
        });
    }
}

// set pattern per le option required - onload
function formAutocompleteAddressInsertValue(formTag, datalistSelectedOptionOrInputValue, allInputToAutocomplete, documentShadowRoot, inputDatalist) {

    // mette in lowercase il comune selezionato o scritto dall'utente
    let datalistSelectedOptionOrInputValueLowerCase = datalistSelectedOptionOrInputValue.toLowerCase().replaceAll('#','!').replaceAll('&','!').replaceAll('+','!').replaceAll(' ', '+')

    // nuova richiesta a php
    let xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {

        // se risposta php completata con successo
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText !== "") {
                let capProvinciaRegioneValue = this.responseText.split(',')
                let moreCapValue = capProvinciaRegioneValue[0].split('|')

                allInputToAutocomplete.forEach(inputToAutocomplete => {

                    let autocompleteDatalistLabelContainer = formTag.querySelector(`#datalist-label-container-${inputToAutocomplete.dataset.list}`)

                    if (inputToAutocomplete.dataset.autocompleteField === "cap") {
                        let capDatalistTag = formTag.querySelector(`#${inputToAutocomplete.dataset.list}`)
                        capDatalistTag.innerHTML = ""
                        if (moreCapValue.length === 1) {
                            inputToAutocomplete.value = capProvinciaRegioneValue[0]
                            inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));
                            inputToAutocomplete.dispatchEvent(new Event('blur', { bubbles: true }));
                        } else if (moreCapValue.length > 1) {
                            let optionCapValues = []
                            moreCapValue.forEach(capValue => {
                                optionCapValues.push(`<option>${capValue}</option>`)
                            });
                            capDatalistTag.innerHTML = optionCapValues.join("")

                            // seleziona tutte le option inserite
                            let allCapDatalistOption = capDatalistTag.querySelectorAll('option')

                            // option onclick
                            allCapDatalistOption.forEach(capDatalistOption => {
                                let capDatalistOptionInnerText = capDatalistOption.innerText

                                capDatalistOption.addEventListener('click', () => {
                                    inputToAutocomplete.value = capDatalistOptionInnerText
                                    // vi faccio avvenire l'evento di input per eseguire gli eventi on input del campo (es. countCharacters)
                                    inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));

                                    capDatalistOption.classList.add('datalist-option-active')
                                    // questa classe indica solo che l'utente ha selezionato un option
                                    capDatalistTag.classList.add('datalist-option-selected')

                                    capDatalistTag.querySelectorAll('option').forEach(option => {
                                        if (!option.classList.contains('datalist-option-active')) {
                                            option.classList.add('datalist-option-hide')
                                        }
                                    });

                                    // close datalist
                                    if (autocompleteDatalistLabelContainer.classList.contains('datalist-label-container-active')) {
                                        autocompleteDatalistLabelContainer.classList.remove('datalist-label-container-active')
                                        fade.fadeOut(autocompleteDatalistLabelContainer, 20)
                                    }
                                    checkInputLive(formTag, inputToAutocomplete, documentShadowRoot)
                                })
                                capDatalistOption.addEventListener('keydown', (e) => {
                                    if (e.keyCode === 13) {

                                        e.preventDefault()
                                        
                                        inputToAutocomplete.focus()
                                        clickInProgress_onLabelOpen_onPasswordVisibility = false

                                        inputToAutocomplete.value = capDatalistOptionInnerText
                                        // vi faccio avvenire l'evento di input per eseguire gli eventi on input del campo (es. countCharacters)
                                        inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));

                                        capDatalistOption.classList.add('datalist-option-active')
                                        // questa classe indica solo che l'utente ha selezionato un option
                                        capDatalistTag.classList.add('datalist-option-selected')

                                        capDatalistTag.querySelectorAll('option').forEach(option => {
                                            if (!option.classList.contains('datalist-option-active')) {
                                                option.classList.add('datalist-option-hide')
                                            }
                                        });

                                        // close datalist
                                        if (autocompleteDatalistLabelContainer.classList.contains('datalist-label-container-active')) {
                                            autocompleteDatalistLabelContainer.classList.remove('datalist-label-container-active')
                                            fade.fadeOut(autocompleteDatalistLabelContainer, 20)
                                        }
                                        checkInputLive(formTag, inputToAutocomplete, documentShadowRoot)
                                    }
                                })
                            });

                            inputToAutocomplete.addEventListener('input', () => {
                                execDatalistOptionLivesearch(formTag, capDatalistTag, allCapDatalistOption, inputToAutocomplete, autocompleteDatalistLabelContainer)
                            })
                            
                            // input cap focus (datalist from autocomplete open)
                            inputToAutocomplete.focus()
                        }
                    }
                    if (inputToAutocomplete.dataset.autocompleteField === "provincia") {
                        inputToAutocomplete.value = capProvinciaRegioneValue[1]
                        inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));

                        let allDatalistOption = autocompleteDatalistLabelContainer.querySelectorAll('option')
                        allDatalistOption.forEach(datalistOption => {
                            if (datalistOption.innerText.toLowerCase().startsWith(capProvinciaRegioneValue[1].toLocaleLowerCase(), 0)) {
                                datalistOption.classList.add('datalist-option-active')
                            }
                        });

                        inputToAutocomplete.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                    if (inputToAutocomplete.dataset.autocompleteField === "regione") {
                        inputToAutocomplete.value = capProvinciaRegioneValue[2]
                        inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));

                        let allDatalistOption = autocompleteDatalistLabelContainer.querySelectorAll('option')
                        allDatalistOption.forEach(datalistOption => {
                            if (datalistOption.innerText.toLowerCase().startsWith(capProvinciaRegioneValue[2].toLocaleLowerCase(), 0)) {
                                datalistOption.classList.add('datalist-option-active')
                            }
                        });

                        inputToAutocomplete.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                    if (inputToAutocomplete.dataset.autocompleteField === "stato") {
                        
                        let allDatalistOption = autocompleteDatalistLabelContainer.querySelectorAll('option')

                        inputToAutocomplete.value = allDatalistOption[0].value // un solo valore 'Italia'
                        inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));

                        allDatalistOption.forEach(datalistOption => {
                            if (datalistOption.innerText.toLowerCase().startsWith(allDatalistOption[0].value.toLocaleLowerCase(), 0)) {
                                datalistOption.classList.add('datalist-option-active')
                            }
                        });

                        inputToAutocomplete.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                });
            } else {
                allInputToAutocomplete.forEach(inputToAutocomplete => {
                    if (inputToAutocomplete.dataset.autocompleteField === "cap") {
                        let capDatalistTag = formTag.querySelector(`#${inputToAutocomplete.dataset.list}`)
                        capDatalistTag.innerHTML = ""
                    }
                    if (inputToAutocomplete.value !== "") {
                        inputToAutocomplete.value = ""
                        inputToAutocomplete.dispatchEvent(new Event('input', { bubbles: true }));
                        inputToAutocomplete.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                })
            }
        }

    }

    // invia richiesta a php
    xmlhttp.open("GET", inputDatalist.dataset.jsonDatalistAutocompleteAddressPath + "?inputDatalistValue=" + datalistSelectedOptionOrInputValueLowerCase, true)
    xmlhttp.send()
}


// TEXTAREA
function setTextarea(formTag) {
    const allTextareaTag = formTag.querySelectorAll('.textarea')

    allTextareaTag.forEach(textareaTag => {
        window.addEventListener('load', () => {
            textareaTag.setAttribute('rows', '1')
            let textareaDefaultRowsNumberHeight = textareaTag.dataset.textareaDefaultRowsNumberHeight.split(";")
            textareaTag.style.minHeight = parseFloat(textareaDefaultRowsNumberHeight[0]) * parseFloat(textareaDefaultRowsNumberHeight[1]) + "px"
            textareaTag.style.height = 0
            textareaTag.style.height = textareaTag.scrollHeight + "px"
        })

        textareaTag.addEventListener('input', () => {
            textareaTag.style.height = 0
            textareaTag.style.height = textareaTag.scrollHeight + "px"
            if (new RegExp(/[\>\<\'\*\^\|\/\\\{\}\[\]\`\~\"]/, 'gm').exec(textareaTag.value)) {
                textareaTag.value = textareaTag.value.replaceAll(/[\>\<\'\*\^\|\/\\\{\}\[\]\`\~\"]/gm, '')
            }
        })

        window.addEventListener('resize', () => {
            textareaTag.style.height = 0
            textareaTag.style.height = textareaTag.scrollHeight + "px"
        })
    });
}


/**
 * @param {HTMLFormElement} formTag
 * @param {*} documentShadowRoot
 * @returns aggiunge l'evento on invalid, la label vibra alla prima volta che l'input diventa invalido (vale per tutti gli input anche per radio, checkbox e switch)
 */
function addInputInvalidEvent(formTag, documentShadowRoot) {

    // input
    const formInputContainerNodeList = formTag.querySelectorAll('.form-input-container')
    formInputContainerNodeList.forEach(formInputContainer => {

        let input = formInputContainer.querySelector('.input')
        let inputLabel = formInputContainer.querySelector('.input-label')

        input.addEventListener('invalid', () => {
            if (documentShadowRoot.activeElement === input) {
                if (inputLabel.classList.contains('input-label-focus') && formInputContainer.classList.contains('form-input-container-invalid')) {
                    inputLabel.classList.add('input-invalid-animation')
                }
            } else if (documentShadowRoot.activeElement !== input && input.value === '') {
                setTimeout(() => {
                    if (!inputLabel.classList.contains('input-label-focus')) {
                        inputLabel.classList.add('input-invalid-animation')
                    }
                }, 300)
            }
        })

        if (input.dataset.inputTextType !== "range") {
            // tranne per input-range
            input.addEventListener('input', () => {
                if (input.checkValidity() === true) {
                    if (inputLabel.classList.contains('input-invalid-animation')) {
                        inputLabel.classList.remove('input-invalid-animation')
                    }
                }
            })
        } else if (input.dataset.inputTextType === "range") {
            // solo per input-range
            let inputRangeContainer = formInputContainer.querySelector('.input-range-track')
            inputRangeContainer.addEventListener('click', () => {
                setTimeout(() => {
                    if (input.checkValidity() === true) {
                        if (inputLabel.classList.contains('input-invalid-animation')) {
                            inputLabel.classList.remove('input-invalid-animation')
                        }
                    }
                }, 300)
            })
            input.addEventListener('keydown', (e) => {
                if (e.keyCode === 39 || e.keyCode === 37) {
                    setTimeout(() => {
                        if (input.checkValidity() === true) {
                            if (inputLabel.classList.contains('input-invalid-animation')) {
                                inputLabel.classList.remove('input-invalid-animation')
                            }
                        }
                    }, 300)
                }
            })
        }
    })

    // radio e checkbox
    const formRadioCheckboxContainerNodeList = formTag.querySelectorAll('.form-input-container-radio-checkbox')
    formRadioCheckboxContainerNodeList.forEach(formRadioCheckboxContainer => {

        let inputLegend = formRadioCheckboxContainer.querySelector('.input-legend')
        let allInput = formRadioCheckboxContainer.querySelectorAll('.input-radio-checkbox')

        allInput.forEach(input => {
            input.addEventListener('input', () => {
                if (formRadioCheckboxContainer.classList.contains('form-input-container-radio-checkbox-invalid')) {
                    inputLegend.classList.add('input-invalid-animation')
                } else {
                    inputLegend.classList.remove('input-invalid-animation')
                }
            })

            input.addEventListener('blur', () => {
                setTimeout(() => {
                    if (formRadioCheckboxContainer.classList.contains('form-input-container-radio-checkbox-invalid')) {
                        inputLegend.classList.add('input-invalid-animation')
                    } else {
                        inputLegend.classList.remove('input-invalid-animation')
                    }
                }, 300)
            }) 
        });
    });

    // switch
    const formSwitchContainerNodeList = formTag.querySelectorAll('.form-input-switch-container')
    formSwitchContainerNodeList.forEach(formSwitchContainer => {

        const inputSwitch = formSwitchContainer.querySelector('.input-switch')
        const inputSwitchLegend = formSwitchContainer.querySelector('.switch-legend')

        inputSwitch.addEventListener('input', () => {
            if (inputSwitch.getAttribute('required') !== null) {
                if (inputSwitch.checked === true) {
                    inputSwitchLegend.classList.remove('input-invalid-animation')
                } else {
                    setTimeout(() => {
                        inputSwitchLegend.classList.add('input-invalid-animation')
                    }, 300)
                }
            }
        })
    });
}




// add all -- da lanciare onload nel documento dove c'è o ci sono le form (dopo la dipendenza di questo file in un tag di script)
export function checkForm(formTag) {

    let documentShadowRoot = document
    if (document.querySelector(`my-form[form-id=${formTag.id}]`) !== null) {
        documentShadowRoot = document.querySelector(`my-form[form-id=${formTag.id}]`).shadowRoot
    }

    // seleziona tutti i tag di input
    const inputTagNodeList = formTag.querySelectorAll('.input')

    // non permette all'utente di scrive nell'input type text e mette inputmode=none per la tastiera a schermo touch
    setInputNoWrite(formTag);

    // imposta i pattern di ogni input
    setInputPattern(formTag, inputTagNodeList, documentShadowRoot);

    // imposta gli eventi oninput, onblur e onfocus per la validazione del tag input live
    addValidationInputEvent(formTag, inputTagNodeList, documentShadowRoot);

    // imposta l'evento submit della form per la sua validazione
    addValidationFormEvent(formTag, inputTagNodeList, documentShadowRoot);

    // crea gli eventi focus e blur sui tag di input
    addInputFocusEvent(formTag, documentShadowRoot);

    // crea l'evento on invalid
    addInputInvalidEvent(formTag, documentShadowRoot);

    // imposta le input utility
    setInputUtility(formTag, documentShadowRoot);

    setInputTypeRange(formTag, documentShadowRoot);

    checkRadioCheckbox(formTag, documentShadowRoot);

    setDatalistAndDatalistOption(formTag, documentShadowRoot)

    setTextarea(formTag)

    setSwitch(formTag)
}

