<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_fees extends CI_Model {

    // payment is enabled when open fees amount >= this constant value
    const PAYMENT_MIN_LIMIT = 0.01;

    // total count of all GTS shares
    const TOTAL_GTS_SHARES_CNT = 100000;
    const OPEN_FEES_RECORDS_STEP = 5;  // how many open fees records will be processing at once

    // total fee value that is used during payment procedure
    protected $total_fee = 0;

    /**
     * Get last N days records from open_fees table grouped by days
     *
     * @param int $days_cnt last N days to get data for
     * @return array
     */
    public function get_recent_fees_data($days_cnt = 1)
    {
        $cur_date = new DateTime();
        $start_date = clone $cur_date;
        if ($days_cnt > 0) {
            $start_date->modify('-' . $days_cnt . ' day');
        }

        // var_dump($start_date->format('Y-m-d'));
        // die;

        $query = $this->db->select('COUNT(*) as cnt, SUM(fee) as fee, DATE(trade_datetime) as trade_date')
             ->from('open_fees')
             ->where('DATE(trade_datetime) >= ', $start_date->format('Y-m-d'))
             ->group_by('DATE(trade_datetime)')
             ->order_by('trade_date', 'ASC')
             ->get();

        $result = [];
        while ($start_date <= $cur_date) {
            $result[$start_date->format('Y-m-d')] = [];
            $start_date->modify('+1 day');
        }

        foreach($query->result() as $row) {
            $date = $row->trade_date;
            if (isset($result[$date])) {
                $result[$date] = [
                    'fee' => $row->fee,
                    'cnt' => $row->cnt
                ];
            }
        }
        return $result;
    }


    /**
     * Calculation of `fee` sum for all open-statused open_fees
     * table records
     *
     * @return float
     */
    public function calc_open_fee()
    {
        $query = $this->db->select_sum('fee', 'total_fee')
                 ->from('open_fees')
                 ->where('status', 'open')
                 ->get();
        $total_fee = $query->row()->total_fee;
        return floatval($total_fee);
    }



    /**
     * Do payment top-level method
     *
     * @return void
     */
    public function do_payment_main()
    {
        try {
            $this->db->trans_begin();

            $this->total_fee = 0;

            $this->do_payment();

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                return 'Error while payment processing';
            }

            $this->db->trans_complete();
            // $this->db->trans_rollback();

            return ''; // no errors result
        } catch (Exception $e) {
            $this->db->trans_rollback();
            return $e->getMessage();
        }
    }


    /**
     * Close all records from `open_fees` table with 'open' status
     * set it to 'closed'
     */
    protected function close_open_fees()
    {
        $this->db->where('status', 'open');
        $this->db->update('open_fees', ['status' => 'closed']);
    }


    /**
    *  Add closed fee record with $open_fee_id and $dividend_id fields values
    *
    * @param int $open_fee_id ID of open_fees record
    * @param int $dividend_id ID of recently added dividend record
    * @return void
    */
    protected function add_closed_fee($open_fee_id, $dividend_id)
    {
        $this->db->insert('closed_fees', [
            'dividend_id' => $dividend_id,
            'open_fee_id' => $open_fee_id,
            'status'      => 'processed'
        ]);
    }


    /**
     * Process block of open_fees records at once
     *
     * @param array $open_fees_ids array of IDs of open_fees records to process
     * @param int $dividend_id ID of recently added dividend record
     * @return void
     */
    protected function process_open_fees_block(array $open_fees_ids, $dividend_id)
    {
        foreach ($open_fees_ids as $open_fee_id) {
            $this->add_closed_fee($open_fee_id, $dividend_id);
        }
        $this->db->set('status', 'closed')
                 ->where_in('id', $open_fees_ids)
                 ->update('open_fees');
    }


    /**
     * Processing of all open fees (with 'open' status) while payment
     * and calculating a real $this->total_fee value
     *
     * @param int $dividend_id ID of recently added dividend record
     * @return void
     */
    protected function open_fees_processing($dividend_id)
    {
        $total_fee = 0;
        while (true) {
            $limit = self::OPEN_FEES_RECORDS_STEP;
            $query = $this->db->get_where('open_fees', ['status' => 'open'], $limit, 0);

            // var_dump($this->db->last_query());

            if ($query->num_rows() === 0) {
                break;
            }

            $open_fees_ids = [];
            foreach ($query->result() as $row) {
                $total_fee += $row->fee;
                $open_fees_ids[] = $row->id;
            }
            $query->free_result();

            // var_dump($open_fees_ids);

            if ($open_fees_ids) {
                $this->process_open_fees_block($open_fees_ids, $dividend_id);
            }
        }

        $this->total_fee = $total_fee;
    }

    /**
     * Create an empry record in `dividend` table with 0 total_fee value
     *
     * @param type $total_fee total fee
     * @return int ID of inserted record
     */
    protected function create_empty_dividend()
    {
        $data = [
            'total_fee'         => 0,
            'dividend_datetime' => date('Y-m-d H:i:s'),
            'status'            => 'paid'
        ];
        $this->db->insert('dividend', $data);
        return $this->db->insert_id();
    }

    /**
     * Set updated total fee value for dividend record
     *
     * @param int $dividend_id ID of dividend record
     * @param float $total_fee new total fee value to update
     * @return void
     */
    protected function set_total_fee_for_dividend($dividend_id, $total_fee)
    {
        $this->db->set('total_fee', $total_fee)
                 ->where('id', $dividend_id)
                 ->update('dividend');
    }


    /**
     * Main payment method
     *
     * @return bool | Exception
     */
    protected function do_payment()
    {
        // check total open fees amount at the click moment
        $open_fees_total = $this->calc_open_fee();
        if ($open_fees_total < self::PAYMENT_MIN_LIMIT) {
            throw new Exception('Total open fees < ' . self::PAYMENT_MIN_LIMIT);
        }
        $dividend_id = $this->create_empty_dividend();
        $this->open_fees_processing($dividend_id);

        // check real value of total open fees
        $open_fees_total = $this->total_fee;
        if ($open_fees_total < self::PAYMENT_MIN_LIMIT) {
            throw new Exception('Total open fees < ' . self::PAYMENT_MIN_LIMIT);
        }
        $this->set_total_fee_for_dividend($dividend_id, $open_fees_total);

        $this->process_users_balances($open_fees_total, $dividend_id);
        return true;
    }


    /**
     * Add a new record on `deposits` table
     *
     * @param int   $user_id  User ID
     * @param int   $dividend_id Dividend ID
     * @param float $dividend Dividend value
     * @param float $user_gts current GTS balance of user
     * @return void
     */
    protected function add_deposit($user_id, $dividend_id, $dividend, $user_gts)
    {
        $user_gts = number_format($user_gts, 8, '.', '');
        $data = [
            'user_id'       => $user_id,
            'EUR'           => $dividend,
            'GTS'           => 0,
            'NLG'           => 0,
            'transaction'   => '',
            'verified'      => 'paid',
            'deposit_date'  => date('Y-m-d'),
            'description'   => 'dividend ' . $user_gts . ' GTS',
            'dividend_id'   => $dividend_id
        ];
        $this->db->insert('deposits', $data);
    }

    /**
     * Create a new empty record in `balance` table for $user_id
     *
     * @param int $user_id User ID
     * @return void
     */
    protected function create_empty_balance($user_id)
    {
        $data = [
            'user_id'     => $user_id,
            'NLG'         => 0,
            'EUR'         => 0,
            'GTS'         => 0,
            'pending_EUR' => 0,
            'pending_NLG' => 0,
            'pending_GTS' => 0
        ];
        $this->db->insert('balance', $data);
    }


    /**
     * Add remaining fee amount into superadmin EUR balance
     *
     * @param float $fee added value
     * @return void
     */
    protected function add_remainig_fee_to_superadmin($fee)
    {
        $user = $this->db->get_where('users', ['role' => 'superadmin'])->row();
        if (!$user) {
            throw new Exception('Cannot find superadmin user to send remaining fee');
        }
        $balance = $this->db->get_where('balance', ['user_id' => $user->id ])->row();
        if (!$balance) {
            $this->create_empty_balance($user->id);
        }
        $this->update_user_balance($user->id, $fee);
    }


    /**
     * Update user balance by addind $euro_adding_value
     *
     * @param int   $user_id  User ID
     * @param float $euro_adding_value Added fee amount
     * @return void
     */
    protected function update_user_balance($user_id, $euro_adding_value)
    {
        $euro_adding_value = floatval($euro_adding_value);
        $this->db->set('EUR', 'EUR + ' . $euro_adding_value, false)
           ->where('user_id', $user_id)
           ->update('balance');
    }

    /**
     * User account processing procedure while payment proceeding
     *
     * @param float $total_fee Total fee of open fees for payment moment
     * @param int $dividend_id ID of a new added dividend record
     * @return void | Exception
     */
    protected function process_users_balances($total_fee, $dividend_id)
    {
        $remaining_fee = $total_fee;
        $one_share_price = $total_fee / self::TOTAL_GTS_SHARES_CNT;
        $query = $this->db->get_where('balance',['GTS >' => 0]);
        while ($balance = $query->unbuffered_row()) {
            $user_id = $balance->user_id;
            $user_gts = $balance->GTS;
            $gts_payment = $user_gts * $one_share_price;
            // round to down to 8 decimals behind the dots
            $gts_payment = floor($gts_payment * 100000000) / 100000000;
            $dividend = number_format($gts_payment, 8, '.', '');
            if ($dividend > $remaining_fee) {
                throw new Exception('Total fee is exhosted while dividend paying');
            }
            $this->add_deposit($user_id, $dividend_id, $dividend, $user_gts);
            $this->update_user_balance($user_id, $dividend);
            $remaining_fee -= $dividend;
        }
        if ($remaining_fee > 0) { // add remain
            $this->add_remainig_fee_to_superadmin($remaining_fee);
        }
    }

}
