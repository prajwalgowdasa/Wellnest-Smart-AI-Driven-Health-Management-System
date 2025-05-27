"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, useNavigation } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CustomCaption(props: any) {
  const { goToMonth, currentMonth } = useNavigation();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  return (
    <div className="flex items-center justify-between px-1 py-2">
      <div className="flex items-center gap-2">
        <Select
          value={months[currentMonth.getMonth()]}
          onValueChange={(value) => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(months.indexOf(value));
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-9 w-[120px] text-sm font-medium">
            <SelectValue placeholder={months[currentMonth.getMonth()]} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentMonth.getFullYear().toString()}
          onValueChange={(value) => {
            const newDate = new Date(currentMonth);
            newDate.setFullYear(parseInt(value));
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-9 w-[90px] text-sm font-medium">
            <SelectValue placeholder={currentMonth.getFullYear()} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white shadow-lg rounded-lg border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide default caption
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-transparent p-0 opacity-90 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[0.9rem] font-medium text-muted-foreground rounded-md w-10 h-10 flex items-center justify-center",
        row: "flex w-full mt-3",
        cell: "h-10 w-10 text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today:
          "border border-primary/50 bg-accent/30 text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
