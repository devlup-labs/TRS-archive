import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from 'react-redux'
import store from '../src/store.tsx'
    



ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <App />
    </Provider>
)
