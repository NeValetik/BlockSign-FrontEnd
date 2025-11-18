"use client"

import { FC } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

// import { cn } from "@/utils/cn"
import Button from "@/components/Form/Button"
import Calendar from "@/components/Form/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Form/Popover"

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
}

const DatePicker:FC<DatePickerProps> = ({value, onChange}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar 
          mode="single" 
          selected={value} 
          onSelect={onChange}
          required 
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker;