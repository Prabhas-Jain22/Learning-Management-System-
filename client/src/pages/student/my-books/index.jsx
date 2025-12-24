import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, AlertCircle, CreditCard } from "lucide-react";
import {
  getUserIssuedBooksService,
  getUserPendingFinesService,
  returnBookService,
} from "@/services";
import { useToast } from "@/hooks/use-toast";
import { FinePaymentDialog } from "@/components/library/FinePaymentDialog";

export default function MyBooksPage() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [pendingFines, setPendingFines] = useState([]);
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!auth?.user?._id) return;

    setLoading(true);
    try {
      const [issuedResponse, finesResponse] = await Promise.all([
        getUserIssuedBooksService(auth.user._id),
        getUserPendingFinesService(auth.user._id),
      ]);

      if (issuedResponse.success) {
        setIssuedBooks(issuedResponse.data);
      }

      if (finesResponse.success) {
        setPendingFines(finesResponse.data.fines);
        setTotalFine(finesResponse.data.totalFine);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth]);

  const handleReturnBook = async (issueId) => {
    try {
      const response = await returnBookService(issueId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-8 w-8" />
        My Issued Books
      </h1>

      {/* Pending Fines Alert */}
      {totalFine > 0 && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    You have pending fines!
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Total fine amount: ₹{totalFine}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Fines
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issued Books */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : issuedBooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">You haven't issued any books yet</p>
            <Button className="mt-4" onClick={() => (window.location.href = "/library")}>
              Browse Books
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issuedBooks.map((issue) => {
            const daysUntilDue = getDaysUntilDue(issue.dueDate);
            const isOverdue = daysUntilDue < 0;

            return (
              <Card key={issue._id} className={isOverdue ? "border-red-300" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{issue.bookTitle}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">by {issue.bookAuthor}</p>
                    </div>
                    <Badge variant={isOverdue ? "destructive" : issue.status === "overdue" ? "destructive" : "default"}>
                      {issue.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Issued: {formatDate(issue.issueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}>
                        Due: {formatDate(issue.dueDate)}
                      </span>
                    </div>
                  </div>

                  {isOverdue && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        Overdue by {Math.abs(daysUntilDue)} days - Fine: ₹{issue.fine || Math.abs(daysUntilDue) * 10}
                      </p>
                    </div>
                  )}

                  {!isOverdue && daysUntilDue <= 3 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Due in {daysUntilDue} {daysUntilDue === 1 ? "day" : "days"}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleReturnBook(issue._id)}
                    variant={isOverdue ? "destructive" : "default"}
                    className="w-full"
                  >
                    Return Book
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <FinePaymentDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        pendingFines={pendingFines}
        totalFine={totalFine}
        userId={auth?.user?._id}
        userName={auth?.user?.userName}
        userEmail={auth?.user?.userEmail}
        onSuccess={fetchData}
      />
    </div>
  );
}
