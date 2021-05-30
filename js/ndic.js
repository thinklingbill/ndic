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
       <div id=ndic_facilitiesSubMenu></div> \
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
   if (okToSwitch()) {
      actionStarted();
      highlightMenu();
      actionEnded();
   }
}

function eventMenuFacilities() {
   console.log("eventMenuFacilities");
   clearMessage();

   if (okToSwitch()) {
      actionStarted();
      highlightMenu();
      renderFacilitiesPage();
      actionEnded();
   }
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
   jQuery("#ndic_facilitiesSubMenu").html(
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

   if (okToSwitch()) {
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

function eventMenuFacilitiesMerge() {
   console.log("eventMenuFacilitiesMerge");
   clearMessage();

   if (okToSwitch()) {
      actionStarted();
      highlightMenu();
      jQuery("#ndic_facilitiesMerge").show();
      jQuery("#ndic_facilitiesList").hide();
      actionEnded();
   }
}

function eventMenuFacilitiesEntry() {
   console.log("eventMenuFacilitiesEntry");
   clearMessage();

   if (okToSwitch()) {
      actionStarted();
      highlightMenu();
      renderFacilitiesEntry();
      jQuery("#ndic_facilitiesAddNewButton").hide();
      jQuery("#ndic_facilitiesEntry").show();
      jQuery("#ndic_facilitiesList").hide();
      setupEvent("#ndic_facilityAddBtn", "click", eventFacilityAdd);
      setupEvent("#ndic_facilityCancelBtn", "click", eventFacilityCancelCheck);
      jQuery("#ndic_facilityName").focus();
      actionEnded();
   }
}

function eventFacilitiesChange() {
   console.log("eventFacilitiesChange");
   clearMessage();

   _unsavedData = true;
}

function eventClearFacilitiesChange() {
   console.log("eventClearFacilitiesChange");
   clearMessage();

   _unsavedData = false;
}

// render functions
function renderFacilitiesList() {
   console.log("renderFacilitiesList");

   jQuery("#ndic_facilitiesList").html(" \
   <div id=> \
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

   renderFacilitiesTable();
}

function renderFacilitiesEntry() {
   console.log("renderFacilitiesEntry");

   jQuery("#ndic_facilitiesEntry").html(" \
      <div id=ndic_facilitiesEntry> \
         <div class=ndic_page_title>Add a Correctional Facility</div> \
         <div id=ndic_facilityForm> \
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
            <div class=ndic_form_row><span class=ndic_form_label>Warden:</span> <input id=ndic_facilityWarden class=ndic_form_entry_medium></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Chaplain:</span> <input id=ndic_facilityChaplain class=ndic_form_entry_medium></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Telephone:</span> <input id=ndic_facilityTelephone class='ndic_form_entry_medium ndic_phone'></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label></span><span class=ndic_form_entry_big> <input type=checkbox id=ndic_facilityDontSend></input> Don't send devotionals to this facility</span></div> \
            <div class=ndic_button_row><button class=ndic_button id=ndic_facilityAddBtn>Add Facility</button> \
            <button class=ndic_button id=ndic_facilityCancelBtn>Cancel</button></div> \
            <div class=ndic_form_label>* = Required</div> \
         </div> \
      </div> \
   " );

   // setup field masks
   jQuery('.ndic_phone').mask('(000) 000-0000');
   jQuery('.ndic_zip_code').mask('00000-ZZZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });

   setupEvent("#ndic_facilitiesEntry input", "change", eventFacilitiesChange);
}

function renderFacilitiesTable() {
   console.log("renderFacilitiesTable");

   actionStarted();

   jQuery.ajax({
      method: "POST",
      url: "/ndic/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: {
         service: "getFacilities"
      }
   })
      .done(function (json) {
         actionEnded();
         console.log( json );
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
               html += "<td>" + res[i].name + "</td>";
               html += "<td>" + res[i].type + "</td>";
               html += "<td>" + res[i].address_01 + " "
                  + res[i].address_02 + "</td>";
               html += "<td>" + res[i].city + "</td>";
               html += "<td>" + res[i].state + "</td>";
               html += "<td>" + res[i].zip_code + "</td>";
               html += "<td>" + res[i].alias_01 + " "
                  + res[i].alias_02 + " "
                  + res[i].alias_03 + "</td>";
               html += "<td>" + res[i].devotional_send_disallowed_flag + "</td>";
               html += "<td>" + res[i].warden_name + "</td>";
               html += "<td>" + res[i].chaplain_name + "</td>";
               html += "<td>" + res[i].phone + "</td>";
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
            ndic_facilityWarden: jQuery("#ndic_facilityWarden").val(),
            ndic_facilityChaplain: jQuery("#ndic_facilityChaplain").val(),
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
               eventClearFacilitiesChange();
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
         , "Leave Form"
         , "Stay on Form"
         , eventFacilityCancel
         , eventMenuFacilitiesList);
   }
   else {
      eventFacilityCancel();
   }
}

function eventFacilityCancel() {
   console.log("eventFacilityCancel");
   eventClearFacilitiesChange();
   eventMenuFacilitiesList();
}

function eventFacilityEdit() {
   console.log("eventFacilityEdit")
   alert("Not yet coded " + jQuery(this).attr("facility_id"));
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
         console.log( res );
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
   jQuery( "#ndic_Menu").css("pointer-events","none");
   jQuery( "#ndic_ActionCanvas").css("pointer-events","none");
}

function enableInteractions() {
   jQuery( "#ndic_Menu").css("pointer-events","auto");
   jQuery( "#ndic_ActionCanvas").css("pointer-events","auto");
}

///////////////////////////////
// utility functions
///////////////////////////////
function setupEvent(id, eventType, handler) {
   console.log("setupEvent for " + id);
   // unset the event if it already exists
   jQuery(id).off(eventType, handler);

   // setup the event
   jQuery(id).on(eventType, handler);
}

function okToSwitch() {

   return (!_unsavedData);

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
