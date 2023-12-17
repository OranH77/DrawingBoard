import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB_19P-e5kwCuap00JHyRa2z-GHYBNNsic",
  authDomain: "drwsuperchat.firebaseapp.com",
  projectId: "drwsuperchat",
  storageBucket: "drwsuperchat.appspot.com",
  messagingSenderId: "215485644721",
  appId: "1:215485644721:web:1019d992884f0bcd11c790"
  })

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        
      </header>
      <section> 
        {user ? <ChatRoom /> : <div id="signInDiv"> <SignIn /> </div>}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInAnonymously = () => {
    firebase.auth().signInAnonymously()
    .catch((error) => {
      console.error("Error signing in anonymously: ", error);
    });
  }

  return(
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInAnonymously}>Sign in Anonymously</button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button style={{
      backgroundImage: `url(../chat_images/logout.png)`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '50px',
      height: '50px' // Adjust the height as needed
    }} onClick={() => auth.signOut()}></button>
  )
}

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(200);

  const [messages] = useCollectionData(query, {idField: 'id'});
  
  const[formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    if (auth.currentUser) {
      const { uid, photoURL, isAnonymous } = auth.currentUser;
  
      
      if (isAnonymous) {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid, 
        "photoURL": "../chat_images/anonymous.png"
      })
    }
    else {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid, 
        photoURL
      })
    }
  
      setFormValue('');
    } else {
      console.log("No user is signed in");
    }
  }

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  ReactDOM.render(<ChatForm sendMessage={sendMessage} formValue={formValue} setFormValue={setFormValue} messagesRef={messagesRef} />, document.getElementById('root-form'));

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>

      </main>

      {/*
      <form class="chat-form" onSubmit={sendMessage}>
         
        <input class="chat-input" value={formValue}  onChange={(e) => setFormValue(e.target.value)}/>

        <button class="chat-button" type="submit">Send</button>
      
        {SignOut()}
      </form>
      */}
    </>
  )
}

function ChatForm({ sendMessage, formValue, setFormValue, messagesRef }) {
  const deleteAllMessages = async () => {
    const query = messagesRef.orderBy('createdAt').limit(500);
    const snapshot = await query.get();
  
    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
  
    await batch.commit();
  };
  
  return (
    <form id="chat-form" onSubmit={sendMessage}>
      <input id="chat-input" value={formValue}  onChange={(e) => setFormValue(e.target.value)} placeholder="Enter your message..."/>
      <div>
      <input id="chat-submit-image" type="image" src="chat_images/send.png" alt="Send Message"/>
      </div>
      <button style={{width: '50px'}} onClick={deleteAllMessages}>Reset Chat</button>
      {SignOut()}
    </form>
    
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
   <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
