import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter.jsx'
import Layout from './components/Layout.jsx'
import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ChakraProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </ChakraProvider>
    </StrictMode>
  </BrowserRouter>
)
