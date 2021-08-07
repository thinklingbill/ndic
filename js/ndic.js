// TODO - REMOVE HARDCODING FROM AJAX SERVICES
// REMOVE HARDCODING OF ROOT FOLDER

//
///////////////////////////////
// global variables
///////////////////////////////
var _unsavedData = false;
var _eventFacilityId; // for facility events.

///////////////////////////////
// Menu functions
///////////////////////////////
function renderMenu() {
   console.log("renderMenu");

   jQuery("#ndic_Menu").html(
      "<div class='ndic_menu'> \
       <span class='ndic_menu_item' id=ndic_menuRequests>Requests</span> \
       <span class='ndic_menu_item' id=ndic_menuFacilities>Facilities</span> \
       <span class='ndic_menu_item' id=ndic_menuMailings>Mailings</span> \
       <span class='ndic_menu_item' id=ndic_menuSearch>Search</span> \
       <span class='ndic_menu_item' id=ndic_menuReports>Reports</span> \
       <span class='ndic_menu_item' id=ndic_menuAddressCorrection>Address Correction</span> \
       <span class='ndic_menu_item' id=ndic_menuChooser>Chooser</span> \
       </div> \
       <div id=ndic_subMenu></div> \
      ");

   menuEventSetup();
}

function menuEventSetup() {
   console.log("eventSetup");

   setupEvent("#ndic_menuRequests", "click", eventMenuRequests);
   setupEvent("#ndic_menuFacilities", "click", eventMenuFacilities);
}

function eventMenuRequests() {
   console.log("eventMenuRequests");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuRequestsWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderRequestsPage();
      actionEnded();
   }
}

function eventMenuRequestsWithReset() {
   console.log("eventMenuRequestsWithReset");
   resetChangedFlag();
   eventMenuRequests();
}

function eventMenuFacilities() {
   console.log("eventMenuFacilities");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuFacilitiesWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderFacilitiesPage();
      actionEnded();
   }
}

function eventMenuFacilitiesWithReset() {
   console.log("eventMenuFacilitiesWithReset");
   resetChangedFlag();
   eventMenuFacilities();
}


///////////////////////////////
// Request functions
///////////////////////////////

function renderRequestsPage() {
   console.log("renderRequestsPage");

   jQuery("#ndic_ActionCanvas").html("\
       <div id=ndic_requestsPage></div> \
      " );

   renderRequestsSubMenu();

   renderRequestsList();
}

function renderRequestsSubMenu() {
   console.log("renderRequestsSubmenu");
   jQuery("#ndic_subMenu").html("");

}

function eventMenuRequestsPage() {
   console.log("eventMenuRequestsPage");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuRequestsPageWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderRequestsPage();
      //      setupEvent("#ndic_newRequestBtn", "click", eventMenuRequestsEntry);
      actionEnded();
   }
}

function eventRequestsChange() {
   console.log("eventRequestsChange");
   clearMessage();

   _unsavedData = true;
}

function eventRequestsFirstOrLastNameChange() {
   console.log("eventRequestsFirstOrLastNameChange");
   eventRequestsChange()

   // if both fields have a value, do a lookup
   firstName = jQuery("#ndic_recipientFirstName").val();
   lastName = jQuery("#ndic_recipientLastName").val();

   if (firstName > "" && lastName > "") {
      console.log(firstName + " " + lastName)
      pos = jQuery("#ndic_recipientLastName").position();
      height = jQuery("#ndic_recipientLastName").height();

      // see if any recipient names match
      jQuery.ajax({
         method: "POST",
         url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
         data: {
            service: "lookupRecipient"
            , recipient_first_name: firstName
            , recipient_last_name: lastName
         }
      })
         .done(function (json) {
            actionEnded();
            //console.log(json);
            res = JSON.parse(json);

            if (res[0].status != "OK") {
               setError(res[0].message)
            }
            else {
               if (res.length > 1) {
                  var html = "";
                  for (var i = 1; i < res.length; i++) {
                     html += "<span>" + res[i].recipient_id + "<span>";
                     html += "<span>" + res[i].first_name + " " + res[i].last_name + "</span>";
                     html += "<br />";
                  }
               }

               jQuery("#ndic_requestsPopUp").html(html);
               jQuery("#ndic_requestsPopUp").css({ top: pos.top + height + 10, left: pos.left - 100, position: 'absolute' });
               requestsPopUp()
            }
         });
   }
}

