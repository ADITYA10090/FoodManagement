import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from './config';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Auth = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async (role) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);

      // Save to Firestore only if role is 'donor'
      if (role === 'donor') {
        await setDoc(
          doc(db, 'users', result.user.uid),
          {
            email: result.user.email,
            role: role,
            createdAt: new Date()
          },
          { merge: true }
        );
      }

      // Redirect based on the selected role and pass the role as a parameter
      if (role === 'donor') {
        navigate('/home', { state: { role: 'donor' } });
      } else if (role === 'receiver') {
        navigate('/receiver-register', { state: { role: 'receiver' } });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sign In / Register</h2>
      <div className="flex space-x-4">
        <button 
          onClick={() => signInWithGoogle('donor')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in / Register as Donor
        </button>
        <button 
          onClick={() => signInWithGoogle('receiver')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sign in / Register as Receiver
        </button>
      </div>
    </div>
  );
};

export default Auth;
