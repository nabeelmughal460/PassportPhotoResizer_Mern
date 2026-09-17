const DropZone = ({ onFiles }) => {
  const handleFiles = (e) => {
    onFiles(e.target.files);
  };

  return (
    <div className="border-2 border-dashed p-8 text-center bg-amber-950">
      <input
        type="file"
        multiple
        onChange={handleFiles}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        Upload Photos
      </label>
    </div>
  );
};

export default DropZone;