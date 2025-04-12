import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export async function registerUser(email, password) {

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/public/index.html');
  });
  
  app.post('/login', async (req, res) => {
    const { emailLogin, passwordLogin } = req.body;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailLogin, passwordLogin);
      req.session.userId = userCredential.user.uid; // Store user ID in session
      res.redirect('/external');
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
  });
  
  app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      console.log("Tesgings");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseId = userCredential.user.uid;
      req.session.userId = firebaseId;
  
      // await db.query(
      //   'INSERT INTO "User" ("firebaseid", "email") VALUES ($1, $2)',
      //   [firebaseId, email]
      // );
  
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  });
  
  const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  app.get('/user', isAuthenticated, (req, res) => {
    res.json({ userId: req.session.userId });
  });
  
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });

  return { errorMessage: null }

}  
