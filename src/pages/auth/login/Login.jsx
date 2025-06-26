import { Navigate, useNavigate } from "react-router";
import chateaLogo from "../../../assets/chatea.png";

const Login = () => {
  const navigate = useNavigate();

  const dashboardRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <main className="flex flex-col w-full items-center justify-center min-h-screen bg-[#e4e9f7] px-4 sm:px-6 lg:px-8">
      <figure className="mb-6 sm:mb-7">
        <img
          className="h-12 sm:h-15 w-auto"
          src={chateaLogo}
          alt="Chatea Logo"
        />
      </figure>

      <form className="w-full max-w-sm mx-auto bg-white p-4 sm:p-6 rounded-2xl border-2 border-[#009ee3] shadow-lg">
        <h1 className="text-lg sm:text-xl text-center font-bold text-gray-500 mb-6 sm:mb-7">
          Iniciar sesión en Chatea Pro
        </h1>

        <div className="mb-6 sm:mb-7">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="bg-[#edf4ff] border border-[#009ee333] text-gray-900 text-sm rounded-lg focus:outline-none focus:border-[#009ee3] focus:ring-2 focus:ring-[#009ee3]/20 transition-all duration-200 block w-full p-2.5"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="mb-6 sm:mb-7">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="bg-[#edf4ff] border border-[#009ee333] text-gray-900 text-sm rounded-lg focus:outline-none focus:border-[#009ee3] focus:ring-2 focus:ring-[#009ee3]/20 transition-all duration-200 block w-full p-2.5"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          onClick={() => dashboardRedirect()}
          className="text-white bg-[#009ee3] hover:bg-[#007bb8] focus:ring-2 focus:ring-[#009ee3]/50 focus:outline-none active:scale-[0.98] cursor-pointer font-medium rounded-lg text-sm w-full mb-4 sm:mb-5 px-5 py-2.5 text-center transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Iniciar sesión
        </button>

        <div className="text-center">
          <a
            href="#"
            className="text-sm text-[#009ee3] hover:text-[#007bb8] hover:underline transition-colors duration-200"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </main>
  );
};

export default Login;
