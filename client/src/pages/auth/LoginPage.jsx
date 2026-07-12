import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoginForm from '@components/auth/LoginForm';

const MOCK_USERS = {
  'admin@transitops.com':   { name: 'Admin User',   role: 'Admin',   token: 'mock-admin-token'   },
  'manager@transitops.com': { name: 'Manager User', role: 'Manager', token: 'mock-manager-token' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 900));

    const mock = MOCK_USERS[email];
    if (!mock || (email === 'admin@transitops.com' && password !== 'admin123') ||
                 (email === 'manager@transitops.com' && password !== 'manager123')) {
      throw new Error('Invalid email or password.');
    }

    login({ name: mock.name, email, role: mock.role }, mock.token);
    navigate('/dashboard');
  }

  return <LoginForm onSubmit={handleLogin} />;
}
