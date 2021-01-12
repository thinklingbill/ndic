DROP TABLE ndic_wp.wp_ndic_address;

CREATE TABLE ndic_wp.wp_ndic_address (
  `address_id` int NOT NULL,
  `effective_from_date` date NOT NULL ,
  `effective_to_date` date NOT NULL ,
  `address_01` varchar(128) DEFAULT NULL,
  `address_02` varchar(128) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `deleted_flag` char(1) NOT NULL DEFAULT '',
  `create_date` datetime NOT NULL ,
  `create_user_id` int NOT NULL DEFAULT '0',
  `modify_date` datetime DEFAULT NULL,
  `modify_user_id` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE ndic_wp.wp_ndic_address
  ADD PRIMARY KEY (`address_id`,`effective_from_date`,`effective_to_date`),
  ADD KEY `state` (`state`),
  ADD KEY `address_01` (`address_01`),
  ADD KEY `deleted_flag` (`deleted_flag`),
  ADD KEY `zip_code` (`zip_code`),
  ADD KEY `address_id` (`address_id`);
  
ALTER TABLE ndic_wp.wp_ndic_address
  MODIFY `address_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77116;
