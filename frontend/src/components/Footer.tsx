import { useState } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import logoFaustinee from "@/assets/logo-horizontral-transparent.png";
import biografia from "@/assets/biografia.png";
// import logoPuma from "@/assets/empresas/Puma-Logo-768x432.png";
// import logoLoreal from "@/assets/empresas/Loreal-Paris.jpg";
// import logoMoet from "@/assets/empresas/moet-logo.jpg";
// import logoCartier from "@/assets/empresas/logo-cartier.jpeg";

function Footer() {
  const [bioVisible, setBioVisible] = useState(false);

  return (
    <footer className="text-gray-900 w-full border-t border-[#DDD]">
      {/* Logos de partners - reemplaza con tus imágenes */}
      {/* <div className="py-14">
        <h3 className="CustomFont text-5xl text-center font-title font-bold mb-6">
          Nos Acompañan
        </h3>
        <div className="overflow-x-auto">
          <div className="flex justify-center p-4 w-max m-auto">
            <div className="flex gap-6 w-max">
              <a
                className="flex items-center justify-center h-[80px] cursor-pointer"
                href="https://ar.puma.com/"
                target="_blank"
              >
                <img className="h-full" src={logoPuma} alt="logo-Puma" />
              </a>
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
            </div>
          </div>
        </div>
      </div> */}

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
              <p className="text-gray-200 mb-2">
                Redactores, Productores y Periodistas: Equipo Revista Faustinee
              </p>
              <button
                type="button"
                onClick={() => setBioVisible(true)}
                className="text-gray-200 underline underline-offset-4 hover:text-primary transition duration-300 cursor-pointer"
              >
                Biografía
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pb-6 text-center font-light text-gray-400">
          Faustinee © {new Date().getFullYear()}
        </div>
      </div>

      {/* Popup de biografía */}
      <Dialog open={bioVisible} onOpenChange={setBioVisible}>
        <DialogContent className="max-w-[92vw] sm:max-w-[520px] max-h-[90vh] overflow-y-auto border-none bg-transparent p-0 shadow-none [&>button]:right-2 [&>button]:top-2 [&>button]:rounded-full [&>button]:bg-white [&>button]:p-1 [&>button]:text-black [&>button]:opacity-80 [&>button]:shadow hover:[&>button]:opacity-100">
          <DialogTitle className="sr-only">
            Biografía de Mónica Brun
          </DialogTitle>
          <img
            src={biografia}
            alt="Biografía de Mónica Brun"
            className="w-full h-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;
