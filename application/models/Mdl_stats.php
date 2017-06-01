<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Mdl_Stats extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function get_today ()
    {
		$date = date('Y-m-d');
		$yesterday = date('Y-m-d', time()-86400);

    	$query = $this->db->query('SELECT COUNT(`id`) AS x FROM `users` WHERE `dateofreg` = ?', [$date]);
    	$today = $query->row()->x;

    	$query = $this->db->query('SELECT COUNT(`id`) AS x FROM `users` WHERE `dateofreg` = ?', [$yesterday]);
    	$yesterday = $query->row()->x;

    	$offset = (int)date('N');
    	$sunday_timestamp = time()-($offset*86400);
    	$monday_timestamp = $sunday_timestamp-(6*86400);

    	$sunday = date('Y-m-d', $sunday_timestamp);
    	$monday = date('Y-m-d', $monday_timestamp);

    	$query = $this->db->query('SELECT COUNT(`id`) AS x FROM `users` WHERE `dateofreg` BETWEEN ? AND ?', [$sunday, $date]);
    	$this_week = $query->row()->x;

    	$query = $this->db->query('SELECT COUNT(`id`) AS x FROM `users` WHERE `dateofreg` BETWEEN ? AND ?', [$monday, $sunday]);
    	$last_week = $query->row()->x;

    	return [
    		'today' 	=> $today,
    		'yesterday' => $yesterday,
    		'this_week' => $this_week,
    		'last_week' => $last_week,
    	];
    }

    public function get_by_month ($month = '')
    {
    	if (empty($month)) {
    		$dt = new DateTime();
    		$month = $dt->format('Y-m');
    	}

    	$query = $this->db->query('SELECT `users_num` FROM `monthly_registrations` WHERE `month-year` = ?', [$month]);
    	$month = (!is_null($query->row())?$query->row()->users_num: '0');

    	$dt->sub(new DateInterval('P1M'));
    	$lmonth = $dt->format('Y-m');
    	$query = $this->db->query('SELECT `users_num` FROM `monthly_registrations` WHERE `month-year` = ?', [$lmonth]);
    	$last_month = (!is_null($query->row())?$query->row()->users_num: '0');

    	return [
    		'this_month' => $month,
    		'last_month' => $last_month,
    	];
    }

    public function get_by_year ()
    {

    }
}