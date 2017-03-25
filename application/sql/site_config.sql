-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.19-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table exchange.site_config
CREATE TABLE IF NOT EXISTS `site_config` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) NOT NULL,
  `contact_person` varchar(50) NOT NULL,
  `email_id` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `siteurl` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `phno` varchar(255) NOT NULL,
  `fax_no` varchar(255) NOT NULL,
  `paypal_mode` varchar(255) NOT NULL,
  `paypal_emailid` varchar(255) NOT NULL,
  `intRows` int(50) NOT NULL,
  `shipping_cost` varchar(200) DEFAULT NULL,
  `facebook_url` varchar(255) NOT NULL,
  `twitter_url` varchar(255) NOT NULL,
  `TFA` varchar(150) NOT NULL,
  `google_plus` varchar(255) NOT NULL,
  `pinterest` varchar(255) NOT NULL,
  `ripple_address` varchar(200) NOT NULL,
  `ripple_name` varchar(150) NOT NULL,
  `secret` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table exchange.site_config: ~0 rows (approximately)
/*!40000 ALTER TABLE `site_config` DISABLE KEYS */;
INSERT INTO `site_config` (`id`, `company_name`, `contact_person`, `email_id`, `address`, `siteurl`, `city`, `state`, `phno`, `fax_no`, `paypal_mode`, `paypal_emailid`, `intRows`, `shipping_cost`, `facebook_url`, `twitter_url`, `TFA`, `google_plus`, `pinterest`, `ripple_address`, `ripple_name`, `secret`) VALUES
	(1, '', '', '', '', 'https://exchange.guldentrader.com', '', '', '', '', '', '0', 10, '8.98', '', '', '', '', '', '', '', '');
/*!40000 ALTER TABLE `site_config` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
