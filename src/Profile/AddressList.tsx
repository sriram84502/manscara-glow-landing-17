
import { Address } from "../types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Edit3, Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressListProps {
  addresses: Address[];
  onSetPrimary: (addressId: string) => Promise<void>;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => Promise<void>;
  isLoading?: boolean;
}

const AddressList = ({ 
  addresses, 
  onSetPrimary, 
  onEdit, 
  onDelete,
  isLoading = false 
}: AddressListProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="py-4 text-center">
          <p>Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-4 text-center">
          <p>You have no saved addresses.</p>
        </div>
      ) : (
        addresses.map((address) => (
          <Card key={address.id} className={`border ${address.isPrimary ? 'border-blue-500 shadow-blue-100' : ''}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <h3 className="font-medium">{address.name}</h3>
                  {address.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(address.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        await onDelete(address.id);
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to delete address",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={address.isPrimary}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600">
                  {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  <Phone className="h-3 w-3 inline-block mr-1" /> {address.phone}
                </p>
                
                {!address.isPrimary && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        await onSetPrimary(address.id);
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to set as primary address",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Set as primary address
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AddressList;
