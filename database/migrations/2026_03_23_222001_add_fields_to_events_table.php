<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->string('type')->nullable(); // Conférence, Meetup, Webinar
            $table->string('date')->nullable();
            $table->string('location')->nullable();
            $table->integer('attendees_count')->default(0);
            $table->string('image')->nullable();
            $table->foreignId('organizer_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['title', 'type', 'date', 'location', 'attendees_count', 'image', 'organizer_id']);
        });
    }
};
