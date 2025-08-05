import { JSX, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import NavBar from './components/NavBar'
import LoginPage from './pages/loginPage'
import SignupPage from './pages/signupPage'
import { CssBaseline, Container } from '@mui/material'
import TimelinePage from './pages/timelinePage'
import { csrfToken } from './utils/api'
import OtherUserPage from './pages/otherUserPage'
import ProfilePage from './pages/profilePage'

const queryClient = new QueryClient()

const isLoggedIn = () =>
  !!Cookies.get('csrf-token') && !!Cookies.get('access-token')

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  return isLoggedIn() ? <Navigate to="/" replace /> : children
}

const AppRoutes = () => {
  useEffect(() => {
    csrfToken().catch((err) => {
      console.error('Failed to fetch CSRF token:', err)
    })
  }, [])

  const showNavbar = isLoggedIn()

  return (
    <>
      {showNavbar && <NavBar />}
      <Container sx={{ mt: showNavbar ? 10 : 0 }}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TimelinePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <PrivateRoute>
                <OtherUserPage />
              </PrivateRoute>
            }
          />
           <Route
            path="/my-profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn() ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Container>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  )
}

export default App
