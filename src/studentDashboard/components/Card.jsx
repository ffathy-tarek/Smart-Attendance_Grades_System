// src/studentDashboard/components/Card.jsx
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export default Card;