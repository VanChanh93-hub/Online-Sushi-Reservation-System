import type { BookingFormData } from "../booking";

export interface PaymentNotesFormProps {
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
}
