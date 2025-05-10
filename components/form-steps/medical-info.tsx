"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface MedicalInfoProps {
  form: UseFormReturn<any>
}

export default function MedicalInfo({ form }: MedicalInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Medical Information</div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="hasMedicalConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Any medical conditions?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("hasMedicalConditions") && (
          <FormField
            control={form.control}
            name="medicalConditionsDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please provide details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Medical condition details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="hasAllergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Any allergies?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("hasAllergies") && (
          <FormField
            control={form.control}
            name="allergiesDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please provide details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Allergy details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="hasInjury"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Had an injury that would affect performance?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("hasInjury") && (
          <FormField
            control={form.control}
            name="injuryDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please provide details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Injury details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  )
}
