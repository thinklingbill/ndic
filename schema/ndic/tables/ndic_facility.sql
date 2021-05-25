DROP TABLE IF EXISTS ndic.wp_ndic_facility;

CREATE TABLE `ndic`.`wp_ndic_facility` (
  `facility_id` int NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `type` char(1) NOT NULL DEFAULT '',
  `address_01` varchar(128) DEFAULT NULL,
  `address_02` varchar(128) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `warden_name` varchar(128) DEFAULT NULL,
  `chaplain_name` varchar(128) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alias_01` varchar(10) DEFAULT NULL,
  `alias_02` varchar(10) DEFAULT NULL,
  `alias_03` varchar(10) DEFAULT NULL,
  `alias_04` varchar(10) DEFAULT NULL,
  `devotional_send_disallowed_flag` char(1) NOT NULL DEFAULT 'N',
  `deleted_flag` char(1) NOT NULL DEFAULT '',
  `create_date` datetime NOT NULL,
  `create_user_id` int NOT NULL DEFAULT '0',
  `modify_date` datetime DEFAULT NULL,
  `modify_user_id` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `wp_ndic_facility`
  ADD PRIMARY KEY (`facility_id`),
  ADD KEY `deleted_flag` (`deleted_flag`)
;

ALTER TABLE `wp_ndic_facility`
  MODIFY `facility_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
