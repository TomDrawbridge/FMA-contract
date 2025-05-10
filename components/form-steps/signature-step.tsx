"use client"

import { useRef, useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import SignatureCanvas from "react-signature-canvas"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Trash2Icon, UndoIcon } from "lucide-react"
import GetIp from "../get-ip"

interface SignatureStepProps {
  form: UseFormReturn<any>
  onSignatureEnd: (signatureData: string) => void
}

export default function SignatureStep({ form, onSignatureEnd }: SignatureStepProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSigned, setIsSigned] = useState(false)
  const [ipAddress, setIpAddress] = useState("127.0.0.1")
  const [canvasWidth, setCanvasWidth] = useState(300)
  const [canvasHeight, setCanvasHeight] = useState(200)
  const [strokeHistory, setStrokeHistory] = useState<any[]>([])

  // Measure and set the canvas size to match its container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        // Subtract padding (8px on each side)
        const actualWidth = containerWidth - 16
        setCanvasWidth(actualWidth)
      }
    }

    // Initial measurement
    updateCanvasSize()

    // Re-measure on window resize
    window.addEventListener("resize", updateCanvasSize)

    // Cleanup
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      setIsSigned(false)
      form.setValue("signatureData", "")
      onSignatureEnd("")
      setStrokeHistory([])
    }
  }

  const undoLastStroke = () => {
    if (sigCanvas.current && strokeHistory.length > 0) {
      // Remove the last stroke from history
      const newHistory = [...strokeHistory]
      newHistory.pop()
      setStrokeHistory(newHistory)

      // Clear canvas and redraw remaining strokes
      sigCanvas.current.clear()
      if (newHistory.length > 0) {
        sigCanvas.current.fromData(newHistory)
        const signatureData = sigCanvas.current.toDataURL("image/png")
        form.setValue("signatureData", signatureData)
        onSignatureEnd(signatureData)
        setIsSigned(true)
      } else {
        form.setValue("signatureData", "")
        onSignatureEnd("")
        setIsSigned(false)
      }
    }
  }

  const handleBegin = () => {
    // Nothing special needed on begin
  }

  const handleEnd = () => {
    if (sigCanvas.current) {
      if (!sigCanvas.current.isEmpty()) {
        setIsSigned(true)

        // Get trimmed signature data (removes whitespace)
        const trimmedCanvas = sigCanvas.current.getTrimmedCanvas()
        const signatureData = trimmedCanvas.toDataURL("image/png")

        form.setValue("signatureData", signatureData)
        onSignatureEnd(signatureData)

        // Save stroke history for undo functionality
        const currentData = sigCanvas.current.toData()
        if (currentData.length > strokeHistory.length) {
          setStrokeHistory(currentData)
        }
      }
    }
  }

  const handleIpReceived = (ip: string) => {
    setIpAddress(ip)
    form.setValue("ipAddress", ip)
  }

  // For debugging
  useEffect(() => {
    console.log("Form values in signature step:", form.getValues())
  }, [form])

  return (
    <div className="space-y-6">
      <GetIp onIpReceived={handleIpReceived} />
      <div className="text-xl font-semibold">Signature</div>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Please sign below to confirm your agreement to the terms and conditions.
        </AlertDescription>
      </Alert>

      <div className="border rounded-md p-4 bg-white" ref={containerRef}>
        <div className="mb-4">
          <div className="border-b border-dashed border-gray-300 mb-2 relative">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: canvasWidth,
                height: canvasHeight,
                className: "signature-canvas",
                style: {
                  touchAction: "none",
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                },
              }}
              backgroundColor="white"
              minWidth={1}
              maxWidth={2.5}
              velocityFilterWeight={0.7}
              onEnd={handleEnd}
              onBegin={handleBegin}
            />
            {!isSigned && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gray-300 text-sm">Sign here</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={undoLastStroke}
            disabled={strokeHistory.length === 0}
            className="flex items-center"
          >
            <UndoIcon className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!isSigned}
            className="flex items-center"
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {isSigned ? (
        <p className="text-sm text-green-600">Signature captured successfully</p>
      ) : (
        <p className="text-sm text-amber-600">Please sign above to continue</p>
      )}
      {form.formState.errors.signatureData && (
        <p className="text-sm text-red-500 mt-1">{form.formState.errors.signatureData.message}</p>
      )}

      <div className="mt-4">
        <FormField
          control={form.control}
          name="contractAgreed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    console.log("Checkbox changed:", checked)
                    field.onChange(checked)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label
                  className="font-medium cursor-pointer"
                  onClick={() => {
                    const newValue = !field.value
                    console.log("Label clicked, setting to:", newValue)
                    field.onChange(newValue)
                  }}
                >
                  I agree to the terms and conditions and confirm that the information provided is accurate
                </label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
