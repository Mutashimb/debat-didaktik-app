// src/components/Spinner.jsx

export default function Spinner() {
  return (
    // Div untuk menengahkan spinner
    <div className="flex justify-center items-center py-16">
      {/* Ini adalah spinner-nya */}
      <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}