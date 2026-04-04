import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe, deleteRecipe } from '../services/recipesApi';

function EditRecipePage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => {
    getRecipe(id)
      .then(({ data }) => {
        const r = data.recipe;
        const ingredients = r.ingredients
          ? (typeof r.ingredients === 'string'
              ? JSON.parse(r.ingredients)
              : r.ingredients)
          : [];
        setForm({
          title:        r.title        ?? '',
          description:  r.description  ?? '',
          category:     r.category     ?? '',
          ingredients:  ingredients.join('\n'),
          instructions: r.instructions ?? '',
          prep_time:    r.prep_time    ?? '',
          servings:     r.servings     ?? '',
        });
      })
      .catch(() => setError('Failed to load recipe.'))
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

    const payload = {
      title:        form.title,
      description:  form.description  || undefined,
      category:     form.category     || undefined,
      instructions: form.instructions || undefined,
      prep_time:    form.prep_time    ? Number(form.prep_time) : undefined,
      servings:     form.servings     ? Number(form.servings)  : undefined,
      ingredients:  form.ingredients
        ? form.ingredients.split('\n').map((s) => s.trim()).filter(Boolean)
        : undefined,
    };

    try {
      await updateRecipe(id, payload);
      setSuccess('Recipe updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update recipe.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this recipe?')) return;
    setDeleting(true);
    try {
      await deleteRecipe(id);
      navigate('/recipes');
    } catch {
      setError('Failed to delete recipe.');
      setDeleting(false);
    }
  }

  if (loading)  return <p>Loading…</p>;
  if (!form)    return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title *</label>
          <input
            id="title" name="title" type="text"
            value={form.title} onChange={handleChange} required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category" name="category" type="text"
            value={form.category} onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description">Short description</label>
          <textarea
            id="description" name="description" rows={2}
            value={form.description} onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="ingredients">Ingredients (one per line)</label>
          <textarea
            id="ingredients" name="ingredients" rows={6}
            value={form.ingredients} onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions" name="instructions" rows={6}
            value={form.instructions} onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="prep_time">Prep time (minutes)</label>
          <input
            id="prep_time" name="prep_time" type="number" min="0"
            value={form.prep_time} onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="servings">Servings</label>
          <input
            id="servings" name="servings" type="number" min="1"
            value={form.servings} onChange={handleChange}
          />
        </div>

        {error   && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <hr />
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete recipe'}
      </button>
    </div>
  );
}

export default EditRecipePage;
