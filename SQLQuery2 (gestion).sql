USE gestion; 
-- ENCARGADO -- 
-- CREACION DE LA TABLA Encargados -- 
CREATE TABLE Encargado(
	Id_Encargado INT IDENTITY(1,1) PRIMARY KEY,
	Nombre_Encargado VARCHAR(50) NOT NULL, 
	Apellido_Encargado VARCHAR(50) NOT NULL,
	Correo_Encargado VARCHAR(100) NOT NULL,
	Contraseña_Encargado VARCHAR(50) NOT NULL,
);
-- INSERCION PARA LA TABLA Encargado -- 
INSERT INTO Encargado(Nombre_Encargado, Apellido_Encargado, Correo_Encargado, Contraseña_Encargado) VALUES
('Martha Xochilt', 'Nava Bautista', 'martha.xochilt@ucolmx', 'martha123'),
('Brenda', 'Cerrato', 'brenda.cerrato@ucol.mx', 'brenda123'),
('Gregorio', 'Martinez', 'gregorio.martinez@ucol.mx', 'gregorio123'),
('Isaac', 'Jaramillo', 'isaac.jaramillo@ucol.mx', 'isaac123'),
('Sonia', 'Martinez', 'sonia.martinez@ucol.mx', 'sonia123'),
('Luis Eduardo', 'Moran Lopez', 'luis.moran@ucol.mx', 'luis123');

-- LABORATORIO -- 
-- CREACION TABLA LABORATORIO -- 
CREATE TABLE Laboratorio( 
	Id_Lab INT IDENTITY(1,1) PRIMARY KEY,
	Nombre_Lab VARCHAR(100) NOT NULL,
	Id_Encargado INT NOT NULL,
	FOREIGN KEY (Id_Encargado) REFERENCES Encargado(Id_Encargado)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);	
-- INSERCION PARA TABLA Laboratorio -- 
INSERT INTO Laboratorio(Nombre_Lab, Id_Encargado) VALUES
('Laboratorio de Telefonía', 1),
('Laboratorio de Cómputo', 2),
('Laboratorio de Cómputo', 3),
('Laboratorio de Ciencia de Datos', 4),
('Laboratorio de Matemáticas Aplicadas', 5),
('Laboratorio de Matemáticas Aplicadas', 6);

-- Cpul -- 
-- CREACION DE TABLA Cpul -- 
CREATE TABLE Cpul(
	Id_Cpu VARCHAR(6) PRIMARY KEY,
	Nombre_Cpu VARCHAR(100) NOT NULL,
	Nucleos INT NOT NULL,
	Hilos INT NOT NULL
);
-- INSERCION TABLA Cpul -- 
INSERT INTO Cpul(Id_Cpu, Nombre_Cpu, Nucleos, Hilos) VALUES 
('CPU001', '13th Gen Intel Core i7-13700', 16, 24),
('CPU002', 'Intel Core i7-860', 4, 8),
('CPU003', 'Intel Core i5-4690', 4, 4),
('CPU004', 'Intel Core i5-6500', 4, 4),
('CPU005', 'Intel Core i7-2500', 4, 4);

-- GPU -- 
-- CREACION DE LA TABLA Gpu --
CREATE TABLE Gpu(
	Id_Gpu VARCHAR(6) PRIMARY KEY,
	Nombre_Gpu VARCHAR(100) NOT NULL,
	Flops FLOAT NOT NULL
);
-- INSERCION PARA TABLA Gpu -- 
INSERT INTO Gpu (Id_Gpu, Nombre_Gpu, Flops) VALUES
('GPU001', 'NVIDIA RTX 3070', 20.3),
('GPU002', 'NVIDIA GTX 660', 1.9),
('GPU003', 'NVIDIA GTX 1050 Ti', 2.1),
('GPU004', 'NVIDIA GTX 1660 Ti', 5.0),
('GPU005', 'NVIDIA GTX 1060', 4.4);

-- RAM -- 
-- CREACION EN LA TABLA Ram -- 
CREATE TABLE Ram(
    Id_Ram VARCHAR(6) PRIMARY KEY, 
    Tipo VARCHAR(50) NOT NULL 
);
-- INSERCION PARA TABLA Ram -- 
INSERT INTO Ram (Id_Ram, Tipo) VALUES
('RAM001', 'DDR5 5600MHz'),
('RAM002', 'DDR3 1333MHz'),
('RAM003', 'DDR3 1600MHz'),
('RAM004', 'DDR4 2133MHz'),
('RAM005', 'DDR3 1066MHz');

