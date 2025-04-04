
export default function Navbar() {
    return (
      <div className="navbar bg-[#1E293B] shadow-md px-4 md:px-8">
        <div className="flex-1">
          <a className="text-2xl font-bold text-[#FACC15] hover:text-[#EAB308] transition-colors duration-300">
            QuizApp
          </a>
        </div>
        <div className="flex-none flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border-2 border-[#FACC15] hover:border-[#EAB308] transition duration-300">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#334155] rounded-box shadow-lg z-10 mt-3 w-52 p-2 border border-gray-500">
              <li>
                <a className="justify-between text-[#F8FAFC] hover:text-[#FACC15] transition duration-300">
                  Profile
                </a>
              </li>
              <li>
                <a className="text-[#F8FAFC] hover:text-[#FACC15] transition duration-300">Settings</a>
              </li>
              <li>
                <a className="text-[#F8FAFC] hover:text-[#FACC15] transition duration-300">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  