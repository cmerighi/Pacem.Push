﻿CREATE TABLE [Push].[Subscriptions]
(
	[Id] bigint NOT NULL CONSTRAINT PK_Push_Subscriptions PRIMARY KEY IDENTITY (1,1),
	[P256Dh] varchar(511) NOT NULL,
	[UserId] varchar(63) NOT NULL,
	[Endpoint] varchar(255) NOT NULL,
	[Auth] varchar(255) NOT NULL,
	[Expires] bigint NULL,
)

GO

CREATE UNIQUE INDEX [UX_Push_Subscriptions_P256Dh] ON [Push].[Subscriptions] ([P256Dh])
GO

CREATE UNIQUE INDEX [UX_Push_Subscriptions_Unique] ON [Push].[Subscriptions] ([UserId],[Endpoint])