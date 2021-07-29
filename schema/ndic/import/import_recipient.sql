drop table import_recipient;

create table import_recipient as 
select * from (
select *
      ,row_number() over ( partition by recipient_id, address_id order by a_effective_to_date desc ) a_pref
  from (
select r.recipient_id
      ,r.first_name
      ,r.middle_initial
      ,r.last_name
      ,r.suffix
      ,r.spin
      ,r.in_jail_flag
      ,r.facility_id
      ,r.use_facility_address_flag
      ,a.address_01
      ,a.address_02
      ,a.city
      ,a.state
      ,a.zip_code
      ,r.phone
      ,r.dorm
      ,r.deleted_flag
      ,r.create_date
      ,r.create_user_id
      ,r.modify_date
      ,r.modify_user_id
	  ,row_number() over ( partition by recipient_id order by r.effective_to_date desc ) r_pref
      ,a.address_id
      ,a.effective_to_date a_effective_to_date
  from devote_recipient r
  join devote_address a 
    on a.address_id = r.address_id
   and a.deleted_flag = 'N'
--   and a.effective_to_date = '9999-12-31'
 where r.deleted_flag = 'N'
--   and r.effective_to_date = '9999-12-31'
-- and r.recipient_id = 14
 ) t
 where r_pref = 1
 ) u
where 1=1
-- and recipient_id = 46
-- and u.r_pref = 1
and u.a_pref = 1
-- order by u.recipient_id
;
  
alter table import_recipient
add primary key (recipient_id);

select * from import_recipient;

select recipient_id, count(*) from import_recipient 
 where deleted_flag = 'N'
 group by recipient_id
having count(*) > 1;

select count(*) from import_recipient where deleted_flag = 'N';

select count(distinct recipient_id) from devote_recipient where deleted_flag = 'N';-- and effective_to_date = '9999-12-31';
-- validate all were loaded
select dr.recipient_id as dr_recipient_id
      ,dp.recipient_id as import_recipient_id
  from devote_recipient dr
  left outer join import_recipient dp
    on dp.recipient_id = dr.recipient_id
   and dp.deleted_flag = 'N'
 where dr.deleted_flag = 'N'
   and dp.recipient_id is null
;   
