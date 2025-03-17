export class LoginUserDto {

  constructor(
    public email: string,
    public password: string,
  ) {}


  static get(object: { [key: string]: any }): [string?, LoginUserDto?] {

    const { email, password } = object;

    if (!email) return ["Missing email"];
    if (!password) return ["Missing password"]

    return [undefined, new LoginUserDto(email, password)]
  }

}