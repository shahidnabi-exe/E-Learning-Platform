import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserContextProvider } from './Context/UserContext.jsx'
import { CourseContextProvider } from './Context/CourseContext.jsx'
import { AdminContextProvider } from './Context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <AdminContextProvider>
        <CourseContextProvider>
          <App />
        </CourseContextProvider>   
      </AdminContextProvider>   
    </UserContextProvider>
  </StrictMode>,
)
