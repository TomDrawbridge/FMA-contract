"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PackagesComparison } from "./packages-comparison"

interface PackageSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onPackageSelect: (packageName: string, quantity: number, totalPrice: number, discountAmount: number) => void
}

export function PackageSelectionModal({ isOpen, onClose, onPackageSelect }: PackageSelectionModalProps) {
  const handlePackageSelect = (packageName: string, quantity: number, totalPrice: number, discountAmount: number) => {
    onPackageSelect(packageName, quantity, totalPrice, discountAmount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Select Membership Package</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-y-auto">
          <PackagesComparison onPackageSelect={handlePackageSelect} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
