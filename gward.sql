-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2021 at 04:52 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gward`
--

-- --------------------------------------------------------

--
-- Table structure for table `garbage_details`
--

CREATE TABLE `garbage_details` (
  `id` int(11) NOT NULL,
  `Images` varchar(150) DEFAULT NULL,
  `weight` float NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `garbage_details`
--

INSERT INTO `garbage_details` (`id`, `Images`, `weight`, `user_id`) VALUES
(1, '1638633081958468800.jpg', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `signup`
--

CREATE TABLE `signup` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered_at` datetime NOT NULL,
  `last_logged_in` datetime DEFAULT NULL,
  `profile_img` varchar(150) DEFAULT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `signup`
--

INSERT INTO `signup` (`id`, `name`, `email`, `password`, `registered_at`, `last_logged_in`, `profile_img`, `points`) VALUES
(1, 'Harshith kumar', 'harshithkumar40@gmail.com', '$5$rounds=535000$sZGCzT61VHTVjJTz$gFQMAuq9Bx/uXjlH899MaQ4nb6hrT2pNP8nN/klFKE2', '2021-07-20 13:42:48', '2021-12-04 15:37:48', '1626958240298350500.jpg', 140),
(2, 'Harshith kumarr', 'harshithkumar40@gmail.comm', '$5$rounds=535000$5l9.kah7/kCfh1hM$DmdV168SShQfFLuD9ANnwMakvkcqTqyu/KUY0aHnXiC', '2021-07-21 14:29:51', '2021-07-21 17:15:00', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `garbage_details`
--
ALTER TABLE `garbage_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `signup`
--
ALTER TABLE `signup`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `garbage_details`
--
ALTER TABLE `garbage_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `signup`
--
ALTER TABLE `signup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `garbage_details`
--
ALTER TABLE `garbage_details`
  ADD CONSTRAINT `garbage_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `signup` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
