import { useState } from "react";
import chateaLogo from "../../assets/chatea.png";
import userLogo from "../../assets/user.png";
import RechargePopup from "../rechargePopup/RechargePopup";

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRechargePopupOpen, setIsRechargePopupOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openRechargePopup = () => {
    setIsRechargePopupOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeRechargePopup = () => {
    setIsRechargePopupOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 relative">
          <a href="#" className="flex items-center space-x-3">
            <img
              src={chateaLogo}
              className="h-10 max-sm:h-8"
              alt="Chatea Logo"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              onClick={openRechargePopup}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium transition cursor-pointer text-white bg-[#009eec] rounded-lg hover:bg-[#007bb8] focus:ring-1 focus:ring-blue-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Recargar minutos</span>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                type="button"
                className="flex text-sm rounded-full border-0 focus:ring-1 cursor-pointer focus:ring-blue-300"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={userLogo}
                  alt="user photo"
                />
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">
                      Gonzalo Salazar
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      gonza@gmail.com
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Abrir menú principal</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={chateaLogo} className="h-8" alt="Chatea Logo" />
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-2"
              onClick={closeMobileMenu}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenido del sidebar */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center space-x-3 mb-6">
              <img
                className="w-12 h-12 rounded-full"
                src={userLogo}
                alt="user photo"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Gonzalo Salazar
                </div>
                <div className="text-sm text-gray-500">gonza@gmail.com</div>
              </div>
            </div>

            <button
              type="button"
              onClick={openRechargePopup}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-sm font-medium transition cursor-pointer text-white bg-[#009eec] rounded-lg hover:bg-[#007bb8] focus:ring-1 focus:ring-blue-300 mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Recargar minutos</span>
            </button>

            <div className="flex-1"></div>

            {/* Botón Cerrar sesión */}
            <button
              type="button"
              className="flex items-center space-x-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={closeMobileMenu}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popup de recarga */}
      <RechargePopup
        isOpen={isRechargePopupOpen}
        onClose={closeRechargePopup}
      />
    </>
  );
};

export default Navbar;
