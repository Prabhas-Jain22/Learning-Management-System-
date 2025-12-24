import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");

  const handleRecentSearch = (query) => {
    navigate(`/courses?search=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Courses</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses, instructors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
            <Button type="submit">Search</Button>
          </div>

          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recent Searches
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group"
                  >
                    <span>{search}</span>
                    <Search className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
