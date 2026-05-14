<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\GlobalObserver;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}
    public function boot(): void {}
}