import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import BookForm from '../components/BookForm';
import { useCreateBook } from '../hooks/useBooks';
import styles from './FormPage.module.css';

export default function AddBookPage() {
  const navigate = useNavigate();
  const createBook = useCreateBook();

  const handleSubmit = async (data) => {
    createBook.mutate(data, { onSuccess: () => navigate('/') });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.iconWrap}><Plus size={20} /></div>
        <div>
          <h1 className={styles.heading}>Add a New Book</h1>
          <p className={styles.sub}>Fill in the details below to add a book to your library.</p>
        </div>
      </div>
      <BookForm
        onSubmit={handleSubmit}
        submitting={createBook.isPending}
        submitLabel="Add Book"
      />
    </div>
  );
}
