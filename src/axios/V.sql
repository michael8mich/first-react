USE [trm]
GO

/****** Object:  View [dbo].[V_contacts]    Script Date: 11/16/2021 6:03:01 PM ******/
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

/****** Object:  View [dbo].[V_teammember]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_teammember]
AS
SELECT        dbo.teammember.id, dbo.teammember.team, dbo.teammember.member, dbo.teammember.manager, dbo.teammember.notify, dbo.teammember.active, dbo.teammember.last_mod_by, 
                         dbo.teammember.last_mod_dt, dbo.teammember.create_date, dbo.V_contacts.name AS team_name, V_contacts_1.name AS member_name, V_contacts_1.email
FROM            dbo.teammember LEFT OUTER JOIN
                         dbo.V_contacts AS V_contacts_1 ON dbo.teammember.member = V_contacts_1.id LEFT OUTER JOIN
                         dbo.V_contacts ON dbo.teammember.team = dbo.V_contacts.id

GO

/****** Object:  View [dbo].[V_notifications]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_notifications]
AS
SELECT        dbo.notification.last_mod_by, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS last_mod_by_name, dbo.notification.notification_type, dbo.utils.name AS notification_type_name, 
                         dbo.notification.name, dbo.notification.id, dbo.notification.ticket, dbo.notification.active, dbo.notification.subject, dbo.notification.body, dbo.notification.last_mod_dt, dbo.notification.create_date, 
                         dbo.notification.condition, dbo.notification.send_to
FROM            dbo.notification LEFT OUTER JOIN
                         dbo.utils ON dbo.notification.notification_type = dbo.utils.id LEFT OUTER JOIN
                         dbo.contact ON dbo.notification.last_mod_by = dbo.contact.id

GO

/****** Object:  View [dbo].[V_tprp]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_tprp]
AS
SELECT        dbo.tprp.name, dbo.tprp.factory, dbo.tprp.category, dbo.tprp.ticket, dbo.tprp.value, dbo.tprp.valueObj, dbo.tprp.sequence, dbo.tprp.width, dbo.tprp.pattern, dbo.tprp.defaultValue, dbo.tprp.placeholder, 
                         dbo.tprp.description, dbo.tprp.last_mod_by, dbo.tprp.last_mod_dt, dbo.tprp.create_date, dbo.tprp.active, dbo.tprp.code, dbo.tprp.id, dbo.utils.name AS factory_name, 
                         dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS last_mod_by_name, dbo.tprp.tcode_select, dbo.tprp.dependence
FROM            dbo.contact RIGHT OUTER JOIN
                         dbo.tprp ON dbo.contact.id = dbo.tprp.last_mod_by LEFT OUTER JOIN
                         dbo.utils ON dbo.tprp.factory = dbo.utils.id

GO

/****** Object:  View [dbo].[V_tprptpls]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_tprptpls]
AS
SELECT        dbo.tprptpl.id, dbo.tprptpl.name, dbo.tprptpl.factory, dbo.tprptpl.category, dbo.tprptpl.sequence, dbo.tprptpl.width, dbo.tprptpl.pattern, dbo.tprptpl.placeholder, dbo.tprptpl.description, dbo.tprptpl.last_mod_by, 
                         dbo.tprptpl.last_mod_dt, dbo.tprptpl.create_date, dbo.tprptpl.active, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS last_mod_by_name, dbo.tprptpl.defaultValue, 
                         utils_1.name AS factory_name, dbo.tprptpl.code, dbo.tprptpl.tcode_select, dbo.utils.name AS tcode_select_name, dbo.tprptpl.dependence
FROM            dbo.tprptpl LEFT OUTER JOIN
                         dbo.utils ON dbo.tprptpl.tcode_select = dbo.utils.id LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON dbo.tprptpl.factory = utils_1.id LEFT OUTER JOIN
                         dbo.contact ON dbo.tprptpl.last_mod_by = dbo.contact.id

GO

/****** Object:  View [dbo].[V_ticket_category]    Script Date: 11/16/2021 6:03:01 PM ******/
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

/****** Object:  View [dbo].[V_ticket_log]    Script Date: 11/16/2021 6:03:01 PM ******/
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

