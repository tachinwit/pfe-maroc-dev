export const SKILLS_LIST = {
    'Langages': [
        'JavaScript', 'TypeScript', 'Python', 'PHP', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Rust', 'SQL', 'HTML', 'CSS', 'Scala', 'Dart', 'R', 'Shell'
    ],
    'Frameworks & Libs': [
        'React', 'Vue', 'Angular', 'Next.js', 'Laravel', 'Symfony', 'Django', 'Flask', 'Node.js', 'Express', 'Spring Boot', '.NET', 'Flutter', 'React Native', 'Tailwind CSS', 'Bootstrap', 'Svelte', 'Nuxt.js'
    ],
    'Outils & DevOps': [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'Jenkins', 'Terraform', 'Ansible', 'Linux', 'Vercel', 'Netlify'
    ],
    'Bases de Données': [
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Firebase', 'Elasticsearch'
    ],
    'Domaines': [
        'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'Data Science', 'IA / ML', 'Cyber Sécurité', 'UI/UX Design', 'Cloud Computing', 'Blockchain', 'Systèmes Embarqués'
    ]
};

export const ALL_SKILLS = Object.values(SKILLS_LIST).flat();
