export class CreateUserDto {
  name: string;
  email: string;
  contact: string;

  emergencyContact: {
    name: string;
    phone: string;
  };
}
