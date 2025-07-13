import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <AppRouter />
    </AuthProvider>
  )
}

export default App
