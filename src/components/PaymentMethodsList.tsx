
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreditCard, Trash2, CheckCircle, PlusCircle } from "lucide-react";
import { SavedPaymentMethod } from "@/utils/addressUtils";

interface PaymentMethodsListProps {
  paymentMethods: SavedPaymentMethod[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const PaymentMethodsList = ({ 
  paymentMethods, 
  onSetDefault, 
  onDelete, 
  onAddNew 
}: PaymentMethodsListProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedPaymentId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPaymentId) {
      onDelete(selectedPaymentId);
      setDeleteConfirmOpen(false);
      setSelectedPaymentId(null);
    }
  };

  return (
    <div className="space-y-6">
      {paymentMethods.length === 0 ? (
        <div className="text-center py-10">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No payment methods</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first payment method to make checkout faster.
          </p>
          <div className="mt-6">
            <Button onClick={onAddNew} className="bg-manscara-black hover:bg-black text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>
      ) : (
        <>
          {paymentMethods.map((method) => (
            <Card key={method.id} className={`border ${method.isDefault ? 'border-blue-500 shadow-blue-100' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <h3 className="font-medium">•••• {method.lastFour}</h3>
                      <p className="text-sm text-gray-500">{method.nameOnCard}</p>
                      <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                    </div>
                    {method.isDefault && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(method.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      disabled={method.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {!method.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSetDefault(method.id)}
                    className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Set as default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={onAddNew} 
            variant="outline" 
            className="flex items-center w-full justify-center py-6 border-dashed"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentMethodsList;
