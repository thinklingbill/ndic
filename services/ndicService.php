<?php

// TODO:
// Abstract table names
// set the userid 

// Main program - call the requested service
$requestedService = $_POST["service"];
$error = false;
$errorMessage = "";

switch ($requestedService) {
    case "addFacility":
        addFacility();
        break;

    case "updateFacility":
        updateFacility();
        break;

    case "getFacilities":
        getFacilities();
        break;

    case "deleteFacility":
        deleteFacility();
        break;

    case "addRequest":
        addRequest();
        break;


    case "getRequests":
        getRequests();
        break;

    case "lookupRecipient":
        lookupRecipient();
        break;

    case "lookupFacility":
        lookupFacility();
        break;

    case "lookupRecipientFriend":
        lookupRecipientFriend();
        break;

    default:
        // error message would go here
        echo json_encode(array("status" => "error", "message" => "unknown service requested"));
}

function getConnection()
{

    require "../../../../wp-config.php";

    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        return $conn;
    } catch (Exception $e) {
        $error = true;
        $errorMessage = $e->getMessage();
        return false;
    }
}

function errorResponse()
{
    return json_encode(array("status" => "ERROR", "message" => $errorMessage));
}

function addFacility()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    try {

        // Convert dont-send flag to Y or N
        if ($_POST["ndic_facilityDontSend"] == "true") {
            $dontSend = "Y";
        } else {
            $dontSend = "N";
        }

        $sql = "
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
        ('" . $_POST["ndic_facilityName"] . "',
         '" . $_POST["ndic_facilityType"] . "',
         '" . $_POST["ndic_facilityAddress01"] . "',
         '" . $_POST["ndic_facilityAddress02"] . "',
         '" . $_POST["ndic_facilityCity"] . "',
         '" . $_POST["ndic_facilityState"] . "',
         '" . $_POST["ndic_facilityZipCode"] . "',
         '" . $_POST["ndic_facilityWardenName"] . "',
         '" . $_POST["ndic_facilityChaplainName"] . "',
         '" . $_POST["ndic_facilityTelephone"] . "',
         '" . $_POST["ndic_facilityAlias01"] . "',
         '" . $_POST["ndic_facilityAlias02"] . "',         
         '" . $_POST["ndic_facilityAlias03"] . "',         
         '" . $_POST["ndic_facilityAlias04"] . "',         
         '" . $dontSend . "',
         'N', now(), 0, now(), 0 )";

        $stmt = $conn->prepare($sql);

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }
        $insertedId = $conn->insert_id;

        $status = "OK";

        $stmt->close();

        echo json_encode(array("status" => $status, "inserted_id" => $insertedId));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        echo json_encode(array("status" => $status, "message" => $errorMessage));
    }
}

function updateFacility()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    try {
        // Convert dont-send flag to Y or N
        if ($_POST["ndic_facilityDontSend"] == "true") {
            $dontSend = "Y";
        } else {
            $dontSend = "N";
        }

        $sql = "
        UPDATE ndic.wp_ndic_facility
        SET name = '" . $_POST["ndic_facilityName"] . "',
            type = '" . $_POST["ndic_facilityType"] . "',
            address_01 = '" . $_POST["ndic_facilityAddress01"] . "',
            address_02 = '" . $_POST["ndic_facilityAddress02"] . "',
            city = '" . $_POST["ndic_facilityCity"] . "',
            state = '" . $_POST["ndic_facilityState"] . "',
            zip_code = '" . $_POST["ndic_facilityZipCode"] . "',
            warden_name = '" . $_POST["ndic_facilityWardenName"] . "',
            chaplain_name = '" . $_POST["ndic_facilityChaplainName"] . "',
            phone = '" . $_POST["ndic_facilityTelephone"] . "',
            alias_01 = '" . $_POST["ndic_facilityAlias01"] . "',
            alias_02 = '" . $_POST["ndic_facilityAlias02"] . "',         
            alias_03 = '" . $_POST["ndic_facilityAlias03"] . "',         
            alias_04 = '" . $_POST["ndic_facilityAlias04"] . "',         
            devotional_send_disallowed_flag = '" . $dontSend . "',
            deleted_flag = 'N',
            modify_date = now(),
            modify_user_id = 0
        WHERE facility_id = " . $_POST["ndic_facilityId"];

        $stmt = $conn->prepare($sql);

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }
        $insertedId = $conn->insert_id;

        $status = "OK";

        $stmt->close();

        echo json_encode(array("status" => $status, "updated_id" => $_POST["ndic_facilityId"]));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        echo json_encode(array("status" => $status, "message" => $errorMessage));
    }
}

