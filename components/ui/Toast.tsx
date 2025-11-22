

interface SaveToastProps {
show: boolean;
onSave: ()=> void

}
export default function SaveToast({ show, onSave }: SaveToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-neutral-800 text-white px-4 py-3 rounded shadow-lg border border-neutral-700 
                    flex items-center gap-4 animate-fade">
      <span className="text-sm">Tienes cambios sin guardar</span>

      <button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm"
      >
        Guardar
      </button>

      <style jsx>{`
        .animate-fade {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}