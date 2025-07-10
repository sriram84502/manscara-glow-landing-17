
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SaveAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  addressType: 'shipping' | 'billing';
}

const SaveAddressDialog: React.FC<SaveAddressDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  addressType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save {addressType} address?</DialogTitle>
          <DialogDescription>
            Would you like to save this {addressType} address to your account for future orders?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            No, just use for this order
          </Button>
          <Button onClick={() => {
            onSave();
            onClose();
          }}>
            Yes, save address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAddressDialog;
