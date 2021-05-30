<?php
/*
Module: Page
Version: 1.0
Author: Bill Roberts
Description: Renders the canvas for the NDIC plugin app
*/

function ndicPage () {
   ?>
 <div class=ndic_app_title>New Day in Christ Devotional Calendar Management</div>

 <div id=ndic_Menu></div>
 <div id=ndic_Message class=message_blank></div>
 <div id=ndic_modalMessage>
   <div id=ndic_modalText></div>
   <div id=ndic_modalButtons>
     <button id=ndic_modalButton1 class=ndic_button />
     <button id=ndic_modalButton2 class=ndic_button />
   </div>
 </div>

 <div id=ndic_ActionCanvas></div>  
   <?php
}
?>