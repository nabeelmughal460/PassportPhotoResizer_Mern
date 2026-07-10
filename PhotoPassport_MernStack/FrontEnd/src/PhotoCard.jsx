export default function PhotoCard({ photo, onRemove, onCrop, onChangeCopies }) {
  return (
    <div className="flex items-center gap-4 bg-gray-700/60 border border-gray-600 rounded-xl p-4 mb-2">
      <img src={photo.previewUrl} className="w-16 h-20 object-cover rounded" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-200 truncate">{photo.originalFile.name}</p>
        <p className="text-xs text-gray-400">{photo.croppedFile ? "✅ Cropped" : "⚠️ Not cropped"}</p>
      </div>
      <input
        type="number"
        value={photo.copies}
        min={1}
        max={54}
        onChange={(e) => onChangeCopies(Number(e.target.value))}
        className="w-16 bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 ring-blue-500 text-white text-center rounded"
      />
      <button onClick={onCrop} className="bg-blue-500/20 hover:bg-blue-500/40 px-3 py-1 rounded text-blue-300 text-xs">Crop</button>
      <button onClick={onRemove} className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded text-red-400 text-xs">Remove</button>
    </div>
    // w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 ring-blue-500 outline-none mt-1 transition-all
  );
}