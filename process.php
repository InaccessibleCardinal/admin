<?php
include 'guid.php';
include 'jsonToXml.php';

$whitelist = array('192.168.1.17', '::1', '76.184.192.93');
$lockoutResponse = '{error: "Something went wrong."}';
$successResponse = '{"message": "Successfully updated jobs."}';
$dateString = date('Y-m-d');
$guid = GUIDv4();
//clone and save current
try {
    $clonedDoc = new DOMDocument();
    $clonedDoc->load('data/data.xml');
    $clonedDoc->save('data/data_' . $guid. '_' . $dateString . '.xml');

    //verify client
    if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
        header("HTTP/1.1 400 Bad Request");
        die($lockoutResponse);
    }
    //get post & build xml
    $data = json_decode(file_get_contents('php://input'), true);
    
    $xml = array2xml($data, false);

    $doc = new DOMDocument;
    $doc->formatOutput = true;
    $doc->loadXML($xml);
    $doc->save('data/data.xml');

    header("HTTP/1.1 201 OK");
    header('Content-Type', 'application/json');
    echo $successResponse;

} catch (Exception $e) {
    echo '{error: ' . $e .'}';
}

?>