/****** Object:  View [dbo].[V_tickets]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_tickets]
AS
SELECT        ticket_1.id, ticket_1.category, ticket_1.status, ticket_1.priority, ticket_1.urgency, ticket_1.requestor, ticket_1.customer, ticket_1.assignee, ticket_1.team, ticket_1.asset, ticket_1.log_agent, ticket_1.description, 
                         ticket_1.last_mod_by, ticket_1.last_mod_dt, ticket_1.create_date, ticket_1.active, dbo.contact.last_name + N' ' + ISNULL(dbo.contact.first_name, N'') AS requestor_name, 
                         contact_1.last_name + N' ' + ISNULL(contact_1.first_name, N'') AS customer_name, contact_3.last_name + N' ' + ISNULL(contact_3.first_name, N'') AS assignee_name, contact_4.last_name AS team_name, 
                         contact_2.last_name + N' ' + ISNULL(contact_2.first_name, N'') AS log_agent_name, contact_5.last_name + N' ' + ISNULL(contact_5.first_name, N'') AS last_mod_by_name, utils_2.name AS status_name, 
                         dbo.utils.name AS priority_name, utils_1.name AS urgency_name, ticket_1.ticket_type, utils_3.name AS ticket_type_name, ticket_1.name, ticket_1.close_date, dbo.ticket_category.name AS category_name,
                             (SELECT        COUNT(id) AS Expr1
                               FROM            dbo.attachment
                               WHERE        (factory = 'ticket') AND (object = ticket_1.id)) AS attachments,
                             (SELECT        COUNT(id) AS Expr1
                               FROM            dbo.ticket AS t WITH (nolock)
                               WHERE        (active = 1) AND (customer = ticket_1.customer) AND (ticket_1.id <> id)) AS customer_open_tickets
FROM            dbo.ticket AS ticket_1 LEFT OUTER JOIN
                         dbo.ticket_category ON ticket_1.category = dbo.ticket_category.id LEFT OUTER JOIN
                         dbo.utils AS utils_3 ON ticket_1.ticket_type = utils_3.id LEFT OUTER JOIN
                         dbo.utils AS utils_1 ON ticket_1.urgency = utils_1.id LEFT OUTER JOIN
                         dbo.utils ON ticket_1.priority = dbo.utils.id LEFT OUTER JOIN
                         dbo.utils AS utils_2 ON ticket_1.status = utils_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_5 ON ticket_1.last_mod_by = contact_5.id LEFT OUTER JOIN
                         dbo.contact AS contact_2 ON ticket_1.log_agent = contact_2.id LEFT OUTER JOIN
                         dbo.contact AS contact_4 ON ticket_1.team = contact_4.id LEFT OUTER JOIN
                         dbo.contact AS contact_3 ON ticket_1.assignee = contact_3.id LEFT OUTER JOIN
                         dbo.contact AS contact_1 ON ticket_1.customer = contact_1.id LEFT OUTER JOIN
                         dbo.contact ON ticket_1.requestor = dbo.contact.id

GO

/****** Object:  View [dbo].[V_organizational_info]    Script Date: 11/16/2021 6:03:01 PM ******/
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

