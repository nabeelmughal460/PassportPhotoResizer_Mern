import emailjs from "emailjs-com";

const FeedbackModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    emailjs.send("service_id", "template_id", {
      contact: form.contact.value,
      message: form.message.value,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded">
        <input name="contact" placeholder="Contact" />
        <textarea name="message" placeholder="Message" />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default FeedbackModal;