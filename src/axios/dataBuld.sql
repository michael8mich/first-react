
------------------- Utils
CREATE TABLE [dbo].[utils](
	[name] [nvarchar](150) NULL,
	[id] [nvarchar](32) NULL,
	[type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_utils_active]  DEFAULT ((1)),
	[code] [nvarchar](32) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_utils_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]
CREATE UNIQUE INDEX utils_key
   ON utils (id); 


-------------- Contacts
CREATE TABLE [dbo].[contact](
	[email] [nvarchar](50) NULL,
	[password] [nvarchar](50) NULL,
	[id] [nvarchar](32) ,
	[login] [nvarchar](50) NULL,
	[contact_number] [nvarchar](50) NULL,
	[avatar_url] [nvarchar](500) NULL,
	[last_name] [nvarchar](50) NULL,
	[first_name] [nvarchar](50) NULL,
	[contact_type] [nvarchar](32) NULL,
	[job_title] [nvarchar](32) NULL,
	[organization] [nvarchar](32) NULL,
	[location] [nvarchar](32) NULL,
	[department] [nvarchar](32) NULL,
	[site] [nvarchar](32) NULL,
	[primary_group] [nvarchar](32) NULL,
	[phone] [nvarchar](30) NULL,
	[mobile_phone] [nvarchar](30) NULL,
	[additional_phone] [nvarchar](30) NULL,
	[locale] [nvarchar](5) NULL,
	[description] [nvarchar](max) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_contact_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

--------------- util_parent
CREATE TABLE [dbo].[util_parent](
	[id] [nvarchar](32) NULL,
	[util]  [nvarchar](32) NULL,
	[parent] [nvarchar](32) NULL,
	[parent_type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_parent_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_util_parent_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO
CREATE UNIQUE INDEX util_parent_key
   ON util_parent (id); 
   
------------------- teammember
CREATE TABLE [dbo].[teammember](
	[id] [nvarchar](32) ,
	[team] [nvarchar](32) ,
	[member] [nvarchar](32) ,
	[manager] int NULL CONSTRAINT [DF_manager]  DEFAULT ((0)),
	[notify] int NULL CONSTRAINT [DF_notify]  DEFAULT ((1)),
	[active] [int] NULL CONSTRAINT [DF_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_teammember_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

CREATE UNIQUE INDEX teammember_key
   ON teammember (id); 

------------------- relationship
CREATE TABLE [dbo].[relationship](
	[id] [nvarchar](32) NULL,
	[node1] [nvarchar](32) NULL,
	[node1_type] [nvarchar](32) NULL,
	[node2] [nvarchar](32) NULL,
	[node2_type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_relationship_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_relationship_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

CREATE UNIQUE INDEX relationship_parent_key
   ON relationship (id); 
   
-------------- organizational_info
CREATE TABLE [dbo].[organizational_info](
	[id] [nvarchar](32) NULL,
	[name] [nvarchar](32) NULL,
	[organizational_type] [nvarchar](32) NULL,
	[contry] [nvarchar](70) NULL,
	[city] [nvarchar](70) NULL,
	[address1] [nvarchar](70) NULL,
    [address2] [nvarchar](70) NULL,
	[address3] [nvarchar](70) NULL,
	[zip] [nvarchar](70) NULL,
	[phone] [nvarchar](70) NULL,
	[manager] [nvarchar](32) NULL,
	[description] [nvarchar](max) NULL,
	[active] [int] NULL CONSTRAINT [DF_organizational_info_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_organizational_info_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

CREATE UNIQUE INDEX organizational_info_key
   ON organizational_info (id); 

CREATE UNIQUE INDEX organizational_info_dupl_key
   ON organizational_info (name, organizational_type); 

GO

CREATE UNIQUE INDEX organizational_info_key
   ON organizational_info (id); 



------------------- VIEWS --------------------------
/****** Object:  View [dbo].[V_util_parent]    Script Date: 10/4/2021 7:34:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_util_parent]
AS
SELECT        dbo.util_parent.id, dbo.util_parent.util, dbo.util_parent.parent, dbo.util_parent.parent_type, dbo.util_parent.active, dbo.util_parent.last_mod_by, dbo.util_parent.last_mod_dt, dbo.utils.name
FROM            dbo.util_parent LEFT OUTER JOIN
                         dbo.utils ON dbo.util_parent.util = dbo.utils.id

GO

/****** Object:  View [dbo].[V_contacts]    Script Date: 10/4/2021 7:34:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_contacts]
AS
SELECT        dbo.contact.email, dbo.contact.password, dbo.contact.id, dbo.contact.login, dbo.contact.contact_number, dbo.contact.avatar_url, dbo.contact.last_name, dbo.contact.first_name, dbo.contact.contact_type, 
                         dbo.contact.job_title, dbo.contact.organization, dbo.contact.location, dbo.contact.department, dbo.contact.site, dbo.contact.primary_group, dbo.contact.phone, dbo.contact.mobile_phone, 
                         dbo.contact.additional_phone, dbo.contact.locale, dbo.contact.description, dbo.contact.last_mod_by, dbo.contact.last_mod_dt, dbo.contact.create_date, dbo.contact.active, 
                         LTRIM(RTRIM(dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N''))) AS name, dbo.utils.name AS contact_type_name, utils_1.name AS job_title_name
FROM            dbo.contact LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON dbo.contact.job_title = utils_1.id LEFT OUTER JOIN
                         dbo.utils ON dbo.contact.contact_type = dbo.utils.id

GO

/****** Object:  View [dbo].[V_events]    Script Date: 10/4/2021 7:34:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_events]
AS
SELECT        dbo.contact.name AS guest_name, contact_1.name AS author_name, dbo.events.author, dbo.events.guest, dbo.events.id, dbo.events.description, dbo.events.event_dt
FROM            dbo.events LEFT OUTER JOIN
                         dbo.contact AS contact_1 ON dbo.events.author = contact_1.id LEFT OUTER JOIN
                         dbo.contact ON dbo.events.guest = dbo.contact.id