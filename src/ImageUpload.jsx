import React, { useState, useRef  } from 'react'
import { Button } from '@mui/material';
import { getDownloadURL , ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from './firebase';
import firebase from 'firebase/compat/app';
import "./ImageUpload.css";

export default function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);  // Define fileInputRef here
    
    const handleChange = (e) => {
      // console.log(e);
      if(e.target.files[0]){
        setImage(e.target.files[0]);
      }
    };

    const handleUpload = () => {

      if(image === null){
        setImage(null);
        alert("File is not selected. Please select a file and try again");
        return;
      }

      console.log(image);
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      }, (error) => {
        console.log(error);
        alert(error.message);
      }, () => {
        // Handle successful uploads on complete
        getDownloadURL(storageRef).then((downloadURL) => {
          db.collection('posts').add({
            caption: caption,
            imageUrl: downloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            username: username
          });

          setProgress(0);
          setImage(null);
          setCaption("");
          fileInputRef.current.value = ""; // Reset file input value
        });
      });
    };

  return (
    <div className='imageUpload'>
        <progress className='imageupload__progress' value={progress}></progress>
        <input type='text' placeholder='Enter a caption...' onChange={(e) => setCaption(e.target.value)} value={caption}/>
        <input type='file' onChange={handleChange} ref={fileInputRef}/>
        <Button type="submit" onClick={handleUpload}>Upload</Button>
    </div>
  )
}
