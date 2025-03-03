<br>

# A. INSTALLAZIONE

<br>

### 1. COPIARE I FILE
Copiare la cartella **"formComponent"** e creare la cartella **"upload"** nella cartella del proprio sito in cui si trova in file.php (qui lo chiamo esempio.php) a cui si vuole aggiungere questo form, il file deve essere **.php**;

*N.B.: Si può poi usare anche in più file basta che si trovino accando a esempio.php*

Utilizzando XAMPP, per quanto riquarla la cartella **"upload"**, una volta creata, necessita di permessi per evitare futuri errori, quindi aprire il teminale e dare i comandi come segue:

```bash
# raggiungere la cartella upload
cd /percorso/fino/a/cartella/upload/

# dentro la cartella upload dare i seguenti comandi (chiede la password superutente)

# nella lista di chi ha i permessi cercare daemon
sudo ls -dl

# se daemon non c'è nella lista inserirlo come segue ( . sta per la cartella in cui ci si trova)
sudo chown -R daemon .

# verificare ora la presenza di daemon nella lista, poi chiudere il teminale
sudo ls -dl
```

<br>

### 2. CSS
In esempio.php non ci sono file.css da aggiungere, ma è possibile metterne quanti se ne vuole per la grafica globale della pagina;

- **PERSONALIZZAZIONE DEL FORM COMPONENT**

    In **formComponent/css/** trovo il file css vuoto **formComponent-customize.php**, quindi dagli strumenti di sviluppo del browser copio il selettore di ciò che voglio cambiare, lo incollo e scrivo le regole che desidero *(non occore usare !important perchè questo file viene inserito per ultimo nella creazione del componente)*.
    
    Puoi anche modificare i colori del componente nel file **formComponent-variables.php** in **formComponent/css/** facendo attenzione a non modificare i nomi delle variabili e a mantenere il corretto contrasto dei colori nella visualizzazione globale. Vale anche per i sottocomponenti: color picker e date time select. *(non è possibile modificare il font-material delle icone)*.

    <br>

    **I FILE CSS HANNO ESTENSIONE PHP (VENGONO CONVERTITI DA PHP IN CSS)**
    - È QUINDI POSSIBILE USARE VARIABILI PHP COME SI FA IN HTML E CAMBIARE ES. IL COLORE DEL FORM IN BASE ALL'URL O A QUALSIASI DATO PHP *(es. dark mode: salvo variabile $_SESSION['mode']='light' come default, se l'utente preme il bottone dark la variabile diventa ='dark'; quindi usandola nel file php che sarà css, ricaricando vedrò i colori del dark mode e non più del light mode di default; ricliccando il bottone viceversa ovviamente solo se ricarico la pagina da PHP)*.
    - Scrivere il codice css dopo la parte PHP di conversione *(già presente)*.

    **Se non si vuole usare PHP:**
    - cambiare l'estensione dei due file in .css e rimuovere dal contenuto di entrambi ogni pezzo di codice PHP;
    - aprire *formComponent/createFormComponent.js* e cambiare l'estensione dei due file in .css alla riga 30 o limitrofa e alla riga 49 o limitrofa;
    - ora si possono usare come comuni file CSS, ma non è più possibile diversificare la grafica del componente i base alla pagina del sito in cui ci si trova.

<br>

### 3. JS
In esempio.php mettere all'inzio del *tag body* (eventualmente dopo dei *tag style*) come di seguito:

```html
<!DOCTYPE html>
<html lang="en">
    <head></head>
    <body>
        <script src="./formComponent/createFormComponent.js" type="module"></script>
        <!-- ... code under here ... -->
    </body>
</html>
```

<br>

### 4. COSTRUIRE IL FORM E GLI INPUT + INPUT-VALUE IN PHP
Seguire i punti qui sotto: capitoli B (creazione form tag), C (creazione delle varie tipologie di input con utilità) e D (input value al reinvio del form dopo errore server in php)

<br>

# B. MY-FORM CUSTOM TAG

```html
<my-form form-id="" form-action="" form-class="" submit-button-text=""></my-form>
```

<br>

- ### REQUIRED ATTRIBUTES:

1. **form-id=""** nome univoco del form
    - esempio **"register-form"** senza spazi come da documentazione attributo *id*
2. **form-action=""** action del form, se non messo è pagina in cui ci si trova *(facoltativo)*
    - esempio **/signin**
3. **form-class="options"** 
    - **"form form-row-small"** input width 100% se schermo width <= 576px
    - **"form form-row-medium"** input width 100% se schermo width <= 768px

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
4. **submit-button-text=""** testo del submit button del form
    - esempio **"Registrati"**
    - N.B.: *se non lo metto non ci sarà il bottone per inviare il form e, senza scrivere ulteriori eventi javascript, il form sarà inviabile solo premendo INVIO su un input in focus*

<br>
<br>
<br>
<br>

# C. LISTA DEI CUSTOM TAG DENTRO MY-FORM

