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
    	$dt = new DateTime();
    	if (empty($month)) {
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

    public function get_by_year ($year = '')
    {
    	if (empty($year)) {
    		$year = date('Y');
    	}

    	$months = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
    	$result = 0;
    	foreach ($months as $month) {
    		$param = $year . '-' . $month;
    		$qry = 'SELECT `users_num` FROM `monthly_registrations` WHERE `month-year` = ?';
    		$query = $this->db->query($qry, [$param]);
    		
    		if ($query->row()) {
    			$result += (int)$query->row()->users_num;
    			continue;
    		}
    	}

    	return $result;
    }

    public function get_in_range ($from, $to)
    {
    	if(empty($from) or empty($to)) {
    		$from = date('Y-m-d');
    		$to   = date('Y-m-d');
    	}

    	$query = $this->db->query('SELECT COUNT(`id`) AS x FROM `users` WHERE `dateofreg` BETWEEN ? and ?', [$from, $to]);
    	
    	return ($query->row()? $query->row()->x: 0);
    } 

}