/****** Object:  View [dbo].[V_util_parent]    Script Date: 11/16/2021 6:03:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[V_util_parent]
AS
SELECT        dbo.util_parent.id, dbo.util_parent.util, dbo.util_parent.parent, dbo.util_parent.parent_type, dbo.util_parent.active, dbo.util_parent.last_mod_by, dbo.util_parent.last_mod_dt, dbo.utils.name, 
                         dbo.util_parent.is_default
FROM            dbo.util_parent LEFT OUTER JOIN
                         dbo.utils ON dbo.util_parent.util = dbo.utils.id

GO

/****** Object:  View [dbo].[V_events]    Script Date: 11/16/2021 6:03:01 PM ******/
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

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[12] 4[49] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "notification"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 276
               Right = 216
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 0
               Left = 613
               Bottom = 204
               Right = 783
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 100
               Left = 863
               Bottom = 305
               Right = 1044
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 14
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 5145
         Alias = 4125
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_notifications'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_notifications'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[52] 4[18] 2[13] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "contact"
            Begin Extent = 
               Top = 188
               Left = 782
               Bottom = 372
               Right = 963
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "tprp"
            Begin Extent = 
               Top = 9
               Left = 412
               Bottom = 315
               Right = 582
            End
            DisplayFlags = 280
            TopColumn = 6
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 23
               Left = 784
               Bottom = 167
               Right = 954
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 10
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 5250
         Alias = 5340
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tprp'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tprp'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[52] 4[15] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "tprptpl"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 375
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 242
               Left = 636
               Bottom = 372
               Right = 806
            End
            DisplayFlags = 280
            TopColumn = 4
         End
         Begin Table = "utils_1"
            Begin Extent = 
               Top = 72
               Left = 1213
               Bottom = 202
               Right = 1383
            End
            DisplayFlags = 280
            TopColumn = 4
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 60
               Left = 840
               Bottom = 287
               Right = 1021
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 4650
         Alias = 3300
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tprptpls'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tprptpls'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tprptpls'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[41] 4[36] 2[5] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ticket_category"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 250
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 140
               Left = 457
               Bottom = 287
               Right = 627
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils_1"
            Begin Extent = 
               Top = 214
               Left = 669
               Bottom = 344
               Right = 839
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 6
               Left = 662
               Bottom = 205
               Right = 843
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_1"
            Begin Extent = 
               Top = 6
               Left = 881
               Bottom = 195
               Right = 1062
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_2"
            Begin Extent = 
               Top = 6
               Left = 1100
               Bottom = 222
               Right = 1281
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 15' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_ticket_category'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'00
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 4935
         Alias = 4050
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_ticket_category'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_ticket_category'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ticket_log"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 287
               Right = 219
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 6
               Left = 257
               Bottom = 179
               Right = 438
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 10
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 5175
         Alias = 4890
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_ticket_log'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_ticket_log'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[13] 4[8] 2[49] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ticket_1"
            Begin Extent = 
               Top = 0
               Left = 903
               Bottom = 375
               Right = 1073
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ticket_category"
            Begin Extent = 
               Top = 84
               Left = 430
               Bottom = 214
               Right = 600
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "utils_3"
            Begin Extent = 
               Top = 277
               Left = 0
               Bottom = 407
               Right = 170
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils_1"
            Begin Extent = 
               Top = 44
               Left = 302
               Bottom = 174
               Right = 472
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 140
               Left = 187
               Bottom = 357
               Right = 357
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils_2"
            Begin Extent = 
               Top = 155
               Left = 79
               Bottom = 336
               Right = 249
            End
            DisplayFlags = 280
            TopColumn = 1
         End
         Begin Table = "contact_5"
            Begin Extent = 
               Top = 82
               Left = 23
               Bottom = 315
               Right = 204
            End
            DisplayFlags' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tickets'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N' = 280
            TopColumn = 0
         End
         Begin Table = "contact_2"
            Begin Extent = 
               Top = 160
               Left = 127
               Bottom = 290
               Right = 308
            End
            DisplayFlags = 280
            TopColumn = 4
         End
         Begin Table = "contact_4"
            Begin Extent = 
               Top = 125
               Left = 107
               Bottom = 255
               Right = 288
            End
            DisplayFlags = 280
            TopColumn = 4
         End
         Begin Table = "contact_3"
            Begin Extent = 
               Top = 116
               Left = 45
               Bottom = 249
               Right = 226
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "contact_1"
            Begin Extent = 
               Top = 0
               Left = 0
               Bottom = 130
               Right = 181
            End
            DisplayFlags = 280
            TopColumn = 5
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 0
               Left = 0
               Bottom = 130
               Right = 181
            End
            DisplayFlags = 280
            TopColumn = 4
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 33
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 11190
         Alias = 3015
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tickets'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_tickets'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "organizational_info"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 254
               Right = 230
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 6
               Left = 268
               Bottom = 136
               Right = 438
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 6
               Left = 476
               Bottom = 208
               Right = 657
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 3870
         Alias = 5910
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_organizational_info'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_organizational_info'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "teammember"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 250
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "V_contacts_1"
            Begin Extent = 
               Top = 0
               Left = 501
               Bottom = 241
               Right = 693
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "V_contacts"
            Begin Extent = 
               Top = 14
               Left = 979
               Bottom = 231
               Right = 1171
            End
            DisplayFlags = 280
            TopColumn = 18
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 12
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 3315
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_teammember'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_teammember'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[54] 4[3] 2[3] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "util_parent"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 218
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 1
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 0
               Left = 641
               Bottom = 244
               Right = 811
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_util_parent'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_util_parent'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[34] 4[20] 2[4] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "contact"
            Begin Extent = 
               Top = 66
               Left = 827
               Bottom = 363
               Right = 1008
            End
            DisplayFlags = 280
            TopColumn = 12
         End
         Begin Table = "organizational_info_3"
            Begin Extent = 
               Top = 4
               Left = 557
               Bottom = 134
               Right = 749
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "organizational_info_2"
            Begin Extent = 
               Top = 141
               Left = 558
               Bottom = 271
               Right = 750
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "organizational_info_1"
            Begin Extent = 
               Top = 30
               Left = 224
               Bottom = 297
               Right = 416
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "organizational_info"
            Begin Extent = 
               Top = 4
               Left = 763
               Bottom = 134
               Right = 955
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_2"
            Begin Extent = 
               Top = 27
               Left = 0
               Bottom = 274
               Right = 181
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_1"
            Begin Extent = 
               Top = 77
               Left = 88
               Bottom = 322
               Right ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_contacts'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'= 269
            End
            DisplayFlags = 280
            TopColumn = 7
         End
         Begin Table = "utils_1"
            Begin Extent = 
               Top = 315
               Left = 13
               Bottom = 474
               Right = 183
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "utils"
            Begin Extent = 
               Top = 129
               Left = 0
               Bottom = 316
               Right = 170
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_3"
            Begin Extent = 
               Top = 0
               Left = 1249
               Bottom = 206
               Right = 1430
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 36
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 10860
         Alias = 2460
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_contacts'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_contacts'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "events"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 208
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact_1"
            Begin Extent = 
               Top = 101
               Left = 894
               Bottom = 275
               Right = 1064
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "contact"
            Begin Extent = 
               Top = 46
               Left = 1138
               Bottom = 176
               Right = 1308
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_events'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'V_events'
GO