0. INPUT-HIDDEN utile per passare dati a php essendo graficamente invisibile all'utente
1. INPUT-TEXT per campi di testo *(option: count-characters)*
2. INPUT-PHONE per numeri di telefono *(options: count-characters e select-prefix)*
3. INPUT-DATALIST lista per campi di testo come suggerimento o selezione obbligatoria di un valore
4. INPUT-PASSWORD per inserire una password o per confermare la password creata
5. INPUT-RANGE è come un input tag con type="range" di numeri in sequenza o di parole/valori preimpostati selezionabili trascinando, cliccando col cursore o con le frecce (es. per selezionare l'età impostando *numbers-range* o il titolo di studio impostando *words-range*)
6. INPUT-COLOR per segliere un colore dal color picker che compare cliccandovi
7. INPUT-DT per selezionare la data oppure l'ora oppure entrambi
8. INPUT-FILE per allegare uno o più file del formato scelto al form
9. INPUT-RADIO-CHECKBOX caselle a scelta singola (radio) o a scelta multipla (checkbox)
10. INPUT-SWITCH bottone true-false usato ad esempio per accettare terimi e condizioni, profilazione, ecc.
11. INPUT-TEXTAREA area di testo anche con caratteri minimi e massimi *(options: count-characters)*
12. INPUT-ANTISPAM immagine captcha di somma random facile (es. 1 + 3 = e l'utente inserisce 4) *(input-antispam necessita di PHP vedi capitolo D punto 12)*

<br>

- ALL UTILITIES = COUNT-CHARACTERS, SELECT-PREFIX, AUTOCOMPLTE-ADDRESS e PASSWORD-VISIBILITY

<br>

```html
<my-form form-id="esempio" form-class="" submit-button-text="">
    <!-- 0. INPUT-HIDDEN --> <input-hidden.esempio />
    <!-- 1. INPUT-TEXT --> <input-text.esempio /> <!-- utility possibili: COUNT-CHARACTERS -->
    <!-- 2. INPUT-PHONE --> <input-phone.esempio /> <!-- utility possibili: COUNT-CHARACTERS, SELECT-PREFIX -->
    <!-- 3. INPUT-DATALIST --> <input-datalist.esempio /> <!-- utility possibili: AUTOCOMPLETE-ADDRESS -->
    <!-- 4. INPUT-PASSWORD --> <input-password.esempio /> <!-- utility possibili: PASSWORD-VISIBILITY -->
    <!-- 5. INPUT-RANGE --> <input-range.esempio />
    <!-- 6. INPUT-COLOR --> <input-color.esempio />
    <!-- 7. INPUT-DT (date e/o time) --> <input-dt.esempio />
    <!-- 8. INPUT-FILE --> <input-file.esempio />
    <!-- 9. INPUT-RADIO-CHECKBOX --> <input-radio-checkbox.esempio />
    <!-- 10. INPUT-SWITCH --> <input-switch.esempio />
    <!-- 11. INPUT-TEXTAREA --> <input-textarea.esempio /> <!-- utility possibili: COUNT-CHARACTERS -->
    <!-- 12. INPUT-ANTISPAM --> <input-antispam.esempio />
</my-form>
```

<br>

#### PER TUTTI I TIPI DI INPUT TRANNE HIDDEN È POSSIBILE METTE ATTRIBUTO **disabled** (senza niente) = disabilita il campo e non invia il campo a PHP all'invio del form

<br>
<br>
<br>

# D. PHP attribute INPUT-VALUE

<br>

    Valore di partenza presente quando l'utente invia il form con un campo invalido secondo il server e quindi ritorna sul form con i valori che aveva inserito prima di inviare

<br>

0. **input-value** è obbligatorio per tutti gli input/textarea (eccetto **INPUT-PASSWORD** e **INPUT-FILE** che non devono averlo) (per **INPUT-HIDDEN** invece fare riferimento al capitolo 0 punto 2)
    - N.B.: *input-name-value* sta per quanto scritto nell'attributo *input-name="_nome"* es. sarà *_nome*

    - **A.** solo per **INPUT-SWITCH** si mette:
        <br>

        ```php
        input-value="if ($_POST !== array()) { if(isset($_POST['terminiCondizioni'])) { echo $_POST['terminiCondizioni']; } else { echo 'false'; } } else { echo 'true'; };"
        // qui sopra, ad esempio, senza reinvio sarà 'true' (già ceccato)
        // cambiare 'true' o 'false' solo nell'ultimo else
        ```
        - NOTE: si può mettere *'true'* o *'false'* se si vuole o meno che la casella sia ceccata di default (senza reinvio form)

    - **B.** solo per **INPUT-RADIO-CHECKBOX** con **rc-type="checkbox"**:
        <br>

        ```php
        input-value="<?php if(isset($_POST['input-name-value'])) { echo implode(';', $_POST['input-name-value']); }; ?>"
        ```

    - **C.** per tutti gli altri (incuso *INPUT-TEXTAREA* e *INPUT-RADIO-CHECKBOX* con *rc-type="radio"*) si mette:
        <br>

        ```php
        input-value="<?php if(isset($_POST['input-name-value'])) { echo $_POST['input-name-value']; }; ?>"
        ```
    
<br>
<br>
<br>

> ## 0. INPUT-HIDDEN.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:
1. **input-name=""** *(mai due input-name uguali nello stesso form)*
    - esempio **"form-tipo"** per dire a php, quando l'utente invia la form, quale tipo di form ha inviato
2. **input-value=""**
    - esempio **"registrazione"** php sa che l'utente ha inviato la form di registrazione, ma potrebbe essere login, iscrizioneNewsletter, ecc.

<br>
<br>
<br>

> ## 1. INPUT-TEXT.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Inserisci il tuo nome"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_nomeUtente"**
5. **input-text-type="options"** definisce il pattern dell'*input type="text"*
    - **"username"** diventa pattern="`^[a-zA-Z0-9]*$`"
    - **"words"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$`"
    - **"wordsWithNumbers"** diventa pattern="`^[a-zA-ZÀ-ü0-9][a-zA-Z' À-ü0-9\\-]*$`"
    - **"address"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z'\\. À-ü\\-]*$`"
    - **"addressComune** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$`"
    - **"addressNumber"** diventa pattern="`^[0-9][0-9a-zA-Z\\-\\/]*$`"
    - **"addressCap"** diventa pattern="`^[0-9]*$`"
    - **"addressProvincia"** diventa pattern="`^[a-zA-Z]*$`"
    - **"addressRegione"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-\\/]*$`"
    - **"email"** diventa pattern="`^([a-z0-9]+(?:[\\._\\-][a-z0-9]+)*)@([a-z0-9]+(?:[\\.\\-][a-z0-9]+)*\\.[a-z]{2,6})$`"
    - *N.B.: i pattern hanno doppi escape* (`\\`) *perchè da javascript passano ad html per essere usati e quindi perdono il primo, ed è necessario che un escape resti; è possibile modificarli o aggiungerne nel file checkForm.js dalla riga 342 alla riga 378*
    - **"pattern"** quindi posso usare un pattern personalizzato mettendo:
        - **input-text-type-pattern="`^[a-zA-Z'\. À-ü\-,:0-9\|]*$`"** posso inserire qualsiasi pattern mi occorra
6. **inputmode="option"** come da documentazione attributo inputmode di input per la tastiera touch
    - esempio **"text"** ; **"email"**
7. **input-message=""** messaggio di errore per il campo
    - esempio **"Insersci un nome valido."**

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
8. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**

<br>
<br>

- ### OPTIONAL UTILITIES:
1. **COUNT-CHARACTERS** (vedi dettagli capitolo UTILITIES punto 1)

<br>
<br>
<br>

> ## 2. INPUT-PHONE.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Inserisci il tuo nome"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_nomeUtente"**
5. **input-text-type="tel"** definisce il pattern dell'*input type="text"* e diventa pattern="`^[0-9]*$`"
6. **inputmode="numeric"** come da documentazione attributo inputmode di input per la tastiera touch mette la sua versione numerica
7. **input-message=""** messaggio di errore per il campo
    - esempio **"Insersci un nome valido."**

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
8. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**

<br>
<br>

- ### OPTIONAL UTILITIES:
1. **COUNT-CHARACTERS** (vedi dettagli capitolo UTILITIES punto 1)
2. **SELECT-PREFIX** (vedi dettagli capitolo UTILITIES punto 2)

<br>
<br>
<br>

> ## 3. INPUT-DATALIST.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Inserisci il tuo nome"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_nomeUtente"**
5. **input-text-type="options"** definisce il pattern dell'*input type="text"*
    - **"username"** diventa pattern="`^[a-zA-Z0-9]*$`"
    - **"words"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$`"
    - **"wordsWithNumbers"** diventa pattern="`^[a-zA-ZÀ-ü0-9][a-zA-Z' À-ü0-9\\-]*$`"
    - **"address"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z'\\. À-ü\\-]*$`"
    - **"addressComune"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-]*$`"
    - **"addressNumber"** diventa pattern="`^[0-9][0-9a-zA-Z\\-\\/]*$`"
    - **"addressCap"** diventa pattern="`^[0-9]*$`"
    - **"addressProvincia"** diventa pattern="`^[a-zA-Z]*$`"
    - **"addressRegione"** diventa pattern="`^[a-zA-ZÀ-ü][a-zA-Z' À-ü\\-\\/]*$`"
    - **"email"** diventa pattern="`^([a-z0-9]+(?:[\\._\\-][a-z0-9]+)*)@([a-z0-9]+(?:[\\.\\-][a-z0-9]+)*\\.[a-z]{2,6})$`"
    - *N.B.: i pattern hanno doppi escape* (`\\`) *perchè da javascript passano ad html per essere usati e quindi perdono il primo, ed è necessario che un escape resti; è possibile modificarli o aggiungerne nel file checkForm.js dalla riga 342 alla riga 378*
    - **"pattern"** quindi posso usare un pattern personalizzato mettendo:
        - **input-text-type-pattern="`^[a-zA-Z'\. À-ü\-,:0-9\|]*$`"** posso inserire qualsiasi pattern mi occorra

        <br>

            N.B. mettere "" stringa vuota se datalist-type="select-option" invece se datalist-type="suggestion" scegliere una delle opzioni di input-text-type, qui sopra

        <br>

<br>

6. **inputmode="text"** come da documentazione attributo inputmode di input per la tastiera touch mette quella classica
7. **input-message=""** messaggio di errore per il campo
    - esempio **"Insersci un nome valido."**

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
8. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**

<br>
<br>

- ### DATALIST REQUIRED ATTRIBUTES:

9. **datalist-json="options"**
    - **"json"** prende la lista da un file .json
    - **"not-json"** prende la lista da *datalist-options-list="option,option,option" (segue documentazione paragrafo not-json punto 12)*
10. **datalist-type="options"**
    - **"suggestion"** suggerisce una lista di valori filtrati in base ai caratteri inseriti dall'utente nel campo di input
    - **"select-option"** costringe l'utente a cliccare su uno dei valori della lista sempre filtrandoli come per i suggerimenti
11. **datalist-value-not-present-in-list-message="message"** inserire il messaggio che appare se l'input utente non ha risultati nella lista che sia in json o in *datalist-options-list="option,option,option"* (not-json)
    - esempio **"Non presente nel database."** se *datalist-type="suggestion"*
    - esempio **"Seleziona un'opzione."** se *datalist-type="select-option"*

<br>
<br>

- ### SE datalist-json="**json**" REQUIRED ATTRIBUTES:

12. **datalist-json-php-file-name="nomeFilePHP"** è il nome del file php senza l'esetensione .php, che si deve trovare nella cartella jsonData/inputDtalist/nomeFilePHP.php

<br>

- ### SOLO SE datalist-json="**json**" e datalist-type="**suggestion**" REQUIRED ATTRIBUTES:
13. **datalist-min-length-for-suggest=""** numero minimo di caratteri inseriti dall'utente nel campo input per mostrare i suggerimenti, può essere anche *"0"*
    - esempio **"3"**
14. **datalist-min-length-for-suggest-message="message"** messaggio per l'utente che se inserisce il minimo dei caratteri settato in *datalist-min-length-for-suggest="3"* compaiono i suggerimenti
    - esempio **"Scrivi almeno tre caratteri per i suggerimenti."**
    - se *datalist-min-length-for-suggest="0"* deve essere stringa vuota, quindi *datalist-min-length-for-suggest-message=""*

    <br>

        N.B. se messa utility AUTOCOMPLETE-ADDRESS, per campo CAP con datalist-only-autocomplete="true", non mettere il punto 13 e 14 qui sopra (vedi dettagli capitolo UTILITIES punto 3 paragrafo CAP)

    <br>

<br>

- ### SE datalist-json="**not-json**" REQUIRED ATTRIBUTES:
12. **datalist-options-list="opzione,opzione,opzione"** separate da virgola e senza spazi prima e dopo la virgola, saranno il testo delle opzioni clicabili nella lista
    - esempio "Auto,Autobus,Treno,Aereo,Nave,A piedi"

    <br>

        N.B. se datalist-json="not-json" e datalist-type="suggestion" NON METTERE datalist-min-length-for-suggest="n", altrimenti usare json

    <br>

<br>

- ### OPTIONAL UTILITIES:
1. **AUTOCOMPLETE-ADDRESS** (vedi dettagli capitolo UTILITIES punto 3)

<br>
<br>
<br>

> ## 4. INPUT-PASSWORD.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Inserisci il tuo nome"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_nomeUtente"**
5. **inputmode="text"** come da documentazione attributo inputmode di input per la tastiera touch

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
6. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**

<br>
<br>

- ### PASSWORD REQUIRED ATTRIBUTES:
7. **input-autocomplte="options"** come da documentazione *attributo autocomplete di input*
    - esempio **"new-password"** se per creazione di nuova passord o sua conferma
    - esempio **"current-password"** per campo password in login form
8. **input-password-type="options"**
    - **"new-password"** per un campo di inserimento password che sia nuova (in fase di registrazione)
    - **"confirm-password"** campo di conferma della password inserita in un altro campo input con *input-password-type="new-password"* (poi da collegare come segue)
    - **"current-password"** campo per inserire una password già registrata *(es. quella di login)*
    
    <br>

        N.B. un input-password con input-password-type="confirm-password" non può esistere senza un input-password con input-password-type="new-password" collegato; quest'ultimo invece può esistere anche senza un campo di conferma della password

<br>
<br>

- ### SE input-password-type="**new-password**" REQUIRED ATTRIBUTES:
8. **password-includes-special-characters="options"** se si vuole o meno consentire all'utente di inserire caratteri speciali nella password
    - **"true"** caratteri speciali consenti e richiesto almeno uno
    - **"false"** caratteri spleciali non consetiti quindi non richiesti
    - **"optional"** caratteri speciali consentiti liberamente all'utente ma non richiesti obbligatoriamente
9. **password-min-length=""** numero per indicare la minima lunghezza richiesta all'utente per la password *(andrà nel pattern)*
    - esempio **"8"** la lunghezza minima sarà 8 caratteri
10. **password-message="message1;message2;message3;message4"** separati da ***;*** e sanza spazi prima e dopo il punto e virgola *(scriverli in base a cosa inserito nelle opzioni precedenti sui caratteri speciai e sulla lunghezza minima)*
    - **message1** = messaggio se contiene caratteri non consentiti *(es. Contiene caratteri non consentiti.)*
    - **message2** = messaggio su cosa deve contenere ma non sulla lunghezza *(es. Deve contenere almeno una lettera minuscola e una maiuscola, un numero e un carattere speciale tra ? ! @ # ^ $ % & + = * . _ -)*. Mai ***;*** tra i caratteri speciali
    - **message3** = caratteri minimi, è sempre impostato in *password-min-length="8"* *(es. Minimo 8 caratteri.)*
    - **message4** = messaggio di correttezza *(es. Sicura!)*
    - quindi esempio *password-message="Contiene caratteri non consentiti.;Deve contenere almeno una lettera minuscola e una maiuscola, un numero e un carattere speciale tra ? ! @ # ^ $ % & + = * . _ -;Minimo 8 caratteri.;Sicura!"*

<br>

- ### SE input-password-type="**confirm-password**" REQUIRED ATTRIBUTES:
8. **confirm-password-for=""** mettere il valore dell'attributo del input-password che vi si vuole collegare per la conferma della password ovvero il suo *input-name* (l'input-password collegato deve avere *input-password-type="new-password"*) e devono essere nello stesso form.
9. **confirm-password-messages="messageA;messageB"** separati da ***;*** e sanza spazi prima e dopo il punto e virgola
    - **messageA** = messaggio che nel campo password collegato non è ancora stata inserita una password valida o è ancora vuoto *(es. Prima inserisci una password corretta.)*
    - **messageB** = messaggio di non corrispondenza alla password inserita nel campo password collegato *(es. Non corrisponde alla password inserita.")*
    - quindi esempio *confirm-password-messages="Prima inserisci una password corretta.;Non corrisponde alla password inserita."*

<br>

- ### SE input-password-type="**current-password**" REQUIRED ATTRIBUTES:
8. **password-includes-special-characters="options"** se si vuole o meno consentire all'utente di inserire caratteri speciali nel campo password in base a quella di registrazione già presente nel database (se input-password-type="new-password" nella form di registrazione ha password-includes-special-characters="false|optional" mettere "false", altrimenti mettere "true")
    - **"true"** caratteri speciali consenti
    - **"false"** caratteri spleciali non consetiti
9. **current-password-message="message"** un solo messagio visibile se l'utente inserisce caratteri non consentiti ovvero quelli non consentiti per la creazione della password in fase di registrazione (*input-password-type="new-password"*) poi salvata nel database da utilizzare per il login
    - **message** = messaggio se la password inserita contiene caratteri non consenti e saranno caratteri non consenti anche i caratteri speciali se *password-includes-special-characters"false"* *(es. Contiene caratteri non consentiti.)*

<br>
<br>

- ### OPTIONAL UTILITIES:
1. **PASSWORD-VISIBILITY** (vedi dettagli capitolo UTILITIES punto 4)

<br>
<br>
<br>

> ## 5. INPUT-RANGE.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Seleziona la tua età"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_etaUtente"**

<br>
<br>

- ### RANGE REQUIRED ATTRIBUTES:
5. **input-range-type="options"** tipo di range se con numeri o parole
    - **"numbers-range"** range di numeri in sequenza *(es. da range-min="0" a range-max="100", sulla linea di range ci saranno tutti i numeri tra loro compresi)*
    - **"words-range"** range di valori preimpostati in array in cui l'utente sceglie una parola oppure un numero specifico, una data che visualizza selezionando la tacca corrispondente

<br>
<br>

- ### SE input-range-type="**numbers-range**" REQUIRED ATTRIBUTES:
6. **range-min=""** primo numero sulla linea di range (anche numero negativo, sempre intero) *(se negativo anche max ricordarsi che -20 è maggiore di -120)*
    - esempio **"0"** (deve essere sempre minore di *range-max=""*)
7. **range-max=""** ultimo numero della linea di range (anche numero negativo, sempre intero) *(se negativo anche min ricordarsi che -120 è minore di -20)*
    - esempio **"100"** (deve essere sempre maggiore di *range-min=""*)
8. **range-default-value=""** numero presente sulla linea di range già selezionato (deve essere sempre compreso tra *range-min=""* e *range-max=""* o essere uno di loro)
    - option **"min"** default è *range-min*
    - option **"max"** default è *range-max*
    - esempio **"50"** (deve esistere sulla linea di range)
9. **range-valid-values=""** numeri presenti sulla linea di range validi per inviare il form, mettere sempre in ordine crescente *(i numeri non compresi sono invalidi)*
    - option **"min:max"** inserisce automaticamente numero minimo e massimo del range, tutti i numeri tra min e max compresi min e max sono validi (qualsiasi numero selezionato del range è sempre valido) (si può quindi mettere *stringa vuota* in *input-message=""*)
    - esempio **"10:55"** sono validi tutti i numeri compresi tra 10 e 55 (non devono essere obbligatoriamente il minimo e il massimo del range, ma il primo deve sempre essere minore del secondo)
    - esempio **"88:90"** sono validi solo il numero 88 e il numero 90 (sono invalidi quelli tra loro compresi)
    - esempio **"10:40;77;95:100"** sono validi i numeri compresi tra 10 e 40, il numero 77 e i numeri compresi tra 95 e 100
10. **input-message="message"** messaggio di errore per il campo se l'utente seleziona uno dei valori non compresi tra quelli validi dichiarati in *range-valid-values=""*
    - esempio **"Devi avere almeno 10 anni per registrati."** se *range-valid-values="10-100"* *(con range-min="0" e range-max="100")*

<br>

- ### SE input-range-type="**words-range**" REQUIRED ATTRIBUTES:
6. **range-words-array="word;word;word"** valori preimpostati separati da **;** che possono contenere spazi e accenti ed essere anche date o numeri che non potrebbe rientrare nel caso di *input-range-type="numbers-range"*
    - esempio **"Nessuno;Licenza Elementare;Licenza Media;Qualifica Professionale;Diploma di maturità;Laurea"**
7. **range-invalid-words-array="word;word"** valori preimpostati presenti nell'elenco di *range-words-array="word;word;word"* (ci sono sulla linea di range) ma non sono validi per il form (es. al fine della registrazione)
    - esempio **"Nessuno;Laurea"** (se l'utente si seleziona il campo da errore)
    - **""** mettere ma lasciare stringa vuota se tutti i valori preimpostati sono validi (non ci sono valori invalidi)
8. **range-default-word-array-position=""** posizione nell'array *range-words-array="word;word;word"* del valore preimpostato per il range
    - esempio **"2"** = **"Diploma"** se range-words-array="[0]Nessuno;[1]Licenza;[2]Diploma"

<br>

- ### SE <u>DOUBLE RANGE</u> input-range-type="**numbers-double-range**" REQUIRED ATTRIBUTES:
6. **range-min=""** primo numero sulla linea di range (anche numero negativo, sempre intero) *(se negativo anche max ricordarsi che -20 è maggiore di -120)*
    - esempio **"0"** (deve essere sempre minore di *range-max=""*)
7. **range-max=""** ultimo numero della linea di range (anche numero negativo, sempre intero) *(se negativo anche min ricordarsi che -120 è minore di -20)*
    - esempio **"100"** (deve essere sempre maggiore di *range-min=""*)
8. **range-default-value=""** numeri presente sulla linea di range (deve essere sempre compreso tra *range-min=""* e *range-max=""* o essere uno di loro)
    - option **"min:max"** min default è *range-min* e max default è *range-max*
    - esempio **"50:80"** (devono esistere sulla linea di range)
9. **range-valid-values=""** numeri presenti sulla linea di range validi per inviare il form, mettere sempre in ordine crescente *(i numeri non compresi sono invalidi)* **(per double solo un range di numeri validi separati da *:*)**
    - option **"min:max"** inserisce automaticamente numero minimo e massimo del range, tutti i numeri tra min e max compresi min e max sono validi (qualsiasi numero selezionato del range è sempre valido) (si può quindi mettere *stringa vuota* in *input-message=""*)
    - esempio **"10:55"** sono validi tutti i numeri compresi tra 10 e 55 (non devono essere obbligatoriamente il minimo e il massimo del range, ma il primo deve sempre essere minore del secondo)
    - esempio **"88:90"** sono validi solo il numero 88 e il numero 90 (sono invalidi quelli tra loro compresi)
10. **input-message="message"** messaggio di errore per il campo se l'utente seleziona uno dei valori non compresi tra quelli validi dichiarati in *range-valid-values=""*
    - esempio **"Min 10, max 30."** se *range-valid-values="10-30"* *es. (con range-min="5" e range-max="80")*
11. **double-range-min-step-between-min-max="int"** (numero intero) indica quanti numeri ci devono sempre essere tra il min selezionato e il max selezionato sul range
    - esempio **"5"** ci saranno 5 numeri tra il min e li max selezionati dall'utente *(es. seleziona 10 come min e non potrà selezionare meno di 15 come max)*

<br>
<br>
<br>

> ## 6. INPUT-COLOR.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C (se non c'è reinvio form il colore sarà quello scelto in *hex-color-selected-default="HEXcolor"*)
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Seleziona il tuo colore preferito"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_coloreUtente"**
5. **hex-color-selected-default=""** colore già selezionato in partenza e usato se non vi è una value fornita dal server *(quindi se value="")*
    - esempio **"#ffffff"** formato HEX senza opacità *(rispettando il pattern `^#[a-fA-F0-9]{6}$`)*

<br>
<br>
<br>

> ## 7. INPUT-DT.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Data di nascita"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_dataNascita"**
5. **dt-type="options"** per scegliere la tipologia del dt-picker
    - **date** mette solo il calendario
    - **time** mette solo il renge per scegliere ora, minuti e opzionale secondi
    - **dateTime** mette entrambi uniti (secondi sempre opzionale)

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
6. **required=""** mette il campo obbligatorio, come value non inserire niente
    - esempio **required=""** mettere **sempre** *stringa vuota*

<br>
<br>

- ### SE dt-type="**date**" o dt-type="**dateTime**" REQUIRED ATTRIBUTES:
7. **dt-not-selected-value="message"** messaggio che si vede prima che sia selezionata una data nel box value
    - esempio *(se dt-type="date")* **dt-not-selected-value="Nessuna data selezionata"**
    - esempio *(se dt-type="dateTime")* **dt-not-selected-value="Nessuna data e ora selezionate"**
8. **dt-min-date="options"** minima data selezionabile sul calendario sempre minore della massima se presente
    - **""** nessuna
    - **"current"** ovvero la data odierna
    - **"01-01-2000"** una data a selta sempre nel formato *gg-mm-aaaa*
    - **"current;segno,numero,soggetto"** quindi la data odierna **current** meno o più un certo numero di **soggetto day** (giorni) o **soggetto month** (mesi) o **soggetto year** (anni); *(esempio: "current;+,10,day" = la data di oggi più dieci giorni)*; Dopo **current** sempre **;** poi **segno** poi **,** poi **numero** poi **,** poi **soggetto** e fine
9. **dt-max-date="options"** massima data selezionabile sul calendario sempre maggiore della minima se presente
    - **""** nessuna
    - **"current"** ovvero la data odierna
    - **"01-01-2000"** una data a selta sempre nel formato *gg-mm-aaaa*
    - **"current;segno,numero,soggetto"** quindi la data odierna **current** meno o più un certo numero di **soggetto day** (giorni) o **soggetto month** (mesi) o **soggetto year** (anni); *(esempio: "current;-,1,month" = la data di oggi meno un mese)*; Dopo **current** sempre **;** poi **segno** poi **,** poi **numero** poi **,** poi **soggetto** e fine
10. **dt-min-max-date-message="message"** messaggio visibile all'interno del box calendario, scritto in base alle date minima e massima
    - esempio **"Devi avere almeno 18 anni e non più di 100"** con *dt-min-date="current;-,100,year"* e con *dt-max-date="current;-,18,year"*

<br>
<br>

- ### SE dt-type="**time**" o dt-type="**dateTime**" REQUIRED ATTRIBUTES:
7. **dt-not-selected-value="message"** messaggio che si vede prima che sia selezionato un orario nel box value
    - esempio *(se dt-type="time")* **dt-not-selected-value="Nessun orario selezionato"**
    - esempio *(se dt-type="dateTime")* **dt-not-selected-value="Nessuna data e ora selezionate"**
8. **time-show-seconds="options"** impostare se l'utente può scegliere o meno i secondi
    - **"true"** l'utente può scegliere i secondi (value formato = HH:MM:SS)
    - **"false"** l'utente non sceglie i secondi che non saranno quindi presenti nella value (value formato = HH:MM)
9. **dt-min-time="HH:MM:SS || HH:MM"** a seconda del formato scelto in *time-show-seconds=""* mettere o meno i secondi; Sarà il minimo orario valido (sempre minore di quello massimo se presente); *HH max 23 min 00, MM max 59 min 00, SS max 59 min 00*
    - **""** nessuno = 00:00:00 || 00:00
    - **"10:05:20"** con i secondi
    - **"08:30"** senza i secondi
10. **dt-max-time="HH:MM:SS || HH:MM"** a seconda del formato scelto in *time-show-seconds=""* mettere o meno i secondi; Sarà il massimo orario valido (sempre maggiore di quello minimo se presente); *HH max 23 min 00, MM max 59 min 00, SS max 59 min 00*
    - **""** nessuno = 23:59:59 || 23:59
    - **"20:55:59"** con i secondi
    - **"20:40"** senza i secondi
11. **dt-min-max-time-message="message"** messaggio visibile all'interno del box time, scritto in base all'orario minimo e massimo
    - esempio **"Seleziona un orari compreso tra le 11.00 e le 15.30"** con *dt-min-time="11:00"* e con *dt-max-time="15:30"*
12. **dt-middle-invalid-time="HH:MM:SS-HH:MM:SS || HH:MM-HH:MM"** fascia oraria invalida *(inzio-fine)* separata da **-** e compresa tra *dt-min-time* e *dt-max-time* (*inizio* maggiore del minimo e *fine* minore del massimo)
    - **""** nessuno = tutti gli oarari compresi tra *dt-min-time* e *dt-max-time* sono validi
    - **"12:20:01-16:00:20"** con i secondi a seconda del formato scelto in *time-show-seconds=""*
    - **"12:20-16:00"** senza i secondi a seconda del formato scelto in *time-show-seconds=""*
    - esempio **dt-middle-invalid-time="12:20-16:00"** con *dt-min-time="09:30" e *dt-max-time="18:50"*; Con messaggio *dt-min-max-time-message="I nostri uffici sono aperti dalle 9.30 alle 12.30 e dalle 16.00 alle 19.00"*; In questo caso l'utente può selezionare l'orario in cui essere contattato secondo gli orari degli uffici *(se togliamo 10 minuti all'orario inziale della fascia di mezzo invalida e sempre 10 miniuti a dt-max-time si ottiene il tempo della telefonata all'utente)*; Più corretto impostando **dt-type="dateTime"** quindi (con data e ora) mettendo come minima data il giorno successivo si evita che l'utente selezioni un orario già passato nella gioranata odierna, assicurandogli così di essere contattato

<br>
<br>
<br>

> ## 8. INPUT-FILE.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Data di nascita"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_fotoProfilo"**
    - *N.B.: solo per INPUT-FILE, l'attributo input-name non deve contenere **:** perchè sarà poi utilizzato nel rinominare il file allegato con php per salvarlo nella cartella (il nome del file per php sarà composto da **inputName:numeroFileNellaCartellaDiDestionazione.estensione**). È meglio non usare i **:** nel inputName per evitare che usando un metodo per capire il numero del file si crei conflitto.*
5. **file-not-selected-value="message"** messaggio nel box value se non ci sono files allegati
    - esempio **"Nessun file selezionato"**
6. **single-file-max-size-MB="options"** massima dimensione per ogni singolo file (se due file allegabili, la massima dimensione totale degli allegati sarà la massima per due file)
    - **N.B.: prima verificare la dimensione massima accetta da PHP o modificarla (vedi capitolo A punto 4)**
    - **"none"** qualsiasi dimensione, non c'è una massima dimensione anche se vale quella massima di sicurezza 10MB impostata in php e modificabile (vedi capitolo A punto 4)
    - **"integer"** esempio **"1"** la massima dimensione sarà 1 MB
    - **decimalNumber** esempio **"2.5"** con rotti usare il **.**, sarà 2.5 MB
    - *NOTA: se multiple-files="true", single-file-max-size-MB="integer || decimalNumber" si riferisce a un singolo file quindi ogni file può avere massimo quella dimensione, non si riferisce alla dimensione totale dell'insieme dei files*
7. **file-accept-MIME-types="validMIMEtype,validMIMEtype"** estensioni accettate in MIME types (anche più di uno separati da virgola senza spazi)
    - esempio **""** valido qualisiasi file
    - esempio **"image/jpeg,application/pdf"** con due MIME types, accetta solo files .jpeg o .jpg e .pdf
    - MIME type generici esempio **"image/*"** con un solo MIME type accetta ogni estensione di file immagine com .jpg, .jpeg, .png, .bmb, ecc.
    - lista MIME types generici: application/* - audio/* - font/* - example/* - image/* - message/* - model/* - multipart/* - text/* - video/* (mettendoli tutti separati da virgola e senza spazi, saranno accettati tutti i file)
    - lista MIME types su https://www.iana.org/assignments/media-types/media-types.xhtml#application
    - *NOTA: mettere un filtro dell'estenzione file anche sul server con PHP per sicurezza essendo facile evadere accept e quindi poter allegare file pericolosi come .exe, ecc.*
8. **file-extension-error-message="message"** visibile se l'utente tenta di allegare un file con estenzione diversa da quella o quelle accettate
    - se *file-accept-MIME-types="" (è stringa vuota)*, mettere ad esempio **"Puoi allegare files con qualisiasi estensione."**
    - se *file-accept-MIME-types="validMIMEtype"*, mettere ad esempio **"Allega solo file .pdf o file di immagine."**
    - **""** lasciare stringa vuota se non si vuole mettere un messaggio (possibile in entrambi i casi)
9. **multiple-files="options"** si può allegare un solo file o più files
    - **"true"** l'utente può allegare più files
    - **"false"** l'utente può allegare un solo file

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
10. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**
    - esempio **required=""**

<br>
<br>

- ### SE single-file-max-size-MB="**integer || decimalNumber**" **!== "none"** REQUIRED ATTRIBUTES:
11. **file-max-size-error-message="message"** visibile se l'utente tenta di allegare un file più grande
    - esempio **"Non puoi allegare un file più grande di 2.5 MB."**
    - **""** lasciare stringa vuota se non si vuole mettere un messaggio
    *N.B.: se single-file-max-size-MB="none" è possibile non mettere l'attributo file-max-size-error-message="message" (punto 11)*

<br>
<br>

- ### SE multiple-files="**true**" REQUIRED ATTRIBUTES:
12. **multiple-max-files="options"** numero massimo dei files allegabili
    - **"none"** non vi è un massimo (quindi di default massimo = numero dei file allegati)
    - **"integer"** (solo numeri interi, non ha senso "0", ma ha senso mettere "1") esempio **"4"** = max 4
13. **multiple-max-files-error-message="message"** visibile se l'utente tenta di allegare più files del numero massimo
    - **""** se *multiple-max-files="none"* o se non si vuole mettere un messaggio
    - **"message"** solo se *multiple-max-files="integer"* ad esempio **"Allega massimo 4 files."**
14. **multiple-min-files="options"** numero minimo di files allegabili
    - **"none"** non vi è un minimo (quindi di default minimo = 0)
    - **"integer"** (solo numeri interi, non ha senso "0" oppure "1") esempio **"2"** = min 2
15. **multiple-min-files-error-message="message"** visibile se l'utente tenta di allegare meno files del numero minimo
    - **""** se *multiple-min-files="none"* o se non si vuole mettere un messaggio
    - **"message"** solo se *multiple-min-files="integer"* ad esempio **"Devi allegare almeno 2 files."**

<br>

    N.B.: il numero minimo se aggiunto deve sempre essere minore o uguale al numero massimo se presente; Se numero minimo e numero massimo fossero uguali non ci sono problemi

<br>
<br>
<br>

> ## 9. INPUT-RADIO-CHECKBOX.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C se *rc-type="radio"* o punto 0B se *rc-type="checkbox"*
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Genere"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_genere"**
5. **rc-type="options"** scegliere se radio o checkbox
    - **"radio"** scelta singola
    - **"checkbox"** scelta multipla
6. **rc-options="option;option;option"** indicare i valori tra cui l'utente può scegliere, separati da **;** (e senza spazi prima e dop il ;) *NON USARE PARENTESI TONDE NEL NOME SE SI VUOLE AGGIUNGERE IL BADGE (spiegato di seguito)*
    - *N.B.: possono contenere spazi tra una parola e l'altra, es. "banane;arance rosse;semi di zucca"*
    - **N.B.: OPTION FORMATO RICHIESTO [a-zA-Z0-9_- ] (eccezione vedi badge di seguito)**
    - esempio **"maschio;femmina;altro"** (meglio con radio)
    - esempio **"banane;pere;arance rosse;ciliege;pesche"** (meglio con checkbox)
    - *NOTA: graficamente più bello se le option iniziano con la lettera miniscola (tutto minuscolo)*
    - **BADGE:**
    <br>
    È POSSIBILE AGGIUNGERE DEI BADGE AD ESEMPIO CON PHP NEI FILTRI PER INDICARE QUANTI RISULTATI CI SARANNO CECCANDO QUELLA OPTION: 
    <br>
        - usare **"option(10);option(5);option"** anche misti con option senza badge.
    <br>
        - Utilizzabile anche per altri scopi e con stringhe.
    <br>
        - *N.B.: se ci fossero spazi prima o dopo le parentesi li toglie in automatico, quanto scritto tra parentesi diventa uno pseudo-element ::after e non finisce nella value della option*
    <br>
        - Non usare le parentesi tonde nel nome, se non si vuole mettere il badge
        
<br>
<br>

- ### OPTIONAL ATTRIBUTES:
7. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare se l'utente non cecca il numero corretto di caselle, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**
    - esempio **required=""**

<br>
<br>

- ### SE rc-type="**checkbox** e required !== null REQUIRED ATTRIBUTES:
8. **number-of-checkbox-required="integer"** numero minimo di caselle ceccate per la validità del campo *(numeri da 1 a max numero totale delle option messe, 0 equivale a non mettere il required vedi N.B.)*
    - esempio **"2"** l'utente deve ceccare almeno due caselle
9. **number-of-checkbox-required-message="message"** messaggio che compare insieme al messaggio di required (successivo separato da spazio tramite javascript)
    - esempio **"Cecca almendo due caselle."** con number-of-checkbox-required="2"

<br>
    
    N.B. se non è presente required (punto 7) i due attributi qui sopra (punto 8 e punto 9) non vanno messi e javascript automaticamente mettera come numero minimo 0, quindi l'utente potrà non ceccare alcuna casella o ceccarne qualsiasi numero

<br>
<br>
<br>

> ## 10. INPUT-SWITCH.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value=""** vedi capitolo D punto 0A
    - si potrà mettere **false** (in PHP, vedi capitolo D punto 0A note) così switch non sarà ceccato
    - oppure se si vuole far partire ceccato si potrà mettere **true** (in PHP, vedi capitolo D punto 0A note)
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Termini e Condizioni"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_consensoTerminiCondizioni"**

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
5. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare se l'utente non cecca il numero corretto di caselle, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**
    - esempio **required=""**
6. **switch-text-inside-button="MessageTrue;MessageFalse"** (altrimenti non mettere questo attributo) messaggio interno al botton di switch, messaggi prima true poi false separati da **;** senza spazi prima e dopo il ; e senza spazi all'inizio e alla fine della riga
    - esempio **"Accetto i termini e le condizioni;Non accetto"**
    - *N.B.: il bottone sarà grande quanto la scritta più lunga tra i due messaggi true e false, **se il più lungo è molto lungo prediligere come input-width 80 o 100***
7. **switch-text-outside="Text"** (altrimenti non mettere questo attributo) testo che si vede sotto il bottone, può essere anche abbastanza lungo
    - esempio **"Se accetti dichiari ..."** testo per spiegare a cosa l'utente presta il consenso
8. **switch-read-document-icon="true"** (altrimenti non mettere questo attributo) così si vede l'icona leggi documento (esempio per leggere i termini e le condizioni)

<br>
<br>

- ### SE switch-read-document-icon="**true**" REQUIRED ATTRIBUTES:
9. **switch-read-document-name="nomeDocumeto.pdf"** nome del documento da far leggere all'utente (meglio se .pdf)
    - esempio **"./doc/example.pdf"** il documento può trovarsi in qualsiasi cartella del sito *(percorso da esempio.php al file)* oppure può essere un link esterno

<br>
<br>
<br>

> ## 11. INPUT-TEXTAREA.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

    N.B.: per una questione di sicurezza in input-textarea l'utente non può inserire i seguenti caratteri > < ' * ^ | / \ { } [ ] ` ~ " (javascript li rimuove digitandoli).
    Per sicurezza in php è possibile verificare che non siano passati lo stesso, usando nei dati POST il *name* del campo

<br>

- ### REQUIRED ATTRIBUTES:

0. **input-value** vedi capitolo D punto 0C
1. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
2. **label-text=""** nome o domanda del campo
    - esempio **"Bio"**
3. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
4. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_bio"**
5. **textarea-rows="integer"** altezza in righe del campo textarea
    - esempio **"1"** sarà alta quanto il tag INPUT-TEXT
    - esempio **"5"** sarà alta 5 volte il tag INPUT-TEXT

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
6. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**

<br>
<br>

- ### OPTIONAL UTILITIES:
1. **COUNT-CHARACTERS** (vedi dettagli capitolo UTILITIES punto 1, mettere solo gli attributi del punto 1 e del punto 3)

<br>
<br>
<br>

> ## 12. INPUT-ANTISPAM.form-id CUSTOM TAG

<br>

    form-id è l'attributo form-id="es. registerForm" di my-form custom tag

<br>

- ### REQUIRED ATTRIBUTES:

0. **fiels-order-number=""** ordine numerico dei campi input usato da *display:flex* che può essere l'ordine di scrittura o differirvi (vale anche per lo scorrimento degli input con TAB o SHIFT+TAB)
    - esempio **"0"** deve esseci tutta la sequenza di numeri da 0 al numero complessivo dei campi e non devono mai ripetersi, come da documentazione di *order:n* in display flex
1. **label-text=""** nome o domanda del campo
    - esempio **"Antispam"**
2. **input-width="options"** numero larghezza del campo, ogni riga deve avere somma 100 *(se 30 il campo successivo sarà 70)*
    - **"20"** ; **"30"** ; **"40"** ; **"50"** ; **"60"** ; **"70"** ; **"80"** ; **"100"**
3. **input-name=""** è il *name* del tag input, senza spazi, all'occorrenza con cammelCase o underscore (senza accenti)
    - esempio **"_antispam"**
4. **input-text-type="antispam"** definisce il pattern dell'*input type="text"*
    - **"antispam"** diventa pattern="`^[0-9]*$`"
6. **inputmode="numeric"** come da documentazione attributo inputmode di input per la tastiera touch
7. **input-message=""** messaggio di errore per il campo
    - esempio **"Solo numeri."**

<br>
<br>

- ### OPTIONAL ATTRIBUTES:
8. **required="message"** mette il campo obbligatorio, come value inserire il messaggio che compare quando l'input è vuoto, lasciando stringa vuota non compare alcun messaggio ma fa errore ugualmente
    - esempio **required="Campo obbligatorio."**
9. **input-antispam-img="path/to/file/captcha.php"** percorso a un file diverso dal default per gererare l'immagine captcha
    - se non metto questo attributo sarà default **./formComponent/captcha/captcha.php** ovvero cartella *captcha* file *captcha.php* che utilizza il file *captcha.png* per generare l'immagine e salva il risultato della somma semplice nella variabile PHP **$_SESSION['check']** che dovrà poi corrispondere all'input utente *(da fare con PHP)*
    - *N.B.: il nome 'check' della variabile $_SESSION['check'] può essere cambiato nel file captcha.php con qualunque occorra*

<br>

    N.B.: possono essercene due o più nella stessa pagina, però saranno uguali (es. entrambi 2 + 2 e quindi stessa variabile $_SESSION['check] con stesso risultato)

<br>
<br>
<br>
<br>

# E. UTILITIES LIST

<br>

1. COUNT-CHARACTERS
2. SELECT-PREFIX
3. AUTOCOMPLTE-ADDRESS
4. PASSWORD-VISIBILITY

<br>
<br>
<br>

> ## 1. COUNT-CHARACTERS

<br>

    Conta i caratteri e permette di inserire min e max con i messaggi di errore

<br>

- ### REQUIRED ATTRIBUTES in custom tag (se si decide di mettere questa utility):
1. **count-characters="true"** dichiara che l'utility è attiva
2. **count-characters-position="options"** in che lato dell'input si vede il contatore **(da non mettere per INPUT-TEXTAREA)**
    - **"right"** va a destra
    - **"left"** va a sinistra
    - **""** se stringa vuota va a destra
3. **count-characters-type-value="options"** senza spazi
    - **"only"** conta solo i caratteri
    - **""** se stringa vuota diventa *"only"*
    - **"min,10"** imposta solo i caratteri minimi richiesti *(es. 10)* e il messaggio di errore sempre Min + numero minimo *(es. Min 10)*
    - **"max,10"** imposta solo i caratteri massimi richiesti *(es. 10)* e il messaggio di errore sempre Max + numero massimo *(es. Max 10)*
    - **"minmax,10-20"** imposta i caratteri minimi e massimi richiesti *(es. min 10 e max 20)* e il messaggio di errore sempre Min + numero minimo *(es. Min 10)* e Max + numero massimo *(es. Max 20)*; min e max posso anche coincidere *(es. "minmax,10-10" saranno richiesti 10 caratteri)*


<br>

    N.B: se input-text-type="email" e se si decide di mettere l'utility COUNT-CHARACTERS è necessario che count-characters-type-value="only" (conta solo i caratteri perchè gli errori sulla lunghezza li dà già il pattern email)

<br>
<br>
<br>

> ## 2. SELECT-PREFIX

<br>

    Crea il menù a tendina per selezionare il prefisso internazionale visualizzando la bandiara a sinstra del campo di input

<br>

- ### REQUIRED ATTRIBUTES in custom tag input-phone (se si decide di mettere questa utility):
1. **select-prefix="true"** dichiara che l'utility è attiva
2. **select-prefix-default-country-code=""** codice in maiuscolo della nazione che si vuole far apparire già selezionata
    - esempio **"IT"** (sarà Italia = 0039)
3. **prefix-list="options"** imposta la lista dei prefissi
    - **"all"** mette tutte le nazioni
    -**"IT"** usare il codice della nazione e senza spazi, se elenco con una sola nazione deve essere quella di default scritta in *select-prefix-default-country-code="IT"*
    - **"IT,FR,CH"** usare il codice della nazione e senza spazi separate da virgola, deve contenere quella di default scritta in *select-prefix-default-country-code="IT"*
4. **prefix-list-search="true"** mette la barra di ricerca nel menù a tendina dei prefissi
    - se non la si vuole, non mettere ne il valore ne l'intero attrubuto

<br>
<br>
<br>

> ## 3. AUTOCOMPLTE-ADDRESS

<br>

    Partento da un input-datalist COMUNE ITALIANO permette l'autocompletamento degli input-datalist CAP, PROVINCIA e REGIONE. Occorrono per 4 input-datalist distinti a cui inserire i vari attributi per il corretto funzionamento dell'autocompletamento. Vedi anche input-datalist per gli atri attrubuti

<br>

- ### REQUIRED ATTRIBUTES in custom tag input-datalist (se si decide di mettere questa utility):

    <br>

        N.B. utilizzare *fields-order-number="n"* in sequenza 
        (es. comune=5, cap=6, provincia=7, regione=8, stato=9)

    <br>

    - ### <ins>in input-datalist COMUNE ITALIANO mettere:</ins>
        - **datalist-json="json"**
        - **datalist-type="suggestion"**
        - **datalist-min-length-for-suggest="3"**
        - **datalist-json-php-file-name="comuni-italiani"**
        1. **datalist-autocomplete-address="comune"**
        2. **datalist-autocomplete-address-id=""** nome univoco a scelta uguale per tutti i campi di questo autocomplete, se secondo autocomplete nella stessa form o pagina cambiare questo punto per se stesso e per tutti campi collegati
            - esempio **"indirizzo-residenza"**

    <br>

    - ### <ins>in input-datalist CAP mettere:</ins>
        - **datalist-json="json"**
        - **datalist-type="suggestion"**
        - **NON METTERE ATTRIBUTO** *datalist-min-length-for-suggest=""*
        - **NON METTERE ATTRIBUTO** *datalist-min-length-for-suggest-message=""*
        - **NON METTERE ATTRIBUTO** *datalist-json-php-file-name="nome-file"*
        1. **<ins>datalist-only-autocomplete="true"</ins>** si vede la lista dei cap solo scrivendo nel input del comune uno dei comuni con più di un cap *(es. Torino)*
        2. **datalist-autocomplete-address="cap"**
        3. **datalist-autocomplete-address-id="come per comune"**

        <br>

        - SOLO PER CAP OPTIONAL UTILITY:
        4. **COUNT-CHARACTERS** se scelta:
            - per il CAP come in questo caso, settare **count-characters-type-value="minmax,5-5"** *(vedi gli altri attributi rischiesti nel capitolo UTILITIES punto 1)*

    <br>

    - ### <ins>in input-datalist PROVINCIA mettere:</ins>
        - **datalist-json="json"**
        - **datalist-type="select-option"**
        - **datalist-json-php-file-name="province-italiane"**
        1. **datalist-autocomplete-address="provincia"**
        2. **datalist-autocomplete-address-id="come per comune"**

    <br>

    - ### <ins>in input-datalist REGIONE mettere:</ins>
        - **datalist-json="json"**
        - **datalist-type="select-option"**
        - **datalist-json-php-file-name="regioni-italiane"**
        1. **datalist-autocomplete-address="regione"**
        2. **datalist-autocomplete-address-id="come per comune"**
    
    <br>

    - ### <ins>in input-datalist STATO mettere:</ins>
        - **datalist-json="not-json"**
        - **datalist-type="select-option"**
        - **datalist-options-list="Italia"** *(con iniziale maiuscola, unica opzione)*
        1. **datalist-autocomplete-address="stato"**
        2. **datalist-autocomplete-address-id="come per comune"**

<br>
<br>
<br>

> ## 4. PASSWORD-VISIBILITY

<br>

    Permette di visualizzare o nascondere la password inserita

<br>

- ### REQUIRED ATTRIBUTES in custom tag input-password (se si decide di mettere questa utility):
1. **password-toggle-visibility="true"** dichiara che l'utility è attiva
2. **password-visibility-position="options"** in che lato dell'input si vede il simbolo cliccabile della visibilità della password
    - **"right"** va a destra
    - **"left"** va a sinistra
    - **""** se stringa vuota va a destra


<br>
<br>
<br>
<br>

# F. FUNZIONI AGGIUNTIVE IN PHP: UPLOAD DI FILES E GESTIONE ERRORI SERVER DEL FORM

- **SINGOLO FILE MAX SIZE e MAX SIZE PER L'UPLOAD IMPOSTATA SUL SERVER**

    Verificare la voce UPLOAD_MAX_FILESIZE e la voce POST_MAX_SIZE con il comando *phpinfo();* in esempio.php (i due valori possone essere uguali o può essere di poco maggioree il secondo). 

    È impostata per motivi di sicurezza in php una dimensione del singolo file massima di 10MB (indipendente da quella massima per il form se minore) ma è possibile modificarla se nel form si richiede una dimensione maggiore. Si può mettere un numero intero oppure un numero decimale, in quest'ultimo caso usando sempre il punto e non la virgola per i rotti. Il numero deve essere sempre inserito come stringa (come si vede nel codice che segue).

    Se le voci UPLOAD_MAX_FILESIZE e POST_MAX_SIZE fossero minori della dimensione massima di sicurezza (10MB) è possibile aumentarle modificando i valori sul server e in base al tipo di server (se non si riesce è comunque possibile diminuire la dimensione massima). 

    <br>

    - **Se si sta usando APACHE WEB SERVER è possibile cambiarli nel file .htaccess:**

        1. creare il file **.htaccess** vicino al file *esempio.php*
        2. inserirvi quanto segue:
        ```apache
            # max upload 20M in php 10MB (meglio abbondare di almeno 10MB per evitare errori)
            php_value upload_max_filesize 20M
            php_value post_max_size 20M

            # limite di tempo per l'esecuzione dello script PHP (utile un tempo non troppo ridotto per evitare errori)
            php_value max_execution_time 200
            php_value max_input_time 200
        ```
        3. salvare e verificare che entrando con il browser su *esempio.php* non compaia l'**errore 500** *(quindi uno sbaglio nel file .htaccess)*.
        4. È possibile verificare se i comandi sono stati eseguiti controllando con *phpInfo();* come detto precedentemente.
        5. Successivamente in questo file possono essere aggiunti ulteriori comandi per il web server anche se non riguardano questo componete.

<br>
<br>

- **CONTROLLI DI SICUREZZA SUL FILE CARICATO DALL'UTENTE**

    I controlli PHP per la sicurezza non fanno passare file con dimensioni maggiori di quella max scelta, file conteneti testo ASCII (come i .jpg con codice all'interno) e i files con estensioni potensialmente pericolose (quelle per file contententi codice, anche per il web,e file eseguibili) è possibile aggiungerne o toglierne nel file *dangerousExtensions.json* in *formComponent/php/json/* (non modificare la key del json: *"codeExecWebFileExtensions"*). 

<br>

- **SALVATAGGIO DEL FILE CARICATO DALL'UTENTE**

    Il file viene spostato nella cartella **"upload"** usando poi un percorso per distinguere il file da quelli caricati da altri utenti e rinominato con uno specifico criterio.

    Percorso: */upload/username/nameCampoInputFile/fileRinominato.ext* (username e inputName in lowercase)

    Nome file: *nameCampoInputFile:numeroInOrdineCrescente.ext* (inputName in lowercase)
    
    Il file viene numerato (es. per non avere file doppi nella cartella se input-file multiple) e il numero è separato da **:** per consentirne poi una possibile estrazione per l'utilizzo del file

    *Nota: per eliminare i file caricati (mai la cartella upload) usare nautilus da superutente con Ubuntu ed eliminare definitivamnte il contenuto di upload o singoli file*

<br>

**In esempio.php aprire il tag `<?php ... ?>` prima di *`<!DOCTYPE html>...`* e inserire come segue:**

```php
// N.B.: le funzioni, usate per verificare se lo username esiste già o se le credenziali di login sono corrette, sono solo un esempio schematico di come impostare la registrazione e il login. In questi casi è necessario creare un oggetto per gestire l'utente. Qui si vuole solo far vedere come vengono visualizzati e come inserire i vari errori del server (username già esistente per la registrazione, credenziali errate per il login come username inesistente e password/username errata/i)

<?php

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
                //cancella i files salvati in fase di registrazione se errore come ad esempio username già presente nel database
                deleteFormFilesData($files); // $files = array con il o i percorsi dei file salvati

                // server error punto 5A - username già presente nel database (register form) - formato: "messaggio;username"
                $registerUsernameErrorMessage = "Questo username è già in uso!".";".$formPostDataSanitized['_username'];
            }

        } elseif ($formPostDataSanitized['TIPOLOGIA_FORM'] === 'LOGIN') {

            // SE LOGIN FORM

            if (usernameAlreadyExist($formPostDataSanitized['_username_login']) === true) {

                // mettere la riga qui sotto solo se ci sono degli INPUT-FILE nella form di login
                // return array associativo percorsi file (es. key=nomeInput:0 se multiple oppure es. key=nomeInput)
                # $files = sanitizeSaveFormFilesData($formFilesData, $formPostDataSanitized['_username'], '10'); // $files = array con il o i percorsi dei file salvati

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
```
**Qui viene usato un INPUT-HIDDEN per indicare la tipologia del form e quindi filtrare i messaggi di errore e le azioni da compiere, come in questo caso per la form di registrazione:**

```html
<input-hidden.form-id
    input-name="TIPOLOGIA_FORM"
    input-value="REGISTER"
>
</input-hidden.form-id>
```

<br>

PHP continua nel punto 5 A e B e nel capitolo D per reimpostare il valore degli input (capitolo D) in caso di reinvio del form per un errore nei campi detto dal server (punto 5) come per lo username se già esiste (quest'ultimo punto 5A)

<br>

### 5. ERRORI NEI CAMPI SECONDO IL SERVER: USERNAME GIÀ PRESENTE NEL DATABASE O INESISTENTE SE LOGIN || CREDENZIALI ERRATE SE LOGIN

- **A.** USERNAME GIÀ PRESENTE NEL DATABASE O INESISTENTE SE LOGIN

    A *INPUT-TEXT.form-id* se *input-text-type="username"* è possibile aggiungere l'attributo **username-already-exists-server-error-message="phpMessage"** per far visualizzare all'utente un messaggio di errore se l'username inserito esiste già nel database(register) o non vi esiste (login), inserisce anche un pattern in modo che l'utente non possa reinviare il form con lo stesso username. 

    Per USERNAME sia register che login **phpMessage** è composto da *"messaggio;username"* separati da **;** e senza spazi prima e dopo il punto e virgola. Si può impostare nel codice php *(vedi punto 4)*.

```php
// se register form $registerUsernameErrorMessage, se login form $loginUsernameErrorMessage
// register form
<input-text.esempio
    input-text-type="username"
    username-already-exists-server-error-message="<?= $registerUsernameErrorMessage; ?>"
>
</input-text.esempio>
```

- **B.** CREDENZIALI ERRATE SE LOGIN

    Si compone di due parte quella del punto 5A, quindi se lo username non esiste nel database.
    La seconda parte è la password, quindi se il nome utente esiste e quindi la password è sbagliata, si può aggiungere a INPUT-PASSWORD (se login form) **login-credentials-server-error-message="phpMessage"** per far visualizzare all'utente il messaggio di errore sotto al campo password.

    Per PASSWORD (se login) **phpMessage** è composto da *"messaggio"*. Si può impostare nel codice php *(vedi punto 4)*.

```php
// login form
<input-text.esempio
    input-text-type="username"
    username-already-exists-server-error-message="<?= $loginUsernameErrorMessage; ?>"
>
</input-text.esempio>
<input-password.esempio
    login-credentials-server-error-message="<?= $loginPasswordErrorMessage; ?>"
>
</input-password.esempio>
```

- **C.** **APPROFONDIMENTO:** AGGIUNGERE NUOVI ERRORI SERVER

    Ad esempio se creo un nuovo *input-text-type="usernameID"* posso creare un errore server con la stessa metodologia:

    1. alla riga 341 della funzione setIputPattern:

        - aggiungo come input-text-type usernameId;

    2. in createFormComponent.js:
    
        - impostare nella creazione del tag, es. input-text, gli attributi richiesti per far funzionare l'errore server per il nuovo input-text-type nel file createFormComponent.js come avviene dalla riga 418 alla riga 420 della funzione setInput per username (fare attenzione al tipo di input) creando una nuova funzione simile a setUsernameServerError ma con l'attributo con il nome scelto es. username-id-error-server-message;

    3. è necessario in html fare come qui sopra ai punti 6A. e 6B. usando il nome corretto per l'attributo es. username-id-error-server-message;

    4. comporre il tutto in php come nell'esempio schematico del punto 4;

    *(N.B.: la spiegazione è schematica e da interpretare usando gli esempi di errore server già presenti nel codice)*

<br>
<br>
<br>
<br>
<br>

#### Fine Documentazione

<br>
