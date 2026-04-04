import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articlesApi';

const EMPTY_FORM = { title: '', summary: '', category: '', content: '' };

function AddArticlePage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(EMPTY_FORM);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await createArticle({
        title:    form.title,
        summary:  form.summary   || undefined,
        category: form.category  || undefined,
        content:  form.content,
      });
      navigate(`/articles/${data.article.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create article.');
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Add Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text"
            value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input id="category" name="category" type="text"
            placeholder="e.g. nutrition, recipes, wellness"
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Publish article'}
        </button>
      </form>
    </div>
  );
}

export default AddArticlePage;
