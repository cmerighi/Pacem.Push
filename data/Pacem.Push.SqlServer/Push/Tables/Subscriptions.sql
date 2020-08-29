CREATE TABLE [Push].[Subscriptions]
(
	[Id] bigint NOT NULL CONSTRAINT PK_Push_Subscriptions PRIMARY KEY IDENTITY (1,1),
	[P256Dh] varchar(127) NOT NULL,

	-- user id
	[UserId] varchar(63) NOT NULL,
	-- client application id
	[ClientId] varchar(63) NULL,

	[Endpoint] varchar(511) NOT NULL,
	[Auth] varchar(31) NOT NULL,
	[Expires] bigint NULL, 
    CONSTRAINT [FK_Subscriptions_Clients] FOREIGN KEY ([ClientId]) REFERENCES [Push].[Clients]([ClientId]) ON UPDATE CASCADE,
)

GO

CREATE UNIQUE INDEX [UX_Push_Subscriptions_P256Dh] ON [Push].[Subscriptions] ([P256Dh])
GO

CREATE UNIQUE INDEX [UX_Push_Subscriptions_Unique] ON [Push].[Subscriptions] ([UserId],[ClientId])
