import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus } from "lucide-react";
import AddressList from "./AddressList";
import { Address } from "@/types/user";
import addressService from "@/services/addressService";

const AddressTab = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India", // Default to India
    phone: "",
    isPrimary: false
  });

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const addressesData = await addressService.getAddresses();
        setAddresses(addressesData);
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
        toast({
          title: "Error loading addresses",
          description: error.message || "Failed to load addresses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [toast]);

  const handleAddNewAddress = async () => {
    try {
      // If this is the first address, set it as primary
      if (addresses.length === 0) {
        newAddress.isPrimary = true;
      }
      
      const addedAddress = await addressService.addAddress(newAddress);
      
      // Update local state with the new address
      setAddresses(prev => {
        // If the new address is primary, update all others to not be primary
        if (addedAddress.isPrimary) {
          return [
            addedAddress,
            ...prev.map(addr => ({ ...addr, isPrimary: false }))
          ];
        }
        return [...prev, addedAddress];
      });
      
      // Reset form
      setNewAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India", // Default to India
        phone: "",
        isPrimary: false
      });
      
      setShowNewAddressForm(false);
      
      toast({
        title: "Address Added",
        description: "Your new address has been added successfully.",
      });
    } catch (error: any) {
      console.error("Error adding address:", error);
      toast({
        title: "Failed to Add Address",
        description: error.message || "There was an error adding your address.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAddress = async (addressId: string, updatedData: Partial<Address>) => {
    try {
      const updatedAddress = await addressService.updateAddress(addressId, updatedData);
      
      setAddresses(prev => {
        // If the updated address is primary, update all others to not be primary
        if (updatedAddress.isPrimary) {
          return prev.map(addr => 
            addr.id === addressId ? updatedAddress : { ...addr, isPrimary: false }
          );
        }
        return prev.map(addr => addr.id === addressId ? updatedAddress : addr);
      });
      
      setEditingAddress(null);
      
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your address.",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    try {
      await addressService.setPrimaryAddress(addressId);
      
      // Update local state to reflect the changes
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isPrimary: addr.id === addressId
        }))
      );
      
      toast({
        title: "Primary Address Updated",
        description: "Your primary address has been updated.",
      });
    } catch (error: any) {
      console.error("Error setting primary address:", error);
      toast({
        title: "Failed to Set Primary",
        description: error.message || "Failed to set your primary address.",
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by the component
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await addressService.deleteAddress(addressId);
      
      // Update local state
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      toast({
        title: "Address Removed",
        description: "The selected address has been removed.",
      });
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast({
        title: "Failed to Delete",
        description: error.message || "Failed to delete the address.",
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by the component
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">My Addresses</h2>
          {!showNewAddressForm && !editingAddress && (
            <Button 
              variant="outline" 
              onClick={() => setShowNewAddressForm(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          )}
        </div>
        
        {showNewAddressForm && (
          <Card className="mb-6 border border-dashed border-gray-300">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Add New Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Address Name</Label>
                  <Input 
                    id="new-name"
                    placeholder="Home, Work, etc." 
                    value={newAddress.name} 
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-phone">Phone</Label>
                  <Input 
                    id="new-phone"
                    placeholder="Phone number" 
                    value={newAddress.phone} 
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="new-street">House Number, Building Name</Label>
                  <Input 
                    id="new-street"
                    placeholder="House number, building name" 
                    value={newAddress.street} 
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-city">City</Label>
                  <Input 
                    id="new-city"
                    placeholder="City" 
                    value={newAddress.city} 
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-state">Road Name, Area, Colony</Label>
                  <Input 
                    id="new-state"
                    placeholder="Road name, area, colony" 
                    value={newAddress.state} 
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-zipCode">Pin Code</Label>
                  <Input 
                    id="new-zipCode"
                    placeholder="Pin code" 
                    value={newAddress.zipCode} 
                    onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                  />
                </div>
                {/* Country field hidden and defaulted to India */}
                <input 
                  type="hidden" 
                  value="India" 
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                />
              </div>
              <div className="mt-4 flex space-x-3">
                <Button 
                  onClick={handleAddNewAddress} 
                  className="bg-manscara-black hover:bg-black"
                  disabled={
                    !newAddress.name || 
                    !newAddress.street || 
                    !newAddress.city || 
                    !newAddress.state || 
                    !newAddress.zipCode
                  }
                >
                  Add Address
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {editingAddress && (
          <Card className="mb-6 border border-dashed border-blue-300">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Edit Address</h3>
              {(() => {
                const address = addresses.find(a => a.id === editingAddress);
                if (!address) return null;
                
                const [editedAddress, setEditedAddress] = useState<Address>({...address, country: address.country || "India"});
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Address Name</Label>
                        <Input 
                          id="edit-name"
                          value={editedAddress.name} 
                          onChange={(e) => setEditedAddress({...editedAddress, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input 
                          id="edit-phone"
                          value={editedAddress.phone} 
                          onChange={(e) => setEditedAddress({...editedAddress, phone: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="edit-street">House Number, Building Name</Label>
                        <Input 
                          id="edit-street"
                          value={editedAddress.street} 
                          onChange={(e) => setEditedAddress({...editedAddress, street: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-city">City</Label>
                        <Input 
                          id="edit-city"
                          value={editedAddress.city} 
                          onChange={(e) => setEditedAddress({...editedAddress, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-state">Road Name, Area, Colony</Label>
                        <Input 
                          id="edit-state"
                          value={editedAddress.state} 
                          onChange={(e) => setEditedAddress({...editedAddress, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-zipCode">Pin Code</Label>
                        <Input 
                          id="edit-zipCode"
                          value={editedAddress.zipCode} 
                          onChange={(e) => setEditedAddress({...editedAddress, zipCode: e.target.value})}
                        />
                      </div>
                      {/* Country field hidden and defaulted to India */}
                      <input 
                        type="hidden" 
                        value="India"
                        onChange={(e) => setEditedAddress({...editedAddress, country: e.target.value})}
                      />
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button 
                        onClick={() => handleUpdateAddress(editingAddress, editedAddress)}
                        className="bg-manscara-black hover:bg-black"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingAddress(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        )}
        
        {!showNewAddressForm && !editingAddress && (
          <div className="space-y-6">
            {isLoading || addresses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-medium mb-2">
                  {isLoading ? "Loading addresses..." : "No addresses found"}
                </h3>
                {!isLoading && (
                  <>
                    <p className="text-gray-500 mb-4">You haven't added any addresses yet.</p>
                    <Button 
                      onClick={() => setShowNewAddressForm(true)}
                      className="bg-manscara-black hover:bg-black"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <AddressList 
                addresses={addresses} 
                onSetPrimary={handleSetPrimary}
                onDelete={handleDeleteAddress}
                onEdit={setEditingAddress}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressTab;
