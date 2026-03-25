<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    protected $fillable = [
        'title', 'company', 'location', 'type', 'description', 
        'salary', 'logo', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(OpportunityApplication::class);
    }
}