-- MONITOR --
-- CREACION DE LA TABLA Monitor -- 
CREATE TABLE Monitor( 
    Id_Monitor VARCHAR(6) PRIMARY KEY, 
    Tamaño DECIMAL(5,2) NOT NULL,
    Frecuencia INT NOT NULL 
);
-- INSERCION PARA TABLA MONITOR -- 
INSERT INTO Monitor (Id_Monitor, Tamaño, Frecuencia) VALUES
('MON001', 27.00, 144),
('MON002', 24.00, 60),
('MON003', 21.50, 60),
('MON004', 23.80, 75),
('MON005', 22.00, 60);

-- ALMACENAMIENTO --     
-- CREACION TABLA ALMACENAMIENTO -- 
CREATE TABLE Almacenamiento(
    Id_Almacenamiento VARCHAR(6) PRIMARY KEY,
    Tipo VARCHAR(50) NOT NULL, -- SSD, HDD, NVMe, etc.
    Capacidad INT NOT NULL, -- Capacidad en GB
    Velocidad_Lectura INT DEFAULT 0, -- Opcional, en MB/s
    Velocidad_Escritura INT DEFAULT 0 -- Opcional, en MB/s
);
-- INSERCION PARA TABLA Almacenamiento -- 
INSERT INTO Almacenamiento (Id_Almacenamiento, Tipo, Capacidad, Velocidad_Lectura, Velocidad_Escritura) VALUES
('ALM001', 'SSD', 500, 550, 520),
('ALM002', 'HDD', 1000, 120, 100),
('ALM003', 'NVMe', 1000, 3500, 3000),
('ALM004', 'SSD', 250, 500, 450),
('ALM005', 'HDD', 2000, 150, 140);

-- ESTADO -- 
-- CREACION DE LA TABLA Estado -- 
CREATE TABLE Estado(
    Id_Estado INT IDENTITY(1,1) PRIMARY KEY,
    Descripcion VARCHAR(50) NOT NULL UNIQUE
);
-- INSERCION PARA TABLA Estado -- 
INSERT INTO Estado (Descripcion) VALUES
('Buen estado'),
('Mal estado'),
('En mantenimiento');

