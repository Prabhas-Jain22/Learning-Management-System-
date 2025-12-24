import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Plus } from "lucide-react";
import { getAllBooksService, issueBookService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { AddBookDialog } from "@/components/library/AddBookDialog";
import { BookCard } from "@/components/library/BookCard";

export default function LibraryBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();

  const categories = ["Programming", "Science", "Mathematics", "History", "Fiction", "Non-Fiction", "Technology", "Business"];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getAllBooksService(searchQuery, category);
      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, category]);

  const handleIssueBook = async (bookId) => {
    if (!auth?.user?._id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to issue books",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await issueBookService({
        bookId,
        userId: auth.user._id,
        userName: auth.user.userName,
        userEmail: auth.user.userEmail,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Book issued successfully!",
        });
        fetchBooks();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to issue book",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to issue book",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Library - Books Collection
          </h1>
          <p className="text-gray-500 mt-1">Browse and issue books from our collection</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={category === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory("")}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-10">Loading books...</div>
      ) : books.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No books found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onIssue={handleIssueBook}
              onUpdate={fetchBooks}
            />
          ))}
        </div>
      )}

      <AddBookDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={fetchBooks}
      />
    </div>
  );
}
