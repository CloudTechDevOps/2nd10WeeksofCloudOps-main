import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Star, Package, Tag, Calendar, Hash, User, BookOpen } from 'lucide-react';
import { useBook, useDeleteBook } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import styles from './BookDetailPage.module.css';

export default function BookDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: res, isLoading } = useBook(id);
  const deleteBook = useDeleteBook();
  const [confirming, setConfirming] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (isLoading) return <div className={styles.center}><Spinner size={40} /></div>;
  const book = res?.data;
  if (!book) return <div className={styles.center}><p>Book not found.</p><Link to="/" className={styles.back}><ArrowLeft size={14}/> Back</Link></div>;

  const canEdit = user && (user.role === 'admin' || user.id === book.created_by);
  const price = parseFloat(book.price);

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); return; }
    deleteBook.mutate(id, { onSuccess: () => navigate('/') });
  };

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}><ArrowLeft size={16} /> Back to library</Link>

      <div className={styles.layout}>
        {/* Cover */}
        <aside className={styles.aside}>
          <div className={styles.coverWrap}>
            {!imgError && book.cover_url ? (
              <img src={book.cover_url} alt={book.title} onError={() => setImgError(true)} className={styles.cover} />
            ) : (
              <div className={styles.coverFallback}>
                <BookOpen size={56} strokeWidth={1} />
              </div>
            )}
          </div>
          {canEdit && (
            <div className={styles.sideActions}>
              <Link to={`/edit/${id}`} className={styles.editBtn}><Pencil size={15} /> Edit</Link>
              <button
                onClick={handleDelete}
                className={`${styles.deleteBtn} ${confirming ? styles.confirming : ''}`}
                disabled={deleteBook.isPending}
              >
                <Trash2 size={15} />
                {confirming ? 'Are you sure?' : 'Delete'}
              </button>
            </div>
          )}
        </aside>

        {/* Detail */}
        <div className={styles.detail}>
          {book.category_name && (
            <span className={styles.category} style={{ '--c': book.category_color }}>
              <Tag size={11} /> {book.category_name}
            </span>
          )}

          <h1 className={styles.title}>{book.title}</h1>

          {book.author && <p className={styles.author}>by <strong>{book.author}</strong></p>}

          <div className={styles.priceBadge}>
            {isNaN(price) ? '—' : `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </div>

          <div className={styles.metaGrid}>
            {book.rating && (
              <MetaItem icon={<Star size={14} fill="currentColor" style={{color:'var(--gold)'}} />} label="Rating">
                {Number(book.rating).toFixed(1)} / 5.0
              </MetaItem>
            )}
            <MetaItem icon={<Package size={14} />} label="In Stock">
              {book.stock ?? 0} units
            </MetaItem>
            {book.isbn && (
              <MetaItem icon={<Hash size={14} />} label="ISBN">{book.isbn}</MetaItem>
            )}
            {book.published_at && (
              <MetaItem icon={<Calendar size={14} />} label="Published">
                {new Date(book.published_at).toLocaleDateString('en-IN', { year:'numeric', month:'long' })}
              </MetaItem>
            )}
            {book.created_by_name && (
              <MetaItem icon={<User size={14} />} label="Added by">{book.created_by_name}</MetaItem>
            )}
          </div>

          {book.description && (
            <div className={styles.descSection}>
              <h2>About this book</h2>
              <p>{book.description}</p>
            </div>
          )}

          <div className={styles.statusBadge} data-status={book.status}>{book.status}</div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, children }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <div>
        <div className={styles.metaLabel}>{label}</div>
        <div className={styles.metaValue}>{children}</div>
      </div>
    </div>
  );
}
