interface UserDtoOptions {
  id: string;
  email: string;
  isActivated: boolean;
}

export default class UserDto {
  id: UserDtoOptions["id"];
  email: UserDtoOptions["email"];
  isActivated: UserDtoOptions["isActivated"];

  constructor({ id, email, isActivated }: UserDtoOptions) {
    this.id = id;
    this.email = email;
    this.isActivated = isActivated;
  }
}