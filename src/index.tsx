import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Scrypt, bsv } from 'scrypt-ts';

import { Voting } from './contracts/voting';
import artifact from "../artifacts/voting.json"

Voting.loadArtifact(artifact)

Scrypt.init({
  apiKey: "testnet_43jHElyVAvEnsSZwLrIjML3OD9zrVosYvXBZdNS8X1hqjHTMV",
  network: bsv.Networks.testnet,
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
