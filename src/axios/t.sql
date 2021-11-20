USE [trm]
GO

/****** Object:  Table [dbo].[attachment]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[contact]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[empty]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[empty](
	[id] [int] NULL
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[events]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[notification]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[notification](
	[name] [nvarchar](150) NULL,
	[id] [nvarchar](32) NULL,
	[ticket] [nvarchar](32) NULL,
	[notification_type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_notification_active]  DEFAULT ((1)),
	[send_to] [nvarchar](300) NULL,
	[condition] [nvarchar](300) NULL,
	[subject] [nvarchar](500) NULL,
	[body] [nvarchar](max) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_notification_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[notification_sended]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[notification_sended](
	[name] [nvarchar](150) NULL,
	[id] [nvarchar](32) NULL,
	[ticket] [nvarchar](32) NULL,
	[sended_to] [nvarchar](500) NULL,
	[sended_subject] [nvarchar](500) NULL,
	[sended_body] [nvarchar](max) NULL,
	[notification_type] [nvarchar](32) NULL,
	[active] [int] NULL CONSTRAINT [DF_notification_sended_active]  DEFAULT ((1)),
	[send_to] [nvarchar](300) NULL,
	[condition] [nvarchar](300) NULL,
	[subject] [nvarchar](500) NULL,
	[body] [nvarchar](max) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_notification_sended_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[organizational_info]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[queries]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[relationship]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[serverSideLog]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[serverSideLog](
	[action] [nvarchar](50) NULL,
	[creation_date] [datetime] NULL CONSTRAINT [DF_serverSideLog_creation_date]  DEFAULT (getdate()),
	[message] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[teammember]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[ticket]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[ticket_category]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[ticket_log]    Script Date: 11/16/2021 6:01:50 PM ******/
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

/****** Object:  Table [dbo].[tprp]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tprp](
	[id] [nvarchar](32) NOT NULL,
	[name] [nvarchar](555) NOT NULL,
	[factory] [nvarchar](32) NOT NULL,
	[category] [nvarchar](32) NOT NULL,
	[ticket] [nvarchar](32) NOT NULL,
	[value] [nvarchar](200) NULL CONSTRAINT [DF_ticket_tprp_value]  DEFAULT (''),
	[valueObj] [nvarchar](32) NULL,
	[sequence] [int] NOT NULL,
	[width] [int] NULL CONSTRAINT [DF_ticket_tprp_sequence]  DEFAULT ((20)),
	[pattern] [nvarchar](200) NULL CONSTRAINT [DF_ticket_tprp_pattern]  DEFAULT (''),
	[defaultValue] [nvarchar](100) NULL CONSTRAINT [DF_ticket_tprp_default]  DEFAULT (''),
	[placeholder] [nvarchar](100) NULL CONSTRAINT [DF_ticket_tprp_placeholder]  DEFAULT (''),
	[description] [nvarchar](max) NULL CONSTRAINT [DF_ticket_tprp_description]  DEFAULT (''),
	[last_mod_by] [nvarchar](32) NULL CONSTRAINT [DF_ticket_tprp_last_mod_by]  DEFAULT (''),
	[last_mod_dt] [bigint] NULL CONSTRAINT [DF_ticket_tprp_last_mod_dt]  DEFAULT (''),
	[create_date] [bigint] NULL DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[active] [int] NULL CONSTRAINT [DF_ticket_tprp_active]  DEFAULT ((1)),
	[code] [nvarchar](max) NULL CONSTRAINT [DF_tprp_code]  DEFAULT (''),
	[tcode_select] [nvarchar](32) NULL,
	[dependence] [nvarchar](300) NULL CONSTRAINT [DF_tprp_dependence]  DEFAULT (''),
	[visible] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[tprptpl]    Script Date: 11/16/2021 6:01:50 PM ******/
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
	[tcode_select] [nvarchar](32) NULL,
	[dependence] [nvarchar](300) NULL CONSTRAINT [DF_tprptpl_dependence]  DEFAULT (''),
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[util_parent]    Script Date: 11/16/2021 6:01:50 PM ******/
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
	[create_date] [bigint] NULL CONSTRAINT [DF_util_parent_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate())),
	[is_default] [int] NULL CONSTRAINT [DF_util_parent_is_default]  DEFAULT ((0))
) ON [PRIMARY]

GO

/****** Object:  Table [dbo].[utils]    Script Date: 11/16/2021 6:01:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[utils](
	[name] [nvarchar](150) NULL,
	[id] [nvarchar](32) NULL,
	[type] [nvarchar](100) NULL,
	[active] [int] NULL CONSTRAINT [DF_utils_active]  DEFAULT ((1)),
	[code] [nvarchar](300) NULL,
	[last_mod_by] [nvarchar](32) NULL,
	[last_mod_dt] [bigint] NULL,
	[create_date] [bigint] NULL CONSTRAINT [DF_utils_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate()))
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[relationship] ADD  CONSTRAINT [DF_relationship_active]  DEFAULT ((1)) FOR [active]
GO

ALTER TABLE [dbo].[relationship] ADD  CONSTRAINT [DF_relationship_create_date]  DEFAULT (datediff(second,'1970-01-01',getutcdate())) FOR [create_date]
GO

