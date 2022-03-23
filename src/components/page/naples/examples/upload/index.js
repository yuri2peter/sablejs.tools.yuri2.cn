/**
 * This file is generated automatically by naples scaffolding.
 * @create February 26o 2022, 5:04:37 pm
 * @author Yuri2
 */
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import styles from './index.module.scss';

function uploadFile(file) {
  const data = new FormData();
  data.append('file', file);
  return axios
    .post('/api/naples/examples/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
}

export default function Index({}) {
  const refInput = useRef();
  const [url, setUrl] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const onInputChange = useCallback(() => {
    const file = refInput.current.files[0];
    setHasFile(!!file);
  }, []);

  const onUpload = useCallback(() => {
    const file = refInput.current.files[0];
    if (!file) {
      alert('Please select a file');
    } else {
      uploadFile(file)
        .then((data) => {
          setUrl(data.url);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, []);

  return (
    <div className={styles.container}>
      <p>
        Upload an image file({'<'}= 4mb) to the server then preview it
        immediately.
      </p>
      <button
        disabled={!hasFile}
        onClick={onUpload}
        className="pure-button pure-button-primary"
      >
        Upload
      </button>
      <input
        onChange={onInputChange}
        ref={refInput}
        type="file"
        name="file"
        accept="image/*"
      />
      {url && <img alt="preview" className={styles.img} src={url} />}
    </div>
  );
}
