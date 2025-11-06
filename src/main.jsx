import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter.jsx'
import { ChakraProvider } from '@chakra-ui/react'   

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <ChakraProvider>
{   /* <App /> */}
    <AppRouter/>
    </ChakraProvider>
  </StrictMode>
  </BrowserRouter>
)
