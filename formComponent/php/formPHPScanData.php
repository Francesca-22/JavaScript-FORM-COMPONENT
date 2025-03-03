<?php

############################################# TOOLS

/**
 * CONTA QUANTI FILE CI SONO NELLA CARTELLA PASSATA COME PARAMENTO
 * @param string $folderPath percorso cartella es. "/opt/lampp/htdocs/PHP/FORM-COMPONENT/upload/" (con / all'inzio e alla fine sempre)
 * @return int numero totale file nella cartella 
 * @note non conta i file nascosti o con . davanti al nome (come il file .htaccess)
 */
function countAllFilesInsideAFolder($folderPath):int {
    $folder = $folderPath;
    $totalOfFiles = count(glob($folder . "*"));
    return $totalOfFiles;
}

/**
 * VERIFICA L'ESISTENZA DI UNA CARTELLA
 * @param string $folder percorso della cartella da verificare
 * @return mixed restituisce il percorso assoluto canonizzato in caso di successo, altrimenti viene restituito FALSE
 */
function folder_exist($folder) {
    // ottiene il percorso assoluto canonizzato
    $path = realpath($folder);

    // se estiste, verifica che sia una cartella
    return ($path !== false AND is_dir($path)) ? $path : false;
}

/**
 * OTTIENE IL JSON (SE SALVATO IN CARTELLA LOCALE)
 * @param string $jsonPath percorso file json
 * @return json
 */
function getJson($jsonPath) {
    // legge il JSON file
    $json = file_get_contents($jsonPath); 
    
    // decodifica il JSON file
    $jsonData = json_decode($json, true); 
    
    // restituisce i dati in formato json
    return $jsonData; 
}

/**
 * CANCELLA LA CARTELLA PASSATA E TUTTO IL SUO CONTENUTO (FILES E SOTTOCARTELLE)
 * @param string $dir percorso fino alla directory da eliminare insieme ai suoi contenuti (es. getcwd()."upload/username"), NON mettere "/" alla fine del percorso
 * @return bool true la cartella passata esiste oppure false se la cartella è inesistente (quindi già cancellata)
 * @return azione se true cancella la cartella passata (es. username) e tutti i file e le sottocartelle che contiene (es. cartella: inputName, e suo contenuto: inputName:0.pdf)
 */
function delTree($dir) {
    if (realpath($dir)) {
        $files = scandir($dir);
        foreach($files as $file){
            if ($file !== '.' && $file !== '..') {
                if(is_dir($dir.DIRECTORY_SEPARATOR.$file)) {
                    delTree($dir.DIRECTORY_SEPARATOR.$file);
                } else {
                    unlink($dir.DIRECTORY_SEPARATOR.$file);
                }
            }
        }
        rmdir($dir);
        return true;
    } else {
        //print_r('Questa cartella e i suoi contenuti sono già stati eliminati!');
        return false;
    }
}


############################################# SANITIZE FUNCTIONS

/**
 * SCANSIONA I FORM POST DATA (NO FILES)
 * @param array $formPostData dati $_POST del form
 * @return array dati sanificati nello stesso formato di $_POST
 */
function sanitizeFormPostData(array $formPostData):array {
    $sanitizedFormPostData = array();
    foreach ($formPostData as $inputName => $inputValue) {
        // strip_tags rimuove eventuali tag html (come gli <script></script>) e poi rimuove gli escape (cioè \) già non consentiti nei vari campi input/textarea
        $sanitizedInputValue = null;
        if (!is_array(($inputValue))) {
            $sanitizedInputValue = strip_tags($inputValue);
        } else {
            $sanitizedInputValue = array();
            for ($i=0; $i < count($inputValue); $i++) { 
                $sanitizedSigleCheckboxInputValue = strip_tags($inputValue[$i]);
                $sanitizedInputValue += [ $i => $sanitizedSigleCheckboxInputValue];
            }
        }
        $sanitizedFormPostData += [ $inputName => $sanitizedInputValue ];
    }
    return $sanitizedFormPostData;
}

/**
 * SCANSIONA, RINOMINA E SALVA I FORM FILES DATA
 * @param array $formFilesData dati $_FILES del form
 * @param string $username nome dell'utente per creare la cartella corretta e univoca dove salvare il file
 * @param string $maxFileSize massima dimensione del singolo file stabilita per la sicurezza (meglio sempre se maggiore di quella scelta in INPUT-FILE di almeno un paio di MB per evitare problemi di conversione della dimensione del file)
 * @return azione rimanda alla funzione sanitizeAndSaveFile() che sposta i file nella cartella "/upload/inputName/userName/fileRinominato.ext" e rinomina il file usando inputName + numero crescente + estensione/i del file caricato
 * @return filesPathArray associative array dei percorsi fino ai files spostati e rinominati
 * @note array associativo: se multiple [index] = [nomeInput:numeroFile] (il numero file parte da 1), se non multiple [index] = [nomeInput]
 */
