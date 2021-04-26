import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase/app'
import 'firebase/storage'
import {UploadPlugin} from "./file-upload-plugin/UploadPlugin"
import './index.css'

/** server storage emulation
 * **/
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPg-E7U6xRShibqH6ptMbCed_jercNfvQ",
    authDomain: "upload-files-9d7e9.firebaseapp.com",
    projectId: "upload-files-9d7e9",
    storageBucket: "upload-files-9d7e9.appspot.com",
    messagingSenderId: "247597627595",
    appId: "1:247597627595:web:9080a2f6ab6b87428b034e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

/**
 * The upload function takes 3 parameters:
 * files - files to upload to the server,
 * showUploadProgress - a callback function that takes two parameters (file id and download percentage),
 * setLink - a callback function that returns id of file
 * and link to this file on the server after uploading file.
 * You can write your own server logic to load the data,
 * but it remains mandatory to call these two callback functions.
 * **/

function onUpload(files, showUploadProgress, setLink) {
    files.forEach((file, idx) => {
        const ref = storage.ref(`images/${file.name}`)
        const task = ref.put(file);
        task.on('state_changed',
            snapshot => {
                const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                showUploadProgress(idx, percentage)
            }, error => {
                console.log(error)
            }, () => {
                const promise = task.snapshot.ref.getDownloadURL()
                promise.then(url => {
                    setLink(idx, url)
                })
            })
    })
}

ReactDOM.render(
    <UploadPlugin onUpload={onUpload}/>,
    document.getElementById('container')
);

