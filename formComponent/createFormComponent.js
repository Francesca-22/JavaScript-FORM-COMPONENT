// IMPORTO VALIDAZIONE FORM
import * as checkForm from "./js/checkForm.js";

let location = './'

// import font
const importFonts = document.createElement("link");
importFonts.setAttribute("rel", "stylesheet")
importFonts.setAttribute('href', location + "formComponent/css/formComponent-importFonts.css")
document.head.appendChild(importFonts)

// Definisco il custom tag MY-FORM
customElements.define('my-form', class extends HTMLElement {
  connectedCallback() {
    // CREO SHADOW ROOT PER MY-FORM TAG
    const shadow = this.attachShadow({ mode: "open" });
  
    // CREO la struttura di MY-FORM TAG
    const form = document.createElement("form");
    form.setAttribute("method", "POST")
    form.setAttribute("enctype", "multipart/form-data")
    form.setAttribute("action", "")
    form.setAttribute("novalidate", "")
    form.setAttribute("spellcheck", "false")
    form.setAttribute("id", this.getAttribute("form-id"))
    form.setAttribute("action", this.getAttribute("form-action") ?? '')
    form.setAttribute("class", "form " + this.getAttribute("form-class"))

    // CREO IL FOGLIO DI STYLE PER TUTTI I GLI ELEMENTI CHE SARANNO CONTENUTI NELLA SHADOW ROOT DI MY-FORM TAG, MA PRIMA IL FILE CSS CON TUTTE LE VARIABILI (ANCHE DEI COMPONENTI)
    const cssVariables = document.createElement("link");
    cssVariables.setAttribute("rel", "stylesheet")
    cssVariables.setAttribute('href', location + "formComponent/css/formComponent-variables.php")

    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet")
    style.setAttribute('href', location + "formComponent/css/formComponent.css")

    // color picker css
    const styleCOLORPICKER = document.createElement("link");
    styleCOLORPICKER.setAttribute("rel", "stylesheet")
    styleCOLORPICKER.setAttribute('href', location + "formComponent/components/colorPicker/colorPickerHOST.css")

    // date time picker css
    const styleDTSEL = document.createElement("link");
    styleDTSEL.setAttribute("rel", "stylesheet")
    styleDTSEL.setAttribute('href', location + "formComponent/components/dateTimeSelect/dtselHOST.css")

    // AGGIUNGO IL FILE CSS PER PERSONALIZZARE LO STILE DEGLI ELEMENTI
    const customizeCss = document.createElement("link");
    customizeCss.setAttribute("rel", "stylesheet")
    customizeCss.setAttribute('href', location + "formComponent/css/formComponent-customize.php")

    // METTO STYLE E GLI ELEMENTI CREATI DENTRO SHADOW ROOT DI MY-FORM
    shadow.appendChild(cssVariables);
    shadow.appendChild(style);
    shadow.appendChild(styleCOLORPICKER);
    shadow.appendChild(styleDTSEL);
    shadow.appendChild(customizeCss);

    shadow.appendChild(form);


    // Definisco le varie tipologie di input (sono tutti dei custom-tag) che possono essere contenute dentro al tag form dentro la shadow root di my-form custom tag (passo this ovvero il custom tag my-fom per poterli inserire nella sua shadow root; passo il tag form):
    // INPUT-HIDDEN
    defineInputHidden(this, form)
    // INPUT-TEXT
    defineInputText(this, form)
    // INPUT-PHONE
    defineInputPhone(this, form)
    // INPUT-DATALIST
    defineInputDatalist(this, form)
    // INPUT-PASSWORD
    defineInputPassword(this, form)
    // INPUT-RANGE
    defineInputRange(this, form)
    // INPUT-COLOR
    defineInputColor(this, form)
    // INPUT-DT (DATE E/O TIME)
    defineInputDateTime(this, form)
    // INPUT-FILE
    defineInputFile(this, form)
    // INPUT-RADIO-CHECKBOX
    defineInputRadioCheckbox(this, form)
    // INPUT-SWITCH
    defineInputSwitch(this, form)
    // INPUT-TEXTAREA
    defineTextarea(this, form)
    // INPUT-ANTISPAM
    defineInputAntispam(this, form)


    if (this.getAttribute("submit-button-text") !== null) {
      // creo submit button container
      const formSubmitButtonContainer = document.createElement('div')
      formSubmitButtonContainer.setAttribute('class', 'form-button-container')
      formSubmitButtonContainer.style.order = form.children.length

      // creo submit button
      const formSubmitButton = document.createElement('button')
      formSubmitButton.setAttribute('tabindex', form.children.length + 1)
      formSubmitButton.setAttribute('class', 'form-button form-submit-button')
      formSubmitButton.setAttribute('type', 'submit')
      formSubmitButton.innerText = this.getAttribute("submit-button-text")

      // METTO SUBMIT BUTTON dentro il form
      form.appendChild(formSubmitButtonContainer)
      formSubmitButtonContainer.appendChild(formSubmitButton)

      // LOADING
      const loading = document.createElement('div')
      loading.setAttribute('class', 'form-loading')
      loading.setAttribute('data-role', 'form-loading')

      formSubmitButton.appendChild(loading);
    }

    // INIZIALIZZO LA VALIDAZIONE DELLA FORM SETTANDO GLI EVENTI LANCIANDO IL FILE IMPORTATO
    this.shadowRoot.load = checkForm.checkForm(this.shadowRoot.querySelector('#' + this.getAttribute("form-id")));
  }
});


/**
 * DEFINE INPUT-HIDDEN CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputHidden(myFormCustomTag, formTag) {
  customElements.define(`input-hidden.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-HIDDEN
      const inputHidden = document.createElement('input')
      inputHidden.setAttribute('type', 'hidden')
      inputHidden.setAttribute('name', this.getAttribute('input-name'))
      inputHidden.setAttribute('value', this.getAttribute('input-value'))
      inputHidden.setAttribute('tabindex', '-1')
      inputHidden.style.order = '-1'

      formTag.appendChild(inputHidden)

    }
  });
}

/**
 * DEFINE INPUT-TEXT CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputText(myFormCustomTag, formTag) {
    customElements.define(`input-text.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
      connectedCallback() {

        // CREO INPUT-TEXT
        setInput(formTag, this, 'input-text')

      }
    });
}

/**
 * DEFINE INPUT-PHONE CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputPhone(myFormCustomTag, formTag) {
  customElements.define(`input-phone.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-PHONE
      setInput(formTag, this, 'input-phone')

    }
  });
}

/**
 * DEFINE INPUT-DATALIST CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputDatalist(myFormCustomTag, formTag) {
  customElements.define(`input-datalist.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-DATALIST
      setInput(formTag, this, 'input-datalist')

    }
  });
}

/**
 * DEFINE INPUT-PASSWORD CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputPassword(myFormCustomTag, formTag) {
  customElements.define(`input-password.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-PASSWORD
      setInput(formTag, this, 'input-password')

    }
  });
}

/**
 * DEFINE INPUT-RANGE CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputRange(myFormCustomTag, formTag) {
  customElements.define(`input-range.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-RANGE
      setInput(formTag, this, 'input-range')

    }
  });
}

/**
 * DEFINE INPUT-COLOR CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputColor(myFormCustomTag, formTag) {
  customElements.define(`input-color.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-COLOR
      setInput(formTag, this, 'input-color')

    }
  });
}

/**
 * DEFINE INPUT-DT (date and/or time) CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputDateTime(myFormCustomTag, formTag) {
  customElements.define(`input-dt.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-DT
      setInput(formTag, this, 'input-dt')

    }
  });
}

/**
 * DEFINE INPUT-FILE CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputFile(myFormCustomTag, formTag) {
  customElements.define(`input-file.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-FILE
      setInput(formTag, this, 'input-file')

    }
  });
}

/**
 * DEFINE INPUT-RADIO-CHECKBOX CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputRadioCheckbox(myFormCustomTag, formTag) {
  customElements.define(`input-radio-checkbox.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-RADIO-CHECKBOX
      setInput(formTag, this, 'input-radio-checkbox')

    }
  });
}

/**
 * DEFINE INPUT-SWITCH CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputSwitch(myFormCustomTag, formTag) {
  customElements.define(`input-switch.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-SWITCH
      setInput(formTag, this, 'input-switch')

    }
  });
}

/**
 * DEFINE INPUT-TEXTAREA CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineTextarea(myFormCustomTag, formTag) {
  customElements.define(`input-textarea.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-TEXTAREA
      setInput(formTag, this, 'textarea')

    }
  });
}

/**
 * DEFINE INPUT-ANTISPAM CUSTOM TAG
 * @param {HTMLCustomElement} myFormCustomTag this
 * @param {HTMLFormElement} formTag form
 */
function defineInputAntispam(myFormCustomTag, formTag) {
  customElements.define(`input-antispam.${myFormCustomTag.getAttribute("form-id")}`, class extends HTMLElement {
    connectedCallback() {

      // CREO INPUT-ANTISPAM
      setInput(formTag, this, 'input-antispam')

    }
  });
}



