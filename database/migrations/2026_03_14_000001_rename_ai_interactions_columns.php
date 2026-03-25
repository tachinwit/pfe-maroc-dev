<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Only rename if the old column names exist (i.e. table was created with the original migration)
        if (Schema::hasColumn('a_i_interactions', 'question')) {
            Schema::table('a_i_interactions', function (Blueprint $table) {
                $table->renameColumn('question', 'user_message');
                $table->renameColumn('response', 'ai_response');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('a_i_interactions', 'user_message')) {
            Schema::table('a_i_interactions', function (Blueprint $table) {
                $table->renameColumn('user_message', 'question');
                $table->renameColumn('ai_response', 'response');
            });
        }
    }
};
