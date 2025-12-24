import { GraduationCap, TvMinimalPlay, Search, Moon, Sun, BookOpen } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled in localStorage
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  function toggleDarkMode() {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b relative gap-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <Link to="/home" className="flex items-center hover:text-black dark:hover:text-white">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS LEARN
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-[14px] md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/library")}
            className="text-[14px] md:text-[16px] font-medium"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Library
          </Button>
        </div>
      </div>
      
      {/* Search Bar with Button */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <Button type="submit" size="icon" className="shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="relative"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div
            onClick={() => navigate("/my-books")}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="font-medium md:text-base text-[14px]">
              My Books
            </span>
            <BookOpen className="w-6 h-6 cursor-pointer" />
          </div>
          
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="font-extrabold md:text-xl text-[14px]">
              My Courses
            </span>
            <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
          </div>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
