<?php
function array2xml($array, $xml = false) {
    if ($xml === false) {
        $xml = new SimpleXMLElement('<jobs/>');
    }
    
    foreach($array as $key =>$value) {
        if(is_array($value)) {
            $convertedKey = is_numeric((string)$key) ? 'job' : $key;
            array2xml($value, $xml->addChild($convertedKey));
        } else {
            $xml->addChild($key, $value);
        }
    }
    return $xml->asXML();
}
?>