import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Edit, Trash2 } from "lucide-react";
import { deleteBookService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { EditBookDialog } from "./EditBookDialog";

export function BookCard({ book, onIssue, onUpdate }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await deleteBookService(book._id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
        onUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
            </div>
            {book.bookImage ? (
              <img
                src={book.bookImage}
                alt={book.title}
                className="w-16 h-20 object-cover rounded ml-2"
              />
            ) : (
              <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center ml-2">
                <Book className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Category:</span>
              <Badge variant="secondary">{book.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ISBN:</span>
              <span className="font-mono">{book.isbn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Available:</span>
              <span className={book.availableCopies > 0 ? "text-green-600 font-semibold" : "text-red-600"}>
                {book.availableCopies} / {book.totalCopies}
              </span>
            </div>
            {book.publisher && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Publisher:</span>
                <span className="text-xs">{book.publisher}</span>
              </div>
            )}
            {book.publishedYear && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Year:</span>
                <span>{book.publishedYear}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => onIssue(book._id)}
            disabled={book.availableCopies === 0}
            className="flex-1"
          >
            {book.availableCopies === 0 ? "Not Available" : "Issue Book"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <EditBookDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        book={book}
        onSuccess={onUpdate}
      />
    </>
  );
}
