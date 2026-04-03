import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import HomePage         from './pages/HomePage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import ProfilePage      from './pages/ProfilePage';
import RecipesPage      from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage    from './pages/AddRecipePage';
import ArticlesPage     from './pages/ArticlesPage';
import DietPlannerPage  from './pages/DietPlannerPage';
import MealLogPage      from './pages/MealLogPage';
import ShoppingListPage from './pages/ShoppingListPage';
import ChatbotPage      from './pages/ChatbotPage';
import AdminPage        from './pages/AdminPage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/recipes"       element={<RecipesPage />} />
          <Route path="/recipes/add"   element={<AddRecipePage />} />
          <Route path="/recipes/:id"   element={<RecipeDetailPage />} />
          <Route path="/articles"      element={<ArticlesPage />} />
          <Route path="/planner"       element={<DietPlannerPage />} />
          <Route path="/meals"         element={<MealLogPage />} />
          <Route path="/shopping"      element={<ShoppingListPage />} />
          <Route path="/chatbot"       element={<ChatbotPage />} />
          <Route path="/admin"         element={<AdminPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
