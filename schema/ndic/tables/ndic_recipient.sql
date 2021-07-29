DROP TABLE wp_ndic_recipient;

CREATE TABLE wp_ndic_recipient (
  recipient_id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(64) NOT NULL DEFAULT '',
  middle_initial char(5) NOT NULL DEFAULT '',
  last_name varchar(64) NOT NULL DEFAULT '',
  suffix varchar(64) DEFAULT NULL,
  spin varchar(64) DEFAULT NULL,
  in_jail_flag char(1) NOT NULL DEFAULT '',
  facility_id int(11) DEFAULT NULL,
  use_facility_address_flag char(1) NOT NULL DEFAULT '',
  address_01 varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  address_02 varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  city varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  state varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  zip_code varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  phone varchar(10) DEFAULT NULL,
  dorm varchar(128) DEFAULT NULL,
  deleted_flag char(1) NOT NULL DEFAULT '',
  create_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  create_user_id int(11) NOT NULL DEFAULT 0,
  modify_date datetime DEFAULT NULL,
  modify_user_id int(11) DEFAULT NULL,
  PRIMARY KEY (recipient_id),
  KEY spin (spin),
  KEY first_name (first_name),
  KEY last_name (last_name),
  KEY deleted_flag (deleted_flag)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


