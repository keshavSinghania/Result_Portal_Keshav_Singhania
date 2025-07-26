import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import Router from './routes/router.jsx'
import {store} from "./store/store.js"
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={Router}>
    </RouterProvider>
    </Provider>
  </StrictMode>,
)