function sanitizeSaveFormFilesData(array $formFilesData, string $username, string $maxFileSize):array {
    $files = [];
    $dangerousFileExtensionsJSON = getJson('./formComponent/php/json/dangerousExtensions.json');

    if (count($formFilesData) !== 0) {
        foreach ($formFilesData as $formFileName => $formFileData) {
            if (is_array($formFileData["name"])) {
                $formFileInputName = $formFileName;
                for ($fileNumber=0; $fileNumber < count($formFileData["name"]); $fileNumber++) {                    
                    if ($formFileData["error"][$fileNumber] === 0) {
                        $files[$formFileInputName.":".$fileNumber+1] = sanitizeAndSaveFile($formFileData["name"][$fileNumber],$formFileData["tmp_name"][$fileNumber], $formFileData["size"][$fileNumber], $formFileInputName, $username, $maxFileSize, $dangerousFileExtensionsJSON);
                    }
                }
            } else {
                $formFileInputName = $formFileName;
                if ($formFileData["error"] === 0) {
                    $files[$formFileInputName] = sanitizeAndSaveFile($formFileData["name"],$formFileData["tmp_name"], $formFileData["size"], $formFileInputName, $username, $maxFileSize, $dangerousFileExtensionsJSON);
                }
            }
        }
    }
    return $files;
}


############################################# TOOLS - SANITIZE FUNCTIONS

/**
 * SANIFICA, SALVA E RINOMINA IL FILE
 * @param string $fileName nome del file caricato
 * @param string $fileTmpName percorso nella cartella temp del browser del file caricato
 * @param string $fileSize peso del file
 * @param string $formFileInputName inputName
 * @param string $username nome dell'utente
 * @param string $maxFileSize massima dimensione del singolo file stabilita per la sicurezza
 * @param json $dangerousFileExtensionsJSON elenco delle estenzione potenzialmente pericolose (quelle per file contententi codice, anche per il web, e file eseguibili)
 * @return azione verifica la sicurezza rimandando alla funzione checkFilesTypeError(), poi se non ci sono pericoli sposta i file nella cartella "/upload/username/inputName/fileRinominato.ext" e rinomina il file usando inputName + numero crescente + estensione/i del file caricato
 * @return filePath percorso fino al file spostato e rinominato
 * @note se il file è pericoloso non viene spostato e sarà autoeliminato dal browser finita l'azione del form
 */
function sanitizeAndSaveFile($fileName, $fileTmpName, $fileSize, $formFileInputName, $username, $maxFileSize, $dangerousFileExtensionsJSON) {
    $usernameLower = mb_strtolower($username);
    $formFileInputNameLower = mb_strtolower($formFileInputName);

    $fileSanitizedName = basename($fileName);
    $filePath = realpath($fileTmpName);

    if (checkFilesTypeError($fileSanitizedName, $filePath, $fileSize, $maxFileSize, $dangerousFileExtensionsJSON) === true) {

        // make dir USERNAME inside UPLOAD
        if (!file_exists(getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.$usernameLower)) {
            mkdir(getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.$usernameLower, 0777, true);
        }
        
        // make dir INPUT-NAME inside USERNAME
        if (!file_exists(getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.$usernameLower.DIRECTORY_SEPARATOR.$formFileInputNameLower)) {
            mkdir(getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.$usernameLower.DIRECTORY_SEPARATOR.$formFileInputNameLower, 0777, true);
        }

        $destinationPath = getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.$usernameLower.DIRECTORY_SEPARATOR.$formFileInputNameLower.DIRECTORY_SEPARATOR;
        $targetPath = $destinationPath.$fileSanitizedName;

        $fileSanitizedNameEXTArray = explode(".", $fileSanitizedName);
        $fileSanitizedNameEXT = "";
        if (count($fileSanitizedNameEXTArray) === 2) {
            $fileSanitizedNameEXT = ".".$fileSanitizedNameEXTArray[1];
        } else if (count($fileSanitizedNameEXTArray) === 3) {
            array_shift($fileSanitizedNameEXTArray);
            $fileSanitizedNameEXT = ".".implode(".", $fileSanitizedNameEXTArray);
        } else if (count($fileSanitizedNameEXTArray) > 3) {
            $fileSanitizedNameEXT = ".".$fileSanitizedNameEXTArray[count($fileSanitizedNameEXTArray) - 1];
        }

        // COUNT ALL THE FILES IN THE FOLDER WHERE THE UPLOADED FILE WILL GO
        $totalFilesInDestinationFolder = countAllFilesInsideAFolder($destinationPath);

        // SAVE FILE
        move_uploaded_file($filePath, $targetPath);

        // RENAME FILE (composto da "destinationPath/inputName:folderTotalFilesNumber.ext")
        rename($targetPath, $destinationPath.$formFileInputNameLower.":".$totalFilesInDestinationFolder.$fileSanitizedNameEXT);

        return DIRECTORY_SEPARATOR.$formFileInputNameLower.DIRECTORY_SEPARATOR.$formFileInputNameLower.":".$totalFilesInDestinationFolder.$fileSanitizedNameEXT;
    } else {
        return 'dangerousFile';
    }
}

