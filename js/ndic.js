// TODO - REMOVE HARDCODING FROM AJAX SERVICES

//
///////////////////////////////
// global variables
///////////////////////////////
var _unsavedData = false;

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
       <div id=ndic_facilitiesSubMenu>SUBMENU</div> \
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
   if (okToSwitch()) {
      actionStarted();
      actionEnded();
   }
}

function eventMenuFacilities() {
   console.log("eventMenuFacilities");
   if (okToSwitch()) {
      actionStarted();
      renderFacilitiesPage();
      actionEnded();
   }
}


///////////////////////////////
// Facility functions
///////////////////////////////
function renderFacilitiesPage() {
   console.log( "renderFacilitiesPage");

   jQuery("#ndic_ActionCanvas").html(
      renderFacilitiesList() +
       "<div id=ndic_facilitiesMerge>FACILITY MERGE</div> \
      " );

   jQuery("#ndic_facilitiesList").hide();
   jQuery("#ndic_facilitiesMerge").hide();

   // setup field masks
   jQuery('.ndic_phone').mask('(000) 000-0000');
   jQuery('.ndic_zip_code').mask('00000-ZZZZ', {translation:  {'Z': {pattern: /[0-9]/, optional: true}}});

   renderFacilitiesSubMenu();
   renderFacilitiesTable();
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

function eventMenuFacilitiesList() {
   console.log("eventMenuFacilitiesList");

   if (okToSwitch()) {
      actionStarted();

      jQuery("#ndic_facilitiesMerge").hide();

      jQuery("#ndic_facilitiesList").show();
      jQuery("#ndic_facilitiesEntry").hide();

      setupEvent( "#ndic_newFacilityBtn", "click", eventMenuFacilitiesEntry);

      actionEnded();
   }

}

function eventMenuFacilitiesMerge() {
   console.log("eventMenuFacilitiesMerge");
   if (okToSwitch()) {
      actionStarted();
      jQuery("#ndic_facilitiesMerge").show();
      jQuery("#ndic_facilitiesList").hide();
      actionEnded();
   }
}

function eventMenuFacilitiesEntry() {
   console.log("eventMenuFacilitiesEntry");
   if (okToSwitch()) {
      actionStarted();
      jQuery("#ndic_facilitiesAddNewButton").hide();
      jQuery("#ndic_facilitiesEntry").show();
      setupEvent("#ndic_facilityAddBtn", "click", eventFacilityAdd);
      actionEnded();
   }
}

function renderFacilitiesList() {
   console.log("renderFacilitiesList");   
 
   var html = " \
   <div id=ndic_facilitiesList> \
      <div class=ndic_page_title>Facility Administration</div> \
      <div id=ndic_facilitiesAddNewButton> \
         <button class=ndic_button id=ndic_newFacilityBtn>Add New Facility</button> \
      </div> "
      + renderFacilitiesEntry() +
   "</div> \
   <div id=ndic_facilitiesTable>FACILITIES TABLE</div> \
   ";

   return html;
}

function renderFacilitiesEntry() {
   console.log("renderFacilitiesEntry");   
   var html = " \
      <div id=ndic_facilitiesEntry> \
         <div class=ndic_page_title>Add a Correctional Facility</div> \
         <div id=ndic_facilityForm> \
            <div class=ndic_form_row><span class=ndic_form_label>Facility Name:</span><input id=ndic_facilityName class=ndic_form_entry></input> *</div> \
            <div class=ndic_form_row><span class=ndic_form_label>Aliases:</span> \
               <input id=ndic_facilityAlias01 class=ndic_form_entry></input> \
               <input id=ndic_facilityAlias02 class=ndic_form_entry></input> \
               <input id=ndic_facilityAlias03 class=ndic_form_entry></input> \
               <input id=ndic_facilityAlias04 class=ndic_form_entry></input> \
            </div> \
            <div class=ndic_form_row><span class=ndic_form_label>Type:</span> \
               <select id=ndic_facilityType> \
                  <option value='F'>Federal</option> \
                  <option value='S'>State</option> \
                  <option value='L'>Local</option> \
               </select>\
            </div> \
            <div class=ndic_form_row><span class=ndic_form_label>Address 1:</span><input id=ndic_facilityAddress01 class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Address 2:</span><input id=ndic_facilityAddress02 class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>City:</span><input id=ndic_facilityCity class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>State:</span><input id=ndic_facilityState class=ndic_form_entry>Turn into dropdown</input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Zip Code:</span><input id=ndic_facilityZipCode class='ndic_form_entry ndic_zip_code'>Zip code template</input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Warden:</span><input id=ndic_facilityWarden class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Chaplain:</span><input id=ndic_facilityChaplain class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Telephone:</span><input id=ndic_facilityTelephone class='ndic_form_entry ndic_phone'>Telephone Template</input></div> \
            <div class=ndic_form_row><input type=checkbox id=ndic_facilityDontSend></input><span class=ndic_form_label>Don't send devotionals to this facility</span></div> \
            <div class=ndic_button_row><button class=ndic_button id=ndic_facilityAddBtn>Add Facility</button> \
            <button class=ndic_button id=ndic_facilityAddCancelBtn>Cancel</button><div> \
            <div class=ndic_form_label>* = Required</div> \
         </div> \
      </div> \
   </div> \
   ";

   return html;
}

function renderFacilitiesTable() {
   console.log("renderFacilitiesTable");
   
   var html = "JOJO BARNES";
   actionStarted();

   jQuery.ajax({
      method: "POST",
      url: "/ndic_wp/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: { service: "getFacilities",
            }
   })
   .done( function(json){
      actionEnded();
      console.log( json );
      res  = JSON.parse( json );

      if ( res[0].status != "OK") {
         setError( res[0].message )
      }
      else {
         var html = "<table>";
         html += "<tr>"
         html += "<th>Name</th>";
         html += "<th>Address 1</th>";
         html += "</tr>"
         for ( var i=0; i < res.length; i++ ) {
            html += "<tr>";
            html += "<td>" + res[i].name + "</td>";
            html += "<td>" + res[i].address_01 + "</td>";
            html += "</tr>";
         }
         html += "</table>";

         jQuery( "#ndic_facilitiesTable" ).html( html );
      }
   });

}

