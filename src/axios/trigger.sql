USE [trm]
GO

/****** Object:  Trigger [dbo].[tr_ticket_Modified]    Script Date: 11/16/2021 6:02:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE  TRIGGER [dbo].[tr_ticket_Modified] on [dbo].[ticket]
AFTER  UPDATE
AS

BEGIN
SET NOCOUNT ON;
declare @id nvarchar(32);
declare @last_mod_by nvarchar(32);
declare @value_obj nvarchar(32); 
------------------------
	IF (UPDATE( description))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'description'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Description Changed', 
			  @id , 
			 (select description from Deleted), 
			 (select description from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select description from Deleted) <> (select description from Inserted)
	end
------------------------
	IF (UPDATE( customer))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'customer'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Customer Changed', 
			  @id , 
			 (select name from V_contacts V where V.id = (select customer from Deleted)), 
			 (select name from V_contacts V where V.id =  (select customer from Inserted)),
			 (select customer from Deleted), 
			 (select customer from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select customer from Deleted) <> (select customer from Inserted)
	end
	------------------------
	IF (UPDATE( status))
	begin
			 select  @id = id from Inserted
			 select  @last_mod_by = last_mod_by from Inserted
			 select  @value_obj = 'status'
			 declare @active int;
			 declare @close_date int;
			 select  @active = CASE cast( ( select code from utils V where V.id = (select status from Inserted) ) as int ) WHEN 0 THEN 0 else 1 end
			 select @close_date = ( select CASE @active when 1 then NULL else datediff(second,'1970-01-01',getutcdate()) end)
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Status Changed', 
			  @id , 
			 (select name from utils V where V.id = (select status from Deleted)), 
			 (select name from utils V where V.id =  (select status from Inserted)),
			 (select status from Deleted), 
			 (select status from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select status from Deleted) <> (select status from Inserted)
			 update ticket set active = @active, close_date = @close_date where id = (select id from Inserted)
	end
	------------------------
	IF (UPDATE( priority))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'priority'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Priority Changed', 
			  @id , 
			 (select name from utils V where V.id = (select priority from Deleted)), 
			 (select name from utils V where V.id =  (select priority from Inserted)),
			 (select priority from Deleted), 
			 (select priority from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select priority from Deleted) <> (select priority from Inserted)
	end
	IF (UPDATE( urgency))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'urgency'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Urgency Changed', 
			  @id , 
			 (select name from utils V where V.id = (select urgency from Deleted)), 
			 (select name from utils V where V.id =  (select urgency from Inserted)),
			 (select urgency from Deleted), 
			 (select urgency from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select urgency from Deleted) <> (select urgency from Inserted)
	end
	IF (UPDATE( ticket_type))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'ticket_type'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Ticket Type Changed', 
			  @id , 
			 (select name from utils V where V.id = (select ticket_type from Deleted)), 
			 (select name from utils V where V.id =  (select ticket_type from Inserted)),
			 (select ticket_type from Deleted), 
			 (select ticket_type from Inserted),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select ticket_type from Deleted) <> (select ticket_type from Inserted)
	end
	IF (UPDATE( assignee))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'assignee'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Assignee Changed', 
			  @id , 
			 isnull((select name from V_contacts V where V.id = (select assignee from Deleted)),''),  
			 isnull((select name from V_contacts V where V.id =  (select assignee from Inserted)),''), 
			 isnull((select assignee from Deleted),''),  
			 isnull((select assignee from Inserted),''), 
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select assignee from Deleted) <> (select assignee from Inserted)
	end
	IF (UPDATE( team))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'team'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Team Changed', 
			  @id , 
			 isnull((select name from V_contacts V where V.id = (select team from Deleted)),''), 
			 isnull((select name from V_contacts V where V.id =  (select team from Inserted)), ''),
			 isnull((select team from Deleted),''), 
			 isnull((select team from Inserted),''),
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select team from Deleted) <> (select team from Inserted)
	end
	------------------------
	IF (UPDATE( category))
	begin
			 select @id = id from Inserted
			 select @last_mod_by = last_mod_by from Inserted
			 select @value_obj = 'category'
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, old_value_obj_id, new_value_obj_id, value_obj, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Category Changed', 
			  @id , 
			 isnull((select name from ticket_category V where V.id = (select category from Deleted)),''), 
			 isnull((select name from ticket_category V where V.id =  (select category from Inserted)),''), 
			 isnull((select category from Deleted),''), 
			 isnull((select category from Inserted),''), 
			 @value_obj,
			 datediff(second,'1970-01-01',getutcdate()), 
			 datediff(second,'1970-01-01',getutcdate()) , 
			 @last_mod_by
			 WHERE (select category from Deleted) <> (select category from Inserted)
			 delete tprp where ticket = isnull((select id from Deleted),'') and (select category from Deleted) <> (select category from Inserted)

	end
	
END








GO

