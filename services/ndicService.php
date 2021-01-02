<?php

// Main program - call the requested service
$requestedService = $_POST[ "service" ];

switch( $requestedService ) {
    case "addFacility" :
        addFacility();
        break;

    default :
        // error message would go here
        echo json_encode( array("status"=>"error", "message"=>"unknown service requested") );
}

function addFacility() {

    $ar = $_POST;

    $ar[ "Adder"] = "Black";

    echo json_encode( $ar );
}   
?>