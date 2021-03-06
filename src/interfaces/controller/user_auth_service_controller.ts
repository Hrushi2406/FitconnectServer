import { UserLoginUseCase } from "../../application/use_cases/user_auth_services/user_login_use_case";
import { UserRegisterUseCase } from "../../application/use_cases/user_auth_services/user_register_use_case";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
// import { AuthService } from "../../application/use_cases/auth_services/auth_service";

export class UserAuthServiceController {
  //UseCases
  private loginUseCase: UserLoginUseCase;
  private registerUseCase: UserRegisterUseCase;

  //constructor
  constructor(public dependencies: IDependencies) {
    this.loginUseCase = new UserLoginUseCase(
      dependencies.userRepository,
      dependencies.encrypter,
      dependencies.accessTokenManager,
      dependencies.customError
    );
    this.registerUseCase = new UserRegisterUseCase(
      dependencies.userRepository,
      dependencies.idGenerator,
      dependencies.encrypter,
      dependencies.accessTokenManager,
      dependencies.customError
    );
  }

  //login
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<String> {
    try {
      //Get token from use case
      const token: string = await this.loginUseCase.execute(email, password);

      //Return the token
      return token;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Register
  async register(args: any): Promise<String> {
    try {
      //Get toke from the use case
      const token: string = await this.registerUseCase.execute(args);

      //Return the token
      return token;
    } catch (err) {
      this.dependencies.customError.message = err;

      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }
}

interface Itoken {
  token: string;
}
