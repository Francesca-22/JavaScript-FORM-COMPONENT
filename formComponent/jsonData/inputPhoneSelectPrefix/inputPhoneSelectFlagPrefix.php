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
    $inputUtenteControlled = str_replace(['^','.','?','*','|','-', '/','(',')','['], ['\^','\.','\?','\*','\|','\-','\/','\(','\)','\['], str_replace('\\', '!', $input_utente)); // rimpiazza un solo \ il secondo è per non farlo vedere come carattere regex
    $re = '/'.$inputUtenteControlled.'/';
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

$allCountryFlagsPrefix = import_json('./flagsPrefix.json');

#get
if ($_GET['selectPrefix'] === 'list') {
    $defaultCauntryCode = mb_strtolower($_GET['defaultSelectedPrefixCountryCode']);

    if ($_GET['prefixList'] === 'all') {
        foreach ($allCountryFlagsPrefix as $countryFlagPrefix) {
            if (is_comune_trovato($defaultCauntryCode, str_replace('+', '00', mb_strtolower($countryFlagPrefix['code'])))) {
                echo "<li class='select-prefix-option-active' data-select-prefix-option data-country-code=".$countryFlagPrefix['code']." data-prefix-value=".str_replace('+', '00', $countryFlagPrefix['dial_code'])."><span class='select-prefix-option-flag'>".$countryFlagPrefix['flag']."</span><span class='select-prefix-option-code'>".$countryFlagPrefix['code']."</span><span class='select-prefix-option-name'>".$countryFlagPrefix['name']."</span><span class='select-prefix-option-prefix'>".$countryFlagPrefix['dial_code']."</span></li>";
            } else {
                echo "<li data-select-prefix-option data-country-code=".$countryFlagPrefix['code']." data-prefix-value=".str_replace('+', '00', $countryFlagPrefix['dial_code'])."><span class='select-prefix-option-flag'>".$countryFlagPrefix['flag']."</span><span class='select-prefix-option-code'>".$countryFlagPrefix['code']."</span><span class='select-prefix-option-name'>".$countryFlagPrefix['name']."</span><span class='select-prefix-option-prefix'>".$countryFlagPrefix['dial_code']."</span></li>";
            }
        }
    } else {
        $prefixList = explode(',', mb_strtolower($_GET['prefixList']));

        foreach ($allCountryFlagsPrefix as $countryFlagPrefix) {
            if (is_comune_trovato($defaultCauntryCode, str_replace('+', '00', mb_strtolower($countryFlagPrefix['code'])))) {
                echo "<li class='select-prefix-option-active' data-select-prefix-option data-country-code=".$countryFlagPrefix['code']." data-prefix-value=".str_replace('+', '00', $countryFlagPrefix['dial_code'])."><span class='select-prefix-option-flag'>".$countryFlagPrefix['flag']."</span><span class='select-prefix-option-code'>".$countryFlagPrefix['code']."</span><span class='select-prefix-option-name'>".$countryFlagPrefix['name']."</span><span class='select-prefix-option-prefix'>".$countryFlagPrefix['dial_code']."</span></li>";
            } else {
                foreach ($prefixList as $prefixListItem) {
                    if (is_comune_trovato($prefixListItem, mb_strtolower($countryFlagPrefix['code']))) {
                        echo "<li data-select-prefix-option data-country-code=".$countryFlagPrefix['code']." data-prefix-value=".str_replace('+', '00', $countryFlagPrefix['dial_code'])."><span class='select-prefix-option-flag'>".$countryFlagPrefix['flag']."</span><span class='select-prefix-option-code'>".$countryFlagPrefix['code']."</span><span class='select-prefix-option-name'>".$countryFlagPrefix['name']."</span><span class='select-prefix-option-prefix'>".$countryFlagPrefix['dial_code']."</span></li>";    
                    }
                }
            }
        }
    }


} else if ($_GET['selectPrefix'] === 'search') {
    $userInputValue = mb_strtolower($_GET['userValue']);
    $countryCode = array();

    foreach ($allCountryFlagsPrefix as $countryFlagPrefix) {
        $findIn = mb_strtolower($countryFlagPrefix['code'])." ".mb_strtolower($countryFlagPrefix['name'])." ".str_replace('+', '00', mb_strtolower($countryFlagPrefix['dial_code']));
        if (is_parzialmente_trovato($userInputValue, $findIn)) {
            array_push($countryCode, $countryFlagPrefix['code']);
        }
    }
    echo implode(",", $countryCode);
}

?>