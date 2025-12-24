import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookService } from "@/services";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Programming",
  "Science",
  "Mathematics",
  "Literature",
  "History",
  "Technology",
  "Business",
  "Arts",
  "Other",
];

export function EditBookDialog({ open, onClose, book, onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    publisher: "",
    publishedYear: "",
    totalCopies: "",
    bookImage: "",
    price: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        description: book.description || "",
        publisher: book.publisher || "",
        publishedYear: book.publishedYear?.toString() || "",
        totalCopies: book.totalCopies?.toString() || "",
        bookImage: book.bookImage || "",
        price: book.price?.toString() || "",
      });
    }
  }, [book]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.isbn || !formData.category || !formData.totalCopies) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies),
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        price: formData.price ? parseFloat(formData.price) : 0,
      };

      const response = await updateBookService(book._id, bookData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-isbn">
                ISBN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="Enter ISBN"
                required
                disabled
              />
              <p className="text-xs text-gray-500">ISBN cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter book description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-publisher">Publisher</Label>
              <Input
                id="edit-publisher"
                value={formData.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
                placeholder="Enter publisher name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-publishedYear">Published Year</Label>
              <Input
                id="edit-publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={(e) => handleChange("publishedYear", e.target.value)}
                placeholder="e.g., 2024"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-totalCopies">
                Total Copies <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={(e) => handleChange("totalCopies", e.target.value)}
                placeholder="Enter number of copies"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Enter price"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bookImage">Book Cover Image URL</Label>
            <Input
              id="edit-bookImage"
              type="url"
              value={formData.bookImage}
              onChange={(e) => handleChange("bookImage", e.target.value)}
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
