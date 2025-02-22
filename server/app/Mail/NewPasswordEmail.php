<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $lastName;
    public $newPassword;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $newPassword
     */
    public function __construct($firstName, $lastName, $newPassword)
    {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->newPassword = $newPassword;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Your new password')
            ->view('pages.auth.new-password');
    }
}
