import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "./SignOutButton";

export default function Header() {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6 ">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to={"/"}>MernHolidays.coms</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link to={"/my-bookings"}>My Bookings</Link>
              <Link to={"/my-hotels"}>My Hotels</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                className="flex items-center text-blue-500 px-3 font-bold bg-white hover:bg-gray-200"
                to={"/sign-in"}
              >
                Sign In
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
