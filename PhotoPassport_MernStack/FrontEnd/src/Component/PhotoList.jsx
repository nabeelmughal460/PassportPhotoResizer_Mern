function PhotoList({ photos, setPhotos, setCropImage }) {

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="mt-6 space-y-4">
      {photos.map(photo => (
        <div key={photo.id} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
          
          <img src={photo.preview} className="w-16 h-20 object-cover" />

          <input
            type="number"
            value={photo.copies}
            onChange={(e) => {
              const value = e.target.value;
              setPhotos(prev =>
                prev.map(p =>
                  p.id === photo.id ? { ...p, copies: value } : p
                )
              );
            }}
          />

          <button
            onClick={() => setCropImage(photo.preview)}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Crop
          </button>

          <button
            onClick={() => removePhoto(photo.id)}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Remove
          </button>

        </div>
      ))}
    </div>
  );
}

export default PhotoList;