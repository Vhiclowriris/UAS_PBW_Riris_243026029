-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2026 at 04:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `umkm_dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_transaksi`
--

CREATE TABLE `detail_transaksi` (
  `id` int(11) NOT NULL,
  `transaksi_id` int(11) NOT NULL,
  `produk_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `harga_satuan` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_transaksi`
--

INSERT INTO `detail_transaksi` (`id`, `transaksi_id`, `produk_id`, `quantity`, `harga_satuan`, `subtotal`) VALUES
(1, 127, 16, 2, 25000.00, 50000.00),
(2, 127, 17, 1, 20000.00, 20000.00),
(3, 128, 19, 1, 30000.00, 30000.00),
(4, 129, 17, 1, 20000.00, 20000.00),
(5, 130, 20, 1, 15000.00, 15000.00),
(6, 130, 16, 1, 25000.00, 25000.00),
(7, 131, 19, 1, 30000.00, 30000.00),
(8, 131, 16, 1, 25000.00, 25000.00),
(9, 132, 20, 1, 15000.00, 15000.00),
(10, 132, 16, 1, 25000.00, 25000.00),
(11, 133, 17, 1, 20000.00, 20000.00),
(12, 133, 20, 1, 15000.00, 15000.00),
(13, 134, 17, 1, 20000.00, 20000.00),
(14, 134, 18, 1, 5000.00, 5000.00),
(15, 135, 18, 1, 5000.00, 5000.00),
(16, 135, 19, 1, 30000.00, 30000.00),
(17, 136, 20, 1, 15000.00, 15000.00),
(18, 136, 16, 1, 25000.00, 25000.00),
(19, 137, 16, 1, 25000.00, 25000.00),
(20, 137, 17, 1, 20000.00, 20000.00),
(21, 138, 18, 1, 5000.00, 5000.00),
(22, 138, 17, 1, 20000.00, 20000.00),
(23, 139, 18, 1, 5000.00, 5000.00),
(24, 140, 17, 1, 20000.00, 20000.00),
(25, 141, 16, 1, 25000.00, 25000.00);

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

CREATE TABLE `outlets` (
  `id` int(11) NOT NULL,
  `nama_outlet` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `kota` varchar(50) NOT NULL,
  `provinsi` varchar(50) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `nama_outlet`, `alamat`, `kota`, `provinsi`, `latitude`, `longitude`, `created_at`) VALUES
(10, 'UMKM Jakarta Pusat', 'Jl. Sudirman No. 45', 'Jakarta Pusat', 'DKI Jakarta', -6.20880000, 106.84560000, '2026-05-25 03:55:35'),
(11, 'UMKM Bandung', 'Jl. Asia Afrika No. 10', 'Bandung', 'Jawa Barat', -6.91750000, 107.61910000, '2026-05-25 03:55:35'),
(12, 'UMKM Surabaya', 'Jl. Tunjungan No. 68', 'Surabaya', 'Jawa Timur', -7.25750000, 112.75210000, '2026-05-25 03:55:35');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id` int(11) NOT NULL,
  `kode_produk` varchar(50) NOT NULL,
  `nama_produk` varchar(100) NOT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `harga_jual` decimal(12,2) NOT NULL,
  `stok` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id`, `kode_produk`, `nama_produk`, `kategori`, `harga_jual`, `stok`, `created_at`) VALUES
(16, 'PRD001', 'Nasi Goreng Spesial', 'Makanan', 25000.00, 100, '2026-05-25 03:55:35'),
(17, 'PRD002', 'Mie Ayam Bakso', 'Makanan', 20000.00, 150, '2026-05-25 03:55:35'),
(18, 'PRD003', 'Es Teh Manis', 'Minuman', 5000.00, 300, '2026-05-25 03:55:35'),
(19, 'PRD004', 'Ayam Goreng Crispy', 'Makanan', 30000.00, 80, '2026-05-25 03:55:35'),
(20, 'PRD005', 'Jus Jeruk Segar', 'Minuman', 15000.00, 120, '2026-05-25 03:55:35');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `nomor_transaksi` varchar(50) NOT NULL,
  `outlet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tanggal_transaksi` datetime NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `metode_pembayaran` enum('tunai','debit','kredit','e-wallet') DEFAULT 'tunai',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `nomor_transaksi`, `outlet_id`, `user_id`, `tanggal_transaksi`, `total_amount`, `metode_pembayaran`, `created_at`) VALUES