/**
 * SCANSIONA IL FILE PER VERIFICARNE LA SICUREZZA
 * @param string $fileSanitizedName nome del file caricato, sanificato per la sicurezza con basename()
 * @param string $filePath percorso nella cartella temp del browser del file caricato, controllato con realpath() per evitare caratteri pericolosi
 * @param string $fileSize peso del file
 * @param string $maxFileSize massima dimensione del singolo file stabilita per la sicurezza
 * @param json $dangerousFileExtensionsJSON elenco delle estenzione potenzialmente pericolose (quelle per file contententi codice, anche per il web e file eseguibili)
 * @return bool true se il file è sicuro e false se contiene dei pericoli come dimensione maggiore della massima, estensioni pericolose (che sia un file con singola o doppia estensione) e/o se contiente testo ASCII (come .jpg con pezzi di codice nascosti all'interno)
 */
function checkFilesTypeError($fileSanitizedName, $filePath, $fileSize, $maxFileSize, $dangerousFileExtensionsJSON):bool {
    $errors = [];
    $dangerousExtension = $dangerousFileExtensionsJSON['codeExecWebFileExtensions'];
    $bytesMaxFileSize = $maxFileSize * 1024 * 1024;

    $fileSanitizedNameEXT = explode(".", $fileSanitizedName);

    // parte system
    ob_start();
    // esegue system
    $fileInfo = system("file $filePath");

    // verifica estensioni pericolose valida anche se ci sono più estensioni per lo stesso file (es. un file file.fr.html non verrà salvato)
    // verifica che le estensioni non contengano caratteri speciali, spazi, lettere accentate ecc. (un'estensione può contenere solo lettere minuscole o maiuscole e numeri)
    if (count($fileSanitizedNameEXT) === 2) {
        if (in_array($fileSanitizedNameEXT[1], $dangerousExtension) || preg_match("/[^a-zA-Z0-9]/", $fileSanitizedNameEXT[1]) === 1) {
            $errors[] = 'Dangerous extension in '.$fileSanitizedName;
        }
    } else if (count($fileSanitizedNameEXT) === 3) {
        array_shift($fileSanitizedNameEXT);
        foreach ($fileSanitizedNameEXT as $fileEXT) {
            if (in_array($fileEXT, $dangerousExtension) || preg_match("/[^a-zA-Z0-9]/", $fileEXT) === 1) {
                $errors[] = 'Dangerous extension in '.$fileSanitizedName;
            }
        }
    } else if (count($fileSanitizedNameEXT) > 3) {
        // è un file che contiene punti nel nome
        $fileEXT = $fileSanitizedNameEXT[count($fileSanitizedNameEXT) - 1];
        if (in_array($fileEXT, $dangerousExtension) || preg_match("/[^a-zA-Z0-9]/", $fileEXT) === 1) {
            $errors[] = 'Dangerous extension in '.$fileSanitizedName;
        }
    }

    // non passano i file contetenti texto ASCII (esempio i .jpg con pezzi di php nascosti ll'interno)
    if (preg_match("/ASCII/im", $fileInfo)) {
        $errors[] = $fileSanitizedName.' is a trusted file';
    }

    // massima dimensione
    if ($fileSize > $bytesMaxFileSize) {
        $errors[] = 'File '.$fileSanitizedName.' size exceeds limit of 10MB';
    }

    // pulisce system
    ob_clean();
    //print_r($errors);

    if (empty($errors)) {
        return true;
    } else {
        return false;
    }
}


############################################# DELETE FORM POST FILES FROM UPLOAD DIRECTORY

/**
 * @param array $files (se il singolo file dell'array è stringa vuota o nullo non viene cancellato)
 * @return deleteFiles cancella il file o i files dell'array $files dalla cartella upload/username/inputName
 * @return removeDirectories cancella la sottocartella o le sottocartelle inputName di upload/username poi cancella anche la sottocartella username di upload (solo se esistenti e vuote)
 */
