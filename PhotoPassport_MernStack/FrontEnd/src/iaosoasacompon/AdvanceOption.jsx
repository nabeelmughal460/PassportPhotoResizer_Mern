const AdvancedOptions = ({ options, setOptions }) => {
  const handleChange = (field, value) => {
    setOptions({ ...options, [field]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {["width", "height", "spacing", "border"].map((field) => (
        <input
          key={field}
          type="number"
          value={options[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ))}
    </div>
  );
};

export default AdvancedOptions;