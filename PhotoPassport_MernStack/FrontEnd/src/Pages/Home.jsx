import { useState } from "react";
import Header from "../iaosoasacompon/Header";
import DropZone from "../iaosoasacompon/DropZone";
import PhotoList from "../iaosoasacompon/PhotoList";

const Home = () => {
  const [photos, setPhotos] = useState([]);

  const addFiles = (files) => {
    const newPhotos = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      copies: 6,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-900">
        <DropZone onFiles={addFiles} />
        <PhotoList photos={photos} onRemove={removePhoto} />
      </div>
    </>
  );
};

export default Home;