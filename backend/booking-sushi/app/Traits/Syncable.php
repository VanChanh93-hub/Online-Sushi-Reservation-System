<?php

namespace App\Traits;

use App\Jobs\SyncDataJob;

trait Syncable
{

    public function syncToBackup(string $action)
    {
        $table = $this->getTable();
        $data = $this->toArray();
        $id = $this->id ?? null;

        // Dispatch job
        dispatch(new SyncDataJob($table, $action, $data, $id));
    }
}