/**
 * SET INPUT
 * @param {HTMLCustomElement} inputTextCustomTag this
 * @param {HTMLFormElement} formTag form
 * @param {string} customInputTagType input-text or input-phone
 * Imposta i parametri generici ai vari input e li collega alle funzioni specifiche per costruirli
 */
function setInput(formTag, inputTextCustomTag, customInputTagType) {
  if (customInputTagType !== 'input-radio-checkbox' && customInputTagType !== 'input-switch') {
    // creo il contenitore
    const formInputContainer = document.createElement('div')
    formInputContainer.setAttribute('id', `form-input-container-${inputTextCustomTag.getAttribute('input-name')}`)
    formInputContainer.setAttribute('class', `input-row-${inputTextCustomTag.getAttribute('input-width')} form-input-container`)
    formInputContainer.style.order = inputTextCustomTag.getAttribute('field-order-number')

    // creo la label principale
    const label = document.createElement('label')
    label.setAttribute('for', `${inputTextCustomTag.getAttribute('input-name')}`)
    label.setAttribute('class', 'input-label')
    label.innerText = `${inputTextCustomTag.getAttribute('label-text')}`

    // creo il contenirore del input tag e delle sue possibili utility
    const inputUtilityContainer = document.createElement('div')
    if (inputTextCustomTag.getAttribute('input-range-type') === null) {
      // tranne per input-range
      inputUtilityContainer.setAttribute('class', 'input-utility-container')
      inputUtilityContainer.setAttribute('data-input-utility', '')
    } else {
      // solo per input-range
      inputUtilityContainer.setAttribute('class', 'input-range-container')
    }

    // INPUT O TEXTAREA
    // definisco se devo creare input o textarea
    let inputOrTextarea = ""
    if (customInputTagType === 'textarea') {
      inputOrTextarea = "textarea"
    } else {
      inputOrTextarea = "input"
    }

    // creo input tag o textarea tag
    const input = document.createElement(inputOrTextarea);
    input.setAttribute('tabindex', parseFloat(inputTextCustomTag.getAttribute('field-order-number')) + 1)
    input.setAttribute('class', 'input')
    input.setAttribute('id', `${inputTextCustomTag.getAttribute('input-name')}`)
    input.setAttribute('name', `${inputTextCustomTag.getAttribute('input-name')}`)

    if (inputTextCustomTag.getAttribute('disabled') === '') {
      input.setAttribute('disabled', '')
    }


    if (customInputTagType !== 'input-color' && customInputTagType !== 'input-file' && customInputTagType !== 'input-password' && customInputTagType !== 'textarea' && customInputTagType !== 'input-antispam') {
      input.value = inputTextCustomTag.getAttribute('input-value')
    }

    if (customInputTagType !== 'textarea') {
      // tranne per textarea
      if (inputTextCustomTag.getAttribute('input-password-type') === null) {
        // tranne per input-password
        if (customInputTagType !== 'input-file') {
          // tranne per input-file
          input.setAttribute('type', 'text')
        } else {
          // solo per input-file
          input.setAttribute('type', 'file')
        }
      } else {
      // solo per input-password
        input.setAttribute('type', 'password')
      }
    }

    if (inputTextCustomTag.getAttribute('input-text-type') !== null && inputTextCustomTag.getAttribute('input-text-type') !== '') {
      // se input-text-type contiene una stringa, altrimenti niente
      input.setAttribute('data-input-text-type', `${inputTextCustomTag.getAttribute('input-text-type')}`)
      if (inputTextCustomTag.getAttribute('input-text-type') === 'pattern') {
        input.setAttribute('data-pattern', inputTextCustomTag.getAttribute('input-text-type-pattern') )
      }
    }

    if (inputTextCustomTag.getAttribute('inputmode') !== null && inputTextCustomTag.getAttribute('inputmode') !== '') {
      // se inputmode contiene una stringa, altrimenti niente
      input.setAttribute('inputmode', `${inputTextCustomTag.getAttribute('inputmode')}`)
    }

    // imposto required a input se presente come attributo nel custom input tag e se non è stringa vuota imposto il suo contenuto come messaggio, altrimenti non ci sarà alcun messaggio se il campo fosse lasciato vuoto dall'utente
    if (inputTextCustomTag.getAttribute('required') !== null) {
      input.setAttribute('required', '')
      input.setAttribute('data-input-required-message', inputTextCustomTag.getAttribute('required'))
    }

    // input autocomplete
    if (inputTextCustomTag.getAttribute('password-autocomplete') !== null) {
      // solo per input-password
      input.setAttribute('autocomplete', inputTextCustomTag.getAttribute('password-autocomplete'))
    } else {
      // tranne per input-password
      input.setAttribute('autocomplete', 'off')
    }

    // imposto il messeggio dell'input (non per required, ma in base al pattern) se esiste come attributo al custom input tag
    if (inputTextCustomTag.getAttribute('input-message') !== null) {
      input.setAttribute('data-input-message', `${inputTextCustomTag.getAttribute('input-message')}`)
    }

    // creo lo stile dell'input
    const inputUnderline = document.createElement('div')
    inputUnderline.setAttribute('class', 'input-underline')

    // creo lo slot per i messaggio di validazione
    const invalidFeedback = document.createElement('div')
    invalidFeedback.setAttribute('id', `invalid-feedback-${inputTextCustomTag.getAttribute('input-name')}`)
    invalidFeedback.setAttribute('class', 'input-feedback-container input-feedback-text')

    // METTO IL CONTENUTO CREATO PER IL TAG INPUT IN QUESTIONE DENTRO FORM (CREATA DA MY-FORM TAG DENTRO LA SUA SHADOW ROOT)
    formTag.appendChild(formInputContainer)

    formInputContainer.appendChild(label)
    formInputContainer.appendChild(inputUtilityContainer)


    // SETTAGGIO UTILITY OPZIONALI DIVERSE PER OGNI TIPO DI INPUT E FINISCO DI COSTRUIRE I VARI TIPI DI INPUT, QUI SOTTO:
    // UTILITY PER INPUT-TEXT
    if (customInputTagType === 'input-text') {
      if (input.getAttribute('data-input-text-type') === 'username') {
        setUsernameServerError(formInputContainer, input, invalidFeedback, inputTextCustomTag)
      }
      setCountCharacters(inputTextCustomTag, input, inputUtilityContainer, customInputTagType)
      formInputContainer.appendChild(inputUnderline)
    }
    // UTILITY PER INPUT-PHONE
    if (customInputTagType === 'input-phone') {
      setCountCharacters(inputTextCustomTag, input, inputUtilityContainer, customInputTagType)
      setSelectPrefix(inputTextCustomTag, input, inputUtilityContainer, formInputContainer, inputUnderline, label)
    }
    // UTILITY PER INPUT-DATALIST
    // SET INPUT-DATALIST
    if (customInputTagType === 'input-datalist') {
      setCountCharacters(inputTextCustomTag, input, inputUtilityContainer, customInputTagType)
      setDatalist(inputTextCustomTag, input, inputUtilityContainer, inputUnderline, invalidFeedback)
    }
    // UTILITY PASSWORD-VISIBILITY
    // SET INPUT-PASSWORD
    if (customInputTagType === 'input-password') {
      setLoginCredentialsServerError(formInputContainer, invalidFeedback, inputTextCustomTag)
      setPassword(inputTextCustomTag, input, inputUtilityContainer, invalidFeedback)
      formInputContainer.appendChild(inputUnderline)
    }
    // SET INPUT-RANGE
    if (customInputTagType === 'input-range') {
      setRange(inputTextCustomTag, formInputContainer, input, inputUtilityContainer, label, inputUnderline, invalidFeedback)
      formInputContainer.appendChild(inputUnderline)
    }
    // SET INPUT-COLOR
    if (customInputTagType === 'input-color') {
      setColor(inputTextCustomTag, input, inputUtilityContainer, label)
      formInputContainer.appendChild(inputUnderline)
    }
    // SET INPUT-DT (date e/o time)
    if (customInputTagType === 'input-dt') {
      setInputDateTime(inputTextCustomTag, input, inputUtilityContainer, label)
      inputUnderline.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))
      formInputContainer.appendChild(inputUnderline)
      invalidFeedback.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))
    }
    // SET INPUT-FILE
    if (customInputTagType === 'input-file') {
      setInputFile(inputTextCustomTag, input, inputUtilityContainer, label, invalidFeedback)
      formInputContainer.appendChild(inputUnderline)
    }
    // SET INPUT-TEXTAREA
    if (customInputTagType === 'textarea') {
      setCountCharacters(inputTextCustomTag, input, inputUtilityContainer, customInputTagType) // inserisce anche textarea nel codice
      setTextarea(inputTextCustomTag, input, inputUtilityContainer)
      formInputContainer.appendChild(inputUnderline)
    }
    // SET INPUT-ANTISPAM
    if (customInputTagType === 'input-antispam') {
      setAntispam(inputTextCustomTag, input, inputUtilityContainer, label)
      formInputContainer.appendChild(inputUnderline)
    }

    formInputContainer.appendChild(invalidFeedback)

  } else if (customInputTagType === 'input-radio-checkbox') {
    // SOLO PER RADIO E CHECKBOX

    // creo il contenitore
    const formInputContainerRC = document.createElement('div')
    formInputContainerRC.setAttribute('class', `input-row-${inputTextCustomTag.getAttribute('input-width')} form-input-container-radio-checkbox`)
    formInputContainerRC.style.order = inputTextCustomTag.getAttribute('field-order-number')

    // creo legend
    const legendRC = document.createElement('legend')
    legendRC.setAttribute('class', 'input-legend')
    legendRC.innerText = `${inputTextCustomTag.getAttribute('label-text')}`

    // creo il box input
    const inputRadioCheckboxContainer = document.createElement('div')
    inputRadioCheckboxContainer.setAttribute('class', 'input-radio-checkbox-container')

    // setto gli input
    setInputRadioCheckbox(inputTextCustomTag, inputRadioCheckboxContainer, inputTextCustomTag.getAttribute('input-value'))

    // creo lo stile dell'input
    const inputUnderline = document.createElement('div')
    inputUnderline.setAttribute('class', 'input-underline-radio-checkbox')

    // creo lo slot per i messaggi di validazione
    const invalidFeedback = document.createElement('div')
    invalidFeedback.setAttribute('class', 'input-feedback-container-radio-checkbox input-feedback-text-radio-checkbox')

    // imposto required a input se presente come attributo nel custom input tag e se non è stringa vuota imposto il suo contenuto come messaggio, altrimenti non ci sarà alcun messaggio se il campo fosse lasciato vuoto dall'utente
    if (inputTextCustomTag.getAttribute('required') !== null) {
      // creo il messaggio di validazione
      const invalidFeedbackP = document.createElement('p')
      invalidFeedbackP.setAttribute('class', 'input-feedback-radio-checkbox')

      if (inputTextCustomTag.getAttribute('rc-type') === 'checkbox') {
        // checkbox aggiungo anche il messaggio del numero minimo di checkbox da ceccare
        formInputContainerRC.setAttribute('data-checkbox-required', inputTextCustomTag.getAttribute('number-of-checkbox-required'))
        if (inputTextCustomTag.getAttribute('number-of-checkbox-required-message') !==  '') {
          // se c'è
          invalidFeedbackP.innerText = inputTextCustomTag.getAttribute('required') + " " + inputTextCustomTag.getAttribute('number-of-checkbox-required-message')
        } else {
          // se non c'è metto solo il messaggio di required
          invalidFeedbackP.innerText = inputTextCustomTag.getAttribute('required')
        }
      } else if (inputTextCustomTag.getAttribute('rc-type') === 'radio') {
        // se radio
        invalidFeedbackP.innerText = inputTextCustomTag.getAttribute('required')
      }
      invalidFeedback.appendChild(invalidFeedbackP)
    } else if (inputTextCustomTag.getAttribute('required') === null) {
      if (inputTextCustomTag.getAttribute('rc-type') === 'checkbox') {
        formInputContainerRC.setAttribute('data-checkbox-required', '0')
      }
    }

    // METTO IL CONTENUTO CREATO PER IL TAG INPUT IN QUESTIONE DENTRO FORM (CREATA DA MY-FORM TAG DENTRO LA SUA SHADOW ROOT)
    formTag.appendChild(formInputContainerRC)
    formInputContainerRC.appendChild(legendRC)
    formInputContainerRC.appendChild(inputRadioCheckboxContainer)
    formInputContainerRC.appendChild(inputUnderline)
    formInputContainerRC.appendChild(invalidFeedback)

  } else if (customInputTagType === 'input-switch') {
    // SOLO PER INPUT-SWITCH

    // creo il contenitore
    const formInputContainerSwitch = document.createElement('div')
    formInputContainerSwitch.setAttribute('class', `input-row-${inputTextCustomTag.getAttribute('input-width')} form-input-switch-container`)
    formInputContainerSwitch.style.order = inputTextCustomTag.getAttribute('field-order-number')

    // creo legend
    const legendSwitch = document.createElement('legend')
    legendSwitch.setAttribute('class', 'switch-legend')
    legendSwitch.innerText = `${inputTextCustomTag.getAttribute('label-text')}`

    // switch
    const boxSwitch = document.createElement('div')
    boxSwitch.setAttribute('class', 'box-switch')

    setSwitch(inputTextCustomTag, boxSwitch)

    // creo lo slot per il messaggio di validazione
    const invalidFeedbackSwitch = document.createElement('div')
    invalidFeedbackSwitch.setAttribute('class', 'input-switch-feedback-container input-switch-feedback-text')

    const invalidFeedbackSwitchP = document.createElement('p')
    invalidFeedbackSwitchP.setAttribute('class', 'input-switch-feedback')

    // required feedback
    if (inputTextCustomTag.getAttribute('required') === null || inputTextCustomTag.getAttribute('required') === '') {
      if (inputTextCustomTag.getAttribute('switch-text-outside') !== null) {
        invalidFeedbackSwitch.classList.add('switch-feedback-none')
      }
    } else {
      invalidFeedbackSwitchP.innerText = inputTextCustomTag.getAttribute('required')
    }


    // METTO IL CONTENUTO CREATO PER IL TAG INPUT IN QUESTIONE DENTRO FORM (CREATA DA MY-FORM TAG DENTRO LA SUA SHADOW ROOT)
    formTag.appendChild(formInputContainerSwitch)
    formInputContainerSwitch.appendChild(legendSwitch)
    formInputContainerSwitch.appendChild(boxSwitch)
    formInputContainerSwitch.appendChild(invalidFeedbackSwitch)
    invalidFeedbackSwitch.appendChild(invalidFeedbackSwitchP)

    // switch text outside
    const switchTextOutside = document.createElement('div')
    switchTextOutside.setAttribute('class', 'switch-text')

    const switchTextOutsideP = document.createElement('p')

    if (inputTextCustomTag.getAttribute('switch-text-outside') !== null && inputTextCustomTag.getAttribute('switch-text-outside') !== '') {
      switchTextOutsideP.innerText = inputTextCustomTag.getAttribute('switch-text-outside')
      formInputContainerSwitch.appendChild(switchTextOutside)
      switchTextOutside.appendChild(switchTextOutsideP)
    }

  }
}

