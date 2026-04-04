import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, getCategories } from '../services/recipesApi';
import { isAuthenticated } from '../services/auth';

function RecipesPage() {
  const [recipes, setRecipes]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // load categories once
  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  // re-fetch recipes whenever search or category changes (debounced for search)
  useEffect(() => {
    setLoading(true);
    setError('');

    const timer = setTimeout(() => {
      getRecipes({ search: search.trim() || undefined, category: category || undefined })
        .then(({ data }) => setRecipes(data.recipes))
        .catch(() => setError('Failed to load recipes.'))
        .finally(() => setLoading(false));
    }, search ? 300 : 0);

    return () => clearTimeout(timer);
  }, [search, category]);

  function handleReset() {
    setSearch('');
    setCategory('');
  }

  const hasFilters = search || category;

  return (
    <div>
      <div>
        <h1>Recipes</h1>
        {isAuthenticated() && <Link to="/recipes/add">+ Add recipe</Link>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Search recipes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" onClick={handleReset}>Clear filters</button>
        )}
      </div>

      {loading && <p>Loading recipes…</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>No recipes found.</p>
      )}

      {!loading && recipes.length > 0 && (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <Link to={`/recipes/${r.id}`}>
                <strong>{r.title}</strong>
              </Link>
              {r.category && <span> — {r.category}</span>}
              {r.description && <p>{r.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipesPage;
