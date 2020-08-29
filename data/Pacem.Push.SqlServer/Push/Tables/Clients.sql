CREATE TABLE [Push].[Clients]
(
	[ClientId] varchar(63) NOT NULL CONSTRAINT PK_Push_Clients PRIMARY KEY,
	[Name] varchar(31) NULL,
	[VapidPublicKey] varchar(127) NOT NULL,
	[VapidPrivateKey] varchar(63) NOT NULL,
	[VapidSubject] varchar(63) NOT NULL, 
    [Enabled] BIT NOT NULL CONSTRAINT DF_Push_Clients_Enabled DEFAULT(0),
)

GO