/**
 * TOOL: che crea la stringa per settare le doppie utility
 * data-input-utility="prima,seconda"
 * @param {getAttribute} settedValueOf data-input-utility
 * @param {string} newUtilityValue
 * @returns stringa dei due valori separati da , o un solo valore se non erano già presenti altri valori
 */
function addValueForDataInputUtility(dataInputUtilitySettedValue, newUtilityValue) {
  let dataInputUtilityValueToSet = ''
  if (dataInputUtilitySettedValue !== '') {
    dataInputUtilityValueToSet = dataInputUtilitySettedValue.split(",").concat(newUtilityValue).join(",")
  } else {
    dataInputUtilityValueToSet = newUtilityValue
  }
  return dataInputUtilityValueToSet
}

/**
 * SET USERNAME SERVER ERROR IF ALREADY EXISTS IN DATABASE
 * @param {HTMLDivElement} formInputContainer
 * @param {HTMLInputElement} input
 * @param {HTMLDivElement} invalidFeedback
 * @param {HTMLCustomElement} inputTextCustomTag
 */
function setUsernameServerError(formInputContainer, input, invalidFeedback, inputTextCustomTag) {
  if (inputTextCustomTag.getAttribute('username-already-exists-server-error-message') !== null && inputTextCustomTag.getAttribute('username-already-exists-server-error-message') !==  '') {

    let serverErrorMessage = inputTextCustomTag.getAttribute('username-already-exists-server-error-message').split(';')

    formInputContainer.classList.add('form-input-container-invalid')

    input.setAttribute('data-input-message-server', serverErrorMessage[0])
    input.setAttribute('data-input-username-server', serverErrorMessage[1])

    invalidFeedback.classList.add('show-input-feedback')
    invalidFeedback.innerHTML = `<p class="input-feedback">${serverErrorMessage[0]}</p>`
  }
}

/**
 * SET ON INPUT-PASSWORD LOGIN CREDENTIALS SERVER ERROR IF USERNAME-PASSWORD NOT CORRECT IN DATABASE
 * @param {HTMLDivElement} formInputContainer
 * @param {HTMLDivElement} invalidFeedback
 * @param {HTMLCustomElement} inputTextCustomTag
 */
function setLoginCredentialsServerError(formInputContainer, invalidFeedback, inputTextCustomTag) {
  if (inputTextCustomTag.getAttribute('login-credentials-server-error-message') !== null && inputTextCustomTag.getAttribute('login-credentials-server-error-message') !==  '') {

    let loginCredentialsServerMessage = inputTextCustomTag.getAttribute('login-credentials-server-error-message')

    formInputContainer.classList.add('form-input-container-invalid')

    invalidFeedback.classList.add('show-input-feedback')
    invalidFeedback.innerHTML = `<p class="input-feedback">${loginCredentialsServerMessage}</p>`
  }
}

