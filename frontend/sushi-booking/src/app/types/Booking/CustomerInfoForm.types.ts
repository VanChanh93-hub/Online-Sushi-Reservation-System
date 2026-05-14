import type { BookingFormData } from "../../types/booking";

export interface CustomerInfoFormProps {
  formData: BookingFormData;
  setFormData: (data: BookingFormData) => void;
}