-- EQUIPO -- 
-- CREACION DE LA TABLA Equipo -- 
CREATE TABLE Equipo( 
    Id_Equipo INT PRIMARY KEY IDENTITY(1,1), 
    Id_Lab INT NOT NULL,
    Id_Cpu VARCHAR(6) NOT NULL, 
    Id_Ram VARCHAR(6) NOT NULL, 
    Id_Monitor VARCHAR(6) NOT NULL,
    Id_Gpu VARCHAR(6) NOT NULL, 
	Id_Estado INT NOT NULL,
	Id_Almacenamiento VARCHAR(6) NOT NULL,
    FOREIGN KEY (Id_Lab) REFERENCES Laboratorio(Id_Lab) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (Id_Cpu) REFERENCES Cpul(Id_Cpu)     
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    FOREIGN KEY (Id_Ram) REFERENCES Ram(Id_Ram) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    FOREIGN KEY (Id_Monitor) REFERENCES Monitor(Id_Monitor) 
        ON DELETE CASCADE
        ON UPDATE CASCADE, 
    FOREIGN KEY (Id_Gpu) REFERENCES Gpu(Id_Gpu)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (Id_Estado) REFERENCES Estado(Id_Estado)
		ON DELETE CASCADE 
		ON UPDATE CASCADE,
	FOREIGN KEY (Id_Almacenamiento) REFERENCES Almacenamiento(Id_Almacenamiento)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
-- INSERCION PARA LA TABLA EQUIPO -- 
INSERT INTO Equipo (Id_Lab, Id_Cpu, Id_Ram, Id_Monitor, Id_Gpu, Id_Estado, Id_Almacenamiento) VALUES
-- Laboratorio de Telefonía --
(1, 'CPU002', 'RAM002', 'MON002', 'GPU002', 1, 'ALM001'),
(1, 'CPU003', 'RAM003', 'MON003', 'GPU003', 1, 'ALM002'),
(1, 'CPU004', 'RAM004', 'MON004', 'GPU004', 1, 'ALM003'),
(1, 'CPU005', 'RAM005', 'MON005', 'GPU005', 1, 'ALM004'),
(1, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM005'),
(1, 'CPU003', 'RAM004', 'MON003', 'GPU002', 1, 'ALM001'),
(1, 'CPU004', 'RAM005', 'MON002', 'GPU003', 1, 'ALM002'),
(1, 'CPU002', 'RAM003', 'MON004', 'GPU004', 1, 'ALM003'),
(1, 'CPU005', 'RAM001', 'MON001', 'GPU005', 1, 'ALM004'),
(1, 'CPU001', 'RAM002', 'MON005', 'GPU001', 1, 'ALM005'),
-- Laboratorio de Cómputo -- 
(2, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM001'),
(2, 'CPU002', 'RAM002', 'MON002', 'GPU002', 1, 'ALM002'),
(2, 'CPU003', 'RAM003', 'MON003', 'GPU003', 1, 'ALM003'),
(2, 'CPU004', 'RAM004', 'MON004', 'GPU004', 1, 'ALM004'),
(2, 'CPU005', 'RAM005', 'MON005', 'GPU005', 1, 'ALM005'),
(2, 'CPU003', 'RAM003', 'MON002', 'GPU003', 1, 'ALM001'),
(2, 'CPU004', 'RAM005', 'MON004', 'GPU002', 1, 'ALM002'),
(2, 'CPU002', 'RAM004', 'MON003', 'GPU004', 1, 'ALM003'),
(2, 'CPU005', 'RAM002', 'MON005', 'GPU005', 1, 'ALM004'),
(2, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM005'),
-- Laboratorio de Ciencia de Datos -- 
(3, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM001'),
(3, 'CPU002', 'RAM002', 'MON002', 'GPU002', 1, 'ALM002'),
(3, 'CPU003', 'RAM003', 'MON003', 'GPU003', 1, 'ALM003'),
(3, 'CPU004', 'RAM004', 'MON004', 'GPU004', 1, 'ALM004'),
(3, 'CPU005', 'RAM005', 'MON005', 'GPU005', 1, 'ALM005'),
(3, 'CPU004', 'RAM004', 'MON003', 'GPU003', 1, 'ALM001'),
(3, 'CPU003', 'RAM002', 'MON002', 'GPU002', 1, 'ALM002'),
(3, 'CPU005', 'RAM003', 'MON005', 'GPU004', 1, 'ALM003'),
(3, 'CPU001', 'RAM005', 'MON001', 'GPU005', 1, 'ALM004'),
(3, 'CPU002', 'RAM001', 'MON004', 'GPU001', 1, 'ALM005'),
-- Laboratorio de Matemáticas Aplicadas --
(4, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM001'),
(4, 'CPU002', 'RAM002', 'MON002', 'GPU002', 1, 'ALM002'),
(4, 'CPU003', 'RAM003', 'MON003', 'GPU003', 1, 'ALM003'),
(4, 'CPU004', 'RAM004', 'MON004', 'GPU004', 1, 'ALM004'),
(4, 'CPU005', 'RAM005', 'MON005', 'GPU005', 1, 'ALM005'),
(4, 'CPU005', 'RAM003', 'MON002', 'GPU004', 1, 'ALM001'),
(4, 'CPU004', 'RAM002', 'MON003', 'GPU003', 1, 'ALM002'),
(4, 'CPU003', 'RAM005', 'MON004', 'GPU002', 1, 'ALM003'),
(4, 'CPU002', 'RAM004', 'MON005', 'GPU005', 1, 'ALM004'),
(4, 'CPU001', 'RAM001', 'MON001', 'GPU001', 1, 'ALM005');

SELECT * FROM Almacenamiento; 
SELECT * FROM Cpul; 
SELECT * FROM Encargado;
SELECT * FROM Equipo;
SELECT * FROM Estado; 
SELECT * FROM Gpu; 
SELECT * FROM Laboratorio;
SELECT * FROM Monitor
SELECT * FROM Ram 