/**
 * SET UTILITY: COUNT CHARACTERS
 * @param {HTMLCustomElement} inputTextCustomTag input-text or input-phone
 * @param {HTMLInputElement} inputTag input
 * @param {HTMLDivElement} inputUtilityContainerTag inputUtilityContainer
 */
function setCountCharacters(inputTextCustomTag, input, inputUtilityContainer, customInputTagType) {
  if (inputTextCustomTag.getAttribute('count-characters') !== undefined && inputTextCustomTag.getAttribute('count-characters') === 'true') {

    //input attrubut only min max minmax
    let countCharactersTypeValue = inputTextCustomTag.getAttribute('count-characters-type-value').split(',')

    if (countCharactersTypeValue[0] === 'only' || countCharactersTypeValue[0] === '') {
      input.setAttribute('data-only-count-characters', '')
    } else if (countCharactersTypeValue[0] === 'min') {
      input.setAttribute('data-min-characters', countCharactersTypeValue[1])
    } else if (countCharactersTypeValue[0] === 'max') {
      input.setAttribute('data-max-characters', countCharactersTypeValue[1])
    } else if (countCharactersTypeValue[0] === 'minmax') {
      input.setAttribute('data-min-characters', countCharactersTypeValue[1].split('-')[0])
      input.setAttribute('data-max-characters', countCharactersTypeValue[1].split('-')[1])
    }    

    inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'countCharacters'))
    const inputUtilityCountCharacters = document.createElement('div')
    const inputUtilityCountCharactersText = document.createElement('p')
    inputUtilityCountCharactersText.setAttribute('data-count-characters', '')

    // position: right or left
    if (customInputTagType !== 'textarea') {
      if (inputTextCustomTag.getAttribute('count-characters-position') === 'right' || inputTextCustomTag.getAttribute('count-characters-position') !== 'right' && inputTextCustomTag.getAttribute('count-characters-position') !== 'left') {
        inputUtilityCountCharacters.setAttribute('class', 'input-utility-slot input-utility-slot-right')
        inputUtilityCountCharactersText.setAttribute('class', 'input-utility-text-right input-utility-count-characters')
      } else if (inputTextCustomTag.getAttribute('count-characters-position') === 'left') {
        inputUtilityCountCharacters.setAttribute('class', 'input-utility-slot input-utility-slot-left')
        inputUtilityCountCharactersText.setAttribute('class', 'input-utility-text-left input-utility-count-characters')
      }
    } else if (customInputTagType === 'textarea') {
      inputUtilityCountCharacters.setAttribute('class', 'input-utility-slot input-utility-slot-textarea')
      inputUtilityCountCharactersText.setAttribute('class', 'input-utility-text-textarea input-utility-count-characters')
    }

    inputUtilityContainer.appendChild(inputUtilityCountCharacters)
    inputUtilityCountCharacters.appendChild(inputUtilityCountCharactersText) 
    inputUtilityContainer.appendChild(input)
  } else {
    inputUtilityContainer.appendChild(input)
  }
}


/**
 * SET UTILITY: SELECT PREFIX
 * @param {HTMLCustomElement} inputTextCustomTag input-phone
 * @param {HTMLInputElement} inputTag input
 * @param {HTMLDivElement} inputUtilityContainerTag inputUtilityContainer
 */
function setSelectPrefix(inputTextCustomTag, input, inputUtilityContainer, formInputContainer, inputUnderline, label) {
  if (inputTextCustomTag.getAttribute('select-prefix') !== undefined && inputTextCustomTag.getAttribute('select-prefix') === 'true') {

    formInputContainer.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))
    label.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))
    label.setAttribute('data-input-label-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'selectPrefix'))
    inputUtilityContainer.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefix = document.createElement('div')
    inputUtilitySelectPrefix.setAttribute('class', 'input-utility-slot input-utility-slot-left')
    inputUtilitySelectPrefix.setAttribute('data-select-prefix-stop-blur', inputTextCustomTag.getAttribute('input-name'))
    inputUtilitySelectPrefix.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefixButton = document.createElement('div')
    inputUtilitySelectPrefixButton.setAttribute('class', 'input-utility-select-prefix-left')
    inputUtilitySelectPrefixButton.setAttribute('data-select-prefix-button', '')
    inputUtilitySelectPrefixButton.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectedPrefixBox = document.createElement('span')
    inputUtilitySelectedPrefixBox.setAttribute('class', 'select-prefix-selected-flag')
    inputUtilitySelectedPrefixBox.setAttribute('data-selected-prefix-box-for', inputTextCustomTag.getAttribute('input-name'))
    inputUtilitySelectedPrefixBox.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))


    const inputUtilitySelectPrefixControls = document.createElement('span')
    inputUtilitySelectPrefixControls.setAttribute('class', 'select-prefix-controls select-prefix-controls_down')
    inputUtilitySelectPrefixControls.setAttribute('data-select-prefix-controls', '')
    inputUtilitySelectPrefixControls.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    input.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefixListboxContainer = document.createElement('div')
    inputUtilitySelectPrefixListboxContainer.setAttribute('class', 'input-utility-select-prefix-container')
    inputUtilitySelectPrefixListboxContainer.setAttribute('data-select-prefix-stop-blur', inputTextCustomTag.getAttribute('input-name'))
    inputUtilitySelectPrefixListboxContainer.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefixSearchContainer = document.createElement('div')
    inputUtilitySelectPrefixSearchContainer.setAttribute('class', 'input-utility-select-prefix-search-container')
    inputUtilitySelectPrefixSearchContainer.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))
    if (inputTextCustomTag.getAttribute('prefix-list-search') === 'true') {
      inputUtilitySelectPrefixSearchContainer.setAttribute('data-search-on-prefix-listbox', 'true')
    }

    const inputUtilitySelectPrefixSearchIcon = document.createElement('span')
    inputUtilitySelectPrefixSearchIcon.setAttribute('class', 'input-utility-select-prefix-search-icon')
    inputUtilitySelectPrefixSearchIcon.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefixSearchInput = document.createElement('input')
    inputUtilitySelectPrefixSearchInput.setAttribute('data-select-prefix-search-input', '') 
    inputUtilitySelectPrefixSearchInput.setAttribute('class', 'input-utility-select-prefix-search-input')
    inputUtilitySelectPrefixSearchInput.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))
    inputUtilitySelectPrefixSearchInput.setAttribute('form', 'none')
    inputUtilitySelectPrefixSearchInput.setAttribute('type', 'text') 
    inputUtilitySelectPrefixSearchInput.setAttribute('inputmode', 'text') 

    const inputUtilitySelectPrefixSearchInputUnderline = document.createElement('div')
    inputUtilitySelectPrefixSearchInputUnderline.setAttribute('class', 'input-utility-select-prefix-search-input-underline')
    inputUtilitySelectPrefixSearchInputUnderline.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))

    const inputUtilitySelectPrefixListbox = document.createElement('ul')
    inputUtilitySelectPrefixListbox.setAttribute('data-select-prefix-flag-php-file-path', location + 'formComponent/jsonData/inputPhoneSelectPrefix/inputPhoneSelectFlagPrefix.php')
    inputUtilitySelectPrefixListbox.setAttribute('class', 'input-utility-select-prefix-listbox')
    inputUtilitySelectPrefixListbox.setAttribute('data-select-prefix-listbox', '')
    inputUtilitySelectPrefixListbox.setAttribute('data-default-selected-prefix-country-code', inputTextCustomTag.getAttribute('select-prefix-default-country-code'))
    inputUtilitySelectPrefixListbox.setAttribute('data-no-close-select-prefix-for', inputTextCustomTag.getAttribute('input-name'))
    inputUtilitySelectPrefixListbox.setAttribute('data-prefix-list', inputTextCustomTag.getAttribute('prefix-list'))

    inputUtilityContainer.appendChild(inputUtilitySelectPrefix)
    inputUtilitySelectPrefix.appendChild(inputUtilitySelectPrefixButton)
    inputUtilitySelectPrefixButton.appendChild(inputUtilitySelectedPrefixBox)
    inputUtilitySelectPrefixButton.appendChild(inputUtilitySelectPrefixControls)
    inputUtilityContainer.appendChild(input)
    inputUtilityContainer.appendChild(inputUnderline)
    inputUtilityContainer.appendChild(inputUtilitySelectPrefixListboxContainer)
    inputUtilitySelectPrefixListboxContainer.appendChild(inputUtilitySelectPrefixSearchContainer)
    inputUtilitySelectPrefixSearchContainer.appendChild(inputUtilitySelectPrefixSearchIcon)
    inputUtilitySelectPrefixSearchContainer.appendChild(inputUtilitySelectPrefixSearchInput)
    inputUtilitySelectPrefixSearchContainer.appendChild(inputUtilitySelectPrefixSearchInputUnderline)
    inputUtilitySelectPrefixListboxContainer.appendChild(inputUtilitySelectPrefixListbox)

  } else {
    inputUtilityContainer.appendChild(input)
    formInputContainer.appendChild(inputUnderline)
  }
}


