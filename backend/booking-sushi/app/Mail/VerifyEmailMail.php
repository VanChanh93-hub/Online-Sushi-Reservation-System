<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verifyUrl;

    public function __construct($verifyUrl)
    {
        $this->verifyUrl = $verifyUrl;
    }

    public function build()
    {
        return $this->subject('Xác nhận đăng ký tài khoản')
                    ->markdown('emails.verify')
                    ->with([
                        'verifyUrl' => $this->verifyUrl,
                    ]);
    }
}
