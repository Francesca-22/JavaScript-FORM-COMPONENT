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
    $inputDatalistValue = str_replace('+', ' ', $_GET['inputDatalistValue']);
}


#autocomplete sigla provincia e regione da comune
#json
$autocompleteComuniJSON = import_json('./comuni.json');

foreach ($autocompleteComuniJSON as $autocompleteComuneJSON) {
    $autocompleteComuneJSON_nome = $autocompleteComuneJSON['nome'];
    $autocompleteComuneJSON_nome_lowercase = mb_strtolower($autocompleteComuneJSON_nome);

    if (is_comune_trovato($inputDatalistValue, $autocompleteComuneJSON_nome_lowercase)) {
        $autocompleteComuneJSON_cap = implode("|", $autocompleteComuneJSON['cap']);
        $autocompleteComuneJSON_sigla_provincia = $autocompleteComuneJSON['sigla'];
        $autocompleteComuneJSON_regione = $autocompleteComuneJSON['regione']['nome'];

        echo "$autocompleteComuneJSON_cap,$autocompleteComuneJSON_sigla_provincia,$autocompleteComuneJSON_regione";
    }
}

?>