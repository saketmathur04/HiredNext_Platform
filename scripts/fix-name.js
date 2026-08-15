const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function fixName() {
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
  const usersRef = db.collection('users');
  
  const snapshot = await usersRef.get();
  snapshot.forEach(async (doc) => {
    const user = doc.data();
    console.log(`User: ${doc.id} - Name: ${user.name} - Email: ${user.email}`);
    if (user.name === 'mathursaket2144' || user.email?.startsWith('mathursaket2144')) {
      await usersRef.doc(doc.id).update({ name: 'Saket Mathur' });
      console.log(`Updated user ${doc.id} name to Saket Mathur`);
    }
  });

  setTimeout(() => process.exit(0), 2000);
}

fixName().catch(console.error);
