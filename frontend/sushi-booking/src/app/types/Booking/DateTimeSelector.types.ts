import type { TimeSlot, BookingFormData } from "../../types/booking";

export interface DateTimeSelectorProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
  availableSlots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onFetchSlots: () => void;
  today: string;
}