// render functions
function renderRequestsList() {
   console.log("renderRequestsList");

   jQuery("#ndic_requestsPage").html(" \
   <div> \
      <div class=ndic_filter>Date Range: \
            <input id=ndic_filterDateRangeStart class=ndic_form_entry_small value='07/02/2021'></input> \
            <input id=ndic_filterDateRangeEnd class=ndic_form_entry_small value='07/02/2021'></input> \
            <input type=checkbox id=ndic_requestOnlyMyRequests></input> <span>Only Show My Requests</span> \
            <button class=ndic_button id=ndic_retrieveDateRangeBtn>Retrieve</button> \
      </div> \
      <div class=ndic_page_title>Add New Request</div> \
      <div id=ndic_requestsEntry></div> \
      <div id=ndic_requestsTable></div> \
   </div> \
   " );

   setupEvent("#ndic_retrieveDateRangeBtn", "click", renderRequestsTable)

   renderRequestsEntry();

   renderRequestsTable();
}

function renderRequestsEntry() {

   console.log("renderRequestsEntry");

   jQuery("#ndic_requestsEntry").html(" \
            <div id=ndic_requestForm> \
               <input id=ndic_requestId class=ndic_hidden value=0 /> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>First Name:</span> <input id=ndic_recipientFirstName class=ndic_form_entry_medium></input>\
                  <span class=ndic_form_label_not_padded>MI:</span> <input id=ndic_recipientMI class=ndic_form_entry_small></input>\
                  <span class=ndic_form_label_not_padded>Last Name:</span> <input id=ndic_recipientLastName class=ndic_form_entry_medium></input>\
               </div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>Suffix:</span> <input id=ndic_recipientSuffix class=ndic_form_entry_small></input> \
                  <span class=ndic_form_label_not_padded>ID #:</span> <input id=ndic_recipientSpin class=ndic_form_entry_small></input> \
               </div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>Facility:</span><span>Match Text*</span> \
                  <input id=ndic_recipientFacilityMatchText class=ndic_form_entry_small></input> \
                  <select id=ndic_recipientFacilityId class=ndic_form_entry_big></select> \
                  <input type=checkbox id=ndic_recipientUseFacilityAddress></input> <span>Use Facility Address</span> \
               </div> \
               <div class=ndic_form_row><span class=ndic_form_label>Address 1:</span> <input id=ndic_recipientAddress01 class=ndic_form_entry_big></input></div> \
               <div class=ndic_form_row><span class=ndic_form_label>Address 2:</span> <input id=ndic_recipientAddress02 class=ndic_form_entry_big></input></div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>City:</span> <input id=ndic_recipientCity class=ndic_form_entry_medium></input> \
                  <span class=ndic_form_label_not_padded>State:</span> <select id=ndic_recipientState class=ndic_form_entry_medium>" + stateDropDown(false, true) + "</select> \
                  <span class=ndic_form_label_not_padded>Zip Code:</span> <input id=ndic_recipientZipCode class='ndic_form_entry_small ndic_zip_code'></input> \
               </div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>Dorm:</span> <input id=ndic_recipientDorm class=ndic_form_entry_medium></input> \
                  <span class=ndic_form_label_not_padded>Friend of: <i>Match text**</i>:</span> <input id=ndic_recipientFriendOf class=ndic_form_entry_medium></input> \
               </div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>Options:</span> \
                  <input type=checkbox id=ndic_requestNoSpiralFlag></input> <span>No Spiral&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestInTouchFlag></input> <span>In Touch&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestPrayerRequestFlag></input> <span>Prayer Request&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestBibleRequestFlag></input> <span>Bible Request&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestSpanishFlag></input> <span>Spanish&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestNoDevotionalFlag></input> <span>No Devotional&nbsp;&nbsp;</span> \
                  <input type=checkbox id=ndic_requestDuplicateFlag></input> <span>Duplicate&nbsp;&nbsp;</span> \
               </div> \
               <div class=ndic_form_row> \
                  <span class=ndic_form_label>Details:</span> \
                  <textarea id=ndic_requestDetails></textarea> \
               </div> \
               <div class=ndic_button_row> \
                  <button class=ndic_button id=ndic_requestAddBtn>Add Request</button> \
                  <button class=ndic_button id=ndic_requestTestBtn>Test</button> \
                  <div class=ndic_form_label>* = Required</div> \
            </div> \
            <div id=ndic_requestsPopUp class=popUp>Hello World</div> \
      " );

   // setup field masks
   jQuery('.ndic_phone').mask('(000) 000-0000');
   jQuery('.ndic_zip_code').mask('00000-ZZZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });

   setupEvent("#ndic_requestsEntry input", "change", eventRequestsChange);

   setupEvent("#ndic_recipientFirstName", "change", eventRequestsFirstOrLastNameChange);
   setupEvent("#ndic_recipientLastName", "change", eventRequestsFirstOrLastNameChange);

   setupEvent("#ndic_requestTestBtn", "click", requestsPopUp);
}

function renderRequestsTable() {
   console.log("renderRequestsTable");

   actionStarted();

   jQuery.ajax({
      method: "POST",
      url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: {
         service: "getRequests"
         , request_start_date: jQuery("#ndic_filterDateRangeStart").val()
         , request_end_date: jQuery("#ndic_filterDateRangeEnd").val()
      }
   })
      .done(function (json) {
         actionEnded();
         //console.log(json);
         res = JSON.parse(json);

         if (res[0].status != "OK") {
            setError(res[0].message)
         }
         else {
            var html = "<table class='ndic_table'>";
            html += "<thead>";
            html += "<tr>";
            html += "<th></th>";
            html += "<th>Name</th>";
            html += "<th>ID #</th>";
            html += "<th>Facility</th>";
            html += "<th>Address</th>";
            html += "<th>City</th>";
            html += "<th>State</th>";
            html += "<th>Zip Code</th>";
            html += "<th>Entered On</th>";
            html += "<th>Dorm</th>";
            html += "<th>Details</th>";
            html += "<th>N.S.</th>";
            html += "<th>I.T.</th>";
            html += "<th>P.R.</th>";
            html += "<th>B.R.</th>";
            html += "<th>S</th>";
            html += "<th>N.D.</th>";
            html += "<th>Dup</th>";
            html += "<th>Friend Of</th>";
            html += "<th>Entered By</th>";
            html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
            for (var i = 1; i < res.length; i++) {
               html += "<tr>";
               html += "<td><a href='#' class='editRequest' request_id='"
                  + res[i].request_id + "'>edit</a> | ";
               html += "<a href='#' class='deleteRequest' request_id='"
                  + res[i].request_id + "'>delete</a></td>";
               html += "<td class=recipientName>" + res[i].first_name + " "
                  + res[i].middle_initial + " "
                  + res[i].last_name + "</td>";
               html += "<td class=recipientSpin>" + res[i].spin + "</td>";
               html += "<td class=recipientFacility>" + res[i].facility_name + "</td>";
               html += "<td><span class=recipientAddress01>" + res[i].address_01 + "</span> "
                  + "<span class=recipientAddress02>" + res[i].address_02 + "</span></td>";
               html += "<td class=recipientCity>" + res[i].city + "</td>";
               html += "<td class=recipientState>" + res[i].state + "</td>";
               html += "<td class=recipientZipCode>" + res[i].zip_code + "</td>";
               html += "<td class=requestCreateDate>" + res[i].create_date + "</td>";
               html += "<td class=recipientDorm>" + res[i].dorm + "</td>";
               html += "<td class=requestDetails>" + res[i].details + "</td>";
               html += "<td class=requestNoSpiralFlag>" + res[i].no_spiral_flag + "</td>";
               html += "<td class=requestInTouchFlag>" + res[i].in_touch_flag + "</td>";
               html += "<td class=requestPrayerRequestFlag>" + res[i].prayer_request_flag + "</td>";
               html += "<td class=requestBibleRequestFlag>" + res[i].bible_request_flag + "</td>";
               html += "<td class=requestSpanishFlag>" + res[i].spanish_flag + "</td>";
               html += "<td class=requestNoDevotionalFlag>" + res[i].no_devotional_flag + "</td>";
               html += "<td class=requestDuplicateFlag>" + res[i].duplicate_flag + "</td>";
               html += "<td class=requestRequestingFriendName>" + res[i].requesting_friend_name + "</td>";
               html += "<td class=requestEnteredBy>" + "</td>";
               html += "</tr>";
            }
            html += "</tbody>";
            html += "</table>";

            jQuery("#ndic_requestsTable").html(html);
            // TODO Set these up
            // setupEvent(".editRequest", "click", eventRequestEdit);
            // setupEvent(".deleteRequest", "click", eventRequestDelete)
         }
      });
}

function requestsPopUp() {
   console.log("requestPopUp ***************************************");
   jQuery("#ndic_requestsPopUp").show();
}


///////////////////////////////
// Facility functions
///////////////////////////////
function renderFacilitiesPage() {
   console.log("renderFacilitiesPage");

   jQuery("#ndic_ActionCanvas").html(
      "<div id=ndic_facilitiesEntry></div> \
       <div id=ndic_facilitiesList></div> \
       <div id=ndic_facilitiesMerge></div> \
      " );

   renderFacilitiesSubMenu();

   eventMenuFacilitiesList();
}

function renderFacilitiesSubMenu() {
   console.log("renderFacilitiesSubMenu");
   jQuery("#ndic_subMenu").html(
      "<div class='ndic_menu'> \
       <span class='ndic_menu_item' id=ndic_menuFacilitiesList>Facilities List</span> \
       <span class='ndic_menu_item' id=ndic_menuFacilitiesMerge>Facilities Merge</span> \
       </div> \
      ");

   facilitiesSubMenuEventSetup();
}

function facilitiesSubMenuEventSetup() {
   console.log("facilitiesSubMenuEventSetup");
   // setup events
   setupEvent("#ndic_menuFacilitiesList", "click", eventMenuFacilitiesList);
   setupEvent("#ndic_menuFacilitiesMerge", "click", eventMenuFacilitiesMerge);
}

function highlightMenu() {
   console.log("highlightMenu STUB");
}

// Menu events
function eventMenuFacilitiesList() {
   console.log("eventMenuFacilitiesList");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuFacilitiesListWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderFacilitiesList();
      jQuery("#ndic_facilitiesAddNewButton").show();
      jQuery("#ndic_facilitiesEntry").hide();
      jQuery("#ndic_facilitiesList").show();
      jQuery("#ndic_facilitiesMerge").hide();
      setupEvent("#ndic_newFacilityBtn", "click", eventMenuFacilitiesEntry);
      actionEnded();
   }
}

