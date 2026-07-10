const PhotoCard = ({ photo, onRemove, onCrop, onCopiesChange }) => {
  return (
    <div className="flex gap-4 bg-gray-800 p-4 rounded-lg">
      <img src={photo.previewUrl} className="w-16 h-20 object-cover" />

      <div className="flex-1">
        <p>{photo.originalFile.name}</p>
        <p>{photo.croppedFile ? "Cropped" : "Not Cropped"}</p>
      </div>

      <input
        type="number"
        value={photo.copies}
        onChange={(e) => onCopiesChange(photo.id, e.target.value)}
      />

      <button onClick={() => onCrop(photo.id)}>Crop</button>
      <button onClick={() => onRemove(photo.id)}>Remove</button>
    </div>
  );
};

export default PhotoCard;