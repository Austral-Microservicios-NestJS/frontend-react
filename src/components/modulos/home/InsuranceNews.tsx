import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";

// Mock data remains the same
const newsData = [
  {
    id: 1,
    source: "La Positiva",
    title: "Nuevos beneficios en seguro vehicular",
    date: "Hace 2 días",
    image:
      "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200",
    url: "#",
  },
  {
    id: 2,
    source: "Rimac Seguros",
    title: "Lanzamiento de seguro de salud internacional",
    date: "Hace 5 días",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200",
    url: "#",
  },
  {
    id: 3,
    source: "Pacífico",
    title: "Cobertura extendida para hogar",
    date: "Hace 1 semana",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200",
    url: "#",
  },
];

export const InsuranceNews = () => {
  return (
    <Card className="border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[--austral-azul] rounded-md">
            <Newspaper className="w-4 h-4" />
          </div>
          Noticias del Sector
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {newsData.map((news) => (
            <a
              key={news.id}
              href={news.url}
              className="flex gap-3 group items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div
                className="w-14 h-14 rounded-md bg-gray-100 bg-cover bg-center shrink-0 border border-gray-200"
                style={{ backgroundImage: `url(${news.image})` }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-[--austral-azul] uppercase tracking-wide mb-0.5 block">
                  {news.source}
                </span>
                <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1 group-hover:text-[--austral-azul] transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{news.date}</span>
                  <ExternalLink className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
