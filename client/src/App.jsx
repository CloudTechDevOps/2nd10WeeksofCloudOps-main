import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Spinner from './components/Spinner';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Spinner fullscreen />;

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="add"    element={<PrivateRoute><AddBookPage /></PrivateRoute>} />
        <Route path="edit/:id" element={<PrivateRoute><EditBookPage /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
