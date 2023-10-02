import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import store from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
const render = () => {
  root.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID}>
      <React.StrictMode>
        <AuthContextProvider>
          <BrowserRouter>
            <Provider store={store}>
              <App />
            </Provider>
          </BrowserRouter>
        </AuthContextProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  );
};

render();

store.subscribe(render);
