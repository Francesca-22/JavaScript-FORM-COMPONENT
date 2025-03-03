<?php
    header('Content-type: text/css');
?>

/* personalizza qui sotto il form-component copiando i selettori interessati dal browser (vedi documentazione capitolo A punto 2-CSS) */

/* PERSONALIZZAZIONE SUBMIT BUTTON DEL FORM CON ID esempio-form-registrazione */
form.form#esempio-form-registrazione div.form-button-container {
    padding-top: 30px;
}
form.form#esempio-form-registrazione button.form-submit-button {
    text-transform: lowercase;
    font: 20px/25px "Brush Script MT", cursive;
    border-radius: 20px;
    padding: 6px 20px 9px;
    white-space: nowrap;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: lightseagreen;
}
form.form#esempio-form-registrazione button.form-submit-button:hover,
form.form#esempio-form-registrazione button.form-submit-button:focus {
    outline-width: 4px;
}
form.form#esempio-form-registrazione .form-loading {
    top: 5px;
}


/* PERSONALIZZAZIONE SUBMIT BUTTON DEL FORM CON ID esempio-form-login */
form.form#esempio-form-login div.form-button-container {
    padding-top: 30px;
}
form.form#esempio-form-login button.form-submit-button {
    text-transform: uppercase;
    font: 600 20px/25px "Courier New", monospace;
    border-radius: 10px;
    padding: 6px 20px 5px;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: #252525;
    color: burlywood;
}
form.form#esempio-form-login button.form-submit-button:hover,
form.form#esempio-form-login button.form-submit-button:focus {
    outline-width: 3px;
    outline-color: burlywood;
}
form.form#esempio-form-login .form-loading {
    top: 3px;
}
form.form#esempio-form-login .form-loading::before,
form.form#esempio-form-login .form-loading::after {
    outline-color: burlywood;
}


/* PERSONALIZZAZIONE SUBMIT BUTTON DEL FORM CON ID esempio-form-aggiungi-indirizzo o esempio-file */
form.form#esempio-form-aggiungi-indirizzo div.form-button-container,
form.form#esempio-file div.form-button-container {
    padding-top: 20px;
}
form.form#esempio-form-aggiungi-indirizzo button.form-submit-button,
form.form#esempio-file button.form-submit-button {
    border-radius: 20px;
    padding: 5px 20px;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: mediumseagreen;
}
form.form#esempio-form-aggiungi-indirizzo button.form-submit-button::after {
    font: 30px/30px var(--icon-font-material);
    content: 'add';
    display: block;
}
form.form#esempio-file button.form-submit-button::after {
    font: 30px/30px var(--icon-font-material);
    content: 'send';
    display: block;
}
form.form#esempio-form-aggiungi-indirizzo button.form-submit-button:hover,
form.form#esempio-form-aggiungi-indirizzo button.form-submit-button:focus,
form.form#esempio-file button.form-submit-button:hover,
form.form#esempio-file button.form-submit-button:focus {
    outline-width: 5px;
}
form.form#esempio-form-aggiungi-indirizzo .form-loading,
form.form#esempio-file .form-loading {
    top: 5px;
}