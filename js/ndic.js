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
   }
}

function eventMenuFacilities() {
   console.log("eventMenuFacilities");
   if (okToSwitch()) {
   renderFacilitiesPage();
   }
}


///////////////////////////////
// Facility functions
///////////////////////////////
function renderFacilitiesPage() {
   console.log( "renderFacilitiesPage");
   jQuery("#ndic_ActionCanvas").html(
      "<div id=ndic_facilitiesSubMenu>SUBMENU</div>"
      + renderFacilitiesList() +
       "<div id=ndic_facilitiesMerge>FACILITY MERGE</div> \
      " );

   jQuery("#ndic_facilitiesList").hide();
   jQuery("#ndic_facilitiesMerge").hide();

   renderFacilitiesSubMenu();
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
      jQuery("#ndic_facilitiesMerge").hide();

      jQuery("#ndic_facilitiesList").show();
      jQuery("#ndic_facilitiesEntry").hide();

      setupEvent( "#ndic_newFacilityBtn", "click", eventMenuFacilitiesEntry);
   }

}

function eventMenuFacilitiesMerge() {
   console.log("eventMenuFacilitiesMerge");
   if (okToSwitch()) {
      jQuery("#ndic_facilitiesMerge").show();
      jQuery("#ndic_facilitiesList").hide();
   }
}

function eventMenuFacilitiesEntry() {
   console.log("eventMenuFacilitiesEntry");
   if (okToSwitch()) {
      jQuery("#ndic_facilitiesTable").hide();
      jQuery("#ndic_facilitiesAddNewButton").hide();
      jQuery("#ndic_facilitiesEntry").show();
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
      "<div id=ndic_facilitiesTable>FACILITIES TABLE</div> \
   </div> \
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
            <div class=ndic_form_row><span class=ndic_form_label>Zip Code:</span><input id=ndic_facilityZipCode class=ndic_form_entry>Zip code template</input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Warden:</span><input id=ndic_facilityWarden class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Chaplain:</span><input id=ndic_facilityChaplain class=ndic_form_entry></input></div> \
            <div class=ndic_form_row><span class=ndic_form_label>Telephone:</span><input id=ndic_facilityTelephone class=ndic_form_entry>Telephone Template</input></div> \
            <div class=ndic_form_row><input type=checkbox id=ndic_facilityDontSend></input><span class=ndic_form_label>Don't send devotionals to this facility</span></div> \
            <div class=ndic_button_row><button class=ndic_button id=ndic_facilityAddBtn>Add Facility</button> <button class=ndic_button id=ndic_facilityAddCancelBtn>Cancel</button><div> \
            <div class=ndic_form_label>* = Required</div> \
         </div> \
      </div> \
   </div> \
   ";

   return html;
}


///////////////////////////////
// utility functions
///////////////////////////////
function setupEvent(id, eventType, handler) {
   console.log("setupEvent");
   // unset the event if it already exists
   jQuery(id).off(eventType, handler);

   // setup the event
   jQuery(id).on(eventType, handler);
}

function okToSwitch() {

   return (!_unsavedData);

}

///////////////////////////////
// main program
///////////////////////////////
console.log("Main Program");
renderMenu();