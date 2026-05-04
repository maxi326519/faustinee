import { Facebook, Instagram, Twitter } from "lucide-react";

import logoFaustinee from "@/assets/logo-horizontral-transparent.png";
// import logoPuma from "@/assets/empresas/Puma-Logo-768x432.png";
import logoLoreal from "@/assets/empresas/Loreal-Paris.jpg";
import logoMoet from "@/assets/empresas/moet-logo.jpg";
import logoCartier from "@/assets/empresas/logo-cartier.jpeg";
import logoBlueTailored from "@/assets/empresas/unnamed.jpg";

function Footer() {
  return (
    <footer className="text-gray-900 w-full border-t border-[#DDD]">
      <div className="py-14">
        <h3 className="CustomFont text-5xl text-center font-title font-bold mb-6">
          Nos Acompañan
        </h3>
        <div className="overflow-x-auto">
          <div className="flex justify-center p-4 w-max m-auto">
            <div className="flex gap-6 w-max">
              {/* Logos de partners - reemplaza con tus imágenes */}
              {/*               <a
                className="flex items-center justify-center h-[80px] cursor-pointer"
                href="https://ar.puma.com/"
                target="_blank"
              >
                <img className="h-full" src={logoPuma} alt="logo-Puma" />
              </a> */}
              <a
                rel="noopener noreferrer"
                className="flex items-center justify-center h-[80px] cursor-pointer"
                href="https://www.moet.com/"
                target="_blank"
              >
                <img className="h-full" src={logoMoet} alt="logo-Moet" />
              </a>
              <a
                rel="noopener noreferrer"
                className="flex items-center justify-center h-[80px] cursor-pointer"
                href="https://cartier.com/"
                target="_blank"
              >
                <img className="h-full" src={logoCartier} alt="logo-Cartier" />
              </a>
              <a
                rel="noopener noreferrer"
                className="flex items-center justify-center h-[80px] cursor-pointer"
                href="https://www.lorealparis.com.ar/"
                target="_blank"
              >
                <img className="h-full" src={logoLoreal} alt="logo-Loreal" />
              </a>
              <div className="flex items-center justify-center h-[80px]">
                <img
                  className="h-full w-auto max-w-[220px] object-contain"
                  src={logoBlueTailored}
                  alt="Blue Tailored Co."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-black text-white">
        <div className="flex flex-col md:flex-row items-center justify-between mx-auto gap-10 md:px-8 py-8 px-4 max-w-6xl">
          <div className="flex flex-col gap-10 h-full m-auto p-4">
            {/* Logo de la revista */}
            <div className="mb-4 md:mb-0">
              <div className="w-52 flex items-center justify-center rounded">
                <img src={logoFaustinee} alt="logo-Puma" />
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <a
                href="https://www.facebook.com/faustinee.luxe/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook
                  strokeWidth={1}
                  className="text-gray-200 hover:text-primary transition duration-300"
                />
              </a>
              <a
                href="https://www.instagram.com/faustinee.luxe"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram
                  strokeWidth={1}
                  className="text-gray-200 hover:text-primary transition duration-300"
                />
              </a>
              <a
                href="https://x.com/faustineemag"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter
                  strokeWidth={1}
                  className="text-gray-200 hover:text-primary transition duration-300"
                />
              </a>
            </div>
          </div>

          <div className="px-10 w-full max-w-[250px] md:max-w-[400px]">
            <h3 className="text-gray-200 text-xl font-title font-bold mb-4">
              CONTACTO
            </h3>
            <ul className="text-gray-200 text-sm font-text">
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=edition@faustinee.com&su=Consulta&body=Hola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  edition@faustinee.com
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=comercial@faustinee.com&su=Consulta&body=Hola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  comercial@faustinee.com
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=staff@faustinee.com&su=Consulta&body=Hola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  staff@faustinee.com
                </a>
              </li>
            </ul>
          </div>

          <div className="px-10 w-full max-w-[250px] md:max-w-[400px]">
            <h3 className="text-gray-200 text-xl font-title font-bold mb-4">
              EQUIPO
            </h3>
            <div className="m-auto md:m-0 max-w-[250px] font-text text-xs">
              <p className="text-gray-200 mb-2">Edición General: Mónica Brun</p>
              <p className="text-gray-200">
                Redactores, Productores y Periodistas: Equipo Revista Faustinee
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pb-6 text-center font-light text-gray-400">
          Faustinee © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
