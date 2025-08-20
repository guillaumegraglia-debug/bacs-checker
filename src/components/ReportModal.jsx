import React from "react";
import Button from "./Button";
import { jsPDF } from "jspdf";

export default function ReportModal({ open, onClose, text }) {
  if (!open) return null;

  const exportPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text || "", 180);
    doc.text(lines, 10, 10);
    doc.save("rapport-bacs.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4">Rapport généré</h3>
        <div className="overflow-y-auto max-h-60 mb-4 whitespace-pre-wrap text-sm">
          {text}
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={exportPDF}>Exporter PDF</Button>
          <Button className="bg-secondary hover:bg-primary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
