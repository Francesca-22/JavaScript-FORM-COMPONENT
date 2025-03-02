<?php

    // NOTE NEL CAPITOLO F DELLA DOCUMENTAZIONE

    require "./formComponent/php/formPHPScanData.php";

    $registerUsernameErrorMessage = NULL;
    $loginUsernameErrorMessage = NULL;
    $loginPasswordErrorMessage = NULL;

    $formPostData = $_POST;

    if (count($formPostData) !== 0) {
        $formPostDataSanitized = sanitizeFormPostData($formPostData);
        
        $formFilesData = $_FILES;
        if ($formPostDataSanitized['TIPOLOGIA_FORM'] === 'REGISTER') {

            // SE REGISTER FORM

            if (usernameAlreadyExist($formPostDataSanitized['_username']) === false) {
                // qui sotto '10' = 10MB - singolo file max size per la sicurezza
                // return array associativo percorsi file (es. key=nomeInput:0 se multiple oppure es. key=nomeInput)
                $files = sanitizeSaveFormFilesData($formFilesData, $formPostDataSanitized['_username'], '10');
                # saveUser($formPostDataSanitized);
                # header('Location: login.php');
            } else {
                // cancella i files salvati in fase di registrazione se errore come ad esempio username già presente nel database
                deleteFormFilesData($files);

                // server error punto 5A - username già presente nel database (register form) - formato: "messaggio;username"
                $registerUsernameErrorMessage = "Questo username è già in uso!".";".$formPostDataSanitized['_username'];
            }

        } elseif ($formPostDataSanitized['TIPOLOGIA_FORM'] === 'LOGIN') {

            // SE LOGIN FORM

            if (usernameAlreadyExist($formPostDataSanitized['_username_login']) === true) {

                // mettere la riga qui sotto solo se ci sono degli INPUT-FILE nella form di login
                // return array associativo percorsi file (es. key=nomeInput:0 se multiple oppure es. key=nomeInput)
                # $files = sanitizeSaveFormFilesData($formFilesData, $formPostDataSanitized['_username'], '10');

                if (isCorrectUsernamePassword($formPostDataSanitized['_username_login'],$formPostDataSanitized['_loginPassword']) === true) {
                    # header('Location: dashboard.php');
                } else {
                    // server error punto 5B - credenziali errate (login form) - formato: "messaggio"
                    $loginPasswordErrorMessage = "Username o password errati!";
                }
            } else {
                // server error punto 5AB - username inesistente nel database (login form) - formato: "messaggio;username"
                $loginUsernameErrorMessage = "Questo username non è presente nel database!".";".$formPostDataSanitized['_username_login'];
            }

        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <style>
        * { margin:0px; padding:0px; }
    </style>
    <script src="./formComponent/createFormComponent.js" type="module"></script>

    <!-- vedi documentazione in readme.md file -->

    <my-form form-id="register-form" form-class="form-row-small" submit-button-text="Registrati">
        <!-- input-hidden (utile per passare dati a php essendo graficamente invisibile all'utente) -->
        <input-hidden.register-form
            input-name="TIPOLOGIA_FORM"
            input-value="REGISTER"
        >
        </input-hidden.register-form>
        <!-- input-text | count-characters -->
        <input-text.register-form
            input-value="<?php if(isset($_POST['_nome'])) { echo $_POST['_nome']; }; ?>"
            field-order-number="0"
            label-text="Nome"
            input-width="50"
            input-name="_nome"
            input-text-type="words"
            inputmode="text"
            input-message="Non è un nome."
            required=""
        >
        </input-text.register-form>
        <input-text.register-form
            input-value="<?php if(isset($_POST['_cognome'])) { echo $_POST['_cognome']; }; ?>"
            field-order-number="1"
            label-text="Cognome"
            input-width="50"
            input-name="_cognome"
            input-text-type="words"
            inputmode="text"
            input-message="Non è un cognome."
        >
        </input-text.register-form>
        <input-text.register-form
            username-already-exists-server-error-message="<?= $registerUsernameErrorMessage; ?>"
            input-value="<?php if(isset($_POST['_username'])) { echo $_POST['_username']; }; ?>"
            field-order-number="2"
            label-text="Username"
            input-width="100"
            input-name="_username"
            input-text-type="username"
            inputmode="text"
            input-message="Solo lettere e numeri."
            required="Campo obbligatorio."
            count-characters="true"
            count-characters-position="right"
            count-characters-type-value="minmax,3-10"
        >
        </input-text.register-form>
        <!-- input-phone | select-prefix e/o count-characters -->
        <input-phone.register-form
            input-value="<?php if(isset($_POST['_telefono'])) { echo $_POST['_telefono']; }; ?>"
            field-order-number="3"
            label-text="Telefono"
            input-width="50"
            input-name="_telefono"
            input-text-type="tel"
            inputmode="numeric"
            input-message="Inserisci un numero di telefono valido."
            required="Campo obbligatorio."
            select-prefix="true"
            select-prefix-default-country-code="IT"
            prefix-list="CH,IT,SM,VA"
        >
        </input-phone.register-form>
        <input-phone.register-form
            input-value="<?php if(isset($_POST['_cellulare'])) { echo $_POST['_cellulare']; }; ?>"
            field-order-number="4"
            label-text="Cellulare"
            input-width="50"
            input-name="_cellulare"
            input-text-type="tel"
            inputmode="numeric"
            input-message="Inserisci un numero di cellulare valido."
            count-characters="true"
            count-characters-position="right"
            count-characters-type-value="max,10"
            select-prefix="true"
            select-prefix-default-country-code="IT"
            prefix-list="all"
            prefix-list-search="true"
        >
        </input-phone.register-form>
        <!-- input-text | count-characters -->
        <input-text.register-form
            input-value="<?php if(isset($_POST['_indirizzo'])) { echo $_POST['_indirizzo']; }; ?>"
            field-order-number="5"
            label-text="Indirizzo"
            input-width="70"
            input-name="_indirizzo"
            input-text-type="address"
            inputmode="text"
            input-message="Non è un indizizzo."
            required="Campo obbligatorio."
        >
        </input-text.register-form>
        <input-text.register-form
            input-value="<?php if(isset($_POST['_numeroCivico'])) { echo $_POST['_numeroCivico']; }; ?>"
            field-order-number="6"
            label-text="Numero civico"
            input-width="30"
            input-name="_numeroCivico"
            input-text-type="addressNumber"
            inputmode="text"
            input-message="Non è un numero civico."
            required="Campo obbligatorio."
        >
        </input-text.register-form>
        <!-- input-datalist | autocomplete-address (count-characters solo per campo cap se autocomplete) -->
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_comuneResidenza'])) { echo $_POST['_comuneResidenza']; }; ?>"
            field-order-number="7"
            label-text="Comune di residenza"
            input-width="60"
            input-name="_comuneResidenza"
            input-text-type="addressComune"
            inputmode="text"
            input-message="Non è un comune."
            required="Campo obbligatorio."

            datalist-json="json"
            datalist-json-php-file-name="comuni-italiani"
            datalist-type="suggestion"
            datalist-min-length-for-suggest="3"
            datalist-min-length-for-suggest-message="Scrivi almeno tre caratteri per i suggerimenti."
            datalist-value-not-present-in-list-message="Questo comune non è presente nel nostro database."

            datalist-autocomplete-address="comune"
            datalist-autocomplete-address-id="indirizzo-residenza"
        >
        </input-datalist.register-form>
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_cap'])) { echo $_POST['_cap']; }; ?>"
            field-order-number="8"
            label-text="Cap"
            input-width="40"
            input-name="_cap"
            input-text-type="addressCap"
            inputmode="text"
            input-message="Non è un cap."
            required="Campo obbligatorio."

            count-characters="true"
            count-characters-position="right"
            count-characters-type-value="minmax,5-5"

            datalist-only-autocomplete="true"

            datalist-json="json"
            datalist-type="suggestion"
            datalist-value-not-present-in-list-message="Questo cap non è nel nostro database per il comune inserito."

            datalist-autocomplete-address="cap"
            datalist-autocomplete-address-id="indirizzo-residenza"
        >
        </input-datalist.register-form>
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_provinciaResidenza'])) { echo $_POST['_provinciaResidenza']; }; ?>"
            field-order-number="9"
            label-text="Provincia di residenza"
            input-width="50"
            input-name="_provinciaResidenza"
            input-text-type=""
            inputmode="text"
            input-message="Non è una provincia italiana."
            required="Campo obbligatorio."

            datalist-json="json"
            datalist-json-php-file-name="province-italiane"
            datalist-type="select-option"
            datalist-value-not-present-in-list-message="Seleziona la sigla della tua provincia."

            datalist-autocomplete-address="provincia"
            datalist-autocomplete-address-id="indirizzo-residenza"
        >
        </input-datalist.register-form>
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_regioneResidenza'])) { echo $_POST['_regioneResidenza']; }; ?>"
            field-order-number="10"
            label-text="Regione di residenza"
            input-width="50"
            input-name="_regioneResidenza"
            input-text-type=""
            inputmode="text"
            input-message="Non è una regione italiana."
            required="Campo obbligatorio."

            datalist-json="json"
            datalist-json-php-file-name="regioni-italiane"
            datalist-type="select-option"
            datalist-value-not-present-in-list-message="Seleziona la tua regione."

            datalist-autocomplete-address="regione"
            datalist-autocomplete-address-id="indirizzo-residenza"
        >
        </input-datalist.register-form>
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_mesePreferito'])) { echo $_POST['_mesePreferito']; }; ?>"
            field-order-number="11"
            label-text="Mese preferito"
            input-width="50"
            input-name="_mesePreferito"
            input-text-type=""
            inputmode="text"
            input-message="Non è un mese."

            datalist-json="not-json"
            datalist-options-list="Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre"
            datalist-type="select-option"
            datalist-value-not-present-in-list-message="Seleziona un mese."
        >
        </input-datalist.register-form>
        <input-datalist.register-form
            input-value="<?php if(isset($_POST['_mezzoTrasportoPreferito'])) { echo $_POST['_mezzoTrasportoPreferito']; }; ?>"
            field-order-number="12"
            label-text="Mezzo di trasporto preferito"
            input-width="50"
            input-name="_mezzoTrasportoPreferito"
            input-text-type="wordsWithNumbers"
            inputmode="text"
            input-message="Non inserire numeri e caratteri speciali."
            required="Campo obbligatorio."

            datalist-json="not-json"
            datalist-options-list="Auto,Autobus,Treno,Aereo,Nave"
            datalist-type="suggestion"
            datalist-value-not-present-in-list-message="Nessun suggerimento."
        >
        </input-datalist.register-form>
        <!-- input-text per email | (per email non mettere count-characters) -->
        <input-text.register-form
            input-value="<?php if(isset($_POST['_email'])) { echo $_POST['_email']; }; ?>"
            field-order-number="13"
            label-text="Email"
            input-width="100"
            input-name="_email"
            input-text-type="email"
            inputmode="email"
            input-message="Email errata."
            required="Campo obbligatorio."
        >
        </input-text.register-form>
        <!-- input-password | password-visibility -->
        <input-password.register-form
            field-order-number="14"
            label-text="Password"
            input-width="50"
            input-name="_registerPassword"
            input-password-type="new-password"
            password-includes-special-characters="true"
            password-min-length="10"
            password-messages="Contiene caratteri non consentiti.;Deve contenere almeno una lettera minuscola e una maiuscola, un numero e un carattere speciale tra ? ! @ # ^ $ % & + = * . _ -;Minimo 10 caratteri.;Sicura."
            password-autocomplete="new-password"
            inputmode="text"
            required="Campo obbligatorio."
            password-toggle-visibility="true"
            password-visibility-position="left"
        >
        </input-password.register-form>
        <!-- input-password per confermare la password inserita al campo password precedente collegato | password-visibility -->
        <input-password.register-form
            field-order-number="15"
            label-text="Conferma password"
            input-width="50"
            input-name="_confermaPassword"
            input-password-type="confirm-password"
            confirm-password-for="_registerPassword"
            password-autocomplete="new-password"
            confirm-password-messages="Prima inserisci una password corretta.;Non corrisponde alla password inserita."
            inputmode="text"
            required="Campo obbligatorio."
            password-toggle-visibility="true"
            password-visibility-position="right"
        >
        </input-password.register-form>
        <!-- input-range -->
        <input-range.register-form
            input-value="<?php if(isset($_POST['_eta'])) { echo $_POST['_eta']; }; ?>"
            field-order-number="16"
            label-text="Età"
            input-width="100"
            input-name="_eta"
            input-message="Seleziona un età valida."

            input-range-type="numbers-range"

            range-min="0"
            range-max="100"
            range-default-value="18"
            range-valid-values="18:90;100"
        >
        </input-range.register-form>
        <!-- input-range DOUBLE-RANGE -->
        <input-range.register-form
            input-value="<?php if(isset($_POST['_priceRange'])) { echo $_POST['_priceRange']; }; ?>"
            field-order-number="16"
            label-text="Price Range"
            input-width="100"
            input-name="_priceRange"
            input-message="min 32 - max 95"

            input-range-type="numbers-double-range"

            range-min="-130"
            range-max="-20"
            double-range-min-step-between-min-max = "10"
            range-default-value="min:max"
            range-valid-values="min:max"
        >
        </input-range.register-form>
        <input-range.register-form
            input-value="<?php if(isset($_POST['_titoloDiStudio'])) { echo $_POST['_titoloDiStudio']; }; ?>"
            field-order-number="17"
            label-text="Titolo di studio"
            input-width="100"
            input-name="_titoloDiStudio"

            input-range-type="words-range"

            range-words-array="Nessuno;Licenza Elementare;Licenza Media;Qualifica Professionale;Diploma di maturità;Laurea"
            range-invalid-words-array=""
            range-default-word-array-position="0"
        >
        </input-range.register-form>
        <!-- input-color -->
        <input-color.register-form
            input-value="<?php if(isset($_POST['_colorePreferito'])) { echo $_POST['_colorePreferito']; }; ?>"
            field-order-number="18"
            label-text="Seleziona il tuo colore preferito"
            input-width="100"
            input-name="_colorePreferito"
            hex-color-selected-default="#ffffff"
        >
        </input-color.register-form>
        <!-- input-dt DATE (NO REQUIRED MESSAGE JS LO TOGLIE SE PRESENTE) -->
        <input-dt.register-form
            input-value="<?php if(isset($_POST['_dataNascita'])) { echo $_POST['_dataNascita']; }; ?>"
            field-order-number="19"
            label-text="Data di nascita"
            input-width="50"
            input-name="_dataNascita"
            required=""
            dt-type="date"
            dt-not-selected-value="Seleziona la tua data di nascita"
            dt-min-date="current;-,100,year"
            dt-max-date="current;-,18,year"
            dt-min-max-date-message="Devi avere almeno 18 anni e non più di 100"
        >
        </input-dt.register-form>
        <!-- input-dt DATE-TIME (NO REQUIRED MESSAGE JS LO TOGLIE SE PRESENTE) -->
        <input-dt.register-form
            input-value="<?php if(isset($_POST['_dataOraPerContattare'])) { echo $_POST['_dataOraPerContattare']; }; ?>"
            field-order-number="20"
            label-text="Che giorno e a che ora preferisci essere contattato?"
            input-width="50"
            input-name="_dataOraPerContattare"
            required=""
            dt-type="dateTime"
            dt-not-selected-value="Seleziona data e ora"
            dt-min-date="current;+,1,day"
            dt-max-date="current;+,1,month"
            dt-min-max-date-message="Disponibile da domani fino a 1 mese avanti"
            time-show-seconds="true"
            dt-min-time="09:30:00"
            dt-max-time="18:50:00"
            dt-min-max-time-message="I nostri uffici sono aperti dalle 9.30 alle 12.30 e dalle 16.00 alle 19.00"
            dt-middle-invalid-time="12:20:01-16:00:00"
        >
        </input-dt.register-form>
        <!-- input-dt TIME (NO REQUIRED MESSAGE JS LO TOGLIE SE PRESENTE) -->
        <input-dt.register-form
            input-value="<?php if(isset($_POST['_oraPausaPranzo'])) { echo $_POST['_oraPausaPranzo']; }; ?>"
            field-order-number="21"
            label-text="A che ora fai pausa pranzo?"
            input-width="50"
            input-name="_oraPausaPranzo"
            required=""
            dt-type="time"
            dt-not-selected-value="Seleziona un orario"
            time-show-seconds="false"
            dt-min-time="11:00"
            dt-max-time="15:30"
            dt-min-max-time-message="Seleziona un orari compreso tra le 11.00 e le 15.30"
            dt-middle-invalid-time=""
        >
        </input-dt.register-form>
        <!-- input-file -->
        <input-file.register-form
            field-order-number="22"
            label-text="Foto profilo"
            input-width="50"
            input-name="_foto_profilo"
            file-not-selected-value="Nessuna immagine selezionata"
            single-file-max-size-MB="none"
            file-accept-MIME-types="image/*"
            file-extension-error-message="Puoi allegare solo file di immagine."
            multiple-files="false"
        >
        </input-file.register-form>
        <!-- input-file - MULTIPLE -->
        <input-file.register-form
            field-order-number="23"
            label-text="Allega fronte e retro della tua carta d'identità"
            input-width="100"
            input-name="_carta_id"
            required="Campo obbligatorio."
            file-not-selected-value="Nessun file selezionato"
            single-file-max-size-MB="1.5"
            file-max-size-error-message="Ogni file deve avere una dimensione minore o pari a 1.5 MB."
            file-accept-MIME-types=""
            file-extension-error-message=""
            multiple-files="true"
            multiple-max-files=""
            multiple-max-files-error-message=""
            multiple-min-files="2"
            multiple-min-files-error-message="Devi allegare almeno 2 file."
        >
        </input-file.register-form>
        <!-- input radio checkbox - RADIO -->
        <input-radio-checkbox.register-form
            input-value="<?php if(isset($_POST['_genere'])) { echo $_POST['_genere']; }; ?>"
            field-order-number="24"
            label-text="Genere"
            input-width="40"
            input-name="_genere"
            required="Campo obbligatorio."
            rc-type="radio"
            rc-options="maschio;femmina (1) ;altro"
        >
        </input-radio-checkbox.register-form>
        <!-- input radio checkbox - CHECKBOX -->
        <input-radio-checkbox.register-form
            input-value="<?php if(isset($_POST['_mezziComunicazione'])) { echo implode(';', $_POST['_mezziComunicazione']); }; ?>"
            field-order-number="25"
            label-text="Mezzi di comunicazione preferiti"
            input-width="60"
            input-name="_mezziComunicazione"
            required="Campo obbligatorio."
            rc-type="checkbox"
            rc-options="telefono fisso;cellulare (10);whatsapp messenger;email(4);posta;#d75b5b"
            number-of-checkbox-required="2"
            number-of-checkbox-required-message="Cecca almendo due caselle."
        >
        </input-radio-checkbox.register-form>
        <!-- input switch -->
        <input-switch.register-form
            input-value="<?php if ($_POST !== array()) { if(isset($_POST['_terminiCondizioni'])) { echo $_POST['_terminiCondizioni']; } else { echo 'false'; } } else { echo 'false'; }; ?>"
            field-order-number="27"
            label-text="Termini e Condizioni"
            input-width="50"
            input-name="_terminiCondizioni"
            required="Campo obbligatorio."
            switch-text-inside-button="Accept;Not Accept"
            switch-read-document-icon="true"
            switch-read-document-name="./doc/example.pdf"
        >
        </input-switch.register-form>
        <input-switch.register-form
            input-value="<?php if ($_POST !== array()) { if(isset($_POST['_profilazione'])) { echo $_POST['_profilazione']; } else { echo 'false'; } } else { echo 'true'; }; ?>"
            field-order-number="28"
            label-text="Profilazione"
            input-width="50"
            input-name="_profilazione"
            switch-text-inside-button="Si;No"
            switch-text-outside="Sei libero di accettare o meno, se accetti dichiari il tuo consenso all'utilizzo dei tuoi dati ai fini publicitari e alla loro divilgazione a soggetti terzi i quali potranno utilizzare i medesimi dati ai fini della profilazione."
        >
        </input-switch.register-form>
        <!-- textarea | count-characters -->
        <input-textarea.register-form
            input-value="<?php if(isset($_POST['_bio'])) { echo $_POST['_bio']; }; ?>"
            field-order-number="26"
            label-text="Bio"
            input-width="50"
            input-name="_bio"
            required="Campo obbligatorio."
            textarea-rows="5"
            count-characters="true"
            count-characters-type-value="minmax,50-200"
        >
        </input-textarea.register-form>
    </my-form>

    <br />
    <br />
    <br />
    <br />
    <br />

    <my-form form-action="./login.php" form-id="login-form" form-class="form form-row-small" submit-button-text="Login">
        <!-- input-hidden (utile per passare dati a php essendo graficamente invisibile all'utente) -->
        <input-hidden.login-form
            input-name="TIPOLOGIA_FORM"
            input-value="LOGIN"
        >
        </input-hidden.login-form>
        <input-text.login-form
            username-already-exists-server-error-message="<?= $loginUsernameErrorMessage; ?>"
            input-value="<?php if(isset($_POST['_username_login'])) { echo $_POST['_username_login']; }; ?>"
            field-order-number="0"
            label-text="Username" 
            input-width="50" 
            input-name="_username_login" 
            input-text-type="username"
            inputmode="text"
            input-message="Username non valido."
            required="Campo obbligatorio."
        >
        </input-text.login-form>
        <input-password.login-form
            login-credentials-server-error-message="<?= $loginPasswordErrorMessage; ?>"
            field-order-number="1"
            label-text="Inserisci la tua password"
            input-width="50"
            input-name="_loginPassword"
            input-password-type="current-password"
            password-includes-special-characters="true"
            current-password-message="Contiene caratteri non consentiti."
            password-autocomplete="current-password"
            inputmode="text"
            required="Campo obbligatorio."
            password-toggle-visibility="true"
            password-visibility-position="right"
        >
        </input-password.login-form>
        <!-- input switch -->
        <input-switch.login-form
            input-value="<?php if ($_POST !== array()) { if(isset($_POST['_terminiCondizioniLogin'])) { echo $_POST['_terminiCondizioniLogin']; } else { echo 'false'; } } else { echo 'false'; }; ?>"
            field-order-number="2"
            label-text="Termini e Condizioni per il login"
            input-width="100"
            input-name="_terminiCondizioniLogin"
            required="Campo obbligatorio."
            switch-read-document-icon="true"
            switch-read-document-name="./doc/example.pdf"
        >
        </input-switch.login-form>
        <!-- input-antispam -->
        <input-antispam.login-form
            field-order-number="3"
            label-text="Antispam"
            input-width="30"
            input-name="_antispamLogin"
            input-text-type="antispam"
            inputmode="numeric"
            required="Campo obbligatorio."
            input-message="Solo numeri."
        >
        </input-antispam.login-form>
    </my-form>

</body>
</html>
