import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, updateArticle, deleteArticle } from '../services/articlesApi';

function EditArticlePage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [form, setForm]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => {
    getArticle(id)
      .then(({ data }) => {
        const a = data.article;
        setForm({
          title:    a.title    ?? '',
          summary:  a.summary  ?? '',
          category: a.category ?? '',
          content:  a.content  ?? '',
        });
      })
      .catch(() => setError('Failed to load article.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateArticle(id, {
        title:    form.title,
        summary:  form.summary   || undefined,
        category: form.category  || undefined,
        content:  form.content,
      });
      setSuccess('Article updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update article.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this article?')) return;
    setDeleting(true);
    try {
      await deleteArticle(id);
      navigate('/articles');
    } catch {
      setError('Failed to delete article.');
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!form)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Edit Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text"
            value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input id="category" name="category" type="text"
            value={form.category} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" rows={2}
            value={form.summary} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="content">Content *</label>
          <textarea id="content" name="content" rows={10}
            value={form.content} onChange={handleChange} required />
        </div>
        {error   && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
      <hr />
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete article'}
      </button>
    </div>
  );
}

export default EditArticlePage;
