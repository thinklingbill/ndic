truncate table wp_ndic_recipient;

insert into wp_ndic_recipient
SELECT recipient_id,
    first_name,
    middle_initial,
    last_name,
    suffix,
    spin,
    in_jail_flag,
    facility_id,
    use_facility_address_flag,
    address_01,
    address_02,
    city,
    state,
    zip_code,
    phone,
    dorm,
    deleted_flag,
    create_date,
    create_user_id,
    modify_date,
    modify_user_id
FROM ndic.import_recipient;

