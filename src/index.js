import React from 'react';
import ReactDOM from 'react-dom';
import {UploadPlugin} from "./file-upload-plugin/UploadPlugin";
import './index.css';

ReactDOM.render(
    <UploadPlugin/>,
  document.getElementById('container')
);

