import { useRef } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropperModal = ({ image, onClose, onCrop }) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 480,
    });

    canvas.toBlob((blob) => {
      onCrop(blob);
    });
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <div className="bg-gray-800 p-4 rounded-lg">
        <Cropper
          src={image}
          aspectRatio={384 / 472}
          ref={cropperRef}
        />

        <div className="flex gap-3 mt-4">
          <button onClick={handleCrop}>Crop</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;