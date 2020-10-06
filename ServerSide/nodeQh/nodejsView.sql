USE [mdb]
GO

/****** Object:  View [dbo].[mxCntNr]    Script Date: 6/12/2019 4:39:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 
CREATE VIEW [dbo].[mxCntNr]
AS
SELECT        dbo.usp_lrel_cenv_cntref.id, dbo.ca_contact.last_name + N' ' + ISNULL(dbo.ca_contact.first_name, N'') AS cnt_name, dbo.ca_owned_resource.resource_name, dbo.ca_resource_class.name AS class_name, 
                         dbo.usp_lrel_cenv_cntref.cnt, dbo.usp_lrel_cenv_cntref.nr, dbo.ca_owned_resource.resource_family
FROM            dbo.ca_resource_class RIGHT OUTER JOIN
                         dbo.ca_owned_resource ON dbo.ca_resource_class.id = dbo.ca_owned_resource.resource_class RIGHT OUTER JOIN
                         dbo.usp_lrel_cenv_cntref ON dbo.ca_owned_resource.own_resource_uuid = dbo.usp_lrel_cenv_cntref.nr LEFT OUTER JOIN
                         dbo.ca_contact ON dbo.usp_lrel_cenv_cntref.cnt = dbo.ca_contact.contact_uuid
WHERE        (dbo.ca_owned_resource.inactive = 0) AND (dbo.ca_contact.inactive = 0)
 

GO

/****** Object:  View [dbo].[mxNrSysDtl]    Script Date: 6/12/2019 4:39:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 
CREATE VIEW [dbo].[mxNrSysDtl]
AS
SELECT  class_name +  ' ' + resource_name as name  ,[nr] as id,  0 as ord  , cnt as cnt   , resource_family   FROM [dbo].[mxCntNr]                   
  union 
  select '*********' as name , 0x00000000000000000000000000000000 as id, 1 as ord , 0x00000000000000000000000000000000 as cnt , '' as resource_family
  union
  select resource_name as name , own_resource_uuid  as id, 2 as ord , 0x00000000000000000000000000000000 as cnt, resource_family from ca_owned_resource where inactive = 0
 
 
 

GO

/****** Object:  View [dbo].[mxGrpmem]    Script Date: 6/12/2019 4:39:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 
CREATE VIEW [dbo].[mxGrpmem]
AS
SELECT        dbo.grpmem.group_id, dbo.ca_contact.last_name AS group_name, ca_contact_1.last_name + N' ' + ISNULL(ca_contact_1.first_name, N'') AS member_name, dbo.grpmem.member, dbo.ca_contact.inactive, 
                         dbo.grpmem.id
FROM            dbo.ca_contact AS ca_contact_1 RIGHT OUTER JOIN
                         dbo.grpmem ON ca_contact_1.contact_uuid = dbo.grpmem.member LEFT OUTER JOIN
                         dbo.ca_contact ON dbo.grpmem.group_id = dbo.ca_contact.contact_uuid
WHERE        (ca_contact_1.inactive = 0) AND (dbo.ca_contact.inactive = 0)
GO

/****** Object:  View [dbo].[mxCr]    Script Date: 6/12/2019 4:39:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[mxCr]
AS
SELECT        TOP (10000) dbo.call_req.id, dbo.call_req.ref_num, dbo.call_req.description, dbo.call_req.status, dbo.cr_stat.sym AS status_name, dbo.call_req.open_date, dbo.call_req.close_date, 
                         dbo.prob_ctg.sym AS category_name, dbo.ca_contact.last_name AS group_name, ca_contact_1.last_name + N' ' + ISNULL(ca_contact_1.first_name, N'') AS assignee_name, 
                         ca_contact_2.last_name + N' ' + ISNULL(ca_contact_2.first_name, N'') AS customer_name, dbo.call_req.assignee, dbo.call_req.category, dbo.call_req.group_id, dbo.call_req.customer, dbo.call_req.priority, 
                         dbo.call_req.type, pri_1.sym AS priority_name, dbo.call_req.affected_rc, dbo.ca_owned_resource.resource_name AS affected_rc_name, dbo.call_req.active_flag, dbo.call_req.log_agent, 
                         ca_contact_3.last_name + N' ' + ISNULL(ca_contact_3.first_name, N'') AS log_agent_name, dbo.call_req.call_back_date, dbo.call_req.last_mod_dt, dbo.call_req.last_mod_by, 
                         ca_contact_4.last_name + N' ' + ISNULL(ca_contact_4.first_name, N'') AS last_mod_by_name
FROM            dbo.ca_contact AS ca_contact_2 RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_1 WITH (nolock) RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_3 RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_4 RIGHT OUTER JOIN
                         dbo.call_req WITH (nolock) ON ca_contact_4.contact_uuid = dbo.call_req.last_mod_by ON ca_contact_3.contact_uuid = dbo.call_req.log_agent LEFT OUTER JOIN
                         dbo.ca_owned_resource WITH (nolock) ON dbo.call_req.affected_rc = dbo.ca_owned_resource.own_resource_uuid ON ca_contact_1.contact_uuid = dbo.call_req.assignee ON 
                         ca_contact_2.contact_uuid = dbo.call_req.customer LEFT OUTER JOIN
                         dbo.ca_contact ON dbo.call_req.group_id = dbo.ca_contact.contact_uuid LEFT OUTER JOIN
                         dbo.pri AS pri_1 ON dbo.call_req.priority = pri_1.enum LEFT OUTER JOIN
                         dbo.prob_ctg ON dbo.call_req.category = dbo.prob_ctg.persid LEFT OUTER JOIN
                         dbo.cr_stat ON dbo.call_req.status = dbo.cr_stat.code
GO

/****** Object:  View [dbo].[mxCrDtl]    Script Date: 6/12/2019 4:39:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[mxCrDtl]
AS
SELECT        TOP (10000) dbo.call_req.id, dbo.call_req.ref_num, dbo.call_req.description, dbo.call_req.status, dbo.cr_stat.sym AS status_name, dbo.call_req.open_date, dbo.call_req.close_date, 
                         dbo.prob_ctg.sym AS category_name, dbo.ca_contact.last_name AS group_name, ca_contact_1.last_name + N' ' + ISNULL(ca_contact_1.first_name, N'') AS assignee_name, 
                         ca_contact_2.last_name + N' ' + ISNULL(ca_contact_2.first_name, N'') AS customer_name, dbo.call_req.assignee, dbo.call_req.category, dbo.call_req.group_id, dbo.call_req.customer, dbo.call_req.priority, 
                         dbo.call_req.type, pri_1.sym AS priority_name, dbo.call_req.affected_rc, dbo.ca_owned_resource.resource_name AS affected_rc_name, dbo.call_req.active_flag, dbo.call_req.log_agent, 
                         ca_contact_3.last_name + N' ' + ISNULL(ca_contact_3.first_name, N'') AS log_agent_name, dbo.call_req.call_back_date, dbo.call_req.last_mod_dt, dbo.call_req.last_mod_by, 
                         ca_contact_4.last_name + N' ' + ISNULL(ca_contact_4.first_name, N'') AS last_mod_by_name
FROM            dbo.ca_contact AS ca_contact_2 RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_1 WITH (nolock) RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_3 RIGHT OUTER JOIN
                         dbo.ca_contact AS ca_contact_4 RIGHT OUTER JOIN
                         dbo.call_req WITH (nolock) ON ca_contact_4.contact_uuid = dbo.call_req.last_mod_by ON ca_contact_3.contact_uuid = dbo.call_req.log_agent LEFT OUTER JOIN
                         dbo.ca_owned_resource WITH (nolock) ON dbo.call_req.affected_rc = dbo.ca_owned_resource.own_resource_uuid ON ca_contact_1.contact_uuid = dbo.call_req.assignee ON 
                         ca_contact_2.contact_uuid = dbo.call_req.customer LEFT OUTER JOIN
                         dbo.ca_contact ON dbo.call_req.group_id = dbo.ca_contact.contact_uuid LEFT OUTER JOIN
                         dbo.pri AS pri_1 ON dbo.call_req.priority = pri_1.enum LEFT OUTER JOIN
                         dbo.prob_ctg ON dbo.call_req.category = dbo.prob_ctg.persid LEFT OUTER JOIN
                         dbo.cr_stat ON dbo.call_req.status = dbo.cr_stat.code
GO