/**
 * SET DATALIST: with JSON or NOT, REQUIRED or SUGGESTION
 * @param {HTMLCustomElement} inputTextCustomTag 
 * @param {HTMLInputElement} input 
 * @param {HTMLDivElement} inputUtilityContainer 
 * @param {HTMLDivElement} inputUnderline 
 */
function setDatalist(inputTextCustomTag, input, inputUtilityContainer, inputUnderline, invalidFeedback) {
  inputUtilityContainer.setAttribute('data-input-datalist-container-for', inputTextCustomTag.getAttribute('input-name'))
  input.setAttribute('data-input', 'datalist')
  input.setAttribute('data-list', `${inputTextCustomTag.getAttribute('input-name')}--list`)

  const datalistContainer = document.createElement('label')
  datalistContainer.setAttribute('class', 'datalist-label-container')
  datalistContainer.setAttribute('id', `datalist-label-container-${inputTextCustomTag.getAttribute('input-name')}--list`)
  datalistContainer.setAttribute('for', `${inputTextCustomTag.getAttribute('input-name')}`)

  const datalist = document.createElement('datalist')
  datalist.setAttribute('class', 'input-datalist')
  datalist.setAttribute('id', `${inputTextCustomTag.getAttribute('input-name')}--list`)


  if (inputTextCustomTag.getAttribute('datalist-json') === 'json') {

    if (inputTextCustomTag.getAttribute('datalist-autocomplete-address') !== null) {
      if (inputTextCustomTag.getAttribute('datalist-autocomplete-address') === 'comune') {
        input.setAttribute('data-autocomplete-address-fields', `autocomplete-address-${inputTextCustomTag.getAttribute('datalist-autocomplete-address-id')}`)
        input.setAttribute('data-json-datalist-autocomplete-address-path', location + `formComponent/jsonData/inputDatalist/comuni-cap-province-regioni-autocomplete.php`)
      } else {
        input.setAttribute('data-address-autocomplete', `autocomplete-address-${inputTextCustomTag.getAttribute('datalist-autocomplete-address-id')}`)
        input.setAttribute('data-autocomplete-field', inputTextCustomTag.getAttribute('datalist-autocomplete-address'))
      }
    }

    if (inputTextCustomTag.getAttribute('datalist-only-autocomplete') === 'true') {
      input.setAttribute('data-autocomplete-with-datalist-free-option-json', '')
    } else if (inputTextCustomTag.getAttribute('datalist-only-autocomplete') === null) {
      datalist.setAttribute('data-json-datalist', inputTextCustomTag.getAttribute('datalist-json-php-file-name'))
      datalist.setAttribute('data-json-datalist-path', location + `formComponent/jsonData/inputDatalist/${inputTextCustomTag.getAttribute('datalist-json-php-file-name')}.php`) 
    }

    if (inputTextCustomTag.getAttribute('datalist-type') === 'suggestion') {
      if (inputTextCustomTag.getAttribute('datalist-only-autocomplete') === null) {
        input.setAttribute('data-min-length-for-suggest', inputTextCustomTag.getAttribute('datalist-min-length-for-suggest'))
        invalidFeedback.setAttribute('data-datalist-messages', `${inputTextCustomTag.getAttribute('datalist-min-length-for-suggest-message')};${inputTextCustomTag.getAttribute('datalist-value-not-present-in-list-message')}`)    
      } else {
        invalidFeedback.setAttribute('data-datalist-messages', `;${inputTextCustomTag.getAttribute('datalist-value-not-present-in-list-message')}`)    
      }
    } else if (inputTextCustomTag.getAttribute('datalist-type') === 'select-option') {
      input.setAttribute('data-datalist-option-required', '')
      invalidFeedback.setAttribute('data-datalist-messages', `;${inputTextCustomTag.getAttribute('datalist-value-not-present-in-list-message')}`)
    }

  } else if (inputTextCustomTag.getAttribute('datalist-json') === 'not-json') {

    if (inputTextCustomTag.getAttribute('datalist-autocomplete-address') !== null) {
      if (inputTextCustomTag.getAttribute('datalist-autocomplete-address') === 'stato') {
        input.setAttribute('data-address-autocomplete', `autocomplete-address-${inputTextCustomTag.getAttribute('datalist-autocomplete-address-id')}`)
        input.setAttribute('data-autocomplete-field', inputTextCustomTag.getAttribute('datalist-autocomplete-address'))
      }
    }

    let optionsToInsertArray = inputTextCustomTag.getAttribute('datalist-options-list').split(',')
    optionsToInsertArray.forEach(optionToInsert => {
      const datalistOption = document.createElement('option')
      datalistOption.innerText = optionToInsert
      datalist.appendChild(datalistOption)
    });

    if (inputTextCustomTag.getAttribute('datalist-type') === 'suggestion') {
      input.setAttribute('data-free-datalist-without-json', '')
      invalidFeedback.setAttribute('data-datalist-messages', `;${inputTextCustomTag.getAttribute('datalist-value-not-present-in-list-message')}`)
    } else if (inputTextCustomTag.getAttribute('datalist-type') === 'select-option') {
      input.setAttribute('data-datalist-option-required', '')
      invalidFeedback.setAttribute('data-datalist-messages', `;${inputTextCustomTag.getAttribute('datalist-value-not-present-in-list-message')}`)
    }
  }

  inputUtilityContainer.appendChild(input)
  inputUtilityContainer.appendChild(inputUnderline)
  inputUtilityContainer.appendChild(datalistContainer)
  datalistContainer.appendChild(datalist)
}


/**
 * SET UTILITY: PASSWORD VISIBILITY
 * @param {HTMLCustomElement} inputTextCustomTag input-password
 * @param {HTMLDivElement} inputUtilityContainerTag inputUtilityContainer
 */
function setPasswordToggleVisibility(inputTextCustomTag, inputUtilityContainer) {
  inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'passwordVisibility'))

  const inputUtilityPasswordVisibility = document.createElement('div')
  const inputUtilityPasswordVisibilityIcon = document.createElement('div')
  inputUtilityPasswordVisibilityIcon.setAttribute('data-password-visibility', '')

  // position: right or left
  if (inputTextCustomTag.getAttribute('password-visibility-position') === 'right' || inputTextCustomTag.getAttribute('password-visibility-position') !== 'right' && inputTextCustomTag.getAttribute('password-visibility-position') !== 'left') {
    inputUtilityPasswordVisibility.setAttribute('class', 'input-utility-slot input-utility-slot-right')
    inputUtilityPasswordVisibilityIcon.setAttribute('class', 'input-utility-icon-right input-utility-password-visibility')
  } else if (inputTextCustomTag.getAttribute('password-visibility-position') === 'left') {
    inputUtilityPasswordVisibility.setAttribute('class', 'input-utility-slot input-utility-slot-left')
    inputUtilityPasswordVisibilityIcon.setAttribute('class', 'input-utility-icon-left input-utility-password-visibility')
  }

  inputUtilityContainer.appendChild(inputUtilityPasswordVisibility)
  inputUtilityPasswordVisibility.appendChild(inputUtilityPasswordVisibilityIcon) 
}

/**
 * SET INPUT PASSWORD: password and confirm-password
 * @param {HTMLCustomElement} inputTextCustomTag 
 * @param {HTMLInputElement} input 
 * @param {HTMLDivElement} inputUtilityContainer 
 * @param {HTMLDivElement} invalidFeedback 
 */
function setPassword(inputTextCustomTag, input, inputUtilityContainer, invalidFeedback) {
  // toggle visibility
  if (inputTextCustomTag.getAttribute('password-toggle-visibility') === 'true') {
    setPasswordToggleVisibility(inputTextCustomTag, inputUtilityContainer)
    inputUtilityContainer.appendChild(input)
  } else {
    inputUtilityContainer.appendChild(input)
  }

  // autocomplete browser
  if (inputTextCustomTag.getAttribute('password-autocomplete') !== null) {
    input.setAttribute('autocomplete', inputTextCustomTag.getAttribute('password-autocomplete'))
  }

  // password or confirm-password
  if (inputTextCustomTag.getAttribute('input-password-type') === 'new-password') {
    input.setAttribute('data-password', 'password')
    input.setAttribute('data-password-includes-special-characters', inputTextCustomTag.getAttribute('password-includes-special-characters'))
    input.setAttribute('data-password-min-length', inputTextCustomTag.getAttribute('password-min-length'))
    input.setAttribute('data-password-messages', inputTextCustomTag.getAttribute('password-messages'))
  } else if (inputTextCustomTag.getAttribute('input-password-type') === 'confirm-password') {
    input.setAttribute('data-password', 'confirmPassword')
    input.setAttribute('data-confirm-password-for', inputTextCustomTag.getAttribute('confirm-password-for'))
    input.setAttribute('data-confirm-password-messages', inputTextCustomTag.getAttribute('confirm-password-messages'))
  } else if (inputTextCustomTag.getAttribute('input-password-type') === 'current-password') {
    input.setAttribute('data-password', 'currentPassword')
    input.setAttribute('data-password-includes-special-characters', inputTextCustomTag.getAttribute('password-includes-special-characters'))
    input.setAttribute('data-current-password-message', inputTextCustomTag.getAttribute('current-password-message'))
  }
}


