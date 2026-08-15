const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function seed() {
  console.log('Starting seed process...');
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
  });

  const apps = getApps();
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
  }

  const db = getFirestore();
  const interviewsCollection = db.collection('interviews');

  const interviews = [
    {
      role: 'Frontend Developer',
      type: 'Technical',
      techstack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
      level: 'Mid Level',
      questions: [
        'How does React Fiber improve rendering performance?',
        'Explain Server-Side Rendering (SSR) vs Static Site Generation (SSG) in Next.js.',
        'How would you manage global state in a complex React application?',
        'Describe the utility-first approach of Tailwind CSS.'
      ],
      finalized: true,
      userId: 'dummy_user_1',
    },
    {
      role: 'Backend Engineer',
      type: 'Technical',
      techstack: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      level: 'Senior',
      questions: [
        'How does the Node.js event loop work under the hood?',
        'Explain how you would optimize MongoDB queries for a large dataset.',
        'What strategies do you use for caching with Redis?',
        'How do you handle authentication and authorization in Express APIs?'
      ],
      finalized: true,
      userId: 'dummy_user_2',
    },
    {
      role: 'Full Stack Developer',
      type: 'System Design',
      techstack: ['Vue.js', 'Nuxt', 'PostgreSQL', 'Docker'],
      level: 'Lead',
      questions: [
        'Design a scalable architecture for an e-commerce platform.',
        'How do you ensure data consistency between your database and cache?',
        'Explain the benefits of containerizing an application with Docker.',
        'How do you approach testing in a Full Stack environment?'
      ],
      finalized: true,
      userId: 'dummy_user_3',
    },
    {
      role: 'DevOps Engineer',
      type: 'Behavioral',
      techstack: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      level: 'Mid Level',
      questions: [
        'Tell me about a time a deployment failed in production. How did you handle it?',
        'How do you balance security and speed in a CI/CD pipeline?',
        'Describe your experience with Infrastructure as Code using Terraform.',
        'How do you monitor and debug issues in a Kubernetes cluster?'
      ],
      finalized: true,
      userId: 'dummy_user_4',
    },
    {
      role: 'Mobile Developer',
      type: 'Technical',
      techstack: ['React Native', 'Firebase', 'Redux'],
      level: 'Junior',
      questions: [
        'What are the main differences between React and React Native?',
        'How do you handle offline data persistence in React Native?',
        'Explain the core principles of Redux.',
        'How would you implement push notifications using Firebase?'
      ],
      finalized: true,
      userId: 'dummy_user_5',
    },
    {
      role: 'Data Scientist',
      type: 'Technical',
      techstack: ['Python', 'Pandas', 'SQL', 'TensorFlow'],
      level: 'Senior',
      questions: [
        'How do you handle missing or imbalanced data in a dataset?',
        'Explain the difference between supervised and unsupervised learning.',
        'Write a SQL query to find the second highest salary in an Employee table.',
        'How do you evaluate the performance of a machine learning model?'
      ],
      finalized: true,
      userId: 'dummy_user_6',
    },
    {
      role: 'UI/UX Designer',
      type: 'Portfolio Review',
      techstack: ['Figma', 'HTML5', 'CSS3'],
      level: 'Mid Level',
      questions: [
        'Walk me through your design process for a recent project.',
        'How do you conduct and incorporate user research into your designs?',
        'Explain the principles of accessible web design.',
        'How do you hand off designs to developers effectively?'
      ],
      finalized: true,
      userId: 'dummy_user_7',
    },
    {
      role: 'Cloud Architect',
      type: 'System Design',
      techstack: ['AWS', 'Azure', 'GCP', 'Kubernetes'],
      level: 'Principal',
      questions: [
        'Design a multi-region active-active architecture on AWS.',
        'How do you ensure data security and compliance in the cloud?',
        'Explain the pros and cons of Serverless vs Containerized workloads.',
        'How do you optimize cloud costs for a large enterprise?'
      ],
      finalized: true,
      userId: 'dummy_user_8',
    },
    {
      role: 'QA Engineer',
      type: 'Technical',
      techstack: ['Cypress', 'Jest', 'Selenium'],
      level: 'Mid Level',
      questions: [
        'Explain the difference between Unit, Integration, and End-to-End testing.',
        'How do you handle flaky tests in your test suite?',
        'Describe a time you found a critical bug just before a release.',
        'How do you integrate automated testing into a CI/CD pipeline?'
      ],
      finalized: true,
      userId: 'dummy_user_9',
    },
    {
      role: 'Game Developer',
      type: 'Technical',
      techstack: ['C#', 'Unity', 'C++'],
      level: 'Senior',
      questions: [
        'How do you optimize game performance and manage memory in Unity?',
        'Explain the concepts of ECS (Entity Component System).',
        'How do you implement pathfinding algorithms like A*?',
        'Describe your experience with multiplayer networking.'
      ],
      finalized: true,
      userId: 'dummy_user_10',
    },
    {
      role: 'Security Analyst',
      type: 'Behavioral',
      techstack: ['Cybersecurity', 'Networking', 'Python'],
      level: 'Senior',
      questions: [
        'Describe a time you responded to a critical security incident.',
        'How do you stay updated on the latest security threats and vulnerabilities?',
        'Explain the concept of Zero Trust architecture.',
        'How do you conduct a risk assessment for a new application?'
      ],
      finalized: true,
      userId: 'dummy_user_11',
    },
    {
      role: 'Machine Learning Engineer',
      type: 'Technical',
      techstack: ['PyTorch', 'TensorFlow', 'Python'],
      level: 'Mid Level',
      questions: [
        'Explain the vanishing gradient problem and how to solve it.',
        'How do you deploy and serve machine learning models in production?',
        'Describe your experience with Natural Language Processing (NLP).',
        'How do you optimize deep learning models for inference speed?'
      ],
      finalized: true,
      userId: 'dummy_user_12',
    }
  ];

  for (let i = 0; i < interviews.length; i++) {
    const interview = interviews[i];
    // Create a random date in the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    interview.createdAt = date.toISOString();
    
    await interviewsCollection.add(interview);
    console.log(`Added interview: ${interview.role}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(console.error);
