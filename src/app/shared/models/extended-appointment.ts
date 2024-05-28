import {Appointment, Qr} from "appointment-center-structure-lib";

export class ExtendedAppointment extends Appointment {
  attended: boolean;
  qr: Qr;

  public static override copy(from: ExtendedAppointment, to: ExtendedAppointment): void {
    super.copy(from, to);
    to.attended = from.attended;
    to.qr = from.qr;
  }
  public static override clone(from: ExtendedAppointment): ExtendedAppointment {
    const to: ExtendedAppointment = new ExtendedAppointment();
    this.copy(from, to);
    return to;
  }
}
