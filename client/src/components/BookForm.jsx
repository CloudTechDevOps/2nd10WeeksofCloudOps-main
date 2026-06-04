import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, DollarSign, Image, User, Hash, Calendar, Layers, Package, ArrowLeft, Save, Upload } from 'lucide-react';
import { useCategories } from '../hooks/useBooks';
import styles from './BookForm.module.css';

const EMPTY = { title: '', description: '', price: '', cover_url: '', author: '', isbn: '', category_id: '', stock: '', published_at: '' };

export default function BookForm({ initialValues = {}, onSubmit, submitting, submitLabel = 'Save Book' }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const { data: catRes } = useCategories();
  const categories = catRes?.data || [];

  useEffect(() => {
    if (Object.keys(initialValues).length) setForm({ ...EMPTY, ...initialValues });
  }, [initialValues]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    setPreviewError(false);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (field === 'cover_url') setPreviewError(false);
  };

  const setFile = (e) => setCoverFile(e.target.files?.[0] || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id ? parseInt(form.category_id) : undefined,
    };

    if (coverFile) {
      const data = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') data.append(key, value);
      });
      data.append('cover_file', coverFile);
      onSubmit(data);
      return;
    }

    onSubmit(payload);
  };

  const previewSrc = coverPreview || form.cover_url;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Cover preview */}
      <div className={styles.preview}>
        {previewSrc && !previewError ? (
          <img src={previewSrc} alt="Cover preview" onError={() => setPreviewError(true)} />
        ) : (
          <div className={styles.previewFallback}>
            <BookOpen size={40} strokeWidth={1} />
            <span>Cover preview</span>
          </div>
        )}
      </div>

      <div className={styles.fields}>
        <div className={styles.row}>
          <Field label="Title *" icon={<BookOpen size={15} />}>
            <input
              type="text" value={form.title} onChange={set('title')}
              placeholder="Enter book title" required maxLength={300}
            />
          </Field>
          <Field label="Author" icon={<User size={15} />}>
            <input type="text" value={form.author} onChange={set('author')} placeholder="Author name" maxLength={200} />
          </Field>
        </div>

        <Field label="Description" icon={<BookOpen size={15} />} full>
          <textarea
            value={form.description} onChange={set('description')}
            placeholder="What is this book about?" rows={4} maxLength={5000}
          />
        </Field>

        <div className={styles.row}>
          <Field label="Price (₹) *" icon={<DollarSign size={15} />}>
            <input type="number" value={form.price} onChange={set('price')} placeholder="0.00" min="0" step="0.01" required />
          </Field>
          <Field label="Stock" icon={<Package size={15} />}>
            <input type="number" value={form.stock} onChange={set('stock')} placeholder="0" min="0" />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="ISBN" icon={<Hash size={15} />}>
            <input type="text" value={form.isbn} onChange={set('isbn')} placeholder="978-..." maxLength={20} />
          </Field>
          <Field label="Published" icon={<Calendar size={15} />}>
            <input type="date" value={form.published_at} onChange={set('published_at')} />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Category" icon={<Layers size={15} />}>
            <select value={form.category_id} onChange={set('category_id')}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Cover URL" icon={<Image size={15} />}>
            <input type="url" value={form.cover_url} onChange={set('cover_url')} placeholder="https://..." />
          </Field>
        </div>

        <Field label="Cover photo" icon={<Upload size={15} />} full>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={setFile} />
          <span className={styles.fileName}>
            {coverFile ? coverFile.name : 'Choose a local cover image, or use the Cover URL above.'}
          </span>
        </Field>

        <div className={styles.actions}>
          <Link to="/" className={styles.cancelBtn}><ArrowLeft size={15} /> Cancel</Link>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? <span className={styles.spinner} /> : <Save size={15} />}
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, icon, children, full }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`}>
      <label className={styles.label}>{icon}{label}</label>
      {children}
    </div>
  );
}
