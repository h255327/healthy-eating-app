import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recipes',   label: 'Recipes' },
  { to: '/articles',  label: 'Articles' },
  { to: '/planner',   label: 'Planner' },
  { to: '/meals',     label: 'Meal Log' },
  { to: '/shopping',  label: 'Shopping' },
  { to: '/chatbot',   label: 'Assistant' },
];

const AUTH_LINKS = [
  { to: '/profile',  label: 'Profile' },
  { to: '/login',    label: 'Login' },
  { to: '/register', label: 'Register' },
];

function Navbar() {
  return (
    <nav>
      <div>
        <Link to="/"><strong>HealthyEat</strong></Link>
      </div>
      <ul>
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
      <ul>
        {AUTH_LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
