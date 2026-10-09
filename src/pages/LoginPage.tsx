import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Title,
  Paper,
  Stack,
  Alert,
} from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/products', { replace: true });
    }
  }, [user, navigate]);

  const isFormValid = userLogin.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please fill in both fields.');
      setIsSubmitting(false);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login(userLogin, password);
      navigate('/products', { replace: true });
    } catch (err: unknown) {
      const responseData =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data
          : undefined;

      const message = responseData?.message || 'Invalid login or password.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-form-container">
        <Container size={420} my={40}>
          <Title ta="center" className="title" c="rgba(71, 67, 147)">
            Log in to your account
          </Title>

          <Paper
            withBorder
            shadow="sm"
            p={22}
            mt={30}
            radius="md"
            c="rgba(71, 67, 147)"
          >
            <form onSubmit={handleLogin}>
              <TextInput
                label="Login"
                required
                radius="md"
                id="user-login"
                placeholder="your login"
                value={userLogin}
                onChange={(e) => setUserLogin(e.target.value)}
              />

              <PasswordInput
                label="Password"
                id="user-password"
                required
                mt="md"
                radius="md"
                placeholder="your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                mt="xl"
                className="login-button"
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !isFormValid}
              >
                Sign in
              </Button>
            </form>

            <Stack gap="md" mt="md">
              {error && (
                <Alert color="red" variant="filled">
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
