import PhotoCard from "./PhotoCard";

const PhotoList = (props) => {
  const { photos } = props;

  return (
    <div className="space-y-3">
      {photos.map((p) => (
        <PhotoCard key={p.id} {...props} photo={p} />
      ))}
    </div>
  );
};

export default PhotoList;