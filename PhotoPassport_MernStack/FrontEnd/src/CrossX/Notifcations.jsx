const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed right-5 bottom-5 bg-red-500 text-white p-3 rounded">
      {message}
    </div>
  );
};

export default Notification;