function eventMenuFacilitiesListWithReset() {
   console.log("eventMenuFacilitiesListWithReset");
   resetChangedFlag();
   eventMenuFacilitiesList();
}


function eventMenuFacilitiesMerge() {
   console.log("eventMenuFacilitiesMerge");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuFacilitiesMergeWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      jQuery("#ndic_facilitiesMerge").show();
      jQuery("#ndic_facilitiesList").hide();
      actionEnded();
   }
}

function eventMenuFacilitiesMergeWithReset() {
   console.log("eventMenuFacilitiesMergeWithReset");
   resetChangedFlag();
   eventMenuFacilitiesMerge();
}

function eventMenuFacilitiesEntry() {
   console.log("eventMenuFacilitiesEntry");
   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuFacilitiesEntryWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderFacilitiesEntry();
      jQuery("#ndic_facilitiesAddNewButton").hide();
      jQuery("#ndic_facilitiesEntry").show();
      jQuery("#ndic_facilitiesList").hide();
      setupEvent("#ndic_facilityAddBtn", "click", eventFacilityAdd);
      setupEvent("#ndic_facilityCancelBtn", "click", eventFacilityCancelCheck);
      jQuery("#ndic_facilityAddBtn").show()
      jQuery("#ndic_facilityUpdateBtn").hide()
      jQuery("#ndic_facilityName").focus();
      actionEnded();
   }
}

