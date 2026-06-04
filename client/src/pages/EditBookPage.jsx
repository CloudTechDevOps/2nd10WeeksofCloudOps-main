import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import BookForm from '../components/BookForm';
import { useBook, useUpdateBook } from '../hooks/useBooks';
import Spinner from '../components/Spinner';
import styles from './FormPage.module.css';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: res, isLoading } = useBook(id);
  const updateBook = useUpdateBook();

  const book = res?.data;
  const initial = useMemo(() => book ? {
    title: book.title || '',
    description: book.description || '',
    price: book.price || '',
    cover_url: book.cover_url || '',
    author: book.author || '',
    isbn: book.isbn || '',
    category_id: book.category_id || '',
    stock: book.stock ?? '',
    published_at: book.published_at ? book.published_at.slice(0, 10) : '',
  } : {}, [book]);

  if (isLoading) return <div style={{ display:'flex',justifyContent:'center',padding:'80px' }}><Spinner size={40}/></div>;

  const handleSubmit = (data) => {
    updateBook.mutate({ id, ...data }, { onSuccess: () => navigate(`/books/${id}`) });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.iconWrap}><Pencil size={20} /></div>
        <div>
          <h1 className={styles.heading}>Edit Book</h1>
          <p className={styles.sub}>Update the details for "{book?.title}"</p>
        </div>
      </div>
      <BookForm
        initialValues={initial}
        onSubmit={handleSubmit}
        submitting={updateBook.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