/**
 * SET INPUT RANGE
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLDivElement} formInputContainer 
 * @param {HTMLInputElement} input 
 * @param {HTMLDivElement} inputRangeContainer (è inputUtilityContainer)
 * @param {HTMLLabelElement} label 
 * @param {HTMLDivElement} inputUnderline 
 * @param {HTMLDivElement} invalidFeedback 
 */
function setRange(inputTextCustomTag, formInputContainer, input, inputRangeContainer, label, inputUnderline, invalidFeedback) {
  formInputContainer.classList.add('form-input-range-container')
  label.classList.add('input-label-focus-always')
  inputUnderline.classList.add('input-underline-none')

  const rangeTrack = document.createElement('div')
  rangeTrack.setAttribute('class', 'input-range-track')

  const rangeTrackBeforeThumb = document.createElement('div')
  rangeTrackBeforeThumb.setAttribute('class', 'input-range-track-before-thumb')

  const rangeThumb = document.createElement('div')
  rangeThumb.setAttribute('class', 'input-range-thumb')

  if (inputTextCustomTag.getAttribute('input-range-type') === "numbers-double-range") {
    // se double range
    rangeTrackBeforeThumb.classList.add('input-double-range-track-between-thumbs')

    rangeThumb.classList.add('input-double-range-thumb--min')

    const rangeThumbMax = document.createElement('div')
    rangeThumbMax.setAttribute('class', 'input-range-thumb input-double-range-thumb--max')

    rangeTrack.appendChild(rangeTrackBeforeThumb)
    rangeTrack.appendChild(rangeThumb)
    rangeTrack.appendChild(rangeThumbMax)
  } else {
    // se non double range (only with numbers)
    rangeTrack.appendChild(rangeTrackBeforeThumb)
    rangeTrack.appendChild(rangeThumb)
  }

  input.classList.add('input-none')
  input.classList.add('input-range')

  input.setAttribute('required', '')
  input.setAttribute('data-input-text-type', 'range')
  input.setAttribute('data-range', '')
  input.setAttribute('data-input-no-write', '')

  if (inputTextCustomTag.getAttribute('input-range-type') === "numbers-range") {
    input.setAttribute('data-range-min', inputTextCustomTag.getAttribute('range-min'))
    input.setAttribute('data-range-max', inputTextCustomTag.getAttribute('range-max'))

    if (inputTextCustomTag.getAttribute('range-default-value') !== 'min' && inputTextCustomTag.getAttribute('range-default-value') !== 'max') {
      input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-default-value'))
    } else if (inputTextCustomTag.getAttribute('range-default-value') === 'min') {
      input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-min'))
    } else if (inputTextCustomTag.getAttribute('range-default-value') === 'max') {
      input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-max'))
    }

    if (inputTextCustomTag.getAttribute('range-valid-values') !== 'min:max') {
      input.setAttribute('data-range-valid-value', inputTextCustomTag.getAttribute('range-valid-values'))
    } else {
      input.setAttribute('data-range-valid-value', inputTextCustomTag.getAttribute('range-min') + ':' + inputTextCustomTag.getAttribute('range-max'))
    }

    const rangeThumbPreview = document.createElement('div')
    rangeThumbPreview.setAttribute('class', 'input-range-value-preview')
    rangeThumb.appendChild(rangeThumbPreview)

  } else if (inputTextCustomTag.getAttribute('input-range-type') === "words-range") {
    input.setAttribute('data-range-array-value', inputTextCustomTag.getAttribute('range-words-array'))
    input.setAttribute('data-invalid-range-array-value', inputTextCustomTag.getAttribute('range-invalid-words-array'))
    input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-default-word-array-position'))

    invalidFeedback.classList.remove('input-feedback-text')
    invalidFeedback.classList.add('input-feedback-range-value')
    invalidFeedback.classList.add('show-input-feedback-always-without-focus')

    const feedbackRangeWordSelected = document.createElement('div')
    feedbackRangeWordSelected.setAttribute('class', 'input-range-predefined-value-show-selected')

    invalidFeedback.appendChild(feedbackRangeWordSelected)

  } else if (inputTextCustomTag.getAttribute('input-range-type') === "numbers-double-range") {

    input.setAttribute('data-double-range', "true")

    input.setAttribute('data-double-range-min-step-between-min-max', inputTextCustomTag.getAttribute('double-range-min-step-between-min-max'))
    input.setAttribute('data-range-min', inputTextCustomTag.getAttribute('range-min'))
    input.setAttribute('data-range-max', inputTextCustomTag.getAttribute('range-max'))

    if (inputTextCustomTag.getAttribute('range-default-value') !== 'min:max') {
      input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-default-value'))
    } else {
      input.setAttribute('data-default-range-value', inputTextCustomTag.getAttribute('range-min') + ':' + inputTextCustomTag.getAttribute('range-max'))
    }

    if (inputTextCustomTag.getAttribute('range-valid-values') !== 'min:max') {
      input.setAttribute('data-range-valid-value', inputTextCustomTag.getAttribute('range-valid-values'))
    } else {
      input.setAttribute('data-range-valid-value', inputTextCustomTag.getAttribute('range-min') + ':' + inputTextCustomTag.getAttribute('range-max'))
    }

    const doubleRangeValuesPreview = document.createElement('div')
    doubleRangeValuesPreview.setAttribute('class', 'input-double-range-values-preview')
    rangeTrack.appendChild(doubleRangeValuesPreview)
  }

  inputRangeContainer.appendChild(rangeTrack)
  inputRangeContainer.appendChild(input)
}

/**
 * SET INPUT COLOR
 * @param {HTMLCustomElement} inputTextCustomTag 
 * @param {HTMLDivElement} formInputContainer 
 * @param {HTMLInputElement} input 
 * @param {HTMLDivElement} inputUtilityContainer 
 * @param {HTMLLabelElement} label 
 */
function setColor(inputTextCustomTag, input, inputUtilityContainer, label) {
  label.classList.add('input-label-focus-always')
  label.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'colorPicker'))
  inputUtilityContainer.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  const colorPickerUtilityLabel = document.createElement('label')
  colorPickerUtilityLabel.setAttribute('class', 'input-utility-slot input-utility-slot-right')
  colorPickerUtilityLabel.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))
  colorPickerUtilityLabel.setAttribute('data-color-picker-label', inputTextCustomTag.getAttribute('input-name'))
  colorPickerUtilityLabel.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  const colorPickerUtilityLabelIcon = document.createElement('div')
  colorPickerUtilityLabelIcon.setAttribute('class', 'input-utility-icon-right input-utility-color-picker')
  colorPickerUtilityLabelIcon.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  colorPickerUtilityLabel.appendChild(colorPickerUtilityLabelIcon)

  const inputColorContainer = document.createElement('div')
  inputColorContainer.setAttribute('class', 'input-color-container')
  inputColorContainer.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  const colorPickerLabel = document.createElement('label')
  colorPickerLabel.setAttribute('class', 'input-label-color')
  colorPickerLabel.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))
  colorPickerLabel.setAttribute('data-color-picker-label', inputTextCustomTag.getAttribute('input-name'))
  colorPickerLabel.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  const selectedColorBox = document.createElement('div')
  selectedColorBox.setAttribute('class', 'input-color-selected')
  selectedColorBox.setAttribute('data-input-color-selected', '')
  selectedColorBox.setAttribute('data-color-selected-for', inputTextCustomTag.getAttribute('input-name'))
  selectedColorBox.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))

  colorPickerLabel.appendChild(selectedColorBox)

  if (inputTextCustomTag.getAttribute('input-value') === '') {
    input.value = inputTextCustomTag.getAttribute('hex-color-selected-default')
  } else {
    input.value = inputTextCustomTag.getAttribute('input-value')
  }

  input.classList.add('input-none')
  input.classList.add('input-color')
  input.setAttribute('data-input-no-write', '')
  input.setAttribute('data-input-text-type', 'color')
  input.setAttribute('data-no-close-color-picker-for', inputTextCustomTag.getAttribute('input-name'))
  input.setAttribute('data-attibute-to-add-for-color-picker-label-wrapper', 'data-color-picker-label')
  input.setAttribute('data-color-picker-padding-top', '-1')

  inputColorContainer.appendChild(colorPickerLabel)
  inputColorContainer.appendChild(input)

  inputUtilityContainer.appendChild(colorPickerUtilityLabel)
  inputUtilityContainer.appendChild(inputColorContainer)
}

/**
 * SET INPUT DATE TIME
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLInputElement} input
 * @param {HTMLDivElement} inputUtilityContainer
 * @param {HTMLLabelElement} label
 */
