import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

interface ConsentProps {
  form: UseFormReturn<any>
}

export default function Consent({ form }: ConsentProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Consent</div>

      <div className="space-y-6">
        <div className="text-sm text-gray-500">Please uncheck the boxes below if you do NOT give consent for:</div>

        <FormField
          control={form.control}
          name="photoConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>My child's photo to be taken and used for marketing</FormLabel>
                <FormDescription>
                  We may use photos for our website, social media, and promotional materials.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstAidConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>FMA to administer General and Emergency First Aid</FormLabel>
                <FormDescription>
                  This allows our trained staff to provide necessary first aid in case of injury or emergency.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