function eventMenuFacilitiesEntryWithReset() {
   console.log("eventMenuFacilitiesEntryWithReset");
   resetChangedFlag();
   eventMenuFacilitiesEntry();
}

function eventFacilitiesChange() {
   console.log("eventFacilitiesChange");
   clearMessage();

   _unsavedData = true;
}

// render functions
function renderFacilitiesList() {
   console.log("renderFacilitiesList");

   jQuery("#ndic_facilitiesList").html(" \
   <div> \
      <div class=ndic_filter>Filter by State: \
            <select id=ndic_filterState>" + stateDropDown(true, false) + "</select></div> \
      <div class=ndic_page_title>Facility Administration</div> \
      <div id=ndic_facilitiesAddNewButton> \
         <button class=ndic_button id=ndic_newFacilityBtn>Add New Facility</button> \
      </div> \
      <div class=ndic_action_link_label>Extract this data to Excel</div> \
      <div id=ndic_facilitiesTable></div> \
   </div> \
   " );

   setupEvent("#ndic_filterState", "change", renderFacilitiesTable)

   renderFacilitiesTable();
}

function renderFacilitiesEntry() {
   console.log("renderFacilitiesEntry");

   jQuery("#ndic_facilitiesEntry").html(" \
         <div class=ndic_page_title>Add a Correctional Facility</div> \
         <div id=ndic_facilityForm> \
            <input id=ndic_facilityId class=ndic_hidden value=0 /> \
            <div class=ndic_form_row><span class=ndic_form_label>Facility Name:</span> <input id=ndic_facilityName class=ndic_form_entry_big></input> *</div> \
            <div class=ndic_form_row><span class=ndic_form_label>Aliases:</span> \
               <input id=ndic_facilityAlias01 class=ndic_form_entry_small></input> \
               <input id=ndic_facilityAlias02 class=ndic_form_entry_small></input> \
               <input id=ndic_facilityAlias03 class=ndic_form_entry_small></input> \
               <input id=ndic_facilityAlias04 class=ndic_form_entry_small></input> \
            </div> \
            <div class=ndic_form_row><span class=ndic_form_label>Type:</span> \
               <select id=ndic_facilityType> \
                  <option value='F'>Federal</option> \
                  <option value='S'>State</option> \
                  <option value='L'>Local</option> \
               </select>\
            </div> \
            <div class=ndic_form_row><span class=ndic_form_label>Address 1:</span> <input id=ndic_facilityAddress01 class=ndic_form_entry_big></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Address 2:</span> <input id=ndic_facilityAddress02 class=ndic_form_entry_big></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>City:</span> <input id=ndic_facilityCity class=ndic_form_entry_medium></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>State:</span> <select id=ndic_facilityState class=ndic_form_entry_medium>" + stateDropDown(false, true) + "</select></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Zip Code:</span> <input id=ndic_facilityZipCode class='ndic_form_entry_small ndic_zip_code'></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Warden:</span> <input id=ndic_facilityWardenName class=ndic_form_entry_medium></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Chaplain:</span> <input id=ndic_facilityChaplainName class=ndic_form_entry_medium></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Telephone:</span> <input id=ndic_facilityTelephone class='ndic_form_entry_medium ndic_phone'></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label></span><span class=ndic_form_entry_big> <input type=checkbox id=ndic_facilityDontSend></input> Don't send devotionals to this facility</span></div> \
            <div class=ndic_button_row> \
               <button class=ndic_button id=ndic_facilityAddBtn>Add Facility</button> \
               <button class=ndic_button id=ndic_facilityUpdateBtn>Update Facility</button> \
               <button class=ndic_button id=ndic_facilityCancelBtn>Cancel</button></div> \
            <div class=ndic_form_label>* = Required</div> \
         </div> \
   " );

   // setup field masks
   jQuery('.ndic_phone').mask('(000) 000-0000');
   jQuery('.ndic_zip_code').mask('00000-ZZZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });

   setupEvent("#ndic_facilitiesEntry input", "change", eventFacilitiesChange);
}

function renderFacilitiesTable() {
   console.log("renderFacilitiesTable");
   console.log("State dropdown value" + jQuery("#ndic_filterState").val())

   actionStarted();

   jQuery.ajax({
      method: "POST",
      url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: {
         service: "getFacilities"
         , state: jQuery("#ndic_filterState").val()
      }
   })
      .done(function (json) {
         actionEnded();
         //console.log(json);
         res = JSON.parse(json);

         if (res[0].status != "OK") {
            setError(res[0].message)
         }
         else {
            var html = "<table class='ndic_table'>";
            html += "<thead>";
            html += "<tr>";
            html += "<th></th>";
            html += "<th>Facility Name</th>";
            html += "<th>Type</th>";
            html += "<th>Address</th>";
            html += "<th>City</th>";
            html += "<th>State</th>";
            html += "<th>Zip Code</th>";
            html += "<th>Aliases</th>";
            html += "<th>No Devotionals?</th>";
            html += "<th>Warden</th>";
            html += "<th>Chaplain</th>";
            html += "<th>Phone</th>";
            html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
            for (var i = 1; i < res.length; i++) {
               html += "<tr>";
               html += "<td><a href='#' class='editFacility' facility_id='"
                  + res[i].facility_id + "'>edit</a> | ";
               html += "<a href='#' class='deleteFacility' facility_id='"
                  + res[i].facility_id + "' facility_name='"
                  + res[i].name + "'>delete</a></td>";
               html += "<td class=facilityName>" + res[i].name + "</td>";
               html += "<td class=facilityType>" + res[i].type + "</td>";
               html += "<td><span class=facilityAddress01>" + res[i].address_01 + "</span> "
                  + "<span class=facilityAddress02>" + res[i].address_02 + "</span></td>";
               html += "<td class=facilityCity>" + res[i].city + "</td>";
               html += "<td class=facilityState>" + res[i].state + "</td>";
               html += "<td class=facilityZipCode>" + res[i].zip_code + "</td>";
               html += "<td><span class=facilityAlias01>" + res[i].alias_01 + "</span> "
                  + "<span class=facilityAlias02>" + res[i].alias_02 + "</span> "
                  + "<span class=facilityAlias03>" + res[i].alias_03 + "</span> "
                  + "<span class=facilityAlias04>" + res[i].alias_03 + "</span></td>";
               html += "<td class=facilityDontSend>" + res[i].devotional_send_disallowed_flag + "</td>";
               html += "<td class=facilityWardenName>" + res[i].warden_name + "</td>";
               html += "<td class=facilityChaplainName>" + res[i].chaplain_name + "</td>";
               html += "<td class=facilityTelephone>" + res[i].phone + "</td>";
               html += "</tr>";
            }
            html += "</tbody>";
            html += "</table>";

            jQuery("#ndic_facilitiesTable").html(html);
            setupEvent(".editFacility", "click", eventFacilityEdit);
            setupEvent(".deleteFacility", "click", eventFacilityDelete)
         }
      });
}

// button events
function eventFacilityAdd() {
   console.log("eventFacilityAdd");

   // validate that the facility data is good
   if (validateFacilityData()) {
      // call the service to add facility data
      actionStarted();
      jQuery.ajax({
         method: "POST",
         url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
         data: {
            service: "addFacility",
            ndic_facilityName: jQuery("#ndic_facilityName").val(),
            ndic_facilityAlias01: jQuery("#ndic_facilityAlias01").val(),
            ndic_facilityAlias02: jQuery("#ndic_facilityAlias02").val(),
            ndic_facilityAlias03: jQuery("#ndic_facilityAlias03").val(),
            ndic_facilityAlias04: jQuery("#ndic_facilityAlias04").val(),
            ndic_facilityType: jQuery("#ndic_facilityType").val(),
            ndic_facilityAddress01: jQuery("#ndic_facilityAddress01").val(),
            ndic_facilityAddress02: jQuery("#ndic_facilityAddress02").val(),
            ndic_facilityCity: jQuery("#ndic_facilityCity").val(),
            ndic_facilityState: jQuery("#ndic_facilityState").val(),
            ndic_facilityZipCode: jQuery("#ndic_facilityZipCode").val(),
            ndic_facilityWardenName: jQuery("#ndic_facilityWardenName").val(),
            ndic_facilityChaplainName: jQuery("#ndic_facilityChaplainName").val(),
            ndic_facilityTelephone: jQuery("#ndic_facilityTelephone").val(),
            ndic_facilityDontSend: jQuery('#ndic_facilityDontSend').is(':checked'),
         }
      })
         .done(function (json) {
            actionEnded();
            //console.log( json );
            res = JSON.parse(json);

            //console.log( res );

            if (res.status != "OK") {
               setError(res.message)
            }
            else {
               resetChangedFlag();
               eventMenuFacilitiesList();
               informTheUser("Facility saved")
            }

         });
   }
}

function eventFacilityUpdate() {
   console.log("eventFacilityUpdate");

   // validate that the facility data is good
   if (validateFacilityData()) {
      // call the service to add facility data
      actionStarted();
      jQuery.ajax({
         method: "POST",
         url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
         data: {
            service: "updateFacility",
            ndic_facilityId: jQuery("#ndic_facilityId").val(),
            ndic_facilityName: jQuery("#ndic_facilityName").val(),
            ndic_facilityAlias01: jQuery("#ndic_facilityAlias01").val(),
            ndic_facilityAlias02: jQuery("#ndic_facilityAlias02").val(),
            ndic_facilityAlias03: jQuery("#ndic_facilityAlias03").val(),
            ndic_facilityAlias04: jQuery("#ndic_facilityAlias04").val(),
            ndic_facilityType: jQuery("#ndic_facilityType").val(),
            ndic_facilityAddress01: jQuery("#ndic_facilityAddress01").val(),
            ndic_facilityAddress02: jQuery("#ndic_facilityAddress02").val(),
            ndic_facilityCity: jQuery("#ndic_facilityCity").val(),
            ndic_facilityState: jQuery("#ndic_facilityState").val(),
            ndic_facilityZipCode: jQuery("#ndic_facilityZipCode").val(),
            ndic_facilityWardenName: jQuery("#ndic_facilityWardenName").val(),
            ndic_facilityChaplainName: jQuery("#ndic_facilityChaplainName").val(),
            ndic_facilityTelephone: jQuery("#ndic_facilityTelephone").val(),
            ndic_facilityDontSend: jQuery('#ndic_facilityDontSend').is(':checked'),
         }
      })
         .done(function (json) {
            actionEnded();
            //console.log( json );
            res = JSON.parse(json);

            //console.log( res );

            if (res.status != "OK") {
               setError(res.message)
            }
            else {
               resetChangedFlag();
               eventMenuFacilitiesList();
               informTheUser("Facility saved")
            }

         });
   }
}

function eventFacilityCancelCheck() {
   console.log("eventFacilityCancelCheck");

   var okToCancel = okToSwitch();

   if (!okToCancel) {
      verifyOK(
         "You have made changes to the data. Are you OK to discard them?"
         , "Cancel Changes"
         , "Stay on Form"
         , eventFacilityCancel
         , clearMessage);
   }
   else {
      eventFacilityCancel();
   }
}

function eventFacilityCancel() {
   console.log("eventFacilityCancel");
   resetChangedFlag();
   eventMenuFacilitiesList();
}

function eventFacilityEdit() {
   console.log("eventFacilityEdit")

   // gather values from the row
   var facilityId = jQuery(this).attr("facility_id");
   var facilityName = jQuery(this).closest('tr').find(".facilityName").text();
   var facilityType = jQuery(this).closest('tr').find(".facilityType").text();
   var facilityAddress01 = jQuery(this).closest('tr').find(".facilityAddress01").text();
   var facilityAddress02 = jQuery(this).closest('tr').find(".facilityAddress02").text();
   var facilityCity = jQuery(this).closest('tr').find(".facilityCity").text();
   var facilityState = jQuery(this).closest('tr').find(".facilityState").text();
   var facilityZipCode = jQuery(this).closest('tr').find(".facilityZipCode").text();
   var facilityAlias01 = jQuery(this).closest('tr').find(".facilityAlias01").text();
   var facilityAlias02 = jQuery(this).closest('tr').find(".facilityAlias02").text();
   var facilityAlias03 = jQuery(this).closest('tr').find(".facilityAlias03").text();
   var facilityAlias04 = jQuery(this).closest('tr').find(".facilityAlias04").text();
   var facilityDontSend = jQuery(this).closest('tr').find(".facilityDontSend").text();
   var facilityWardenName = jQuery(this).closest('tr').find(".facilityWardenName").text();
   var facilityChaplainName = jQuery(this).closest('tr').find(".facilityChaplainName").text();
   var facilityTelephone = jQuery(this).closest('tr').find(".facilityTelephone").text();

   console.log("eventFacilityEdit: " + facilityId + " - " + facilityName);

   clearMessage();

   if (!okToSwitch()) {
      verifySwitchWithPendingChanges(eventMenuFacilitiesEntryWithReset)
   }
   else {
      actionStarted();
      highlightMenu();
      renderFacilitiesEntry();
      // populate the form      
      jQuery("#ndic_facilitiesEntry #ndic_facilityId").val(facilityId);
      jQuery("#ndic_facilitiesEntry #ndic_facilityName").val(facilityName);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAddress01").val(facilityAddress01);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAddress02").val(facilityAddress02);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAlias01").val(facilityAlias01);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAlias02").val(facilityAlias02);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAlias03").val(facilityAlias03);
      jQuery("#ndic_facilitiesEntry #ndic_facilityAlias04").val(facilityAlias04);
      jQuery("#ndic_facilitiesEntry #ndic_facilityType").val(facilityType);
      jQuery("#ndic_facilitiesEntry #ndic_facilityCity").val(facilityCity);
      jQuery("#ndic_facilitiesEntry #ndic_facilityState").val(facilityState);
      jQuery("#ndic_facilitiesEntry #ndic_facilityZipCode").val(facilityZipCode);
      jQuery("#ndic_facilitiesEntry #ndic_facilityWardenName").val(facilityWardenName);
      jQuery("#ndic_facilitiesEntry #ndic_facilityChaplainName").val(facilityChaplainName);
      jQuery("#ndic_facilitiesEntry #ndic_facilityTelephone").val(facilityTelephone);

      jQuery("#ndic_facilitiesAddNewButton").hide();
      jQuery("#ndic_facilitiesEntry").show();
      jQuery("#ndic_facilitiesList").hide();
      setupEvent("#ndic_facilityUpdateBtn", "click", eventFacilityUpdate);
      setupEvent("#ndic_facilityCancelBtn", "click", eventFacilityCancelCheck);
      jQuery("#ndic_facilityAddBtn").hide()
      jQuery("#ndic_facilityUpdateBtn").show()
      jQuery("#ndic_facilityName").focus();
      actionEnded();
   }

}

