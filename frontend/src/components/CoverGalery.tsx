import { useState } from "react";

const covers = [
  "https://via.placeholder.com/300x400?text=Portada+1",
  "https://via.placeholder.com/300x400?text=Portada+2",
  "https://via.placeholder.com/300x400?text=Portada+3",
  "https://via.placeholder.com/300x400?text=Portada+4",
  "https://via.placeholder.com/300x400?text=Portada+5",
  "https://via.placeholder.com/300x400?text=Portada+6",
];

export default function CoverGallery() {
  const [selectedCover, setSelectedCover] = useState<string | null>(null);

  return (
    <section className="py-12 px-4 bg-[#F9F5F1] max-w-7xl mx-auto">
      <h2 className="text-2xl font-title text-[#6A1B1A] mb-6">
        Galería de Portadas
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {covers.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Portada ${idx + 1}`}
            className="rounded-lg shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedCover(src)}
          />
        ))}
      </div>

      {selectedCover && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedCover(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold z-50"
              onClick={() => setSelectedCover(null)}
            >
              &times;
            </button>
            <img
              src={selectedCover}
              alt="Portada ampliada"
              className="rounded-lg max-h-[90vh] shadow-lg"
              onClick={(e) => e.stopPropagation()} // Evita que al hacer click en la imagen se cierre el modal
            />
          </div>
        </div>
      )}
    </section>
  );
}
