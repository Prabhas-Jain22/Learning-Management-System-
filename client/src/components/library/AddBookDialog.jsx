import { useState } from "react";
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
import { addBookService } from "@/services";
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

export function AddBookDialog({ open, onClose, onSuccess }) {
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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

      const response = await addBookService(bookData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Book added successfully",
        });
        // Reset form
        setFormData({
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
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add book",
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
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">
                ISBN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="Enter ISBN"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter book description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
                placeholder="Enter publisher name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
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
              <Label htmlFor="totalCopies">
                Total Copies <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={(e) => handleChange("totalCopies", e.target.value)}
                placeholder="Enter number of copies"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
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
            <Label htmlFor="bookImage">Book Cover Image URL</Label>
            <Input
              id="bookImage"
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
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
