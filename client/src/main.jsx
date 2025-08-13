import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom'
import Store from './Store/Store.js';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={Store}>
      <App />
    </Provider>

  </BrowserRouter>
)
