truncate table wp_ndic_facility;

insert into wp_ndic_facility
SELECT facility_id,
    name,
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
    modify_user_id
FROM ndic.import_facility;