function setInputDateTime(inputTextCustomTag, input, inputUtilityContainer, label) {
  label.classList.add('input-label-focus-always')
  label.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'dateTime'))
  inputUtilityContainer.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  const dtLabel = document.createElement('label')
  dtLabel.setAttribute('class', 'input-utility-slot input-utility-slot-left-visible-always input-utility-slot-left-visible-always-show')
  dtLabel.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))
  dtLabel.setAttribute('data-date-time-label', '')
  dtLabel.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))


  const dtLabelIcon = document.createElement('div')
  dtLabelIcon.setAttribute('class', 'input-utility-icon-left')
  dtLabelIcon.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  if (inputTextCustomTag.getAttribute('dt-type') === 'date') {
    dtLabelIcon.classList.add('input-utility-date')
  } else if (inputTextCustomTag.getAttribute('dt-type') === 'dateTime') {
    dtLabelIcon.classList.add('input-utility-date-time')
  } else if (inputTextCustomTag.getAttribute('dt-type') === 'time') {
    dtLabelIcon.classList.add('input-utility-time')
  }

  input.classList.add('input-none')
  input.classList.add('input-date-time')
  input.setAttribute('data-input-no-write', '')
  input.setAttribute('data-input-date-time', '')
  input.setAttribute('data-input-text-type', inputTextCustomTag.getAttribute('dt-type'))
  input.setAttribute('data-date-time-not-selected-value', inputTextCustomTag.getAttribute('dt-not-selected-value'))
  input.setAttribute('data-input-required-message', '')
  input.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  if (inputTextCustomTag.getAttribute('dt-type') == 'time' && inputTextCustomTag.getAttribute('time-show-seconds') === 'false' || inputTextCustomTag.getAttribute('dt-type') == 'dateTime' && inputTextCustomTag.getAttribute('time-show-seconds') === 'false') {
    input.setAttribute('data-time-picker', 'no-seconds')
  }

  if (inputTextCustomTag.getAttribute('dt-type') == 'date' || inputTextCustomTag.getAttribute('dt-type') == 'dateTime') {
    input.setAttribute('data-min-date', inputTextCustomTag.getAttribute('dt-min-date'))
    input.setAttribute('data-max-date', inputTextCustomTag.getAttribute('dt-max-date'))
    input.setAttribute('data-min-max-date-message', inputTextCustomTag.getAttribute('dt-min-max-date-message'))
  }

  if (inputTextCustomTag.getAttribute('dt-type') == 'time' || inputTextCustomTag.getAttribute('dt-type') == 'dateTime') {
    input.setAttribute('data-min-time', inputTextCustomTag.getAttribute('dt-min-time'))
    input.setAttribute('data-max-time', inputTextCustomTag.getAttribute('dt-max-time'))
    input.setAttribute('data-middle-invalid-time', inputTextCustomTag.getAttribute('dt-middle-invalid-time'))
    input.setAttribute('data-min-max-time-message', inputTextCustomTag.getAttribute('dt-min-max-time-message'))
  }

  const inputDTValueContainer = document.createElement('div')
  inputDTValueContainer.setAttribute('class', 'input-date-time-container')
  inputDTValueContainer.setAttribute('data-date-time-label', '')
  inputDTValueContainer.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  const inputDTValueLabel = document.createElement('label')
  inputDTValueLabel.setAttribute('class', 'input-date-time-value-container')
  inputDTValueLabel.setAttribute('data-date-time-label', '')
  inputDTValueLabel.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))
  inputDTValueLabel.setAttribute('id', `input-date-time-value-container-${inputTextCustomTag.getAttribute('input-name')}`)
  inputDTValueLabel.setAttribute('data-no-close-dtsel-for', inputTextCustomTag.getAttribute('input-name'))

  inputUtilityContainer.appendChild(dtLabel)
  dtLabel.appendChild(dtLabelIcon)
  inputUtilityContainer.appendChild(input)
  inputUtilityContainer.appendChild(inputDTValueContainer)
  inputDTValueContainer.appendChild(inputDTValueLabel)
}

/**
 * SET INPUT FILE
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLInputElement} input
 * @param {HTMLDivElement} inputUtilityContainer
 * @param {HTMLLabelElement} label
 * @param {HTMLDivElement} invalidFeedback
 */
function setInputFile(inputTextCustomTag, input, inputUtilityContainer, label, invalidFeedback) {
  label.classList.add('input-label-focus-always')
  label.setAttribute('data-input-attach-file-label-for', inputTextCustomTag.getAttribute('input-name'))

  inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'attachFile'))

  // icon attach file
  const attachFileIconContainer = document.createElement('label')
  attachFileIconContainer.setAttribute('class', 'input-utility-slot input-utility-slot-left-visible-always input-utility-slot-left-visible-always-show')
  attachFileIconContainer.setAttribute('data-attach-file-input-focus', '')
  attachFileIconContainer.setAttribute('data-attach-file-label', '')
  attachFileIconContainer.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))

  const attachFileIcon = document.createElement('div')
  attachFileIcon.setAttribute('class', 'input-utility-icon-left input-utility-attach-file')
  
  inputUtilityContainer.appendChild(attachFileIconContainer)
  attachFileIconContainer.appendChild(attachFileIcon)

  // icon remove attached file
  const removeAttachedFileIconContainer = document.createElement('div')
  removeAttachedFileIconContainer.setAttribute('class', 'input-utility-slot input-utility-slot-left-visible-always')
  removeAttachedFileIconContainer.setAttribute('data-attach-file-input-focus', '')
  removeAttachedFileIconContainer.setAttribute('data-input-attach-file-label-for', inputTextCustomTag.getAttribute('input-name'))
  removeAttachedFileIconContainer.setAttribute('data-attach-file-remove-all-container', '')

  const removeAttachedFileIcon = document.createElement('div')
  removeAttachedFileIcon.setAttribute('class', 'input-utility-icon-left input-utility-attach-file-remove-all')
  removeAttachedFileIcon.setAttribute('data-attach-file-remove-all', '')

  inputUtilityContainer.appendChild(removeAttachedFileIconContainer)
  removeAttachedFileIconContainer.appendChild(removeAttachedFileIcon)

  // input
  const inputFileContainer = document.createElement('div')
  inputFileContainer.setAttribute('class', 'input-attach-file-container')
  inputFileContainer.setAttribute('data-attach-file-input-focus', '')
  inputFileContainer.setAttribute('data-input-attach-file-label-for', inputTextCustomTag.getAttribute('input-name'))

  const inputFileValueContainer = document.createElement('div')
  inputFileValueContainer.setAttribute('class', 'input-attach-file-value-container')
  inputFileValueContainer.setAttribute('data-input-attach-file-value-container', '')

  input.classList.add('input-attach-file')

  // extension
  input.setAttribute('accept', inputTextCustomTag.getAttribute('file-accept-MIME-types'))
  input.setAttribute('data-file-extension-message', inputTextCustomTag.getAttribute('file-extension-error-message'))

  // size
  input.setAttribute('data-attached-file-max-size-mb', inputTextCustomTag.getAttribute('single-file-max-size-MB'))
  if (inputTextCustomTag.getAttribute('single-file-max-size-MB') !== 'none') {
    input.setAttribute('data-file-size-message', inputTextCustomTag.getAttribute('file-max-size-error-message'))
  }

  // default in box value
  input.setAttribute('data-none-attached-file-input-message', inputTextCustomTag.getAttribute('file-not-selected-value'))

  // multiple
  if (inputTextCustomTag.getAttribute('multiple-files') === 'true') {
    // se multiple
    input.setAttribute('multiple','')
    input.setAttribute('data-multile-max-files', inputTextCustomTag.getAttribute('multiple-max-files'))
    input.setAttribute('data-file-multiple-max-message', inputTextCustomTag.getAttribute('multiple-max-files-error-message'))
    input.setAttribute('data-multile-min-files', inputTextCustomTag.getAttribute('multiple-min-files'))
    input.setAttribute('data-file-multiple-min-message', inputTextCustomTag.getAttribute('multiple-min-files-error-message'))
    input.setAttribute('name', `${inputTextCustomTag.getAttribute('input-name')}[]`)
  }

  inputUtilityContainer.appendChild(inputFileContainer)
  inputFileContainer.appendChild(inputFileValueContainer)
  inputFileContainer.appendChild(input)


  invalidFeedback.classList.add('show-input-feedback-always')
}

/**
 * SET INPUT RADIO CHECKBOX
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLDivElement} inputRadioCheckboxContainer
 * @param {Array||String} value
 */
