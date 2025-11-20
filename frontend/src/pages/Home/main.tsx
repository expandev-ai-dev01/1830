import { useNavigate } from 'react-router-dom';

/**
 * @page HomePage
 * @summary Welcome page for FoodTrack application.
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Simulating login for the "simple" scope of the project
    // In a real app, this would be a real login flow
    localStorage.setItem('auth_token', 'mock-token-for-demo');
    navigate('/purchases');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">FoodTrack</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema simples e eficiente para controle de compras de alimentos. Gerencie seus gastos,
          acompanhe históricos e organize sua despensa.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-1"
          >
            Acessar Sistema
          </button>
          <p className="text-sm text-gray-500">Clique para iniciar a demonstração</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
