function DropZone({ addFiles }) {
  return (
    <div
      onClick={() => document.getElementById("fileInput").click()}
      className="border-2 border-dashed border-gray-600 p-8 text-center rounded-lg cursor-pointer"
    >
      <input
        id="fileInput"
        type="file"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
      <p>Click or Drag Images</p>
    </div>
  );
}

export default DropZone;