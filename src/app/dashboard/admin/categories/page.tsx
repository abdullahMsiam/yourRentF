'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Tag, ArrowLeft, AlertCircle } from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/context/ToastContext';
import type { Category } from '@/services/types';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminCategoriesPage() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryService.list();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-generate slug from name (unless user manually edited)
  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugManuallyEdited) {
      setSlug(slugify(v));
    }
  };

  const handleSlugChange = (v: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(v));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!cleanName || !cleanSlug) {
      showToast('Name and slug are required.', 'error');
      return;
    }

    // Duplicate check (case-insensitive)
    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() === cleanName.toLowerCase() ||
        c.slug.toLowerCase() === cleanSlug.toLowerCase()
    );
    if (exists) {
      showToast('A category with this name or slug already exists.', 'error');
      return;
    }

    setCreating(true);
    try {
      const newCat = await categoryService.create({
        name: cleanName,
        slug: cleanSlug,
      });
      setCategories((prev) => [...prev, newCat]);
      setName('');
      setSlug('');
      setSlugManuallyEdited(false);
      showToast(`Category "${newCat.name}" created!`, 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to create category.',
        'error'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-indigo-600" />
            Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage property categories that landlords can choose from.
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Admin
        </Link>
      </div>

      {/* Create form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          Add new category
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          The slug is used in URLs and filters. Auto-generated from name, but
          you can customize it.
        </p>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Studio Apartment"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="studio-apartment"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            All categories ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              No categories yet. Create your first one above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-400">
                      {cat.id.slice(0, 8)}…
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
