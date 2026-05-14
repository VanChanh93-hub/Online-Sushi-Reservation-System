<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TableBookingMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $tables;
    public $date;
    public $time;

    public function __construct($order, $tables, $date, $time)
    {
        $this->order = $order;
        $this->tables = $tables;
        $this->date = $date;
        $this->time = $time;
    }

    public function build()
    {
        return $this->subject('Xác nhận đặt bàn thành công')
                    ->markdown('emails.booking');
    }
}