function eventFacilityAdd() {
   console.log( "eventFacilityAdd");

   // validate that the facility data is good

   // call the service to add facility data
   actionStarted();
   jQuery.ajax({
      method: "POST",
      url: "/ndic_wp/wp-content/plugins/ndic_devotional_calendar/services/ndicService.php",
      data: { service: "addFacility",
              ndic_facilityName : jQuery( "#ndic_facilityName").val(),
              ndic_facilityAlias01 : jQuery( "#ndic_facilityAlias01").val(),
              ndic_facilityAlias02 : jQuery( "#ndic_facilityAlias02").val(),
              ndic_facilityAlias03 : jQuery( "#ndic_facilityAlias03").val(),
              ndic_facilityAlias04: jQuery( "#ndic_facilityAlias04").val(),
              ndic_facilityType : jQuery( "#ndic_facilityType" ).val(),
              ndic_facilityAddress01 : jQuery( "#ndic_facilityAddress01").val(),
              ndic_facilityAddress02 : jQuery( "#ndic_facilityAddress02").val(),
              ndic_facilityCity : jQuery( "#ndic_facilityCity").val(),
              ndic_facilityState : jQuery( "#ndic_facilityState").val(),
              ndic_facilityZipCode : jQuery( "#ndic_facilityZipCode").val(),
              ndic_facilityWarden : jQuery( "#ndic_facilityWarden").val(),
              ndic_facilityChaplain : jQuery( "#ndic_facilityChaplain").val(),
              ndic_facilityTelephone : jQuery( "#ndic_facilityTelephone").val(),
              ndic_facilityDontSend: jQuery('#ndic_facilityDontSend').is(':checked'),
            }
   })
   .done( function(json){
      actionEnded();
      console.log( json );
      res  = JSON.parse( json );

      console.log( res );

      if ( res.status != "OK") {
         setError( res[0].message )
      }
      else {
         renderFacilitiesTable();
      }

   });
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

function setError( message ) {
   console.log( "setMessage: " + message)
   jQuery( "#ndic_Message").html( message );
}

function actionStarted() {
   jQuery( "#ndic_Message").html( "***THROBBER**");
}

function actionEnded() {
   jQuery( "#ndic_Message").html( "");
}

///////////////////////////////
// main program
///////////////////////////////
console.log("Main Program");
jQuery(document).ready(function(){

   renderMenu();
});