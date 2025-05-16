export default class UserDto {
  id: string;
  email: string;
  isActivated: boolean;

  constructor({ id, email, isActivated }) {
    this.id = id;
    this.email = email;
    this.isActivated = isActivated;
  }
}