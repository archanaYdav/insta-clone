import React, { useEffect, useState } from 'react';
import Post from "./Post.js";
import { db, auth } from "./firebase.js";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import "./App.css";
import { Input, Button, Modal } from '@mui/material';
import ImageUpload from "./ImageUpload.jsx";
import { InstagramEmbed } from 'react-social-media-embed';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: "white",
  border: '2px solid #000',
  boxShadow: 24,
  padding: "20px",
  p: 4,
};


export default function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState(""); //and this one is for uploading the details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); //this one is for tracking the user which user is logged in 


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {

      if (authUser) {
        //user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }

      return () => { unsubscribe() };
    })
    // console.log(user);
    // console.log(username);
  }, [user, username]);

  useEffect(() => {
    //this code will listen the posts changes and run this first time and everytime posts changes
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // console.log(snapshot);//snapshot main bhot saari cheeje hogi jiske andr docs naam koi cheej to use tap krne ke liye aapko snapshot.docs likhna hoga that will return an array ex: snapshot = {
      // ....
      //   docs: ....
      // }
      //every time a new post is added , this code will get fired
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);



  const signUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(userCredential.user);
      updateProfile(userCredential.user, {
        displayName: username
      })
      setOpen(false);
      setUsername("");
      setEmail("");
      setPassword("");
    }
    catch (error) {
      console.log(error);
      alert(error.message);
    }

  }

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log(userCredential.user);
      updateProfile(userCredential.user, {
        displayName: username
      })
      setOpenSignIn(false);
      setEmail("");
      setPassword("");
    }
    catch (error) {
      console.log(error);
      alert(error.message);
    }

  }

  return (
    <div className='app'>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={style}>
          <form className='app__signUp'>
            <center>
              <img className='app__headerImage' src='https://blackhillsballoons.com/wp-content/uploads/2021/01/Instagram-Logo.png' alt='instaLogo' />
            </center>
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={style}>
          <form className='app__signUp'>
            <center>
              <img className='app__headerImage' src='https://blackhillsballoons.com/wp-content/uploads/2021/01/Instagram-Logo.png' alt='instaLogo' />
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img className='app__headerImage' src='https://blackhillsballoons.com/wp-content/uploads/2021/01/Instagram-Logo.png' alt='instaLogo' />
        {user ? (
          <Button type="submit" onClick={async () => await signOut(auth)}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button type="submit" onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
          <div className="app__postsLeft">
              {
              posts.map(({ id, post }) => {
                return (
                  //In React, the key prop is a special attribute that you can include when rendering a list of elements. It helps React identify which items have changed, are added, or are removed from a list of components.
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
                )
              })
            }
          </div>
          <div className='app__postsRight' style={{ display: 'flex', justifyContent: 'center' }}>
            <InstagramEmbed url="https://www.instagram.com/p/CUbHfhpswxt/" width={428} />
          </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to Login</h3>
      )}
      
    </div>

  )
}