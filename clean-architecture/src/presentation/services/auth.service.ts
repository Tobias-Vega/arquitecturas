import { bcryptAdapter, JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongo";
import { LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { CustomError } from '../../domain/errors/custom.error';

export class AuthService {
  
  constructor(
  ){}

  public async registerUser(registerUserDto: RegisterUserDto) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email })

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      user.password = bcryptAdapter.hash(registerUserDto.password);
      
      await user.save();


      const token = await JWTAdapter.generateToken({id: user.id});

      if (!token) throw CustomError.internalServerError('Error while creating JWT')

      const { password, ...userEntity } = UserEntity.fromObject(user)

      return { 
        user: userEntity,
        token
      };
      
    } catch (error) {
      throw CustomError.internalServerError(`${error}`)
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {

    const user = await UserModel.findOne({ 
      email: loginUserDto.email,
    })

    if (!user) throw CustomError.badRequest('invalid credentials')

    const comparePassword = bcryptAdapter.compare( loginUserDto.password, user.password);

    if (!comparePassword) throw CustomError.badRequest('Incorrect credentials');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JWTAdapter.generateToken({ id: user.id });

    if (!token) throw CustomError.internalServerError('Error while creating JWT')

    return {
      user: userEntity,
      token
    }
  }
}