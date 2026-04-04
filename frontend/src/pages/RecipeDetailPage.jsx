import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../services/recipesApi';
import { isAuthenticated, getToken } from '../services/auth';
import { jwtDecode } from '../utils/jwt';

function parseIngredients(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not JSON — treat as comma-separated or newline-separated plain text
    }
    return value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function RecipeDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [recipe, setRecipe]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [deleting, setDeleting] = useState(false);

  const currentUserId = isAuthenticated() ? jwtDecode(getToken())?.id : null;

  useEffect(() => {
    getRecipe(id)
      .then(({ data }) => setRecipe(data.recipe))
      .catch(() => setError('Recipe not found.'))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;
  if (!recipe) return null;

  const ingredients = parseIngredients(recipe.ingredients);

  const isOwner = currentUserId === recipe.user_id;

  return (
    <div>
      <h1>{recipe.title}</h1>
      {recipe.category && <p><strong>Category:</strong> {recipe.category}</p>}
      {recipe.description && <p>{recipe.description}</p>}

      {recipe.prep_time && <p><strong>Prep time:</strong> {recipe.prep_time} min</p>}
      {recipe.servings  && <p><strong>Servings:</strong> {recipe.servings}</p>}

      {ingredients.length > 0 && (
        <section>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.instructions && (
        <section>
          <h2>Instructions</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{recipe.instructions}</p>
        </section>
      )}

      {isOwner && (
        <div>
          <Link to={`/recipes/${id}/edit`}>Edit</Link>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}

      <Link to="/recipes">← Back to recipes</Link>
    </div>
  );
}

export default RecipeDetailPage;
