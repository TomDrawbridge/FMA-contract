"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Trash2Icon } from "lucide-react"
import GetIp from "../get-ip"

interface SignatureStepProps {
  form: UseFormReturn<any>
  onSignatureEnd: (signatureData: string) => void
}

export default function SignatureStep({ form, onSignatureEnd }: SignatureStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(300)
  const [canvasHeight, setCanvasHeight] = useState(200)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

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

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas and set background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing style
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "black"
  }, [canvasWidth, canvasHeight])

  const getCoordinates = (event: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if ("touches" in event) {
      // Touch event
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      }
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
  }

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    const coords = getCoordinates(event.nativeEvent)
    setLastPos(coords)
  }

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    if (!isDrawing || !canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const currentPos = getCoordinates(event.nativeEvent)

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(currentPos.x, currentPos.y)
    ctx.stroke()

    setLastPos(currentPos)
    setIsSigned(true)
  }

  const endDrawing = () => {
    if (isDrawing && isSigned) {
      // Only capture signature when drawing ends, not during drawing
      captureSignature()
    }
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setIsSigned(false)
    form.setValue("signatureData", "", { shouldValidate: true })
    onSignatureEnd("")
    setDebugInfo("Signature cleared")
  }

  const captureSignature = () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) {
        setDebugInfo("Error: Canvas not found")
        return
      }

      // Get the signature data
      try {
        const signatureData = canvas.toDataURL("image/png")

        if (!signatureData || !signatureData.startsWith("data:image/")) {
          setDebugInfo("Error: Invalid signature data format")
          return
        }

        // Set the form value - but don't log the entire signature data
        form.setValue("signatureData", signatureData, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })

        onSignatureEnd(signatureData)
        setIsSigned(true)
        // Just log that it was captured, not the entire data
        setDebugInfo("Signature captured successfully")
      } catch (error) {
        setDebugInfo(`Error capturing signature: ${error}`)
        console.error("Error capturing signature:", error)
      }
    } catch (error) {
      setDebugInfo(`Error in capture function: ${error}`)
      console.error("Error in capture function:", error)
    }
  }

  const handleIpReceived = (ip: string) => {
    // Set the IP address only once when received
    form.setValue("ipAddress", ip)
  }

  return (
    <div className="space-y-6">
      {/* GetIp component only runs once when mounted */}
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
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="touch-none"
              style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
            {!isSigned && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gray-300 text-sm">Sign here</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between space-x-2">
          <Button type="button" variant="secondary" size="sm" onClick={captureSignature} className="flex items-center">
            Capture Signature
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

      {/* Debug info */}
      <div className="text-xs text-gray-500 mt-1 break-all">{debugInfo}</div>

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
                    field.onChange(checked)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label
                  className="font-medium cursor-pointer"
                  onClick={() => {
                    const newValue = !field.value
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
