import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({                                      
  apiKey: "AIzaSyByzYYzzbwYkIC-TrMyoFgEgBGRm4SsqNk",
  authDomain: "superchat-2c981.firebaseapp.com",
  projectId: "superchat-2c981",
  storageBucket: "superchat-2c981.appspot.com",
  messagingSenderId: "257469666684",
  appId: "1:257469666684:web:49c9b526a611387a7140f9",
  measurementId: "G-T19CR0RERM"
})

const auth = firebase.auth();      
const firestore = firebase.firestore();

function App() {

   const [user] = useAuthState(auth);            // Signed in user is an object. Signed out user is null

  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}            // if user is signed in it shows the chat room, else it shows the sign in button
      </section>
    </div>
  );
}

function SignIn() {                                        //Signs the user in with Google
   const signInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();    
     auth.signInWithPopup(provider);                                   // pop up window
   }

   return(
     <button onClick={signInWithGoogle}>Sign in with Google</button>    //waits for the button
   )
}

function SignOut() {                                   // signs the user out
  return auth.currentUser && (
    
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');     //reference from fire store collection
  const query = messagesRef.orderBy('createdAt').limit(25); //query from the documents
  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <>
    <main>
         {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

         <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

          <button type="submit">🛹</button>
      </form>
    </>
  )
}

function ChatMessage(props) {                                         
  const { text, uid, photoURL } = props.message; 
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
   <div className={'message ${messageClass}'}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>
  )
}

export default App;
