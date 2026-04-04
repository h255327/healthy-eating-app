import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/articlesApi';
import { isAuthenticated, getToken } from '../services/auth';
import { jwtDecode } from '../utils/jwt';

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const isAdmin = isAuthenticated() && jwtDecode(getToken())?.role === 'admin';

  useEffect(() => {
    getArticles()
      .then(({ data }) => setArticles(data.articles))
      .catch(() => setError('Failed to load articles.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading articles…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div>
        <h1>Articles</h1>
        {isAdmin && <Link to="/articles/add">+ Add article</Link>}
      </div>

      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map((a) => (
            <li key={a.id}>
              <Link to={`/articles/${a.id}`}>
                <strong>{a.title}</strong>
              </Link>
              {a.category && <span> — {a.category}</span>}
              {a.summary && <p>{a.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArticlesPage;
