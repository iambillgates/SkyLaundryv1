-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2026 at 09:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laundry_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `weight` double NOT NULL,
  `serviceType` enum('KILOAN','SATUAN','EXPRESS') NOT NULL,
  `totalPrice` double NOT NULL,
  `status` enum('PENDING','WASHING','IRONING','READY','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `isPaid` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `customerName`, `weight`, `serviceType`, `totalPrice`, `status`, `createdAt`, `updatedAt`, `orderId`, `isPaid`) VALUES
('22fb73f4-6b75-4580-84c2-5273ad04492e', 'Awang', 100, 'KILOAN', 700000, 'PENDING', '2026-02-09 07:53:52.466', '2026-02-09 07:53:52.466', '260209-1453-K', 0),
('41e3594f-7f8b-4762-95e3-d5906705bf79', 'Rocky', 4, 'EXPRESS', 60000, 'PENDING', '2026-02-09 06:19:24.308', '2026-02-09 07:48:50.965', '202602091319-02', 1),
('69b31c74-30a9-4d41-870b-736eec4f344d', 'Ayam', 2, 'EXPRESS', 30000, 'COMPLETED', '2026-02-07 12:55:58.022', '2026-02-09 06:48:21.365', '202602071955-02', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `createdAt`) VALUES
(1, 'admin@skylaundry.com', '$2b$10$zYMamGD1927WKINM82ktZeCaaBhgjFKgr2c2aZae.zq5cupyg1RAq', 'Super Admin', '2026-02-08 15:07:30.807');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('30a31bb2-4f82-4cbd-9fe4-75151bbea4a1', 'a3a528bea5435e243d65969a60f66df860ff4c8645375172bd341afca85cca2a', '2026-02-08 14:27:06.592', '20260208142706_allen', NULL, NULL, '2026-02-08 14:27:06.542', 1),
('445c453c-576f-4a7c-b1d3-579a585c35f7', '111ccf18a108051946a7db46bc91dc0b04835852131f8ff61f7c3323312169f0', '2026-02-07 09:15:21.652', '20260207091521_init_tables', NULL, NULL, '2026-02-07 09:15:21.646', 1),
('b34531b8-613d-4373-a044-76c8b52d1989', '7d0ff4b828d64e0495ccb841303dd2f30a654c5f1b6be0fb849acbf6c7282b2a', '2026-02-09 07:43:45.846', '20260209074345_add_payment_status', NULL, NULL, '2026-02-09 07:43:45.828', 1),
('d191d4f3-ab3c-430f-9880-ba3869536ed4', '5c11a92969ab5417fed0264459e212016b67045a2b5644859c44c6cf3d7bffde', '2026-02-07 12:50:23.682', '20260207125023_allen', NULL, NULL, '2026-02-07 12:50:23.669', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_orderId_key` (`orderId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
