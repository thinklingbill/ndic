<?php

// TODO:
// Abstract table names
// set the userid 

// Main program - call the requested service
$requestedService = $_POST[ "service" ];
$error = false;
$errorMessage = "";

switch( $requestedService ) {
    case "addFacility" :
        addFacility();
        break;

    case "getFacilities" :
        getFacilities();
        break;

    case "deleteFacility" :
        deleteFacility();
        break;
    
    default :
        // error message would go here
        echo json_encode( array("status"=>"error", "message"=>"unknown service requested") );
}

function getConnection() {

    require "../../../../wp-config.php";

    try { 
       $conn = new mysqli( DB_HOST, DB_USER, DB_PASSWORD, DB_NAME );
       return $conn;
    } 
    catch ( Exception $e ) {
        $error = true;
        $errorMessage = $e->getMessage();
        return false;
    }
}

function errorResponse() {
    return json_encode( array( "status"=>"ERROR", "message"=>$errorMessage));
}

function addFacility() {

    $conn = getConnection();

    if ( !$conn ) {
        echo errorResponse();
        return;
    }  

    try {   

        // Convert dont-send flag to Y or N
        if ( $_POST[ "ndic_facilityDontSend" ] == "true" ) {
            $dontSend = "YES";
        }
        else {
            $dontSend = "N";
        }

        $sql= "
        INSERT INTO ndic.wp_ndic_facility
        (name,
         type,
         address_01,
         address_02,
         city,
         state,
         zip_code,
         warden_name,
         chaplain_name,
         phone,
         alias_01,
         alias_02,
         alias_03,
         alias_04,
         devotional_send_disallowed_flag,
         deleted_flag,
         create_date,
         create_user_id,
         modify_date,
         modify_user_id)
        VALUES
        ('" . $_POST[ "ndic_facilityName" ] . "',
         '" . $_POST[ "ndic_facilityType" ] . "',
         '" . $_POST[  "ndic_facilityAddress01" ] . "',
         '" . $_POST[  "ndic_facilityAddress02" ] . "',
         '" . $_POST[  "ndic_facilityCity" ] . "',
         '" . $_POST[  "ndic_facilityState" ] . "',
         '" . $_POST[  "ndic_facilityZipCode" ] . "',
         '" . $_POST[  "ndic_facilityWarden" ] . "',
         '" . $_POST[  "ndic_facilityChaplain" ] . "',
         '" . $_POST[  "ndic_facilityTelephone" ] . "',
         '" . $_POST[  "ndic_facilityAlias01" ] . "',
         '" . $_POST[  "ndic_facilityAlias02" ] . "',         
         '" . $_POST[  "ndic_facilityAlias03" ] . "',         
         '" . $_POST[  "ndic_facilityAlias04" ] . "',         
         '" . $dontSend . "',
         'N', now(), 0, now(), 0 )";

         $stmt = $conn->prepare( $sql );
         
         $stmt->execute();

         if ( $conn->error ) {
             throw new Exception( $conn->error, $conn->errNo );
         }
         $insertedId = $conn->insert_id;

         $status = "OK";

         $stmt->close();

         echo json_encode( array( "status" => $status, "inserted_id" => $insertedId ) );
    }
    catch ( Exception $e ) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();
        
        echo json_encode( array( "status" => $status, "message" => $errorMessage ) );
    }
} 

function getFacilities() {

    $conn = getConnection();

    if ( !$conn ) {
        echo errorResponse();
        return;
    }  

    $array = array();

    $state = $_POST["state"];
    if ( $state != "ALL" ) {
        $stateWhere = " and state = '$state'";
    }
    else {
        $stateWhere = "";
    }

    try {   

        $sql= "
        SELECT * FROM ndic.wp_ndic_facility where deleted_flag = 'N'" 
        . $stateWhere
        . " order by name";

         $stmt = $conn->prepare( $sql );

         if ( !$stmt ) {
            throw new Exception( $conn->error, $conn->errNo );
        }

         $stmt->execute();

         if ( $conn->error ) {
             throw new Exception( $conn->error, $conn->errNo );
         }

        $result = $stmt->get_result();
        
        while( $line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array,$line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift( $array, array( "status" => $status, "message" => "successful"));
   
    }
    catch ( Exception $e ) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();
    
        array_unshift( $array, array( "status" => $status, "message" => $errorMessage ) );
    }

    echo json_encode( $array );
}

function deleteFacility() {

    $conn = getConnection();

    $array = array();

    if ( !$conn ) {
        echo errorResponse();
        return;
    }  
    try {   

        $facilityId = $_POST["facility_id"];

        $sql= "
        UPDATE ndic.wp_ndic_facility 
        SET deleted_flag = 'Y'
        WHERE facility_id = $facilityId
        ";

         $stmt = $conn->prepare( $sql );

         if ( !$stmt ) {
            throw new Exception( $conn->error, $conn->errNo );
        }

         $stmt->execute();

         if ( $conn->error ) {
             throw new Exception( $conn->error, $conn->errNo );
         }

        $status = "OK";

        $stmt->close();

        array_unshift( $array, array( "status" => $status, "message" => "successful"));
   
    }
    catch ( Exception $e ) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();
    
        array_unshift( $array, array( "status" => $status, "message" => $errorMessage ) );
    }

    echo json_encode( $array );
}
?>
