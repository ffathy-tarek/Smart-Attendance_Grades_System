// src/studentDashboard/components/Button.jsx
function Button({ children, variant = "primary", type = "button", onClick }) {
  const baseClasses = "px-4 py-2 rounded border-none cursor-pointer text-sm transition-all duration-300";
  
  const variants = {
    primary: "bg-[#1E3A8A] text-white hover:bg-[#2563EB]",
    secondary: "bg-[#E2E8F0] text-[#1E293B] hover:bg-[#CBD5E1]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary}`}
    >
      {children}
    </button>
  );
}

export default Button;