(127, 'TRX-2024-031', 10, 17, '2026-06-02 15:48:00', 70000.00, 'tunai', '2026-06-02 08:48:08'),
(128, 'TRX-2024-032', 12, 18, '2026-06-25 17:59:00', 30000.00, 'e-wallet', '2026-06-02 08:58:03'),
(129, 'TRX-2024-045', 11, 17, '2026-06-07 18:54:00', 20000.00, 'debit', '2026-06-02 10:57:48'),
(130, 'TRX-2024-066', 12, 17, '2026-06-27 17:57:00', 40000.00, 'e-wallet', '2026-06-03 06:53:59'),
(131, 'TRX-2024-090', 10, 18, '2026-06-09 20:02:00', 55000.00, 'tunai', '2026-06-09 13:01:49'),
(132, 'TRX-2024-065', 12, 17, '2026-06-10 21:19:00', 40000.00, 'e-wallet', '2026-06-09 13:19:40'),
(133, 'TRX-2024-014', 11, 18, '2026-06-12 20:39:00', 35000.00, 'debit', '2026-06-09 13:42:21'),
(134, 'TRX-2024-037', 12, 17, '2026-06-15 21:15:00', 25000.00, 'tunai', '2026-06-09 14:14:35'),
(135, 'TRX-2024-029', 10, 17, '2026-06-24 22:42:00', 35000.00, 'debit', '2026-06-09 14:41:53'),
(136, 'TRX-2024-028', 10, 18, '2026-06-06 21:42:00', 40000.00, 'debit', '2026-06-09 14:42:58'),
(137, 'TRX-2025-078', 10, 17, '2026-06-26 21:47:00', 45000.00, 'tunai', '2026-06-09 14:47:54'),
(138, 'PAJ-2025-016', 12, 18, '2026-06-16 21:52:00', 25000.00, 'e-wallet', '2026-06-09 14:52:42'),
(139, 'AWM-2024-011', 11, 17, '2026-06-09 21:54:00', 5000.00, 'tunai', '2026-06-09 14:54:57'),
(140, 'AWM-2028-021', 11, 17, '2026-06-20 00:38:00', 20000.00, 'tunai', '2026-06-09 17:39:15'),
(141, 'TRX-2023-088', 10, 18, '2026-06-10 00:46:00', 25000.00, 'debit', '2026-06-09 17:46:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('owner','kasir','analis') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(16, 'owner1', '$2a$10$3sDh6qSkU6o15R7dqVWZ5O/GPLFRJzqQdvPyAvM/KJ/DxFpEz8JHy', 'owner', '2026-05-25 03:55:35'),
(17, 'kasir1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kasir', '2026-05-25 03:55:35'),
(18, 'kasir2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kasir', '2026-05-25 03:55:35'),
(19, 'analis1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'analis', '2026-05-25 03:55:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaksi_id` (`transaksi_id`),
  ADD KEY `idx_produk_id` (`produk_id`);

--
-- Indexes for table `outlets`
--
ALTER TABLE `outlets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_produk` (`kode_produk`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_transaksi` (`nomor_transaksi`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_tanggal_transaksi` (`tanggal_transaksi`),
  ADD KEY `idx_outlet_id` (`outlet_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `outlets`
--
ALTER TABLE `outlets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD CONSTRAINT `detail_transaksi_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`),
  ADD CONSTRAINT `detail_transaksi_ibfk_2` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`);

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`),
  ADD CONSTRAINT `transaksi_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
