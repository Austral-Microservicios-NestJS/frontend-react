import { useState, useRef } from "react";
import type { Lead, EstadoLead } from "@/types/lead.interface";
import { LeadCard } from "./LeadCard";

interface KanbanColumnProps {
  title: string;
  leads: Lead[];
  estado: EstadoLead;
  color: string;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onDrop: (leadId: string, nuevoEstado: EstadoLead) => void;
}

export const KanbanColumn = ({
  title,
  leads,
  estado,
  color,
  onEdit,
  onDelete,
  onDrop,
}: KanbanColumnProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("text/plain")) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounter.current = 0;

    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId && leadId !== "") {
      // Solo llamar onDrop si el lead está cambiando de estado
      const lead = leads.find(l => l.idLead === leadId);
      if (!lead || lead.estado !== estado) {
        onDrop(leadId, estado);
      }
    }
    setDraggedLeadId(null);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.stopPropagation();
    setDraggedLeadId(lead.idLead);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.idLead);

    // Crear imagen personalizada para el drag
    const dragImage = document.createElement("div");
    dragImage.className = "bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-4";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-9999px";
    dragImage.style.left = "-9999px";
    dragImage.style.width = "300px";
    dragImage.style.zIndex = "9999";
    dragImage.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 truncate text-sm">${lead.nombre}</p>
          <p class="text-xs text-gray-500">Moviendo lead...</p>
        </div>
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 150, 30);
    setTimeout(() => {
      try {
        document.body.removeChild(dragImage);
      } catch (err) {
        // Ignore error if element already removed
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setIsDraggingOver(false);
    dragCounter.current = 0;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      {/* Header de la columna */}
      <div className={`${color} text-white px-4 py-3 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm">{title}</h2>
          <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Contenido de la columna con área de drop mejorada */}
      <div
        className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-100 transition-all duration-200 ${
          isDraggingOver
            ? "bg-blue-50 border-2 border-dashed border-blue-400 rounded-b-xl"
            : "bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDraggingOver && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-blue-400 rounded-xl bg-blue-100/50 animate-pulse">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <p className="text-sm font-semibold text-blue-700">Suelta aquí para mover</p>
            </div>
          </div>
        )}

        {leads.length === 0 && !isDraggingOver ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p>No hay leads</p>
            </div>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.idLead}
              draggable
              onDragStart={(e) => handleDragStart(e, lead)}
              onDragEnd={handleDragEnd}
              className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
                draggedLeadId === lead.idLead ? "opacity-50 scale-95" : "hover:scale-[1.02]"
              }`}
            >
              <LeadCard lead={lead} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
