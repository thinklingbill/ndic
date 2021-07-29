drop table import_facility;

create table import_facility as 
select * from (
select f.facility_id
      ,f.name
      ,f.type
      ,a.address_01
      ,a.address_02
      ,a.city
      ,a.state
      ,a.zip_code
      ,f.warden_name
      ,f.chaplain_name
      ,f.phone
      ,f.alias_01
      ,f.alias_02
      ,f.alias_03
      ,f.alias_04
      ,f.devotional_send_disallowed_flag
      ,f.deleted_flag
      ,f.create_date
      ,f.create_user_id
      ,f.modify_date
      ,f.modify_user_id
      ,row_number() over ( partition by f.facility_id order by a.effective_to_date desc ) as pref
  from devote_facility f
  join devote_address a
    on a.address_id = f.address_id
   and a.deleted_flag = 'N'
 where f.deleted_flag = 'N'
 ) t
 where t.pref = 1
 ;
 
alter table import_facility
add primary key (facility_id);

select * from import_facility;

select facility_id, count(*) from import_facility 
 where deleted_flag = 'N'
 group by facility_id
having count(*) > 1;

select count(*) from import_facility where deleted_flag = 'N';

select count(*) from devote_facility where deleted_flag = 'N';

select dr.facility_id as dr_facility_id
      ,dp.facility_id as import_facility_id
  from devote_facility dr
  left outer join import_facility dp
    on dp.facility_id = dr.facility_id
   and dp.deleted_flag = 'N'
 where dr.deleted_flag = 'N'
   and dp.facility_id is null
;   