function setInputRadioCheckbox(inputTextCustomTag, inputRadioCheckboxContainer, value) {
  // option/options checked dal server
  let checkedOption = value.split(';')

  let options = inputTextCustomTag.getAttribute('rc-options').split(';')

  if (inputTextCustomTag.getAttribute('rc-type') === 'radio') {
    inputRadioCheckboxContainer.classList.add('input-radio-container')
  } else if (inputTextCustomTag.getAttribute('rc-type') === 'checkbox') {
    inputRadioCheckboxContainer.classList.add('input-checkbox-container')
  }

  options.forEach(option => {

    // label
    let label = document.createElement('label')
    label.setAttribute('class', 'input-label-radio-checkbox')

    // option solo se contiene option(3) metto il badge after 3 alla label e tolgo la parte tra parentesi alla option
    if (option.match(/\(/)) {
      let resultsNumberForThisOption = option.split('(')[1].trim().replace(')', '')
      label.setAttribute('data-after-content-results-number-for-this-option', resultsNumberForThisOption)
      option = option.split('(')[0].trim()
    }

    // colori hex
    if (option.match(/^[#]/)) {
      label.classList.add('input-label-radio-checkbox--hex-color')
      if (option.match(/[_]/)) {
        let optionHexColorArray = option.split('_');
        label.style.backgroundImage = 'linear-gradient(-45deg, ' + optionHexColorArray[0] + ' 50%, ' + optionHexColorArray[1] + ' 50%)'
      } else {
        label.style.backgroundColor = option
      }
    } else {
      label.setAttribute('class', 'input-label-radio-checkbox')
    }

    // sostituisco tutti gli spazi bianchi della option con underscore
    let optionNoWhiteSpace = option.replaceAll(' ', '_')

    // se la option è un colore hex
    if (option.match(/^[#]/)) {
      optionNoWhiteSpace = optionNoWhiteSpace.replaceAll('#','')
    }

    // label
    label.setAttribute('for', `${inputTextCustomTag.getAttribute('input-name')}${optionNoWhiteSpace}`)

    // option/options checked dal server
    if (checkedOption.includes(option)) {
      label.classList.add('input-label-radio-checkbox-active')
    }

    // box icona
    let boxRadioCheckbox = document.createElement('div')
    boxRadioCheckbox.setAttribute('class', 'box-radio-checkbox')
    if (option.match(/^[#]/)) {
      if (option.match(/[_]/)) {
        let optionHexColorArray = option.split('_');
        boxRadioCheckbox.style.backgroundImage = 'linear-gradient(-45deg, ' + checkForm.pickTextColorBasedOnBgColorAdvanced(optionHexColorArray[0], '#ffffff', '#000000') + ' 50%, ' + checkForm.pickTextColorBasedOnBgColorAdvanced(optionHexColorArray[1], '#ffffff', '#000000') + ' 50%)'
      } else {
        boxRadioCheckbox.style.backgroundColor = checkForm.pickTextColorBasedOnBgColorAdvanced(option, '#ffffff', '#000000')
      }
    }

    // input
    let input = document.createElement('input')
    input.setAttribute('tabindex', parseFloat(inputTextCustomTag.getAttribute('field-order-number')) + 1)
    input.setAttribute('class', 'input-radio-checkbox')
    input.setAttribute('id', `${inputTextCustomTag.getAttribute('input-name')}${optionNoWhiteSpace}`)
    input.setAttribute('value', option)

    // option/options checked dal server
    if (checkedOption.includes(option)) {
      input.setAttribute('checked', '')
    }

    if (inputTextCustomTag.getAttribute('required') !== null) {
      input.setAttribute('required', '')
    }

    if (inputTextCustomTag.getAttribute('disabled') === '') {
      input.setAttribute('disabled', '')
    }

    // box value
    let titleRadioCheckbox = document.createElement('span')
    titleRadioCheckbox.setAttribute('class', 'title-radio-checkbox')
    titleRadioCheckbox.innerText = option

    if (inputTextCustomTag.getAttribute('rc-type') === 'radio') {
      label.setAttribute('data-label-radio', '')
      boxRadioCheckbox.classList.add('box-radio')
      input.setAttribute('name', inputTextCustomTag.getAttribute('input-name'))
      input.setAttribute('type', 'radio')
    } else if (inputTextCustomTag.getAttribute('rc-type') === 'checkbox') {
      label.setAttribute('data-label-checkbox', '')
      boxRadioCheckbox.classList.add('box-checkbox')
      input.setAttribute('name', `${inputTextCustomTag.getAttribute('input-name')}[]`)
      input.setAttribute('type', 'checkbox')
    }

    inputRadioCheckboxContainer.appendChild(label)
    label.appendChild(boxRadioCheckbox)
    label.appendChild(input)

    // solo se la option non è un colore hex
    if (!option.match(/^[#]/)) {
      label.appendChild(titleRadioCheckbox)
    }

  });
  
}

/**
 * SET INPUT SWITCH
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLDivElement} boxSwitch
 */
function setSwitch(inputTextCustomTag, boxSwitch) {

  // input
  const inputSwitch = document.createElement('input')
  inputSwitch.setAttribute('tabindex', parseFloat(inputTextCustomTag.getAttribute('field-order-number')) + 1)
  inputSwitch.setAttribute('class', 'input-switch')
  inputSwitch.setAttribute('id', inputTextCustomTag.getAttribute('input-name'))
  inputSwitch.setAttribute('name', inputTextCustomTag.getAttribute('input-name'))
  inputSwitch.setAttribute('type', 'checkbox')
  // required
  if (inputTextCustomTag.getAttribute('required') !== null) {
    inputSwitch.setAttribute('required', '')
  }
  // value
  inputSwitch.setAttribute('value', inputTextCustomTag.getAttribute('input-value'))

  if (inputTextCustomTag.getAttribute('disabled') === '') {
    inputSwitch.setAttribute('disabled', '')
  }


  // button
  const switchButtonContainer = document.createElement('label')
  switchButtonContainer.setAttribute('class', 'switch')
  switchButtonContainer.setAttribute('for', inputTextCustomTag.getAttribute('input-name'))

  const switchButton = document.createElement('div')
  switchButton.setAttribute('class', 'switch-button')

  const switchBeforeDot = document.createElement('div')
  switchBeforeDot.setAttribute('class', 'switch-before-dot')

  const switchDot = document.createElement('div')
  switchDot.setAttribute('class', 'switch-dot')

  const switchAfterDot = document.createElement('div')
  switchAfterDot.setAttribute('class', 'switch-after-dot')

  switchButtonContainer.appendChild(switchButton)
  switchButton.appendChild(switchBeforeDot)
  switchButton.appendChild(switchDot)
  switchButton.appendChild(switchAfterDot)

  // text inside button
  if (inputTextCustomTag.getAttribute('switch-text-inside-button') !== null && inputTextCustomTag.getAttribute('switch-text-inside-button') !== '' ) {
    const beforeP = document.createElement('p')
    const afterP = document.createElement('p')

    let switchTextInside = inputTextCustomTag.getAttribute('switch-text-inside-button').split(';')

    beforeP.innerText = switchTextInside[0]
    afterP.innerText = switchTextInside[1]

    switchBeforeDot.appendChild(beforeP)
    switchAfterDot.appendChild(afterP)
  }


  // append
  boxSwitch.appendChild(inputSwitch)
  boxSwitch.appendChild(switchButtonContainer)


  // icon read
  if (inputTextCustomTag.getAttribute('switch-read-document-icon') === 'true') {
    const switchIconReadContainer = document.createElement('div')
    switchIconReadContainer.setAttribute('class', 'switch-icon-read-container')
  
    const switchIconReadLink = document.createElement('a')
    switchIconReadLink.setAttribute('class', 'switch-icon-read')
    switchIconReadLink.setAttribute('target', '_blanck')
    switchIconReadLink.setAttribute('href', inputTextCustomTag.getAttribute('switch-read-document-name'))
    switchIconReadLink.setAttribute('tabindex', '-1')
  
    switchIconReadContainer.appendChild(switchIconReadLink)
  
    boxSwitch.appendChild(switchIconReadContainer)
  }

}

/**
 * SET TEXTAREA
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLDivElement} inputUtilityContainer
 */
function setTextarea(inputTextCustomTag, textarea, inputUtilityContainer) {
  inputUtilityContainer.classList.add('textarea-container')

  textarea.setAttribute('class', 'input textarea')
  textarea.setAttribute('novalidate', '')
  textarea.setAttribute('wrap', 'soft')
  textarea.setAttribute('data-textarea-default-rows-number-height', `${inputTextCustomTag.getAttribute('textarea-rows')};19`)

  textarea.innerHTML = inputTextCustomTag.getAttribute('input-value')
}

/**
 * SET ANTISPAM
 * @param {HTMLCustomElement} inputTextCustomTag
 * @param {HTMLInputElement} input
 * @param {HTMLDivElement} inputUtilityContainer
 * @param {HTMLLabelElement} label
 */
function setAntispam(inputTextCustomTag, input, inputUtilityContainer, label) {
  label.classList.add('input-label-focus-always')

  inputUtilityContainer.setAttribute('data-input-utility', addValueForDataInputUtility(inputUtilityContainer.getAttribute('data-input-utility'), 'antispam'))

  const inputUtilityAntispam = document.createElement('div')
  inputUtilityAntispam.setAttribute('class', 'input-utility-slot input-utility-slot-left input-utility-slot-left-visible-always input-utility-slot-left-visible-always-show')

  const inputUtilityAntispamImg = document.createElement('img')
  inputUtilityAntispamImg.setAttribute('id', `img-antispam-${inputTextCustomTag.getAttribute('input-name')}`)
  inputUtilityAntispamImg.setAttribute('class', 'antispam-img')
  inputUtilityAntispamImg.setAttribute('src', inputTextCustomTag.getAttribute('input-antispam-img') ?? location + '/formComponent/captcha/captcha.php')

  inputUtilityContainer.appendChild(inputUtilityAntispam)
  inputUtilityAntispam.appendChild(inputUtilityAntispamImg)

  inputUtilityContainer.appendChild(input)
}

