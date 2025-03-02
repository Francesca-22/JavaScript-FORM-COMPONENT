<?php

#tools
function import_json($fileJSON) {
    $JSON = file_get_contents($fileJSON);
    return json_decode($JSON, true);
}

/** 
 * @return true se il comune in cui si sta cercando inizia con le lettere cercate
 * @return false se non inizia con le lettere cercate
 */
function is_parzialmente_trovato(string $input_utente, string $cerca_in):bool {
    $inputUtenteControlled = str_replace(['^','.','?','*','|','-', '/','(',')','['], ['\^','\.','\?','\*','\|','\-','\/','\(','\)','\['], str_replace('\\','!', $input_utente));
    $re = '/^'.$inputUtenteControlled.'/';
    if (preg_match($re, $cerca_in)) {
        return true;
    } else {
        return false;
    }
}

/** 
 * @return true se il comune cercato è uguale identico al comune in cui si sta cercando
 * @return false se è diverso
 */
function is_comune_trovato(string $comuneCercato, string $cercaIn):bool {

    if ($cercaIn === $comuneCercato) {
        return true;
    } else {
        return false;
    }
}
#end tools



#get
$inputDatalistValue = null;
if (isset($_GET['inputDatalistValue'])) {
    $inputDatalistValue = $_GET['inputDatalistValue'];
}


#provincia
#json
$provinceJSON = import_json('./province.json');

if ($inputDatalistValue === null) {
    foreach ($provinceJSON as $provinciaJSON) {
        $provinciaJSON_sigla = $provinciaJSON['sigla'];

        echo "<option>".$provinciaJSON_sigla."</option>";
    }
}

?>