// src/studentDashboard/components/Input.jsx
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm text-gray-600">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
      />
    </div>
  );
}

export default Input;