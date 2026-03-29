<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Event;
use App\Models\Opportunity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Admin DevMaroc',
            'email' => 'admin@devmaroc.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'level' => 'Administrateur',
            'title' => 'Platform Administrator',
            'location' => 'Casablanca, Maroc',
            'bio' => 'Administrateur de la plateforme DevMaroc. Gestion de la communauté et des contenus.',
            'points' => 5000,
            'skills' => ['Laravel', 'React', 'DevOps', 'Database', 'Security'],
        ]);

        // Create Test User
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'level' => 'Débutant',
            'title' => 'Software Engineer',
            'location' => 'Rabat, Maroc',
            'bio' => 'Passionné par le développement web et les nouvelles technologies.',
            'points' => 150,
            'skills' => ['React', 'JavaScript', 'HTML/CSS'],
        ]);

        // Create Expert Level Users
        $expertNames = ['Mohssine Baraou', 'Fatima Alaoui', 'Youssef Tazi', 'Sarah Bennani', 'Ahmed Hassani'];
        $expertTitles = ['Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Mobile Developer', 'Cloud Architect'];
        $expertSkills = [
            ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
            ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform'],
            ['React', 'TypeScript', 'Node.js', 'GraphQL', 'WebAssembly'],
            ['React Native', 'Flutter', 'Swift', 'iOS Development'],
            ['AWS', 'Azure', 'GCP', 'Infrastructure', 'Microservices'],
        ];

        foreach ($expertNames as $idx => $name) {
            User::factory()->create([
                'name' => $name,
                'email' => 'expert' . ($idx + 1) . '@devmaroc.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'level' => 'Expert',
                'title' => $expertTitles[$idx],
                'location' => ['Casablanca', 'Fès', 'Marrakech', 'Agadir', 'Tanger'][array_rand(['Casablanca', 'Fès', 'Marrakech', 'Agadir', 'Tanger'])],
                'bio' => 'Expert en développement logiciel avec plus de 5 ans d\'expérience. Passionné par les technologies modernes et la contribution à la communauté.',
                'points' => 1500 + ($idx * 250),
                'skills' => $expertSkills[$idx],
            ]);
        }

        // Create Intermediate Level Users
        $intermediateNames = ['Omar Khalili', 'Leila Bennani', 'Hassan Belkadi', 'Nour Essayed', 'Karim Oukadi'];
        
        foreach ($intermediateNames as $idx => $name) {
            User::factory()->create([
                'name' => $name,
                'email' => 'intermediate' . ($idx + 1) . '@devmaroc.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'level' => 'Intermédiaire',
                'title' => ['Senior Developer', 'Tech Lead', 'Architect', 'Backend Lead', 'Frontend Specialist'][array_rand(['Senior Developer', 'Tech Lead', 'Architect', 'Backend Lead', 'Frontend Specialist'])],
                'location' => ['Casablanca', 'Fès', 'Marrakech', 'Agadir'][array_rand(['Casablanca', 'Fès', 'Marrakech', 'Agadir'])],
                'bio' => 'Développeur passionné avec 2-4 ans d\'expérience. Toujours en apprentissage et en quête de nouvelles défis.',
                'points' => 600 + ($idx * 150),
                'skills' => [
                    ['Python', 'Django'],
                    ['Vue.js', 'Laravel'],
                    ['Java', 'Spring Boot'],
                    ['Go', 'PostgreSQL'],
                    ['Rust', 'WebAssembly'],
                ][$idx],
            ]);
        }

        // Create Novice Users
        $noviceNames = ['Ali Mansouri', 'Zahra Bennani', 'Mohammed Fahmy', 'Amina Boutaleb', 'Hicham Daoudi'];
        
        foreach ($noviceNames as $idx => $name) {
            User::factory()->create([
                'name' => $name,
                'email' => 'novice' . ($idx + 1) . '@devmaroc.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'level' => 'Débutant',
                'title' => 'Junior Developer',
                'location' => ['Casablanca', 'Fès', 'Marrakech'][array_rand(['Casablanca', 'Fès', 'Marrakech'])],
                'bio' => 'Développeur en herbe, passionné par la programmation et désireux d\'apprendre.',
                'points' => 50 + ($idx * 30),
                'skills' => [
                    ['HTML', 'CSS', 'JavaScript'],
                    ['Python', 'Basics'],
                    ['JavaScript', 'React basics'],
                    ['PHP', 'Laravel basics'],
                    ['Java', 'OOP'],
                ][$idx],
            ]);
        }

        // Create Posts
        $postTopics = [
            ['title' => 'Meilleure pratique pour l\'architecture microservices en 2025', 'body' => 'Quels sont les patterns essentiels pour une bonne architecture microservices? Kubernetes ou Docker Swarm? Partage vos expériences!', 'user_id' => 2],
            ['title' => 'Help: Optimisation des requêtes SQL complexes', 'body' => 'Mes requêtes prennent trop de temps. Comment faire de l\'indexation efficace?', 'user_id' => 8],
            ['title' => 'React 18 vs Vue 3: lequel choisir?', 'body' => 'Je dois choisir un framework pour mon projet. Vos recommandations?', 'user_id' => 12],
            ['title' => 'Tutorial: Mise en place du CI/CD avec GitHub Actions', 'body' => 'Voici comment j\'ai automatisé mes déploiements... *code example*', 'user_id' => 3],
            ['title' => 'Quelle AMA sur DevOps et Infrastructure?', 'body' => 'Je fais un AMA (Ask Me Anything) demain à 18h!', 'user_id' => 4],
            ['title' => 'Les erreurs courantes en Python que j\'ai faites', 'body' => 'Voici 5 erreurs que j\'aurais aimé éviter..', 'user_id' => 5],
            ['title' => 'Comment déboguer efficacement en JavaScript', 'body' => 'Astuces et outils essentiels pour gagner du temps...', 'user_id' => 9],
        ];

        foreach ($postTopics as $postData) {
            Post::create([
                'title' => $postData['title'],
                'content' => $postData['body'],
                'user_id' => $postData['user_id'],
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Create Events
        $events = [
            [
                'title' => 'Meetup DevMaroc - React & Performance',
                'type' => 'Meetup',
                'date' => now()->addDays(7)->format('Y-m-d H:i:s'),
                'location' => 'Casablanca Hub',
                'attendees_count' => 45,
                'image' => 'https://via.placeholder.com/600x400?text=React+Meetup',
                'organizer_id' => 3,
            ],
            [
                'title' => 'Workshop: Introduction à Docker & Kubernetes',
                'type' => 'Workshop',
                'date' => now()->addDays(14)->format('Y-m-d H:i:s'),
                'location' => 'Fès Tech Center',
                'attendees_count' => 30,
                'image' => 'https://via.placeholder.com/600x400?text=Docker+Workshop',
                'organizer_id' => 4,
            ],
            [
                'title' => 'Conference: L\'avenir du Web avec WebAssembly',
                'type' => 'Conference',
                'date' => now()->addDays(21)->format('Y-m-d H:i:s'),
                'location' => 'Marrakech Convention Center',
                'attendees_count' => 120,
                'image' => 'https://via.placeholder.com/600x400?text=WebAssembly+Conf',
                'organizer_id' => 5,
            ],
            [
                'title' => 'Hackathon: AI & Machine Learning',
                'type' => 'Hackathon',
                'date' => now()->addDays(30)->format('Y-m-d H:i:s'),
                'location' => 'Casablanca',
                'attendees_count' => 200,
                'image' => 'https://via.placeholder.com/600x400?text=AI+Hackathon',
                'organizer_id' => 2,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

        // Create Opportunities
        $opportunities = [
            [
                'title' => 'Senior React Developer',
                'company' => 'Tech Startup Casablanca',
                'description' => 'Nous recrutons un Senior React Developer pour rejoindre notre équipe. 5+ ans d\'expérience requise.',
                'type' => 'CDD',
                'location' => 'Casablanca, Maroc',
            ],
            [
                'title' => 'DevOps Engineer - AWS Specialist',
                'company' => 'Global Tech Company',
                'description' => 'Rejoignez notre équipe DevOps! Expertise AWS et Kubernetes requise.',
                'type' => 'CDI',
                'location' => 'Fès, Maroc',
            ],
            [
                'title' => 'Full Stack Developer - Freelance',
                'company' => 'Agence Web',
                'description' => 'Plusieurs missions disponibles en freelance. React + Node.js.',
                'type' => 'Freelance',
                'location' => 'Remote',
            ],
            [
                'title' => 'Data Scientist',
                'company' => 'Finance Company',
                'description' => 'Opportunité pour analyser des données et créer des modèles ML.',
                'type' => 'CDI',
                'location' => 'Marrakech, Maroc',
            ],
            [
                'title' => 'Flutter Mobile Developer',
                'company' => 'Mobile App Studio',
                'description' => 'Développez des applications mobiles innovantes avec Flutter.',
                'type' => 'CDD',
                'location' => 'Agadir, Maroc',
            ],
        ];

        foreach ($opportunities as $opportunity) {
            Opportunity::create($opportunity);
        }

        echo "✅ Base de données seedée avec succès!\n";
        echo "   - 1 Admin user\n";
        echo "   - 1 Test user\n";
        echo "   - 5 Expert users (1500+ pts)\n";
        echo "   - 5 Intermediate users (600+ pts)\n";
        echo "   - 5 Novice users (50+ pts)\n";
        echo "   - 7 Community posts\n";
        echo "   - 4 Events\n";
        echo "   - 5 Job opportunities\n";
    }
}
