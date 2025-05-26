"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X, Info, Plus, Minus, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface PackagesComparisonProps {
  showBackButton?: boolean
  onPackageSelect?: (packageName: string, quantity: number, totalPrice: number, discountAmount: number) => void
}

interface SelectedPackage {
  name: string
  price: number
  quantity: number
}

export function PackagesComparison({ showBackButton = false, onPackageSelect }: PackagesComparisonProps) {
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const packages = [
    {
      name: "Bronze",
      price: 40,
      colors: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        price: "text-amber-700",
        subtitle: "text-amber-600",
      },
    },
    {
      name: "Silver",
      price: 45,
      colors: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-800",
        price: "text-gray-700",
        subtitle: "text-gray-600",
      },
    },
    {
      name: "Gold",
      price: 50,
      colors: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        price: "text-yellow-700",
        subtitle: "text-yellow-600",
      },
    },
    {
      name: "Platinum",
      price: 58,
      colors: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800",
        price: "text-purple-700",
        subtitle: "text-purple-600",
      },
    },
  ]

  const handlePackageSelect = (packageName: string, price: number) => {
    setSelectedPackage({
      name: packageName,
      price: price,
      quantity: 1,
    })
  }

  const updateQuantity = (change: number) => {
    if (!selectedPackage) return

    const newQuantity = Math.max(1, Math.min(21, selectedPackage.quantity + change))
    setSelectedPackage({
      ...selectedPackage,
      quantity: newQuantity,
    })
  }

  const calculatePricing = () => {
    if (!selectedPackage) return { total: 0, discount: 0, finalTotal: 0 }

    const { price, quantity } = selectedPackage
    const fullPriceTotal = price * quantity

    // First package at full price, additional packages get 10% discount
    const firstPackagePrice = price
    const additionalPackages = quantity - 1
    const discountedPackagePrice = price * 0.9 // 10% discount
    const additionalPackagesTotal = additionalPackages * discountedPackagePrice

    const finalTotal = firstPackagePrice + additionalPackagesTotal
    const discount = fullPriceTotal - finalTotal

    return {
      total: fullPriceTotal,
      discount: discount,
      finalTotal: finalTotal,
    }
  }

  const handleConfirmSelection = () => {
    if (!selectedPackage || !onPackageSelect) return

    const pricing = calculatePricing()
    onPackageSelect(selectedPackage.name, selectedPackage.quantity, pricing.finalTotal, pricing.discount)
  }

  const pricing = calculatePricing()

  // Auto-scroll to bottom when package selection changes
  useEffect(() => {
    if (selectedPackage && scrollContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated, then add a small delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const scrollContainer = scrollContainerRef.current
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
        }, 50) // Small delay to ensure order summary is rendered
      })
    }
  }, [selectedPackage]) // Updated to use the entire selectedPackage object

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="border shadow-sm">
        <CardHeader className="pb-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Monthly Membership Packages</h1>
            <p className="text-muted-foreground">Compare our membership options to find the perfect fit for you</p>

            <Alert className="text-left">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Monthly packages include one class per week. For additional classes, you can add extra packages and
                receive a multi-package discount.
              </AlertDescription>
            </Alert>
          </div>
        </CardHeader>

        <CardContent className="px-0 flex-1 flex flex-col min-h-0">
          <div ref={scrollContainerRef} className="flex-1 overflow-x-auto overflow-y-auto px-4">
            <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
              <colgroup>
                <col style={{ width: "20%", minWidth: "160px" }} />
                <col style={{ width: "20%", minWidth: "160px" }} />
                <col style={{ width: "20%", minWidth: "160px" }} />
                <col style={{ width: "20%", minWidth: "160px" }} />
                <col style={{ width: "20%", minWidth: "160px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="p-3 text-left border-b-2 border-gray-200"></th>
                  {packages.map((pkg) => (
                    <th key={pkg.name} className="p-3 text-center border-b-2 border-gray-200">
                      <div className={`rounded-md ${pkg.colors.bg} p-2 border ${pkg.colors.border}`}>
                        <div className={`text-lg font-bold ${pkg.colors.text}`}>{pkg.name}</div>
                        <div className={`text-base font-semibold ${pkg.colors.price}`}>£{pkg.price}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs ${pkg.colors.subtitle} mt-1 font-normal cursor-help inline-flex flex-wrap items-end justify-center gap-1`}
                            >
                              <span>+ annual subscription fee</span>
                              <HelpCircle className="h-3 w-3 flex-shrink-0" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>You can choose your membership plan in the next steps</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">Additional Classes</td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-sm">Award Certificates</td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">Competition Entries</td>
                  <td className="p-3 text-center text-sm">Half price entry into 1 in-house competition</td>
                  <td className="p-3 text-center text-sm">1 entry to the FMA competition</td>
                  <td className="p-3 text-center text-sm">2 entries to the FMA competition</td>
                  <td className="p-3 text-center text-sm">2 entries to the FMA competition</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-sm">Sibling Benefits</td>
                  <td className="p-3 text-center text-sm">Priority access for sibling classes</td>
                  <td className="p-3 text-center text-sm">Priority access & 5% sibling discount</td>
                  <td className="p-3 text-center text-sm">10% sibling discount</td>
                  <td className="p-3 text-center text-sm">15% sibling discount</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">Merchandise*</td>
                  <td className="p-3 text-center text-sm">T-Shirt</td>
                  <td className="p-3 text-center text-sm">T-Shirt, FMA Bag</td>
                  <td className="p-3 text-center text-sm">T-Shirt, FMA Bag & Water bottle</td>
                  <td className="p-3 text-center text-sm">T-Shirt, FMA Bag, Water bottle & Training leotard/hoodie</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-sm">Award Medals</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center text-sm">1 included</td>
                  <td className="p-3 text-center text-sm">3 included</td>
                  <td className="p-3 text-center text-sm">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">Bring a Friend</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center text-sm">1 free taster session</td>
                  <td className="p-3 text-center text-sm">4 free taster sessions</td>
                  <td className="p-3 text-center text-sm">12 free taster sessions</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-sm">Special Events Discount</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center text-sm">5% discount</td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                  <td className="p-3 text-center text-sm">15% discount</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">Explorer Activities</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center text-sm">4 free entries</td>
                  <td className="p-3 text-center text-sm">12 free entries</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-sm">Free Taster Class</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <Check className="mx-auto text-green-500" size={16} />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-sm">FMA Birthday Parties</td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center">
                    <X className="mx-auto text-red-500" size={16} />
                  </td>
                  <td className="p-3 text-center text-sm">10% discount</td>
                  <td className="p-3 text-center text-sm">20% discount</td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="p-3 font-medium text-gray-600 text-sm">Select Package:</td>
                  {packages.map((pkg) => (
                    <td key={pkg.name} className="p-3 text-center">
                      {!selectedPackage ? (
                        <Button
                          onClick={() => handlePackageSelect(pkg.name, pkg.price)}
                          className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 hover:opacity-90 transition-opacity text-xs px-2 py-1.5"
                        >
                          Choose {pkg.name}
                        </Button>
                      ) : selectedPackage.name === pkg.name ? (
                        <div className="space-y-2">
                          <div className="bg-green-50 border border-green-200 rounded-md p-2">
                            <div className="text-xs font-medium text-green-800">Selected</div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(-1)}
                                disabled={selectedPackage.quantity <= 1}
                                className="h-6 w-6 p-0"
                              >
                                <Minus size={12} />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{selectedPackage.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(1)}
                                disabled={selectedPackage.quantity >= 21}
                                className="h-6 w-6 p-0"
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handlePackageSelect(pkg.name, pkg.price)}
                          variant="outline"
                          className="w-full text-xs px-2 py-1.5"
                        >
                          Choose {pkg.name}
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {selectedPackage && (
            <div className="flex-shrink-0 mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>
                    {selectedPackage.name} Package × {selectedPackage.quantity}
                  </span>
                  <span>£{pricing.total.toFixed(2)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Multi-package discount (10% off additional packages)</span>
                    <span>-£{pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-1 mt-2">
                  <div className="flex justify-between font-semibold text-blue-900">
                    <span>Total</span>
                    <span>£{pricing.finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {onPackageSelect && (
                <Button
                  onClick={handleConfirmSelection}
                  className="w-full mt-3 bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 hover:opacity-90 transition-opacity"
                >
                  Confirm Selection
                </Button>
              )}
            </div>
          )}

          <div className="flex-shrink-0 mt-4 mx-4 text-xs text-muted-foreground bg-gray-50 p-3 rounded-md border border-gray-200">
            <p>
              * Merchandise (T-Shirt, FMA Bag, Water bottle, Training leotard/hoodie) is available on full membership
              year only.
            </p>
            {selectedPackage && selectedPackage.quantity > 1 && (
              <p className="mt-2 text-green-600 font-medium">
                💡 You're saving £{pricing.discount.toFixed(2)} with our multi-package discount!
              </p>
            )}
          </div>

          {showBackButton && (
            <div className="flex-shrink-0 mt-6 flex justify-center px-4">
              <Link href="/" passHref>
                <Button className="bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 hover:opacity-90 transition-opacity">
                  Back to Registration
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
