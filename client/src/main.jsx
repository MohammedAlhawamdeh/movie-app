import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './redux/store';
import { NotificationProvider } from './context/NotificationContext';
import App from './App';

// Styles
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
