USE [trm]
GO

/****** Object:  Table [dbo].[attachment]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[attachment](
	[id] [nvarchar](32) NOT NULL,
	[name] [nvarchar](150) NOT NULL,
	[object] [nvarchar](32) NULL,
	[factory] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_attachemnt_active]  DEFAULT ((1)),
	[file_name] [nvarchar](2000) NULL,
	[folder] [nvarchar](32) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_attachemnt_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[contact]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[contact](
	[email] [nvarchar](50) NULL CONSTRAINT [DF_contact_email]  DEFAULT (''),
	[password] [nvarchar](50) NULL CONSTRAINT [DF_contact_password]  DEFAULT (''),
	[id] [nvarchar](32) NULL CONSTRAINT [DF_contact_id]  DEFAULT (''),
	[login] [nvarchar](50) NULL CONSTRAINT [DF_contact_login]  DEFAULT (''),
	[contact_number] [nvarchar](50) NULL CONSTRAINT [DF_contact_contact_number]  DEFAULT (''),
	[avatar_url] [nvarchar](500) NULL CONSTRAINT [DF_contact_avatar_url]  DEFAULT (''),
	[last_name] [nvarchar](50) NULL CONSTRAINT [DF_contact_last_name]  DEFAULT (''),
	[first_name] [nvarchar](50) NULL CONSTRAINT [DF_contact_first_name]  DEFAULT (''),
	[contact_type] [nvarchar](32) NULL CONSTRAINT [DF_contact_contact_type]  DEFAULT (''),
	[job_title] [nvarchar](32) NULL CONSTRAINT [DF_contact_job_title]  DEFAULT (''),
	[organization] [nvarchar](32) NULL CONSTRAINT [DF_contact_organization]  DEFAULT (''),
	[location] [nvarchar](32) NULL CONSTRAINT [DF_contact_location]  DEFAULT (''),
	[department] [nvarchar](32) NULL CONSTRAINT [DF_contact_department]  DEFAULT (''),
	[site] [nvarchar](32) NULL CONSTRAINT [DF_contact_site]  DEFAULT (''),
	[primary_group] [nvarchar](32) NULL CONSTRAINT [DF_contact_primary_group]  DEFAULT (''),
	[phone] [nvarchar](30) NULL CONSTRAINT [DF_contact_phone]  DEFAULT (''),
	[mobile_phone] [nvarchar](30) NULL CONSTRAINT [DF_contact_mobile_phone]  DEFAULT (''),
	[additional_phone] [nvarchar](30) NULL CONSTRAINT [DF_contact_additional_phone]  DEFAULT (''),
	[locale] [nvarchar](5) NULL CONSTRAINT [DF_contact_locale]  DEFAULT (''),
	[description] [nvarchar](max) NULL CONSTRAINT [DF_contact_description]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_contact_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_contact_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL CONSTRAINT [DF_contact_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[active] [int] NULL CONSTRAINT [DF_contact_active]  DEFAULT ((1)),
	[manager] [nvarchar](32) NULL CONSTRAINT [DF_contact_manager]  DEFAULT ('')
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[empty]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[empty](
	[id] [int] NULL
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[events]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[events](
	[author] [nvarchar](32) NULL,
	[guest] [nvarchar](32) NULL,
	[id] [nvarchar](32) NULL,
	[description] [nvarchar](max) NULL,
	[event_dt] [bigint] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[organizational_info]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[organizational_info](
	[id] [nvarchar](32) NULL,
	[name] [nvarchar](32) NULL,
	[organizational_type] [nvarchar](32) NULL,
	[country] [nvarchar](70) NULL,
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
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[queries]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[queries](
	[name] [nvarchar](150) NULL,
	[id] [nvarchar](32) NULL,
	[object] [nvarchar](32) NULL,
	[factory] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_queries_active]  DEFAULT ((1)),
	[query] [nvarchar](2000) NULL,
	[seq] [int] NULL,
	[folder] [nvarchar](32) NULL,
	[default] [int] NULL CONSTRAINT [DF_queries_default]  DEFAULT ((0)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_queries_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[relationship]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[relationship](
	[id] [nvarchar](32) NULL,
	[node1] [nvarchar](32) NULL,
	[node1_type] [nvarchar](32) NULL,
	[node2] [nvarchar](32) NULL,
	[node2_type] [nvarchar](32) NULL,
	[active] [int] NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[teammember]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[teammember](
	[id] [nvarchar](32) NULL,
	[team] [nvarchar](32) NULL,
	[member] [nvarchar](32) NULL,
	[manager] [int] NULL CONSTRAINT [DF_manager]  DEFAULT ((0)),
	[notify] [int] NULL CONSTRAINT [DF_notify]  DEFAULT ((1)),
	[active] [int] NULL CONSTRAINT [DF_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_teammember_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[ticket]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ticket](
	[id] [nvarchar](32) NOT NULL,
	[name] [int] IDENTITY(1,1) NOT NULL,
	[category] [nvarchar](32) NULL CONSTRAINT [DF_ticket_category]  DEFAULT (''),
	[status] [nvarchar](32) NULL,
	[priority] [nvarchar](32) NULL,
	[urgency] [nvarchar](32) NULL CONSTRAINT [DF_ticket_urgency]  DEFAULT (''),
	[requestor] [nvarchar](50) NULL CONSTRAINT [DF_ticket_requestor]  DEFAULT (''),
	[customer] [nvarchar](50) NULL CONSTRAINT [DF_ticket_customer]  DEFAULT (''),
	[assignee] [nvarchar](32) NULL CONSTRAINT [DF_ticket_assignee]  DEFAULT (''),
	[team] [nvarchar](32) NULL CONSTRAINT [DF_ticket_team]  DEFAULT (''),
	[asset] [nvarchar](32) NULL CONSTRAINT [DF_ticket_asset]  DEFAULT (''),
	[log_agent] [nvarchar](32) NULL CONSTRAINT [DF_ticket_log_agent]  DEFAULT (''),
	[description] [nvarchar](max) NULL CONSTRAINT [DF_ticket_description]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_ticket_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_ticket_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[active] [int] NULL CONSTRAINT [DF_ticket_active]  DEFAULT ((1)),
	[ticket_type] [nvarchar](32) NULL,
	[close_date] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[ticket_category]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ticket_category](
	[id] [nvarchar](32) NOT NULL,
	[name] [nvarchar](555) NOT NULL,
	[priority] [nvarchar](32) NULL,
	[urgency] [nvarchar](32) NULL CONSTRAINT [DF_ticket_category_urgency]  DEFAULT (''),
	[assignee] [nvarchar](32) NULL CONSTRAINT [DF_ticket_category_assignee]  DEFAULT (''),
	[team] [nvarchar](32) NULL CONSTRAINT [DF_ticket_category_team]  DEFAULT (''),
	[description] [nvarchar](max) NULL CONSTRAINT [DF_ticket_category_description]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_ticket_category_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_ticket_category_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[active] [int] NULL CONSTRAINT [DF_ticket_category_active]  DEFAULT ((1)),
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[ticket_log]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ticket_log](
	[id] [nvarchar](32) NOT NULL,
	[name] [nvarchar](32) NOT NULL,
	[ticket] [nvarchar](32) NOT NULL,
	[old_value] [nvarchar](max) NOT NULL,
	[new_value] [nvarchar](max) NOT NULL,
	[value_obj] [nvarchar](32) NULL CONSTRAINT [DF_ticket_log_old_value_obj]  DEFAULT (''),
	[old_value_obj_id] [nvarchar](32) NULL CONSTRAINT [DF_ticket_log_old_value_obj_id]  DEFAULT (''),
	[new_value_obj_id] [nvarchar](32) NULL CONSTRAINT [DF_ticket_log_[new_value_obj_id]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_ticket_log_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_ticket_log_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL DEFAULT (datediff(second,'1970-01-01',getutcdate())),
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[tprptpl]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tprptpl](
	[id] [nvarchar](32) NOT NULL,
	[name] [nvarchar](555) NOT NULL,
	[factory] [nvarchar](32) NOT NULL,
	[category] [nvarchar](32) NOT NULL,
	[sequence] [int] NOT NULL,
	[width] [int] NULL CONSTRAINT [DF_ticket_tprptpl_sequence]  DEFAULT ((20)),
	[pattern] [nvarchar](200) NULL CONSTRAINT [DF_ticket_tprptpl_pattern]  DEFAULT (''),
	[defaultValue] [nvarchar](100) NULL CONSTRAINT [DF_ticket_tprptpl_default]  DEFAULT (''),
	[placeholder] [nvarchar](100) NULL CONSTRAINT [DF_ticket_tprptpl_placeholder]  DEFAULT (''),
	[description] [nvarchar](max) NULL CONSTRAINT [DF_ticket_tprptpl_description]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_ticket_tprptpl_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_ticket_tprptpl_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[active] [int] NULL CONSTRAINT [DF_ticket_tprptpl_active]  DEFAULT ((1)),
	[code] [nvarchar](max) NULL CONSTRAINT [DF_tprptpl_code]  DEFAULT (''),
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[util_parent]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[util_parent](
	[id] [nvarchar](32) NULL,
	[util] [nvarchar](32) NULL,
	[parent] [nvarchar](32) NULL,
	[parent_type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_parent_active]  DEFAULT ((1)),
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_util_parent_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[utils]    Script Date: 10/21/2021 7:01:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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

GO

ALTER TABLE [dbo].[relationship] ADD  CONSTRAINT [DF_relationship_active]  DEFAULT ((1)) FOR [active]
GO

ALTER TABLE [dbo].[relationship] ADD  CONSTRAINT [DF_relationship_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate())) FOR [create_date]
GO


------------
****** Object:  View [dbo].[V_contacts]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_contacts]
AS
SELECT        dbo.contact.email, dbo.contact.password, dbo.contact.id, dbo.contact.login, dbo.contact.contact_number, dbo.contact.avatar_url, dbo.contact.last_name, dbo.contact.first_name, dbo.contact.contact_type, 
                         dbo.contact.job_title, dbo.contact.organization, dbo.contact.location, dbo.contact.department, dbo.contact.site, dbo.contact.primary_group, dbo.contact.phone, dbo.contact.mobile_phone, 
                         dbo.contact.additional_phone, dbo.contact.locale, dbo.contact.description, dbo.contact.last_mod_by, dbo.contact.last_mod_dt, dbo.contact.create_date, dbo.contact.active, 
                         LTRIM(RTRIM(dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N''))) AS name, dbo.utils.name AS contact_type_name, utils_1.name AS job_title_name, dbo.contact.manager, 
                         contact_1.last_name + N' ' + ISNULL(contact_1.first_name, N'') AS manager_name, contact_2.last_name AS primary_group_name, dbo.organizational_info.name AS organization_name, 
                         organizational_info_1.name AS location_name, organizational_info_2.name AS department_name, organizational_info_3.name AS site_name, organizational_info_1.address1 AS location_address1, 
                         organizational_info_1.address2 AS location_address2, organizational_info_1.address3 AS location_address3, contact_3.last_name + N' ' + ISNULL(contact_3.first_name, N'') AS last_mod_by_name
FROM            dbo.contact LEFT OUTER JOIN
                         dbo.contact AS contact_3 ON dbo.contact.last_mod_by = contact_3.id LEFT OUTER JOIN
                         dbo.organizational_info AS organizational_info_3 ON dbo.contact.site = organizational_info_3.id LEFT OUTER JOIN
                         dbo.organizational_info AS organizational_info_2 ON dbo.contact.department = organizational_info_2.id LEFT OUTER JOIN
                         dbo.organizational_info AS organizational_info_1 ON dbo.contact.location = organizational_info_1.id LEFT OUTER JOIN
                         dbo.organizational_info ON dbo.contact.organization = dbo.organizational_info.id LEFT OUTER JOIN
                         dbo.contact AS contact_2 ON dbo.contact.primary_group = contact_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_1 ON dbo.contact.manager = contact_1.id LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON dbo.contact.job_title = utils_1.id LEFT OUTER JOIN
                         dbo.utils ON dbo.contact.contact_type = dbo.utils.id

GO

/****** Object:  View [dbo].[V_teammember]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_teammember]
AS
SELECT        dbo.teammember.id, dbo.teammember.team, dbo.teammember.member, dbo.teammember.manager, dbo.teammember.notify, dbo.teammember.active, dbo.teammember.last_mod_by, 
                         dbo.teammember.last_mod_dt, dbo.teammember.create_date, dbo.V_contacts.name AS team_name, V_contacts_1.name AS member_name
FROM            dbo.teammember LEFT OUTER JOIN
                         dbo.V_contacts AS V_contacts_1 ON dbo.teammember.member = V_contacts_1.id LEFT OUTER JOIN
                         dbo.V_contacts ON dbo.teammember.team = dbo.V_contacts.id

GO

/****** Object:  View [dbo].[V_tprptpls]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_tprptpls]
AS
SELECT        dbo.tprptpl.id, dbo.tprptpl.name, dbo.tprptpl.factory, dbo.tprptpl.category, dbo.tprptpl.sequence, dbo.tprptpl.width, dbo.tprptpl.pattern, dbo.tprptpl.placeholder, dbo.tprptpl.description, dbo.tprptpl.last_mod_by, 
                         dbo.tprptpl.last_mod_dt, dbo.tprptpl.create_date, dbo.tprptpl.active, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS last_mod_by_name, dbo.tprptpl.defaultValue, 
                         dbo.utils.name AS factory_name, dbo.tprptpl.code
FROM            dbo.tprptpl LEFT OUTER JOIN
                         dbo.utils ON dbo.tprptpl.factory = dbo.utils.id LEFT OUTER JOIN
                         dbo.contact ON dbo.tprptpl.last_mod_by = dbo.contact.id

GO

/****** Object:  View [dbo].[V_ticket_category]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_ticket_category]
AS
SELECT        dbo.ticket_category.id, dbo.ticket_category.name, dbo.ticket_category.priority, dbo.ticket_category.urgency, dbo.ticket_category.assignee, dbo.ticket_category.team, dbo.ticket_category.description, 
                         dbo.ticket_category.last_mod_by, dbo.ticket_category.last_mod_dt, dbo.ticket_category.create_date, dbo.ticket_category.active, utils_1.name AS priority_name, dbo.utils.name AS urgency_name, 
                         dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS assignee_name, contact_1.last_name AS team_name, contact_2.last_name + N' ' + ISNULL(contact_2.first_name, N'') 
                         AS last_mod_by_name
FROM            dbo.ticket_category LEFT OUTER JOIN
                         dbo.contact AS contact_2 ON dbo.ticket_category.last_mod_by = contact_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_1 ON dbo.ticket_category.team = contact_1.id LEFT OUTER JOIN
                         dbo.contact ON dbo.ticket_category.assignee = dbo.contact.id LEFT OUTER JOIN
                         dbo.utils ON dbo.ticket_category.urgency = dbo.utils.id LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON dbo.ticket_category.priority = utils_1.id

GO

/****** Object:  View [dbo].[V_ticket_log]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_ticket_log]
AS
SELECT        dbo.ticket_log.id, dbo.ticket_log.name, dbo.ticket_log.ticket, dbo.ticket_log.old_value, dbo.ticket_log.new_value, dbo.ticket_log.value_obj, dbo.ticket_log.old_value_obj_id, dbo.ticket_log.new_value_obj_id, 
                         dbo.ticket_log.last_mod_by, dbo.ticket_log.last_mod_dt, dbo.ticket_log.create_date, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS last_mod_by_name
FROM            dbo.ticket_log LEFT OUTER JOIN
                         dbo.contact ON dbo.ticket_log.last_mod_by = dbo.contact.id

GO

/****** Object:  View [dbo].[V_tickets]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_tickets]
AS
SELECT        dbo.ticket.id, dbo.ticket.category, dbo.ticket.status, dbo.ticket.priority, dbo.ticket.urgency, dbo.ticket.requestor, dbo.ticket.customer, dbo.ticket.assignee, dbo.ticket.team, dbo.ticket.asset, dbo.ticket.log_agent, 
                         dbo.ticket.description, dbo.ticket.last_mod_by, dbo.ticket.last_mod_dt, dbo.ticket.create_date, dbo.ticket.active, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS requestor_name, 
                         contact_1.last_name + N' ' + ISNULL(contact_1.first_name, N'') AS customer_name, contact_3.last_name + N' ' + ISNULL(contact_3.first_name, N'') AS assignee_name, contact_4.last_name AS team_name, 
                         contact_2.last_name + N' ' + ISNULL(contact_2.first_name, N'') AS log_agent_name, contact_5.last_name + N' ' + ISNULL(contact_5.first_name, N'') AS last_mod_by_name, utils_2.name AS status_name, 
                         dbo.utils.name AS priority_name, utils_1.name AS urgency_name, dbo.ticket.ticket_type, utils_3.name AS ticket_type_name, dbo.ticket.name, dbo.ticket.close_date, dbo.ticket_category.name AS category_name,
                             (SELECT        COUNT(id) AS Expr1
                               FROM            dbo.attachment
                               WHERE        (factory = 'ticket') AND (object = dbo.ticket.id)) AS attachments
FROM            dbo.ticket LEFT OUTER JOIN
                         dbo.ticket_category ON dbo.ticket.category = dbo.ticket_category.id LEFT OUTER JOIN
                         dbo.utils AS utils_3 ON dbo.ticket.ticket_type = utils_3.id LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON dbo.ticket.urgency = utils_1.id LEFT OUTER JOIN
                         dbo.utils ON dbo.ticket.priority = dbo.utils.id LEFT OUTER JOIN
                         dbo.utils AS utils_2 ON dbo.ticket.status = utils_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_5 ON dbo.ticket.last_mod_by = contact_5.id LEFT OUTER JOIN
                         dbo.contact AS contact_2 ON dbo.ticket.log_agent = contact_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_4 ON dbo.ticket.team = contact_4.id LEFT OUTER JOIN
                         dbo.contact AS contact_3 ON dbo.ticket.assignee = contact_3.id LEFT OUTER JOIN
                         dbo.contact AS contact_1 ON dbo.ticket.customer = contact_1.id LEFT OUTER JOIN
                         dbo.contact ON dbo.ticket.requestor = dbo.contact.id

GO

/****** Object:  View [dbo].[V_organizational_info]    Script Date: 10/21/2021 7:01:59 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_organizational_info]
AS
SELECT        dbo.organizational_info.id, dbo.organizational_info.name, dbo.organizational_info.organizational_type, dbo.organizational_info.country, dbo.organizational_info.city, dbo.organizational_info.address1, 
                         dbo.organizational_info.address2, dbo.organizational_info.address3, dbo.organizational_info.zip, dbo.organizational_info.phone, dbo.organizational_info.manager, dbo.organizational_info.description, 
                         dbo.organizational_info.active, dbo.organizational_info.last_mod_by, dbo.organizational_info.last_mod_dt, dbo.organizational_info.create_date, dbo.utils.name AS organizational_type_name, 
                         dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS manager_name
FROM            dbo.organizational_info LEFT OUTER JOIN
                         dbo.contact ON dbo.organizational_info.manager = dbo.contact.id LEFT OUTER JOIN
                         dbo.utils ON dbo.organizational_info.organizational_type = dbo.utils.id

GO

/****** Object:  View [dbo].[V_util_parent]    Script Date: 10/21/2021 7:01:59 PM ******/
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

/****** Object:  View [dbo].[V_events]    Script Date: 10/21/2021 7:01:59 PM ******/
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

GO

---------------

USE [trm]
GO
/****** Object:  Trigger [dbo].[tr_ticket_Modified]    Script Date: 10/21/2021 7:02:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER  TRIGGER [dbo].[tr_ticket_Modified] on [dbo].[ticket]
AFTER UPDATE
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
			 INSERT INTO ticket_log (id, name, ticket, old_value, new_value, create_date, last_mod_dt, last_mod_by)
			 select 
			 LEFT(REPLACE(NEWID(),'-',''), 32) , 
			 'Description Changed', 
			  @id , 
			 (select description from Deleted), 
			 (select description from Inserted),
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
	end
	
END