function deleteFormFilesData($files) {
    $dirInputNameArray = [];
    $dirUsernameArray = [];

    foreach ($files as $file) {
        // se il file non è stato rimosso perchè potenzialmente pericoloso
        if ($file !== '' && $file !== NULL) {
            // percorso file
            $filePath = getcwd().$file;

            // restituisci il percorso delle cartelle inputName in upload/username
            $inputNameDirectoryPathArray = explode(DIRECTORY_SEPARATOR, $filePath);
            array_pop($inputNameDirectoryPathArray);
            $dirInputNameArray[] = implode(DIRECTORY_SEPARATOR, $inputNameDirectoryPathArray);
    
            // restituisci il percorso della cartella username in upload
            $usernameDirectoryPathArray = explode(DIRECTORY_SEPARATOR, $filePath);
            array_pop($usernameDirectoryPathArray);
            array_pop($usernameDirectoryPathArray);
            $dirUsernameArray[] = implode(DIRECTORY_SEPARATOR, $usernameDirectoryPathArray);
    
            // rimuovi i files nelle cartelle inputName in upload/username
            unlink(realpath($filePath));
        }
    }


    // rimuovi se esistenti e vuote le sottocartelle inputName in upload/username
    $inputNameDirToRemoveArray = array_values(array_unique($dirInputNameArray));
    foreach ($inputNameDirToRemoveArray as $inputNameDirToRemove) {
        if (realpath($inputNameDirToRemove)) {
            if (count(scandir($inputNameDirToRemove)) == 2) {
                rmdir(realpath($inputNameDirToRemove));
            }
        }
    }

    // rimuovi se esistente e vuota la sottocartella username in upload
    $usernameDirToRemoveArray = array_values(array_unique($dirUsernameArray));
    foreach ($usernameDirToRemoveArray as $usernameDirToRemove) {
        if (realpath($usernameDirToRemove)) {
            if (count(scandir($usernameDirToRemove)) == 2) {
                rmdir(realpath($usernameDirToRemove));
            }
        }
    }
}


############################################# RENAME USERNAME DIRECTORY IF USER CHANGE HIS USERNAME

/**
 * RINOMINA LA CARTELLA USERNAME IN UPLOAD AD ESEMPIO SE VIENE CAMBIATO LO USERNAME
 * @param string $currentUsername session username da cambiare
 * @param string $newUsername username nuovo
 * @return true se la cartella esisteva ed è stata rinominata con successo
 */
function renameUsernameDirectory($currentUsername, $newUsername) {
    $currentUsernameLower = mb_strtolower($currentUsername);
    $newUsernameLower = mb_strtolower($newUsername);

    $uploadDirectoryPath = getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR;

    if(file_exists($uploadDirectoryPath)){
        $files = scandir($uploadDirectoryPath);
        foreach($files as $file) {
            if ($file === $currentUsernameLower) {
                rename($uploadDirectoryPath.$file,$uploadDirectoryPath.$newUsernameLower);
                return true;
            }
        }
    }
}


############################################# DELETE ALL FILES IN DIRECTORY INPUTNAME IF USER UPDATE THEM

/**
 * CANCELLA I FILES GIÀ PRESENTI NELLA CARTELLA INPUTNAME DELL'UTENTE AD ESEMPIO SE L'UTENTE AGGIORNA QUELLO SPECIFICO CAMPO INPUT
 * @param string $inputNameDirectoryPath esempio: /username/carta_id/
 * @return deleteAllFiles in directory /upload/username/inputName/
 */
function deleteOldFiles($inputNameDirectoryPath) {
    $uploadDirectoryPath = getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR;

    $files = scandir($uploadDirectoryPath.$inputNameDirectoryPath);

    foreach($files as $file) {
        if ($file != '.' && $file != '..') {
            $filePath = $uploadDirectoryPath.$inputNameDirectoryPath.$file;
            unlink($filePath);
        }
    }
}


############################################# DELETE DIRECTORY USERNAME AND ITS CONTENTS

/**
 * CANCELLA LA CARTELLA USERNAME E TUTTO IL SUO CONTENUTO (FILES E SOTTOCARTELLE)
 * @param string $username username
 * @return deleteUsernameDirectoryAndContents nela cartella upload cancella la cartella username e tutti i suoi contenuti
 */
function deleteUsernameFolderAndItsContents($username) {
    $usernameLowerDirPath = getcwd().DIRECTORY_SEPARATOR."upload".DIRECTORY_SEPARATOR.mb_strtolower($username);
    delTree($usernameLowerDirPath);
}

?>