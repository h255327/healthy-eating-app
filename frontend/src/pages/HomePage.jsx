import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/recipesApi';
import { isAuthenticated } from '../services/auth';

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'How to Build a Balanced Plate',
    description: 'Learn the basics of portion control and macronutrient balance for every meal.',
  },
  {
    id: 2,
    title: 'The Benefits of Meal Planning',
    description: 'Discover how planning your meals in advance saves time, money, and calories.',
  },
  {
    id: 3,
    title: 'Understanding Diet Types',
    description: 'From vegan to keto — a clear guide to choosing the right diet for your goals.',
  },
];

function HomePage() {
  const [recipes, setRecipes]   = useState([]);
  const loggedIn = isAuthenticated();

  useEffect(() => {
    getRecipes()
      .then(({ data }) => setRecipes(data.recipes.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>

      {/* Hero */}
      <section>
        <h1>Eat better. Feel better.</h1>
        <p>
          HealthyEat helps you plan your diet, discover nutritious recipes,
          track your daily meals, and reach your health goals — all in one place.
        </p>
        {loggedIn ? (
          <div>
            <Link to="/dashboard">Go to Dashboard</Link>
            <Link to="/recipes">Browse Recipes</Link>
          </div>
        ) : (
          <div>
            <Link to="/register">Get started</Link>
            <Link to="/login">Log in</Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section>
        <h2>Everything you need</h2>
        <ul>
          <li>
            <strong>Recipe library</strong>
            <p>Browse and save healthy recipes filtered by category and diet type.</p>
          </li>
          <li>
            <strong>Meal planner</strong>
            <p>Plan your week ahead and keep your nutrition on track every day.</p>
          </li>
          <li>
            <strong>Calorie tracking</strong>
            <p>Log your meals and monitor your daily calorie and macro intake.</p>
          </li>
          <li>
            <strong>Shopping list</strong>
            <p>Auto-generate a grocery list straight from your weekly meal plan.</p>
          </li>
        </ul>
      </section>

      {/* Featured recipes */}
      <section>
        <div>
          <h2>Featured Recipes</h2>
          <Link to="/recipes">View all →</Link>
        </div>

        {recipes.length === 0 ? (
          <p>No recipes yet. <Link to="/recipes/add">Add the first one!</Link></p>
        ) : (
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
      </section>

      {/* Featured articles */}
      <section>
        <div>
          <h2>From the Blog</h2>
          <Link to="/articles">View all →</Link>
        </div>

        <ul>
          {MOCK_ARTICLES.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong>
              <p>{a.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom CTA */}
      {!loggedIn && (
        <section>
          <h2>Start your journey today</h2>
          <p>Create a free account and take control of your nutrition.</p>
          <Link to="/register">Sign up for free</Link>
        </section>
      )}

    </div>
  );
}

export default HomePage;