function getFacilities()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    $array = array();

    $state = $_POST["state"];
    if ($state != "ALL") {
        $stateWhere = " and state = '$state'";
    } else {
        $stateWhere = "";
    }

    try {

        $sql = "
        SELECT * FROM ndic.wp_ndic_facility where deleted_flag = 'N'"
            . $stateWhere
            . " order by name";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $result = $stmt->get_result();

        while ($line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array, $line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}

function deleteFacility()
{

    $conn = getConnection();

    $array = array();

    if (!$conn) {
        echo errorResponse();
        return;
    }
    try {

        $facilityId = $_POST["facility_id"];

        $sql = "
        UPDATE ndic.wp_ndic_facility 
        SET deleted_flag = 'Y'
        WHERE facility_id = $facilityId
        ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}

function addRequest()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    try {

        // Convert flags to Y or N
        if ($_POST["ndic_recipientUseFacilityAddress"] == "true") {
            $ndic_recipientUseFacilityAddress = "Y";
        } else {
            $ndic_recipientUseFacilityAddress = "N";
        }

        if ($_POST["ndic_requestNoSpiralFlag"] == "true") {
            $ndic_requestNoSpiralFlag = "Y";
        } else {
            $ndic_requestNoSpiralFlag = "N";
        }

        if ($_POST["ndic_requestInTouchFlag"] == "true") {
            $ndic_requestInTouchFlag = "Y";
        } else {
            $ndic_requestInTouchFlag = "N";
        }

        if ($_POST["ndic_requestPrayerRequestFlag"] == "true") {
            $ndic_requestPrayerRequestFlag = "Y";
        } else {
            $ndic_requestPrayerRequestFlag = "N";
        }

        if ($_POST["ndic_requestBibleRequestFlag"] == "true") {
            $ndic_requestBibleRequestFlag = "Y";
        } else {
            $ndic_requestBibleRequestFlag = "N";
        }

        if ($_POST["ndic_requestSpanishFlag"] == "true") {
            $ndic_requestSpanishFlag = "Y";
        } else {
            $ndic_requestSpanishFlag = "N";
        }

        if ($_POST["ndic_requestNoDevotionalFlag"] == "true") {
            $ndic_requestNoDevotionalFlag = "Y";
        } else {
            $ndic_requestNoDevotionalFlag = "N";
        }

        if ($_POST["ndic_requestDuplicateFlag"] == "true") {
            $ndic_requestDuplicateFlag = "Y";
        } else {
            $ndic_requestDuplicateFlag = "N";
        }

        // ndic_recipientFirstName
        // ndic_recipientMI
        // ndic_recipientSuffix
        // ndic_recipientSpin
        // ndic_recipientFacilityId
        // ndic_recipientUseFacilityAddress
        // ndic_recipientAddress01
        // ndic_recipientAddress01
        // ndic_recipientCity
        // ndic_recipientState
        // ndic_recipientZipCode
        // ndic_recipientDorm
        // ndic_requestRequestingFriendId
        // ndic_requestNoSpiralFlag
        // ndic_requestInTouchFlag
        // ndic_requestPrayerRequestFlag
        // ndic_requestBibleRequestFlag
        // ndic_requestSpanishFlag
        // ndic_requestNoDevotionalFlag
        // ndic_requestDuplicateFlag
        // ndic_requestDetails

// HERE: NEED TO STORE RECIPIENT IF IT ISN'T AN EXISTING ONE, THEN SAVE 
// REQUEST

        $sql = "
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
        ('" . $_POST["ndic_facilityName"] . "',
         '" . $_POST["ndic_facilityType"] . "',
         '" . $_POST["ndic_facilityAddress01"] . "',
         '" . $_POST["ndic_facilityAddress02"] . "',
         '" . $_POST["ndic_facilityCity"] . "',
         '" . $_POST["ndic_facilityState"] . "',
         '" . $_POST["ndic_facilityZipCode"] . "',
         '" . $_POST["ndic_facilityWardenName"] . "',
         '" . $_POST["ndic_facilityChaplainName"] . "',
         '" . $_POST["ndic_facilityTelephone"] . "',
         '" . $_POST["ndic_facilityAlias01"] . "',
         '" . $_POST["ndic_facilityAlias02"] . "',         
         '" . $_POST["ndic_facilityAlias03"] . "',         
         '" . $_POST["ndic_facilityAlias04"] . "',         
         '" . $dontSend . "',
         'N', now(), 0, now(), 0 )";

        $stmt = $conn->prepare($sql);

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }
        $insertedId = $conn->insert_id;

        $status = "OK";

        $stmt->close();

        echo json_encode(array("status" => $status, "inserted_id" => $insertedId));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        echo json_encode(array("status" => $status, "message" => $errorMessage));
    }
}


