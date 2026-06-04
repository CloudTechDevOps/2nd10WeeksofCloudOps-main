import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Pencil, Star, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDeleteBook } from '../hooks/useBooks';
import styles from './BookCard.module.css';

export default function BookCard({ book, index = 0 }) {
  const { user } = useAuth();
  const deleteBook = useDeleteBook();
  const [imgError, setImgError] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const canEdit = user && (user.role === 'admin' || user.id === book.created_by);

  const handleDelete = (e) => {
    e.preventDefault();
    if (!confirming) { setConfirming(true); return; }
    deleteBook.mutate(book.id);
  };

  const price = parseFloat(book.price);

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Cover */}
      <Link to={`/books/${book.id}`} className={styles.coverWrap}>
        {!imgError && book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className={styles.cover}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.coverFallback}>
            <span>{book.title?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
        )}
        {book.category_name && (
          <span className={styles.categoryBadge} style={{ '--cat-color': book.category_color || '#8b5cf6' }}>
            {book.category_name}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className={styles.body}>
        <Link to={`/books/${book.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{book.title}</h3>
        </Link>

        {book.author && (
          <p className={styles.author}>by {book.author}</p>
        )}

        {book.description && (
          <p className={styles.desc}>{book.description}</p>
        )}

        <div className={styles.meta}>
          {book.rating && (
            <span className={styles.rating}>
              <Star size={12} fill="currentColor" /> {Number(book.rating).toFixed(1)}
            </span>
          )}
          <span className={styles.stock}>
            <Package size={12} /> {book.stock ?? 0}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.price}>
          {isNaN(price) ? '—' : `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
        </span>

        {canEdit && (
          <div className={styles.actions}>
            <Link to={`/edit/${book.id}`} className={styles.editBtn} title="Edit">
              <Pencil size={14} />
            </Link>
            <button
              className={`${styles.deleteBtn} ${confirming ? styles.confirming : ''}`}
              onClick={handleDelete}
              disabled={deleteBook.isPending}
              title={confirming ? 'Click again to confirm' : 'Delete'}
              onBlur={() => setConfirming(false)}
            >
              <Trash2 size={14} />
              {confirming && <span>Sure?</span>}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
