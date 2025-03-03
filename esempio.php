<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript FORM COMPONENT</title>
    <style>
        * { margin:0px; padding:0px; }
        body {
            background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
            padding: 50px;
        }
        section {
            max-width: 900px;
            margin: 0px auto;
            display: flex;
            flex-flow: column nowrap;
            gap: 50px 0px;
            align-items: center;
        }
        p.title {
            margin-bottom: -30px;
            padding: 0px 20px;
            font: 600 30px/32px "Courier New", monospace;
            color: #ffffff;
            text-align: center;
            max-width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        p.title::after {
            content: '';
            width: 300px;
            max-width: 100%;
            height: 3px;
            background-color: #ffffff;
            display: block;
            position: relative;
            margin: 20px auto 0px;
        }
        p.subtitle {
            font: 600 23px/25px "Courier New", monospace;
            margin-top: 80px;
            padding: 0px 20px;
            color: #252525;
            text-align: center;
            width: 80%;
            max-width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .form-container {
            width: 100%;
            border-radius: 20px;
            background-color: #ffffff;
            padding: 15px;
        }
    </style>
</head>
<body>
    <!-- documentazione in README.md -->

    <!-- importo il componente -->
    <script src="./formComponent/createFormComponent.js" type="module"></script>

    <p class="title">JavaScript Form Component</p>

    <section>
        <p class="subtitle">Esempio di form di registrazione</p>
        <div class="form-container">
            <my-form form-id="esempio-form-registrazione" form-class="form-row-small" submit-button-text="Registrati"> <!-- bottone personalizzato in formComponent/css/formComponent-customize.php -->
                <!-- input-hidden (invisibile all'utente) -->
                <input-hidden.esempio-form-registrazione
                    input-name="TIPOLOGIA_FORM"
                    input-value="REGISTRAZIONE"
                />
                <!-- input-text -->
                <input-text.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_nome'] ?? ''; ?>"
                    field-order-number="1"
                    label-text="Nome"
                    input-width="50"
                    input-name="registrazione_nome"
                    input-text-type="words"
                    inputmode="text"
                    input-message="Messaggio di formato invalido"
                    required="Messaggio di campo obbligatorio"
                />
                <!-- input-text -->
                <input-text.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_cognome'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Cognome"
                    input-width="50"
                    input-name="registrazione_cognome"
                    input-text-type="words"
                    inputmode="text"
                    input-message="Messaggio di formato invalido"
                    required=""
                />
                <!-- input-text con UTILITY count-characters per min e max - possibile uasere funzione aggiuntiva per gli errori server (documentazione: capitolo F) -->
                <input-text.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_username'] ?? ''; ?>"
                    field-order-number="2"
                    label-text="Username"
                    input-width="100"
                    input-name="registrazione_username"
                    input-text-type="username"
                    inputmode="text"
                    input-message="Solo lettere e numeri."
                    required="Messaggio di campo obbligatorio"
                    count-characters="true"
                    count-characters-position="right"
                    count-characters-type-value="minmax,3-10"
                />
                <!-- input-text per email (per email non occorre mettere count-characters) -->
                <input-text.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_email'] ?? ''; ?>"
                    field-order-number="3"
                    label-text="Email"
                    input-width="50"
                    input-name="registrazione_email"
                    input-text-type="email"
                    inputmode="email"
                    input-message="Email errata"
                    required="Messaggio di campo obbligatorio"
                />
                <!-- input-phone con UTILITY select-prefix con lista dei prefissi possibili -->
                <input-phone.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_cellulare'] ?? 'IT,+39,123456789'; ?>"
                    field-order-number="4"
                    label-text="Cellulare"
                    input-width="50"
                    input-name="registrazione_cellulare"
                    input-text-type="tel"
                    inputmode="numeric"
                    input-message="Inserisci un numero di cellulare valido"
                    required="Messaggio di campo obbligatorio"
                    select-prefix="true"
                    select-prefix-default-country-code="IT"
                    prefix-list="CH,IT,SM,VA"
                />
                <!-- textarea con UTILITY count-characters che conta solo i caratteri -->
                <input-textarea.esempio-form-registrazione
                    input-value="<?= $_POST['registrazione_bio'] ?? ''; ?>"
                    field-order-number="5"
                    label-text="Bio"
                    input-width="100"
                    input-name="registrazione_bio"
                    required="Messaggio di campo obbligatorio"
                    textarea-rows="3"
                    count-characters="true"
                    count-characters-type-value="only"
                />
                <!-- input-password con UTILITY password-visibility -->
                <input-password.esempio-form-registrazione
                    field-order-number="6"
                    label-text="Password"
                    input-width="50"
                    input-name="registrazione_password"
                    input-password-type="new-password"
                    password-includes-special-characters="true"
                    password-min-length="10"
                    password-messages="Contiene caratteri non consentiti;Deve contenere almeno una lettera minuscola e una maiuscola, un numero e un carattere speciale tra ? ! @ # ^ $ % & + = * . _ -;Minimo 10 caratteri;Sicura"
                    password-autocomplete="new-password"
                    inputmode="text"
                    required="Messaggio di campo obbligatorio"
                    password-toggle-visibility="true"
                    password-visibility-position="left"
                />
                <!-- input-password per confermare la password inserita al campo password precedente collegato | password-visibility -->
                <input-password.esempio-form-registrazione
                    field-order-number="7"
                    label-text="Conferma password"
                    input-width="50"
                    input-name="registrazione__conferma_password"
                    input-password-type="confirm-password"
                    confirm-password-for="registrazione_password"
                    password-autocomplete="new-password"
                    confirm-password-messages="Prima inserisci una password corretta;Non corrisponde alla password inserita"
                    inputmode="text"
                    required="Messaggio di campo obbligatorio"
                    password-toggle-visibility="true"
                    password-visibility-position="right"
                />
                <!-- input switch -->
                <input-switch.esempio-form-registrazione
                    input-value="<?= $_POST !== array() ? (isset($_POST['registrazione_privacy']) ? $_POST['registrazione_privacy'] : 'false') : 'false'; // quest'ultimo sarà il valore di default ?>"
                    field-order-number="9"
                    label-text="Privacy"
                    input-width="30"
                    input-name="registrazione_privacy"
                    required="Messaggio di campo obbligatorio"
                    switch-text-inside-button="Accetto;Non accetto"
                    switch-read-document-icon="true"
                    switch-read-document-name="./doc/example.pdf"
                >
                </input-switch.esempio-form-registrazione>
                <!-- input switch con note esterne -->
                <input-switch.esempio-form-registrazione
                    input-value="<?= $_POST !== array() ? (isset($_POST['registrazione_profilazione']) ? $_POST['registrazione_profilazione'] : 'false') : 'false'; // quest'ultimo sarà il valore di default ?>"
                    field-order-number="8"
                    label-text="Profilazione"
                    input-width="50"
                    input-name="registrazione_profilazione"
                    switch-text-inside-button="Si;No"
                    switch-text-outside="Consenso facoltativo. Se accetti dichiari il tuo consenso all'utilizzo dei tuoi dati ai fini della profilazione."
                >
                </input-switch.esempio-form-registrazione>
                <!-- input-antispam con img generata da PHP modificabile nei colori in formComponent/captcha/captcha.php -->
                <input-antispam.esempio-form-registrazione
                    field-order-number="10"
                    label-text="Antispam"
                    input-width="20"
                    input-name="registrazione_antispam"
                    input-text-type="antispam"
                    inputmode="numeric"
                    input-message="Solo numeri"
                    required="Messaggio di campo obbligatorio"
                />
            </my-form>
        </div>


        <p class="subtitle">Esempio di form di login</p>
        <div class="form-container">
            <my-form form-action="./login.php" form-id="esempio-form-login" form-class="form-row-small" submit-button-text="login"> <!-- bottone personalizzato in formComponent/css/formComponent-customize.php -->
                <input-hidden.esempio-form-login
                    input-name="TIPOLOGIA_FORM"
                    input-value="LOGIN"
                />
                <!-- possibile uasere funzione aggiuntiva per gli errori server (documentazione: capitolo F) -->
                <input-text.esempio-form-login
                    input-value="<?= $_POST['login_username'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Username"
                    input-width="50" 
                    input-name="login_username" 
                    input-text-type="username"
                    inputmode="text"
                    input-message="Username non valido"
                    required="Messaggio di campo obbligatorio"
                />
                <!-- possibile uasere funzione aggiuntiva per gli errori server (documentazione: capitolo F) -->
                <input-password.esempio-form-login
                    field-order-number="1"
                    label-text="Inserisci la tua password"
                    input-width="50"
                    input-name="login_password"
                    input-password-type="current-password"
                    password-includes-special-characters="true"
                    current-password-message="Contiene caratteri non consentiti"
                    password-autocomplete="current-password"
                    inputmode="text"
                    required="Messaggio di campo obbligatorio"
                    password-toggle-visibility="true"
                    password-visibility-position="right"
                />
            </my-form>
        </div>


        <p class="subtitle">Esempio di form di inserimento indirizzo con autocompletamento</p>
        <div class="form-container">
            <my-form form-id="esempio-form-aggiungi-indirizzo" form-class="form-row-small" submit-button-text=""> <!-- submit-button-text="" perchè il bottone diventa un'icona in formComponent/css/formComponent-customize.php -->
                <!-- input-text per indirizzo -->
                <input-text.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_indirizzo'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Indirizzo"
                    input-width="70"
                    input-name="aggiungiIndirizzo_indirizzo"
                    input-text-type="address"
                    inputmode="text"
                    input-message="Non è un indizizzo"
                    required="Messaggio di campo obbligatorio"
                />
                <!-- input-text per numero civico -->
                <input-text.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_numeroCivico'] ?? ''; ?>"
                    field-order-number="1"
                    label-text="Numero civico"
                    input-width="30"
                    input-name="aggiungiIndirizzo_numeroCivico"
                    input-text-type="addressNumber"
                    inputmode="text"
                    input-message="Non è un numero civico"
                    required="Messaggio di campo obbligatorio"
                />
                <!-- input-datalist con UTILITY autocomplete-address (count-characters solo per campo cap se autocomplete) -->
                <!-- comune -->
                <input-datalist.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_comuneResidenza'] ?? ''; ?>"
                    field-order-number="2"
                    label-text="Comune di residenza"
                    input-width="60"
                    input-name="aggiungiIndirizzo_comuneResidenza"
                    input-text-type="addressComune"
                    inputmode="text"
                    input-message="Non è un comune"
                    required="Messaggio di campo obbligatorio"

                    datalist-json="json"
                    datalist-json-php-file-name="comuni-italiani"
                    datalist-type="suggestion"
                    datalist-min-length-for-suggest="3"
                    datalist-min-length-for-suggest-message="Scrivi almeno tre caratteri per i suggerimenti"
                    datalist-value-not-present-in-list-message="Questo comune non è presente nel nostro database"

                    datalist-autocomplete-address="comune"
                    datalist-autocomplete-address-id="indirizzo-residenza"
                />
                <!-- cap -->
                <input-datalist.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_cap'] ?? ''; ?>"
                    field-order-number="3"
                    label-text="Cap"
                    input-width="40"
                    input-name="aggiungiIndirizzo_cap"
                    input-text-type="addressCap"
                    inputmode="text"
                    input-message="Non è un cap"
                    required="Messaggio di campo obbligatorio"

                    count-characters="true"
                    count-characters-position="right"
                    count-characters-type-value="minmax,5-5"

                    datalist-only-autocomplete="true"

                    datalist-json="json"
                    datalist-type="suggestion"
                    datalist-value-not-present-in-list-message="Questo cap non è nel nostro database per il comune inserito"

                    datalist-autocomplete-address="cap"
                    datalist-autocomplete-address-id="indirizzo-residenza"
                />
                <!-- provincia -->
                <input-datalist.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_provinciaResidenza'] ?? ''; ?>"
                    field-order-number="4"
                    label-text="Provincia di residenza"
                    input-width="30"
                    input-name="aggiungiIndirizzo_provinciaResidenza"
                    input-text-type=""
                    inputmode="text"
                    input-message="Non è una provincia italiana"
                    required="Messaggio di campo obbligatorio"

                    datalist-json="json"
                    datalist-json-php-file-name="province-italiane"
                    datalist-type="select-option"
                    datalist-value-not-present-in-list-message="Seleziona la sigla della tua provincia"

                    datalist-autocomplete-address="provincia"
                    datalist-autocomplete-address-id="indirizzo-residenza"
                />
                <!-- regione -->
                <input-datalist.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_regioneResidenza'] ?? ''; ?>"
                    field-order-number="5"
                    label-text="Regione di residenza"
                    input-width="40"
                    input-name="aggiungiIndirizzo_regioneResidenza"
                    input-text-type=""
                    inputmode="text"
                    input-message="Non è una regione italiana"
                    required="Messaggio di campo obbligatorio"

                    datalist-json="json"
                    datalist-json-php-file-name="regioni-italiane"
                    datalist-type="select-option"
                    datalist-value-not-present-in-list-message="Seleziona la tua regione"

                    datalist-autocomplete-address="regione"
                    datalist-autocomplete-address-id="indirizzo-residenza"
                />
                <!-- stato -->
                <input-datalist.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_statoResidenza'] ?? ''; ?>"
                    field-order-number="6"
                    label-text="Stato di residenza"
                    input-width="30"
                    input-name="aggiungiIndirizzo_statoResidenza"
                    input-text-type=""
                    inputmode="text"
                    input-message="Campo errato"
                    required="Messaggio di campo obbligatorio"

                    datalist-json="not-json"
                    datalist-type="select-option"
                    datalist-options-list="Italia"

                    datalist-autocomplete-address="stato"
                    datalist-autocomplete-address-id="indirizzo-residenza"
                />
                <!-- input-phone con 2 UTILITY count-characters e select-prefix (FACOLTATIVO non mettondo required) -->
                <input-phone.esempio-form-aggiungi-indirizzo
                    input-value="<?= $_POST['aggiungiIndirizzo_telefonoAbitazione'] ?? ''; ?>"
                    field-order-number="7"
                    label-text="Telefono abitazione"
                    input-width="100"
                    input-name="aggiungiIndirizzo_telefonoAbitazione"
                    input-text-type="tel"
                    inputmode="numeric"
                    input-message="Inserisci un numero di telefono valido"
                    count-characters="true"
                    count-characters-position="right"
                    count-characters-type-value="max,10"
                    select-prefix="true"
                    select-prefix-default-country-code="IT"
                    prefix-list="all"
                    prefix-list-search="true"
                />
            </my-form>
        </div>


        <p class="subtitle">Esempi di datalist e range</p>
        <div class="form-container">
            <my-form form-id="esempio-datalist-range" form-class="form-row-medium" submit-button-text="invia">
                <!-- esempio di datalist con opzione obbligatoria dalla lista (non da json) - campo facoltativo -->
                <input-datalist.esempio-datalist-range
                    input-value="<?= $_POST['datalistRange_mesePreferito'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Mese preferito"
                    input-width="50"
                    input-name="datalistRange_mesePreferito"
                    input-text-type=""
                    inputmode="text"
                    input-message="Non è un mese"

                    datalist-json="not-json"
                    datalist-options-list="Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre"
                    datalist-type="select-option"
                    datalist-value-not-present-in-list-message="Seleziona un mese"
                />
                <!-- esempio di datalist con suggerimenti dalla lista (non da json) -->
                <input-datalist.esempio-datalist-range
                    input-value="<?= $_POST['datalistRange__mezzoTrasportoPreferito'] ?? ''; ?>"
                    field-order-number="1"
                    label-text="Mezzo di trasporto preferito"
                    input-width="50"
                    input-name="datalistRange_mezzoTrasportoPreferito"
                    input-text-type="wordsWithNumbers"
                    inputmode="text"
                    input-message="Non inserire numeri e caratteri speciali"
                    required="Messaggio di campo obbligatorio"

                    datalist-json="not-json"
                    datalist-options-list="Auto,Autobus,Treno,Aereo,Nave"
                    datalist-type="suggestion"
                    datalist-value-not-present-in-list-message="Nessun suggerimento"
                />
                <!-- input-range -->
                <input-range.esempio-datalist-range
                    input-value="<?= $_POST['datalistRange_eta'] ?? ''; ?>"
                    field-order-number="2"
                    label-text="Età"
                    input-width="100"
                    input-name="datalistRange_eta"
                    input-message="Seleziona un età valida"

                    input-range-type="numbers-range"

                    range-min="0"
                    range-max="100"
                    range-default-value="18"
                    range-valid-values="18:90;100"
                />
                <!-- input-range DOPPIO -->
                <input-range.esempio-datalist-range
                    input-value="<?= $_POST['datalistRange_filtraPerPrezzo'] ?? ''; ?>"
                    field-order-number="3"
                    label-text="Filtra per prezzo"
                    input-width="100"
                    input-name="datalistRange_filtraPerPrezzo"
                    input-message="min 20 - max 1000"

                    input-range-type="numbers-double-range"

                    range-min="20"
                    range-max="1000"
                    double-range-min-step-between-min-max="10"
                    range-default-value="min:max"
                    range-valid-values="min:max"
                />
                <!-- input-range con PAROLE -->
                <input-range.esempio-datalist-range
                    input-value="<?php if(isset($_POST['datalistRange_titoloDiStudio'])) { echo $_POST['_titoloDiStudio']; }; ?>"
                    field-order-number="4"
                    label-text="Titolo di studio"
                    input-width="100"
                    input-name="datalistRange_titoloDiStudio"

                    input-range-type="words-range"

                    range-words-array="Nessuno;Licenza Elementare;Licenza Media;Qualifica Professionale;Diploma di maturità;Laurea"
                    range-invalid-words-array=""
                    range-default-word-array-position="0"
                />
            </my-form>
        </div>


        <p class="subtitle">Esempi di radio, checkbox e color</p>
        <div class="form-container">
            <my-form form-id="esempio-radio-checkbox-color" form-class="form-row-medium" submit-button-text="INVIA">            
                <!-- input radio checkbox - RADIO -->
                <input-radio-checkbox.esempio-radio-checkbox-color
                    input-value="<?= $_POST['radioCheckboxColor_genere'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Genere"
                    input-width="100"
                    input-name="radioCheckboxColor_genere"
                    required="Messaggio di campo obbligatorio"
                    rc-type="radio"
                    rc-options="maschio;femmina;altro"
                />
                <!-- input radio checkbox - CHECKBOX -->
                <input-radio-checkbox.esempio-radio-checkbox-color
                    input-value="<?= isset($_POST['radioCheckboxColor_mezziComunicazione']) ? implode(';', $_POST['radioCheckboxColor_mezziComunicazione']) : ''; ?>"
                    field-order-number="1"
                    label-text="Mezzi di comunicazione preferiti"
                    input-width="100"
                    input-name="radioCheckboxColor_mezziComunicazione"
                    required="Messaggio del campo obbligatorio"
                    rc-type="checkbox"
                    rc-options="telefono fisso;cellulare;whatsapp messenger;email;posta"
                    number-of-checkbox-required="2"
                    number-of-checkbox-required-message="Cecca almendo due caselle"
                />
                <!-- input radio checkbox - CHECKBOX esempio di filtro per colori con badge - campo facoltativo -->
                <input-radio-checkbox.esempio-radio-checkbox-color
                    input-value="<?= isset($_POST['radioCheckboxColor_filtraPerColore']) ? implode(';', $_POST['radioCheckboxColor_filtraPerColore']) : ''; ?>"
                    field-order-number="3"
                    label-text="Filtra per colore"
                    input-width="50"
                    input-name="radioCheckboxColor_filtraPerColore"
                    rc-type="checkbox"
                    rc-options="#d75b5b(2);#fae56a(1);#4088fe_#4020aa(19)"
                />
                <!-- input-color con COLOR PICKER con selezionato colore di default -->
                <input-color.esempio-radio-checkbox-color
                    input-value="<?= $_POST['radioCheckboxColor_colorePreferito'] ?? ''; ?>"
                    field-order-number="2"
                    label-text="Seleziona il tuo colore preferito"
                    input-width="50"
                    input-name="radioCheckboxColor_colorePreferito"
                    hex-color-selected-default="#6c1782"
                />
            </my-form>
        </div>


        <p class="subtitle">Esempi di datetime</p>
        <div class="form-container">
            <my-form form-id="esempio-datetime" form-class="form-row-medium" submit-button-text="Invia">    
                <!-- per tutti gli input-dt: non mettere REQUIRED MESSAGE, JavaScript LO TOGLIE SE PRESENTE -->        
                <!-- input-dt DATE -->
                <input-dt.esempio-datetime
                    input-value="<?= $_POST['datetime_dataNascita'] ?? ''; ?>"
                    field-order-number="0"
                    label-text="Data di nascita"
                    input-width="100"
                    input-name="datetime_dataNascita"
                    required=""
                    dt-type="date"
                    dt-not-selected-value="Seleziona la tua data di nascita"
                    dt-min-date="current;-,100,year"
                    dt-max-date="current;-,18,year"
                    dt-min-max-date-message="Devi avere almeno 18 anni e non più di 100"
                />
                <!-- input-dt DATE-TIME -->
                <input-dt.esempio-datetime
                    input-value="<?= $_POST['datetime_dataOraPerContattare'] ?? ''; ?>"
                    field-order-number="1"
                    label-text="Che giorno e a che ora preferisci essere contattato?"
                    input-width="50"
                    input-name="datetime_dataOraPerContattare"
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
                />
                <!-- input-dt TIME -->
                <input-dt.esempio-datetime
                    input-value="<?= $_POST['datetime_oraPausaPranzo'] ?? ''; ?>"
                    field-order-number="2"
                    label-text="A che ora fai pausa pranzo?"
                    input-width="50"
                    input-name="datetime_oraPausaPranzo"
                    required=""
                    dt-type="time"
                    dt-not-selected-value="Seleziona un orario"
                    time-show-seconds="false"
                    dt-min-time="11:00"
                    dt-max-time="15:30"
                    dt-min-max-time-message="Seleziona un orari compreso tra le 11.00 e le 15.30"
                    dt-middle-invalid-time=""
                />
            </my-form>
        </div>


        <p class="subtitle">Esempi di input file</p>
        <div class="form-container">
            <my-form form-id="esempio-file" form-class="form-row-medium" submit-button-text=""> <!-- submit-button-text="" perchè il bottone diventa un'icona in formComponent/css/formComponent-customize.php -->
                <!-- - possibile uasere funzione aggiuntiva per caricare i file (documentazione: capitolo F) -->
                <!-- input-file - campo facoltativo -->
                <input-file.esempio-file
                    field-order-number="0"
                    label-text="Foto profilo"
                    input-width="100"
                    input-name="file_fotoProfilo"
                    file-not-selected-value="Nessuna immagine selezionata"
                    single-file-max-size-MB="none"
                    file-accept-MIME-types="image/*"
                    file-extension-error-message="Puoi allegare solo file di immagine"
                    multiple-files="false"
                />
                <!-- input-file MULTIPLO -->
                <input-file.esempio-file
                    field-order-number="1"
                    label-text="Allega fronte e retro della tua carta d'identità"
                    input-width="100"
                    input-name="file_cartaId"
                    required=""
                    file-not-selected-value="Nessun file selezionato"
                    single-file-max-size-MB="2"
                    file-max-size-error-message="Ogni file deve avere una dimensione minore o pari a 2 MB"
                    file-accept-MIME-types="application/pdf,image/jpeg"
                    file-extension-error-message="Puoi allegare solo file di tipo PDF o JPEG"
                    multiple-files="true"
                    multiple-max-files="5"
                    multiple-max-files-error-message="Puoi allegare al massimo 5 file"
                    multiple-min-files="2"
                    multiple-min-files-error-message="Devi allegare almeno 2 file"
                />
            </my-form>
        </div>
    </section>

</body>
</html>