function eventFacilityDelete() {
   console.log("eventFacilityDelete")
   _eventFacilityId = jQuery(this).attr("facility_id")
   modalMessage("Are you sure you want to delete facility "
      + jQuery(this).attr("facility_name") + "?"
      , "Confirm delete"
      , "Cancel"
      , eventFacilityDeleteFinalize
      , clearMessage);
}

function eventFacilityDeleteFinalize() {
   console.log("eventFacilityDeleteFinalize");
   actionStarted();

   jQuery.ajax({
      method: "POST",
      url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: {
         service: "deleteFacility",
         facility_id: _eventFacilityId,
      }
   })
      .done(function (json) {
         actionEnded();
         //console.log( json );
         res = JSON.parse(json);
         console.log(res);
         if (res[0].status != "OK") {
            setError(res.message)
         }
         else {
            eventMenuFacilitiesList();
            informTheUser("Facility deleted")
         }

      });

   clearMessage();
}

///////////////////////////////
// Facility validation functions
///////////////////////////////
function validateFacilityData() {
   return true;
}

///////////////////////////////
// dropdowns
///////////////////////////////
function stateDropDown(includeAllOption, includeSelectOption) {
   var html = "";

   if (includeAllOption) {
      html += "<option value='ALL'>All States</option>";
   }

   if (includeSelectOption) {
      html += "<option value=''>[Select a State]</option>";
   }

   html += "<option value='AL'>AL - Alabama</option> \
   <option value='AK'>AK - Alaska</option> \
   <option value='AZ'>AZ - Arizona</option> \
   <option value='AR'>AR - Arkansas</option> \
   <option value='CA'>CA - California</option> \
   <option value='CO'>CO - Colorado</option> \
   <option value='CT'>CT - Connecticut</option> \
   <option value='DE'>DE - Delaware</option> \
   <option value='DC'>DC - District of Columbia</option> \
   <option value='FL'>FL - Florida</option> \
   <option value='GA'>GA - Georgia</option> \
   <option value='HI'>HI - Hawaii</option> \
   <option value='ID'>ID - Idaho</option> \
   <option value='IL'>IL - Illinois</option> \
   <option value='IN'>IN - Indiana</option> \
   <option value='IA'>IA - Iowa</option> \
   <option value='KS'>KS - Kansas</option> \
   <option value='KY'>KY - Kentucky</option> \
   <option value='LA'>LA - Louisiana</option> \
   <option value='ME'>ME - Maine</option> \
   <option value='MD'>MD - Maryland</option> \
   <option value='MA'>MA - Massachusetts</option> \
   <option value='MI'>MI - Michigan</option> \
   <option value='MN'>MN - Minnesota</option> \
   <option value='MS'>MS - Mississippi</option> \
   <option value='MO'>MO - Missouri</option> \
   <option value='MT'>MT - Montana</option> \
   <option value='NE'>NE - Nebraska</option> \
   <option value='NV'>NV - Nevada</option> \
   <option value='NH'>NH - New Hampshire</option> \
   <option value='NJ'>NJ - New Jersey</option> \
   <option value='NM'>NM - New Mexico</option> \
   <option value='NY'>NY - New York</option> \
   <option value='NC'>NC - North Carolina</option> \
   <option value='ND'>ND - North Dakota</option> \
   <option value='OH'>OH - Ohio</option> \
   <option value='OK'>OK - Oklahoma</option> \
   <option value='OR'>OR - Oregon</option> \
   <option value='PA'>PA - Pennsylvania</option> \
   <option value='RI'>RI - Rhode Island</option> \
   <option value='SC'>SC - South Carolina</option> \
   <option value='SD'>SD - South Dakota</option> \
   <option value='TN'>TN - Tennessee</option> \
   <option value='TX'>TX - Texas</option> \
   <option value='UT'>UT - Utah</option> \
   <option value='VT'>VT - Vermont</option> \
   <option value='VA'>VA - Virginia</option> \
   <option value='WA'>WA - Washington</option> \
   <option value='WV'>WV - West Virginia</option> \
   <option value='WI'>WI - Wisconsin</option> \
   <option value='WY'>WY - Wyoming</option>";

   return html;
}

