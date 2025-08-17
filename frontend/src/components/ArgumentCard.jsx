// src/components/ArgumentCard.jsx

function ArgumentCard({ argument, isProSide, onTagClick }) {
  // Menentukan gaya berdasarkan sisi (PRO atau KONTRA)
  const cardAlignment = isProSide ? 'justify-start' : 'justify-end';
  const bubbleColor = isProSide ? 'bg-gray-700/50' : 'bg-blue-900/40';
  const textAlign = isProSide ? 'text-left' : 'text-right';

  return (
    <div className={`flex items-start gap-4 ${cardAlignment} my-4`}>
      {/* Avatar Placeholder */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white text-xl">
        {argument.pengguna.charAt(0).toUpperCase()}
      </div>

      {/* Konten Argumen */}
      <div className={`flex flex-col w-full max-w-xl p-4 border border-gray-700 rounded-lg ${bubbleColor}`}>
        <div className={`flex items-center justify-between pb-2 border-b border-gray-600 ${textAlign}`}>
          <p className="text-sm text-secondary">
            Ronde {argument.ronde}
          </p>
          <p className="text-lg font-semibold text-white">
            {argument.pengguna}
          </p>
        </div>

        <div className={`mt-2 ${textAlign}`}>
          <h4 className="font-bold text-accent">Klaim:</h4>
          <p className="text-secondary">{argument.klaim}</p>
          
          <h4 className="font-bold text-accent mt-3">Bukti:</h4>
          <p className="text-secondary">{argument.bukti}</p>

          <h4 className="font-bold text-accent mt-3">Jaminan:</h4>
          <p className="text-secondary">{argument.jaminan}</p>
          <div className={`mt-4 pt-3 border-t border-gray-600 flex justify-between items-center`}>

          <div>
            {argument.taggedfallacy_set && argument.taggedfallacy_set.map((tag, index) => (
              <div key={index} className="relative group">
                <span key={index} className="inline-block bg-red-900/50 text-red-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full border border-red-700">
                  Tagged as "{tag.fallacy_name}" by {tag.tagged_by}
                </span>
                <div className="absolute bottom-full mb-2 w-72 p-3 bg-primary border border-gray-600 rounded-lg shadow-lg text-sm text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <h5 className="font-bold text-accent">{tag.fallacy_name}</h5>
                  <p className="italic text-gray-400 mb-2">"{tag.fallacy_description}"</p>
                  {/* Tampilkan justifikasi jika ada */}
                  {/* Tampilkan justifikasi jika ada */}
                  {tag.justification && (
                    <>
                      <hr className="border-gray-600 my-1" />
                      <p className="font-semibold mt-2">Justifikasi:</p>
                      <p>{tag.justification}</p>
                    </>
                  )}
                </div>
              </div>              
            ))}
          </div>
          <button 
            onClick={() => onTagClick(argument.id)} 
            className="text-xs text-gray-400 hover:text-accent transition-colors flex-shrink-0 ml-4">
            Tandai Falasi
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArgumentCard;