import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { booksApi, socket, connectSocket } from '../pages/config';
import toast from 'react-hot-toast';

export function useBooks(params = {}) {
  const qc = useQueryClient();

  // Connect socket and listen for live updates
  useEffect(() => {
    connectSocket();

    const onCreated = (book) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      toast.success(`📚 "${book.title}" was just added!`, { duration: 4000 });
    };
    const onUpdated = (book) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['book', book.id] });
    };
    const onDeleted = ({ id }) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.removeQueries({ queryKey: ['book', id] });
    };

    socket.on('book:created', onCreated);
    socket.on('book:updated', onUpdated);
    socket.on('book:deleted', onDeleted);

    return () => {
      socket.off('book:created', onCreated);
      socket.off('book:updated', onUpdated);
      socket.off('book:deleted', onDeleted);
    };
  }, [qc]);

  return useQuery({
    queryKey: ['books', params],
    queryFn:  () => booksApi.list(params),
    staleTime: 30_000,
  });
}

export function useBook(id) {
  return useQuery({
    queryKey: ['book', id],
    queryFn:  () => booksApi.get(id),
    enabled:  !!id,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: booksApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully!');
    },
    onError: (err) => toast.error(err?.message || 'Failed to add book'),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => booksApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.setQueryData(['book', res.data?.id], res);
      toast.success('Book updated!');
    },
    onError: (err) => toast.error(err?.message || 'Failed to update book'),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: booksApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete book'),
  });
}

export function useBookStats() {
  return useQuery({
    queryKey: ['book-stats'],
    queryFn:  booksApi.stats,
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  booksApi.categories,
    staleTime: Infinity,
  });
}