///////////////////////////////
// user verification Functions
///////////////////////////////
function verifyOK(message, button1, button2, button1Event, button2Event) {
   modalMessage(message, button1, button2, button1Event, button2Event);
}

function verifySwitchWithPendingChanges(switchEvent) {
   console.log("verifySwitchWithPendingChanges")
   verifyOK(
      "You have made changes to the data. Are you OK to discard them?"
      , "Leave Form"
      , "Stay on Form"
      , switchEvent
      , clearMessage
      , );
}

///////////////////////////////
// message functions
///////////////////////////////
function clearMessage() {
   jQuery("#ndic_Message").html("");
   jQuery("#ndic_Message").attr('class', 'message_blank');
   jQuery("#ndic_modalMessage").hide();
   enableInteractions();
}

function informTheUser(message) {
   console.log("informTheUser: " + message)
   jQuery("#ndic_Message").html(message);
   jQuery("#ndic_Message").attr('class', 'message_info');
}

function setError(message) {
   console.log("setError: " + message)
   jQuery("#ndic_Message").html(message);
   jQuery("#ndic_Message").attr('class', 'message_error');
}

function modalMessage(message, button1, button2, button1Event, button2Event) {
   console.log("modalMessage");
   jQuery("#ndic_modalText").html(message);
   jQuery("#ndic_modalButton1").html(button1);
   jQuery("#ndic_modalButton2").html(button2);
   setupEvent("#ndic_modalButton1", "click", button1Event)
   setupEvent("#ndic_modalButton2", "click", button2Event)
   disableInteractions()
   jQuery("#ndic_modalMessage").show();
}

// disables interactions on the menu and action canvas
function disableInteractions() {
   jQuery("#ndic_Menu").css("pointer-events", "none");
   jQuery("#ndic_ActionCanvas").css("pointer-events", "none");
}

function enableInteractions() {
   jQuery("#ndic_Menu").css("pointer-events", "auto");
   jQuery("#ndic_ActionCanvas").css("pointer-events", "auto");
}

///////////////////////////////
// utility functions
///////////////////////////////
function setupEvent(id, eventType, handler) {
   console.log("setupEvent for " + id);
   // unset the event if it already exists
   jQuery(id).off(eventType);

   // setup the event
   jQuery(id).on(eventType, handler);
}

function okToSwitch() {

   return (!_unsavedData);

}

function resetChangedFlag() {
   console.log("resetChangedFlag");
   clearMessage();

   _unsavedData = false;
}

function resetSwitchConditions() {
   resetChangedFlag();
}

function actionStarted() {
   jQuery("#ndic_Throbber").html("***THROBBER**");
}

function actionEnded() {
   jQuery("#ndic_Throbber").html("");
}

///////////////////////////////
// main program
///////////////////////////////
console.log("Main Program");
jQuery(document).ready(function () {

   renderMenu();
});
