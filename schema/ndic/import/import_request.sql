-- select request_id, count(*) from (
-- select count(*) from (

drop table import_request;

create table import_request as 
 select * from (
     select rq.request_id
     , rq.recipient_id
     , a.address_id
     , r.facility_id
     , rq.request_date
     , r.first_name
     , r.middle_initial
     , r.last_name
     , r.suffix
     , r.spin
     , r.in_jail_flag
     , r.use_facility_address_flag
     , a.address_01
     , a.address_02
     , a.city
     , a.state
     , a.zip_code
     , r.phone
     , r.dorm
     , rq.no_spiral_flag
     , rq.in_touch_flag
     , rq.prayer_request_flag
     , rq.bible_request_flag
     , rq.spanish_flag
     , rq.no_devotional_flag
     , rq.duplicate_flag
     , rq.details
     , rq.requesting_friend_id
     , rq.deleted_flag
     , rq.create_date
     , rq.create_user_id
     , rq.modify_date
     , rq.modify_user_id
     , row_number() over ( partition by rq.request_id order by rq.modify_date desc ) as pref
  from devote_request rq
  join devote_recipient r 
    on r.recipient_id = rq.recipient_id
   and rq.request_date >= r.effective_from_date
   and rq.request_date <= r.effective_to_date
  join devote_address a
    on r.address_id = a.address_id
   and rq.request_date >= a.effective_from_date
   and rq.request_date <= a.effective_to_date
 where r.deleted_flag = 'N'
   and rq.deleted_flag = 'N'
   and a.deleted_flag = 'N'
 --   and rq.request_id in ( 27,65,66,100 )
 -- and rq.request_id between 1 and 50000
) t 
where t.pref = 1
-- order by t.request_id
;

alter table import_request
add primary key (request_id);

select * from import_request;

-- check for dups
select request_id, count(*) from import_request 
 where deleted_flag = 'N'
 group by request_id
having count(*) > 1;

select count(*) from import_request where deleted_flag = 'N';

select count(*) from devote_request where deleted_flag = 'N';
select count(*) from devote_request where deleted_flag = 'N';

-- find missing requests
select dr.request_id as dr_request_id
      ,dp.request_id as import_request_id
  from devote_request dr
  left outer join import_request dp
    on dp.request_id = dr.request_id
   and dp.deleted_flag = 'N'
 where dr.deleted_flag = 'N'
   and dp.request_id is null
;   

select * from devote_request where request_id = 100092;

select * from devote_recipient where recipient_id = 89503;
-- issue: Recipient is end-dated before the request date

-- there are about 62 requests that are missing. Research before production date