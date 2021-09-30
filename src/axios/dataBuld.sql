
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
CREATE UNIQUE INDEX utils_dupl_key
   ON utils (name, type, code); 