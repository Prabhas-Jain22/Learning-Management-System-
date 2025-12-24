import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, IndianRupee } from "lucide-react";

export function FinePaymentDialog({ 
  open, 
  onClose, 
  pendingFines = [], 
  totalFine = 0,
  userId,
  userName,
  userEmail,
  onSuccess 
}) {
  const { toast } = useToast();
  const { handleRazorpayPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const handlePayFines = async () => {
    if (totalFine <= 0) {
      toast({
        title: "No Fines",
        description: "There are no pending fines to pay",
      });
      return;
    }

    setLoading(true);
    try {
      const issueIds = pendingFines.map(issue => issue._id);
      
      await handleRazorpayPayment(
        totalFine,
        userId,
        userName,
        userEmail,
        "Library Fines Payment",
        "fine",
        issueIds
      );

      toast({
        title: "Payment Successful",
        description: `Successfully paid ₹${totalFine} in fines`,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
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
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Pay Library Fines
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total Fine Card */}
          <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Fine Amount</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" />
                  {totalFine.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Books</p>
                <p className="text-2xl font-semibold">{pendingFines.length}</p>
              </div>
            </div>
          </Card>

          {/* Fine Details */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Fine Breakdown</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pendingFines.map((issue) => (
                <Card key={issue._id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{issue.bookId?.title}</p>
                      <p className="text-sm text-gray-500">by {issue.bookId?.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600 flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {issue.fine.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.ceil((new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24))} days late
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Payment Information</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                  <li>Fine rate: ₹10 per day after due date</li>
                  <li>Payment will be processed via Razorpay</li>
                  <li>You can return books after paying fines</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayFines} 
            disabled={loading || totalFine <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Processing..." : `Pay ₹${totalFine.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
