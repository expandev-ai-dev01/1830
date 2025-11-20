-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

-- Create purchase table
CREATE TABLE [dbo].[purchase] (
    [id] INT IDENTITY(1,1) NOT NULL,
    [idAccount] INT NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [category] NVARCHAR(50) NOT NULL,
    [purchaseDate] DATE NOT NULL,
    [unitPrice] DECIMAL(10, 2) NOT NULL,
    [quantity] DECIMAL(10, 3) NOT NULL,
    [unitMeasure] NVARCHAR(20) NOT NULL,
    [totalValue] DECIMAL(10, 2) NOT NULL,
    [currency] NVARCHAR(3) NOT NULL DEFAULT 'BRL',
    [location] NVARCHAR(100) NULL,
    [observations] NVARCHAR(500) NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'ativo',
    [version] INT NOT NULL DEFAULT 1,
    [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [dateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

ALTER TABLE [dbo].[purchase]
ADD CONSTRAINT [pkPurchase] PRIMARY KEY CLUSTERED ([id]);
GO

-- =====================================================
-- INDEXES
-- =====================================================

CREATE NONCLUSTERED INDEX [ixPurchase_Account]
ON [dbo].[purchase]([idAccount])
INCLUDE ([purchaseDate], [status], [totalValue]);
GO

CREATE NONCLUSTERED INDEX [ixPurchase_Date]
ON [dbo].[purchase]([idAccount], [purchaseDate])
INCLUDE ([totalValue]);
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseCreate]
    @idAccount INT,
    @name NVARCHAR(100),
    @category NVARCHAR(50),
    @purchaseDate DATE,
    @unitPrice DECIMAL(10, 2),
    @quantity DECIMAL(10, 3),
    @unitMeasure NVARCHAR(20),
    @totalValue DECIMAL(10, 2),
    @currency NVARCHAR(3),
    @location NVARCHAR(100) = NULL,
    @observations NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [dbo].[purchase] (
        [idAccount], [name], [category], [purchaseDate], 
        [unitPrice], [quantity], [unitMeasure], [totalValue], 
        [currency], [location], [observations], [status], 
        [version], [dateCreated], [dateUpdated]
    )
    VALUES (
        @idAccount, @name, @category, @purchaseDate, 
        @unitPrice, @quantity, @unitMeasure, @totalValue, 
        @currency, @location, @observations, 'ativo', 
        1, GETUTCDATE(), GETUTCDATE()
    );

    SELECT SCOPE_IDENTITY() AS [id];
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseUpdate]
    @id INT,
    @idAccount INT,
    @name NVARCHAR(100),
    @category NVARCHAR(50),
    @purchaseDate DATE,
    @unitPrice DECIMAL(10, 2),
    @quantity DECIMAL(10, 3),
    @unitMeasure NVARCHAR(20),
    @totalValue DECIMAL(10, 2),
    @currency NVARCHAR(3),
    @location NVARCHAR(100) = NULL,
    @observations NVARCHAR(500) = NULL,
    @version INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @currentVersion INT;
    
    SELECT @currentVersion = [version]
    FROM [dbo].[purchase]
    WHERE [id] = @id AND [idAccount] = @idAccount;

    IF @currentVersion IS NULL
    BEGIN
        ;THROW 51000, 'recordNotFound', 1;
    END;

    IF @currentVersion <> @version
    BEGIN
        ;THROW 51000, 'concurrencyConflict', 1;
    END;

    UPDATE [dbo].[purchase]
    SET 
        [name] = @name,
        [category] = @category,
        [purchaseDate] = @purchaseDate,
        [unitPrice] = @unitPrice,
        [quantity] = @quantity,
        [unitMeasure] = @unitMeasure,
        [totalValue] = @totalValue,
        [currency] = @currency,
        [location] = @location,
        [observations] = @observations,
        [version] = [version] + 1,
        [dateUpdated] = GETUTCDATE()
    WHERE [id] = @id AND [idAccount] = @idAccount;

    SELECT [version] FROM [dbo].[purchase] WHERE [id] = @id;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseDelete]
    @id INT,
    @idAccount INT,
    @version INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @currentVersion INT;
    
    SELECT @currentVersion = [version]
    FROM [dbo].[purchase]
    WHERE [id] = @id AND [idAccount] = @idAccount;

    IF @currentVersion IS NULL
    BEGIN
        ;THROW 51000, 'recordNotFound', 1;
    END;

    IF @currentVersion <> @version
    BEGIN
        ;THROW 51000, 'concurrencyConflict', 1;
    END;

    UPDATE [dbo].[purchase]
    SET 
        [status] = 'excluido',
        [version] = [version] + 1,
        [dateUpdated] = GETUTCDATE()
    WHERE [id] = @id AND [idAccount] = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseGet]
    @id INT,
    @idAccount INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [id], [idAccount], [name], [category], [purchaseDate], 
        [unitPrice], [quantity], [unitMeasure], [totalValue], 
        [currency], [location], [observations], [status], 
        [version], [dateCreated], [dateUpdated]
    FROM [dbo].[purchase]
    WHERE [id] = @id AND [idAccount] = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseList]
    @idAccount INT,
    @startDate DATE = NULL,
    @endDate DATE = NULL,
    @category NVARCHAR(50) = NULL,
    @name NVARCHAR(100) = NULL,
    @status NVARCHAR(20) = 'ativo',
    @page INT = 1,
    @pageSize INT = 10,
    @orderBy NVARCHAR(50) = 'date_desc'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @offset INT = (@page - 1) * @pageSize;

    ;WITH FilteredData AS (
        SELECT 
            [id], [idAccount], [name], [category], [purchaseDate], 
            [unitPrice], [quantity], [unitMeasure], [totalValue], 
            [currency], [location], [observations], [status], 
            [version], [dateCreated], [dateUpdated],
            COUNT(*) OVER() as [totalCount],
            SUM([totalValue]) OVER() as [totalValueFiltered]
        FROM [dbo].[purchase]
        WHERE [idAccount] = @idAccount
          AND (@startDate IS NULL OR [purchaseDate] >= @startDate)
          AND (@endDate IS NULL OR [purchaseDate] <= @endDate)
          AND (@category IS NULL OR [category] = @category)
          AND (@name IS NULL OR [name] LIKE '%' + @name + '%')
          AND (@status = 'todos' OR [status] = @status)
    )
    SELECT *
    FROM FilteredData
    ORDER BY 
        CASE WHEN @orderBy = 'date_desc' THEN [purchaseDate] END DESC,
        CASE WHEN @orderBy = 'date_asc' THEN [purchaseDate] END ASC,
        CASE WHEN @orderBy = 'name_asc' THEN [name] END ASC,
        CASE WHEN @orderBy = 'name_desc' THEN [name] END DESC,
        CASE WHEN @orderBy = 'value_desc' THEN [totalValue] END DESC,
        CASE WHEN @orderBy = 'value_asc' THEN [totalValue] END ASC,
        [id] DESC
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END;
GO