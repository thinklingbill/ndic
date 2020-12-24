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

   jQuery("#ndicMenu").html(
      "<div class='ndic_menu'> \
       <span class='ndic_menu_item' id=menuRequests>Requests</span> \
       <span class='ndic_menu_item' id=menuFacilities>Facilities</span> \
       <span class='ndic_menu_item' id=menuMailings>Mailings</span> \
       <span class='ndic_menu_item' id=menuSearch>Search</span> \
       <span class='ndic_menu_item' id=menuReports>Reports</span> \
       <span class='ndic_menu_item' id=menuAddressCorrection>Address Correction</span> \
       <span class='ndic_menu_item' id=menuChooser>Chooser</span> \
       </div> \
      ");

   menuEventSetup();
}

function menuEventSetup() {
   console.log("eventSetup");

   setupEvent("#menuRequests", "click", eventMenuRequests);
   setupEvent("#menuFacilities", "click", eventMenuFacilities);
}

function eventMenuRequests() {
   console.log("eventMenuRequests");
   if (okToSwitch()) {
   }
}

function eventMenuFacilities() {
   console.log("eventMenuFacilities");
   if (okToSwitch()) {
   renderFacilities();
   }
}


///////////////////////////////
// Facility functions
///////////////////////////////
function renderFacilities() {
   jQuery("#ndicActionCanvas").html(
      "<div id=facilitiesSubMenu>SUBMENU</div> \
       <div id=facilitiesEntry>FACILITY ENTRY</div> \
       <div id=facilitiesList>FACILITY LIST</div> \
       <div id=facilitiesMerge>FACILITY MERGE</div> \
      " );

   jQuery("#facilitiesEntry").hide();
   jQuery("#facilitiesList").hide();
   jQuery("#facilitiesMerge").hide();

   renderFacilitiesSubMenu();
}

function renderFacilitiesSubMenu() {
   console.log("renderFacilitiesSubMenu");
   jQuery("#facilitiesSubMenu").html(
      "<div class='ndic_menu'> \
       <span class='ndic_menu_item' id=menuFacilitiesList>Facilities List</span> \
       <span class='ndic_menu_item' id=menuFacilitiesMerge>Facilities Merge</span> \
       </div> \
      ");

   facilitiesSubMenuEventSetup();
}

function facilitiesSubMenuEventSetup() {
   console.log("facilitiesSubMenuEventSetup");
   // setup events
   setupEvent("#menuFacilitiesList", "click", eventMenuFacilitiesList);
   setupEvent("#menuFacilitiesMerge", "click", eventMenuFacilitiesMerge);
}

function eventMenuFacilitiesList() {
   console.log("eventMenuFacilitiesList");

   if (okToSwitch()) {
      jQuery("#facilitiesEntry").hide();
      jQuery("#facilitiesMerge").hide();
      jQuery("#facilitiesList").show();
   }

}

function eventMenuFacilitiesMerge() {
   console.log("eventMenuFacilitiesMerge");
   if (okToSwitch()) {
      jQuery("#facilitiesEntry").hide();
      jQuery("#facilitiesMerge").show();
      jQuery("#facilitiesList").hide();
   }
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


