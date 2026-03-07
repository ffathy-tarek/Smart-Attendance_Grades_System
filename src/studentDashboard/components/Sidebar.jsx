// src/studentDashboard/components/Sidebar.jsx
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
      alert("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <nav className="w-full bg-[#1E3A8A] text-white">
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">System</h2>
          <ul className="flex items-center space-x-4 sm:space-x-6 list-none p-0 m-0">
            <li>
              <Link 
                to="/student"
                className="text-white hover:text-gray-200 block py-2 px-2 sm:px-3 transition-colors"
              >
                Main
              </Link>
            </li>
            <li>
              <Link to="/student/attendance" className="text-white hover:text-gray-200 block py-2 px-2 sm:px-3 transition-colors">
                Attendance
              </Link>
            </li>
            <li>
              <Link to="/student/grades" className="text-white hover:text-gray-200 block py-2 px-2 sm:px-3 transition-colors">
                Grades
              </Link>
            </li>
            <li>
              <Link to="/student/profile" className="text-white hover:text-gray-200 block py-2 px-2 sm:px-3 transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 block py-2 px-2 sm:px-3 transition-colors"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;