function getRequests()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    $array = array();

    # get current date if no date passed
    $startDate = $_POST["request_start_date"];
    $endDate = $_POST["request_end_date"];

    if ($startDate == "") {
        $startDate = date("m/d/Y");
    }

    if ($endDate == "") {
        $endDate = date("m/d/Y");
    }

    try {
        $sql = "
  SELECT rq.request_id
        ,rq.recipient_id
        ,rq.request_date
        ,rq.first_name
        ,rq.middle_initial
        ,rq.last_name
        ,rq.suffix
        ,rq.spin
        ,rq.in_jail_flag
        ,f.name facility_name
        ,rq.use_facility_address_flag
        ,rq.address_01
        ,rq.address_02
        ,rq.city
        ,rq.state
        ,rq.zip_code
        ,rq.phone
        ,rq.dorm
        ,rq.no_spiral_flag
        ,rq.in_touch_flag
        ,rq.prayer_request_flag
        ,rq.bible_request_flag
        ,rq.spanish_flag
        ,rq.no_devotional_flag
        ,rq.duplicate_flag
        ,rq.details
        ,rq.requesting_friend_id
        ,concat(fr.first_name, case when fr.middle_initial is not null then ' ' else '' end, fr.middle_initial,' ', fr.last_name ) as requesting_friend_name
        ,rq.deleted_flag
        ,date_format(  rq.create_date, '%m/%d/%Y' ) as create_date
        ,rq.create_user_id
        ,date_format(  rq.modify_date, '%m/%d/%Y' ) as modify_date
        ,rq.modify_user_id
    FROM wp_ndic_request rq
    LEFT OUTER JOIN wp_ndic_facility f
      ON f.facility_id = rq.facility_id
    LEFT OUTER JOIN wp_ndic_recipient fr
      ON fr.recipient_id = rq.requesting_friend_id
   WHERE request_date between str_to_date( '$startDate', '%m/%d/%Y' ) 
                          and str_to_date( '$endDate', '%m/%d/%Y' )
   ORDER BY
         rq.create_date
   ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $result = $stmt->get_result();

        while ($line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array, $line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}

function lookupRecipient()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    $array = array();

    # get first and last name pattern
    $firstName = $_POST["recipient_first_name"];
    $lastName = $_POST["recipient_last_name"];

    try {
        $sql = "
  SELECT * FROM (      
  SELECT r.recipient_id
        ,r.spin
        ,r.first_name
        ,r.middle_initial
        ,r.last_name
        ,f.name facility_name
        ,r.address_01
        ,r.address_02
        ,r.city
        ,r.state
        ,r.zip_code
        ,r.phone
        ,r.dorm
        ,date_format(rq.request_date,'%m/%d/%y') as last_request_date
        ,row_number() over ( partition by rq.recipient_id order by rq.request_date desc ) pref
    FROM wp_ndic_recipient r
    LEFT OUTER JOIN wp_ndic_facility f
      ON f.facility_id = r.facility_id
    JOIN wp_ndic_request rq
      on rq.recipient_id = r.recipient_id
   WHERE upper( r.first_name ) like upper( '$firstName' ) 
     and upper( r.last_name ) like upper( '$lastName' )
) t 
 WHERE t.pref = 1 
 ORDER BY
       t.last_name, t.first_name
   ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $result = $stmt->get_result();

        while ($line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array, $line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}

function lookupFacility()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    $array = array();

    # get first and last name pattern
    $facilityMatchText = "%" . $_POST["facility_match_text"] . "%";

    try {
        $sql = "
  SELECT f.facility_id
        ,f.name as facility_name
        ,f.address_01
        ,f.address_02
        ,f.city
        ,f.state
        ,f.zip_code
    FROM wp_ndic_facility f
   WHERE upper( f.name ) like upper( '$facilityMatchText' ) 
   ORDER BY
         f.name
   ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $result = $stmt->get_result();

        while ($line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array, $line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}

function lookupRecipientFriend()
{

    $conn = getConnection();

    if (!$conn) {
        echo errorResponse();
        return;
    }

    $array = array();

    # get first and last name pattern
    $friendMatchText = $_POST["friend_match_text"] . "%";

    try {
        $sql = "
  SELECT r.recipient_id
        ,r.first_name
        ,r.middle_initial
        ,r.last_name
        ,r.address_01
        ,r.address_02
        ,r.city
        ,r.state
        ,r.zip_code
    FROM wp_ndic_recipient r
   WHERE upper( concat( r.first_name, ' ', r.last_name ) ) like upper( '$friendMatchText' ) 
   ORDER BY
         r.last_name, r.first_name
   ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $stmt->execute();

        if ($conn->error) {
            throw new Exception($conn->error, $conn->errNo);
        }

        $result = $stmt->get_result();

        while ($line = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($array, $line);
        }
        $status = "OK";

        $stmt->close();

        array_unshift($array, array("status" => $status, "message" => "successful"));
    } catch (Exception $e) {
        $status = "ERROR";
        $errorMessage = $e->getMessage();

        array_unshift($array, array("status" => $status, "message" => $errorMessage));
    }

    echo json_encode($array);
}
