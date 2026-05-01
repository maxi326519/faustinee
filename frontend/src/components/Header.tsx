import { Facebook, Instagram, Twitter, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "@/assets/logo-horizontral-transparent.png";

const categories = [
  { key: "inicio", label: "Inicio" },
  { key: "editorial", label: "Editorial" },
  { key: "moda", label: "Moda" },
  { key: "estilo", label: "Estilo" },
  { key: "belleza", label: "Belleza" },
  { key: "tendencias", label: "Tendencias" },
  { key: "hombres", label: "Hombres" },
  // { key: "estilo-de-vida", label: "Estilo de vida" },
  { key: "entrevistas", label: "Entrevistas" },
  { key: "lo-ultimo", label: "Lo último" },
  { key: "noticias", label: "Noticias" },
  { key: "viajes", label: "Viajes" },
];

interface Props {
  categorySelected?: string;
}

export default function Header({ categorySelected }: Props) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Clave activa: si no viene, por defecto "inicio"
  const activeKey = categorySelected ?? "inicio";

  return (
    <header className="relative w-full font-text bg-black">
      {/* Logo + redes */}
      <div className="bg-black">
        <div className="relative flex items-center justify-center md:justify-between max-w-[1200px] md:m-auto">
          <div className="flex justify-center items-center mx-auto mt-16 md:mt-4 my-4 h-[100px] overflow-hidden">
            <img className="h-full object-cover" src={logo} alt="logo" />
          </div>
          <div className="absolute top-2 left-2 md:mb-0">
            <div className="flex items-center justify-center gap-6 mt-4">
              <a
                href="https://www.facebook.com/faustinee.luxe/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook
                  size={20}
                  strokeWidth={1}
                  className="text-gray-400 hover:text-primary transition duration-300"
                />
              </a>
              <a
                href="https://www.instagram.com/faustinee.luxe"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram
                  size={20}
                  strokeWidth={1}
                  className="text-gray-400 hover:text-primary transition duration-300"
                />
              </a>
              <a
                href="https://x.com/faustineemag"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter
                  size={20}
                  strokeWidth={1}
                  className="text-gray-400 hover:text-primary transition duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías - Desktop */}
      <nav className="hidden md:block sticky top-0 text-sm text-center font-medium tracking-wide px-4 overflow-x-auto whitespace-nowrap border-b border-[#DDD] bg-white">
        <ul className="flex justify-between max-w-[1200px] m-auto">
          {categories.map((category) => {
            const isActive = activeKey === category.key;
            return (
              <li
                key={category.key}
                className={`text-secondary px-4 py-2 border-b-2 border-transparent hover:border-secondary cursor-pointer ${
                  isActive ? "bg-gray-100" : ""
                }`}
                onClick={() =>
                  navigate(category.key !== "inicio" ? `/${category.key}` : "/")
                }
              >
                {category.label.toUpperCase()}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Categorías - Mobile */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-gray-600 uppercase tracking-wide text-sm font-semibold">
            Categorías
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="text-gray-700" />
            ) : (
              <Menu className="text-gray-700" />
            )}
          </button>
        </div>

        {menuOpen && (
          <ul className="flex flex-col px-4 pb-4 text-sm uppercase tracking-wide">
            {categories.map((category) => {
              const isActive = activeKey === category.key;
              return (
                <li
                  key={category.key}
                  className={`text-secondary px-4 py-2 border-b-2 border-transparent hover:border-secondary cursor-pointer ${
                    isActive ? "bg-gray-100" : ""
                  }`}
                  onClick={() =>
                    navigate(
                      category.key !== "inicio" ? `/${category.key}` : "/"
                    )
                  }
                >
                  {category.label.toUpperCase()}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </header>
  );
}
