import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, deleteArticle } from '../services/articlesApi';
import { isAuthenticated, getToken } from '../services/auth';
import { jwtDecode } from '../utils/jwt';

function ArticleDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [article, setArticle]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(false);

  const isAdmin = isAuthenticated() && jwtDecode(getToken())?.role === 'admin';

  useEffect(() => {
    getArticle(id)
      .then(({ data }) => setArticle(data.article))
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading)  return <p>Loading…</p>;
  if (error)    return <p style={{ color: 'red' }}>{error}</p>;
  if (!article) return null;

  return (
    <div>
      <h1>{article.title}</h1>
      {article.category && <p><strong>Category:</strong> {article.category}</p>}
      {article.summary  && <p><em>{article.summary}</em></p>}

      <p style={{ whiteSpace: 'pre-line' }}>{article.content}</p>

      {isAdmin && (
        <div>
          <Link to={`/articles/${id}/edit`}>Edit</Link>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}

      <Link to="/articles">← Back to articles</Link>
    </div>
  );
}

export default ArticleDetailPage;
