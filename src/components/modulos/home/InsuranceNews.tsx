import { Card } from "@/components/ui/card";
import {
  Newspaper,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock data
const newsData = [
  {
    id: 1,
    source: "La Positiva",
    title: "Nuevos beneficios en seguro vehicular",
    date: "Hace 2 días",
    image:
      "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
  {
    id: 2,
    source: "Rimac Seguros",
    title: "Lanzamiento de seguro de salud internacional",
    date: "Hace 5 días",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
  {
    id: 3,
    source: "Pacífico",
    title: "Cobertura extendida para hogar",
    date: "Hace 1 semana",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
];

export const InsuranceNews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % newsData.length);
      setIsAnimating(false);
    }, 300); // Half of the transition duration
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + newsData.length) % newsData.length);
      setIsAnimating(false);
    }, 300);
  };

  const currentNews = newsData[currentIndex];

  return (
    <Card
      className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all overflow-hidden relative group bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Zoom Effect */}
      <div
        key={currentNews.image}
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
          isAnimating ? "opacity-50 scale-105" : "opacity-100 scale-100"
        } group-hover:scale-110`}
        style={{ backgroundImage: `url(${currentNews.image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

      {/* Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header Badge */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg">
            <Newspaper className="w-4 h-4" />
            <span className="font-semibold text-lg ml-1">
              Noticias del Sector
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <span>{currentNews.source}</span>
            <span className="w-1 h-1 rounded-full bg-blue-200" />
            <span>{currentNews.date}</span>
          </div>

          <h3 className="text-base font-bold text-white leading-tight line-clamp-3 drop-shadow-md">
            {currentNews.title}
          </h3>

          <a
            href={currentNews.url}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition-colors group/link mt-1"
          >
            Leer noticia completa
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            handlePrev();
          }}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-white/30"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10 hover:border-white/30"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute top-4 right-4 flex gap-1">
        {newsData.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </Card>
  );
};
