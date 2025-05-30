USE [master]
GO
/****** Object:  Database [gestion]    Script Date: 23/05/2025 11:56:06 a. m. ******/
CREATE DATABASE [gestion]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'gestion', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLSERVER\MSSQL\DATA\gestion.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'gestion_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLSERVER\MSSQL\DATA\gestion_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [gestion] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [gestion].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [gestion] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [gestion] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [gestion] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [gestion] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [gestion] SET ARITHABORT OFF 
GO
ALTER DATABASE [gestion] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [gestion] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [gestion] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [gestion] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [gestion] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [gestion] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [gestion] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [gestion] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [gestion] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [gestion] SET  ENABLE_BROKER 
GO
ALTER DATABASE [gestion] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [gestion] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [gestion] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [gestion] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [gestion] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [gestion] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [gestion] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [gestion] SET RECOVERY FULL 
GO
ALTER DATABASE [gestion] SET  MULTI_USER 
GO
ALTER DATABASE [gestion] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [gestion] SET DB_CHAINING OFF 
GO
ALTER DATABASE [gestion] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [gestion] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [gestion] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [gestion] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'gestion', N'ON'
GO
ALTER DATABASE [gestion] SET QUERY_STORE = ON
GO
ALTER DATABASE [gestion] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [gestion]
GO
/****** Object:  Table [dbo].[Almacenamiento]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Almacenamiento](
	[Id_Almacenamiento] [varchar](6) NOT NULL,
	[Tipo] [varchar](50) NOT NULL,
	[Capacidad] [int] NOT NULL,
	[Velocidad_Lectura] [int] NULL,
	[Velocidad_Escritura] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Almacenamiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cpul]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cpul](
	[Id_Cpu] [varchar](6) NOT NULL,
	[Nombre_Cpu] [varchar](100) NOT NULL,
	[Nucleos] [int] NOT NULL,
	[Hilos] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Cpu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Encargado]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Encargado](
	[Id_Encargado] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_Encargado] [varchar](50) NOT NULL,
	[Apellido_Encargado] [varchar](50) NOT NULL,
	[Correo_Encargado] [varchar](100) NOT NULL,
	[Contraseña_Encargado] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Encargado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Equipo]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Equipo](
	[Id_Equipo] [int] IDENTITY(1,1) NOT NULL,
	[Id_Lab] [int] NOT NULL,
	[Id_Cpu] [varchar](6) NOT NULL,
	[Id_Ram] [varchar](6) NOT NULL,
	[Id_Monitor] [varchar](6) NOT NULL,
	[Id_Gpu] [varchar](6) NOT NULL,
	[Id_Estado] [int] NOT NULL,
	[Id_Almacenamiento] [varchar](6) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Equipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Estado]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Estado](
	[Id_Estado] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Estado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gpu]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gpu](
	[Id_Gpu] [varchar](6) NOT NULL,
	[Nombre_Gpu] [varchar](100) NOT NULL,
	[Flops] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Gpu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Laboratorio]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Laboratorio](
	[Id_Lab] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_Lab] [varchar](100) NOT NULL,
	[Id_Encargado] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Lab] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Monitor]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Monitor](
	[Id_Monitor] [varchar](6) NOT NULL,
	[Tamaño] [decimal](5, 2) NOT NULL,
	[Frecuencia] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Monitor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ram]    Script Date: 23/05/2025 11:56:07 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ram](
	[Id_Ram] [varchar](6) NOT NULL,
	[Tipo] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id_Ram] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Almacenamiento] ([Id_Almacenamiento], [Tipo], [Capacidad], [Velocidad_Lectura], [Velocidad_Escritura]) VALUES (N'ALM001', N'SSD', 500, 550, 520)
INSERT [dbo].[Almacenamiento] ([Id_Almacenamiento], [Tipo], [Capacidad], [Velocidad_Lectura], [Velocidad_Escritura]) VALUES (N'ALM002', N'HDD', 1000, 120, 100)
INSERT [dbo].[Almacenamiento] ([Id_Almacenamiento], [Tipo], [Capacidad], [Velocidad_Lectura], [Velocidad_Escritura]) VALUES (N'ALM003', N'NVMe', 1000, 3500, 3000)
INSERT [dbo].[Almacenamiento] ([Id_Almacenamiento], [Tipo], [Capacidad], [Velocidad_Lectura], [Velocidad_Escritura]) VALUES (N'ALM004', N'SSD', 250, 500, 450)
INSERT [dbo].[Almacenamiento] ([Id_Almacenamiento], [Tipo], [Capacidad], [Velocidad_Lectura], [Velocidad_Escritura]) VALUES (N'ALM005', N'HDD', 2000, 150, 140)
GO
INSERT [dbo].[Cpul] ([Id_Cpu], [Nombre_Cpu], [Nucleos], [Hilos]) VALUES (N'CPU001', N'13th Gen Intel Core i7-13700', 16, 24)
INSERT [dbo].[Cpul] ([Id_Cpu], [Nombre_Cpu], [Nucleos], [Hilos]) VALUES (N'CPU002', N'Intel Core i7-860', 4, 8)
INSERT [dbo].[Cpul] ([Id_Cpu], [Nombre_Cpu], [Nucleos], [Hilos]) VALUES (N'CPU003', N'Intel Core i5-4690', 4, 4)
INSERT [dbo].[Cpul] ([Id_Cpu], [Nombre_Cpu], [Nucleos], [Hilos]) VALUES (N'CPU004', N'Intel Core i5-6500', 4, 4)
INSERT [dbo].[Cpul] ([Id_Cpu], [Nombre_Cpu], [Nucleos], [Hilos]) VALUES (N'CPU005', N'Intel Core i7-2500', 4, 4)
GO
SET IDENTITY_INSERT [dbo].[Encargado] ON 

INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (1, N'Martha Xochilt', N'Nava Bautista', N'martha.xochilt@ucolmx', N'martha123')
INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (2, N'Brenda', N'Cerrato', N'brenda.cerrato@ucol.mx', N'brenda123')
INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (3, N'Gregorio', N'Martinez', N'gregorio.martinez@ucol.mx', N'gregorio123')
INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (4, N'Isaac', N'Jaramillo', N'isaac.jaramillo@ucol.mx', N'isaac123')
INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (5, N'Sonia', N'Martinez', N'sonia.martinez@ucol.mx', N'sonia123')
INSERT [dbo].[Encargado] ([Id_Encargado], [Nombre_Encargado], [Apellido_Encargado], [Correo_Encargado], [Contraseña_Encargado]) VALUES (6, N'Luis Eduardo', N'Moran Lopez', N'luis.moran@ucol.mx', N'luis123')
SET IDENTITY_INSERT [dbo].[Encargado] OFF
GO
SET IDENTITY_INSERT [dbo].[Equipo] ON 

INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (1, 1, N'CPU002', N'RAM002', N'MON002', N'GPU002', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (2, 1, N'CPU003', N'RAM003', N'MON003', N'GPU003', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (3, 1, N'CPU004', N'RAM004', N'MON004', N'GPU004', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (4, 1, N'CPU005', N'RAM005', N'MON005', N'GPU005', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (5, 1, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (6, 1, N'CPU003', N'RAM004', N'MON003', N'GPU002', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (7, 1, N'CPU004', N'RAM005', N'MON002', N'GPU003', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (8, 1, N'CPU002', N'RAM003', N'MON004', N'GPU004', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (9, 1, N'CPU005', N'RAM001', N'MON001', N'GPU005', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (10, 1, N'CPU001', N'RAM002', N'MON005', N'GPU001', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (11, 2, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (12, 2, N'CPU002', N'RAM002', N'MON002', N'GPU002', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (13, 2, N'CPU003', N'RAM003', N'MON003', N'GPU003', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (14, 2, N'CPU004', N'RAM004', N'MON004', N'GPU004', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (15, 2, N'CPU005', N'RAM005', N'MON005', N'GPU005', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (16, 2, N'CPU003', N'RAM003', N'MON002', N'GPU003', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (17, 2, N'CPU004', N'RAM005', N'MON004', N'GPU002', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (18, 2, N'CPU002', N'RAM004', N'MON003', N'GPU004', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (19, 2, N'CPU005', N'RAM002', N'MON005', N'GPU005', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (20, 2, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (21, 3, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (22, 3, N'CPU002', N'RAM002', N'MON002', N'GPU002', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (23, 3, N'CPU003', N'RAM003', N'MON003', N'GPU003', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (24, 3, N'CPU004', N'RAM004', N'MON004', N'GPU004', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (25, 3, N'CPU005', N'RAM005', N'MON005', N'GPU005', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (26, 3, N'CPU004', N'RAM004', N'MON003', N'GPU003', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (27, 3, N'CPU003', N'RAM002', N'MON002', N'GPU002', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (28, 3, N'CPU005', N'RAM003', N'MON005', N'GPU004', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (29, 3, N'CPU001', N'RAM005', N'MON001', N'GPU005', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (30, 3, N'CPU002', N'RAM001', N'MON004', N'GPU001', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (31, 4, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (32, 4, N'CPU002', N'RAM002', N'MON002', N'GPU002', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (33, 4, N'CPU003', N'RAM003', N'MON003', N'GPU003', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (34, 4, N'CPU004', N'RAM004', N'MON004', N'GPU004', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (35, 4, N'CPU005', N'RAM005', N'MON005', N'GPU005', 1, N'ALM005')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (36, 4, N'CPU005', N'RAM003', N'MON002', N'GPU004', 1, N'ALM001')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (37, 4, N'CPU004', N'RAM002', N'MON003', N'GPU003', 1, N'ALM002')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (38, 4, N'CPU003', N'RAM005', N'MON004', N'GPU002', 1, N'ALM003')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (39, 4, N'CPU002', N'RAM004', N'MON005', N'GPU005', 1, N'ALM004')
INSERT [dbo].[Equipo] ([Id_Equipo], [Id_Lab], [Id_Cpu], [Id_Ram], [Id_Monitor], [Id_Gpu], [Id_Estado], [Id_Almacenamiento]) VALUES (40, 4, N'CPU001', N'RAM001', N'MON001', N'GPU001', 1, N'ALM005')
SET IDENTITY_INSERT [dbo].[Equipo] OFF
GO
SET IDENTITY_INSERT [dbo].[Estado] ON 

INSERT [dbo].[Estado] ([Id_Estado], [Descripcion]) VALUES (1, N'Buen estado')
INSERT [dbo].[Estado] ([Id_Estado], [Descripcion]) VALUES (3, N'En mantenimiento')
INSERT [dbo].[Estado] ([Id_Estado], [Descripcion]) VALUES (2, N'Mal estado')
SET IDENTITY_INSERT [dbo].[Estado] OFF
GO
INSERT [dbo].[Gpu] ([Id_Gpu], [Nombre_Gpu], [Flops]) VALUES (N'GPU001', N'NVIDIA RTX 3070', 20.3)
INSERT [dbo].[Gpu] ([Id_Gpu], [Nombre_Gpu], [Flops]) VALUES (N'GPU002', N'NVIDIA GTX 660', 1.9)
INSERT [dbo].[Gpu] ([Id_Gpu], [Nombre_Gpu], [Flops]) VALUES (N'GPU003', N'NVIDIA GTX 1050 Ti', 2.1)
INSERT [dbo].[Gpu] ([Id_Gpu], [Nombre_Gpu], [Flops]) VALUES (N'GPU004', N'NVIDIA GTX 1660 Ti', 5)
INSERT [dbo].[Gpu] ([Id_Gpu], [Nombre_Gpu], [Flops]) VALUES (N'GPU005', N'NVIDIA GTX 1060', 4.4)
GO
SET IDENTITY_INSERT [dbo].[Laboratorio] ON 

INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (1, N'Laboratorio de Telefonía', 1)
INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (2, N'Laboratorio de Cómputo', 2)
INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (3, N'Laboratorio de Cómputo', 3)
INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (4, N'Laboratorio de Ciencia de Datos', 4)
INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (5, N'Laboratorio de Matemáticas Aplicadas', 5)
INSERT [dbo].[Laboratorio] ([Id_Lab], [Nombre_Lab], [Id_Encargado]) VALUES (6, N'Laboratorio de Matemáticas Aplicadas', 6)
SET IDENTITY_INSERT [dbo].[Laboratorio] OFF
GO
INSERT [dbo].[Monitor] ([Id_Monitor], [Tamaño], [Frecuencia]) VALUES (N'MON001', CAST(27.00 AS Decimal(5, 2)), 144)
INSERT [dbo].[Monitor] ([Id_Monitor], [Tamaño], [Frecuencia]) VALUES (N'MON002', CAST(24.00 AS Decimal(5, 2)), 60)
INSERT [dbo].[Monitor] ([Id_Monitor], [Tamaño], [Frecuencia]) VALUES (N'MON003', CAST(21.50 AS Decimal(5, 2)), 60)
INSERT [dbo].[Monitor] ([Id_Monitor], [Tamaño], [Frecuencia]) VALUES (N'MON004', CAST(23.80 AS Decimal(5, 2)), 75)
INSERT [dbo].[Monitor] ([Id_Monitor], [Tamaño], [Frecuencia]) VALUES (N'MON005', CAST(22.00 AS Decimal(5, 2)), 60)
GO
INSERT [dbo].[Ram] ([Id_Ram], [Tipo]) VALUES (N'RAM001', N'DDR5 5600MHz')
INSERT [dbo].[Ram] ([Id_Ram], [Tipo]) VALUES (N'RAM002', N'DDR3 1333MHz')
INSERT [dbo].[Ram] ([Id_Ram], [Tipo]) VALUES (N'RAM003', N'DDR3 1600MHz')
INSERT [dbo].[Ram] ([Id_Ram], [Tipo]) VALUES (N'RAM004', N'DDR4 2133MHz')
INSERT [dbo].[Ram] ([Id_Ram], [Tipo]) VALUES (N'RAM005', N'DDR3 1066MHz')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Estado__92C53B6C70767557]    Script Date: 23/05/2025 11:56:07 a. m. ******/
ALTER TABLE [dbo].[Estado] ADD UNIQUE NONCLUSTERED 
(
	[Descripcion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Almacenamiento] ADD  DEFAULT ((0)) FOR [Velocidad_Lectura]
GO
ALTER TABLE [dbo].[Almacenamiento] ADD  DEFAULT ((0)) FOR [Velocidad_Escritura]
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Almacenamiento])
REFERENCES [dbo].[Almacenamiento] ([Id_Almacenamiento])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Cpu])
REFERENCES [dbo].[Cpul] ([Id_Cpu])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Estado])
REFERENCES [dbo].[Estado] ([Id_Estado])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Gpu])
REFERENCES [dbo].[Gpu] ([Id_Gpu])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Lab])
REFERENCES [dbo].[Laboratorio] ([Id_Lab])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Monitor])
REFERENCES [dbo].[Monitor] ([Id_Monitor])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Equipo]  WITH CHECK ADD FOREIGN KEY([Id_Ram])
REFERENCES [dbo].[Ram] ([Id_Ram])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Laboratorio]  WITH CHECK ADD FOREIGN KEY([Id_Encargado])
REFERENCES [dbo].[Encargado] ([Id_Encargado])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
USE [master]
GO
ALTER DATABASE [gestion] SET  READ_WRITE 
GO

-----------------------------------------------------------------

