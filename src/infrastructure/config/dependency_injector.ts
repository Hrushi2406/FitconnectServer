import { IDependencies } from "../../application/abstracts/dependencies_interface";
import { AccessTokenManager } from "../security/access_token_manager";
import { Encrypter } from "../security/encrypter";
import { UserRepository } from "../../data_provider/repository/user_repository";
import { TrainerRepository } from "../../data_provider/repository/trainer_repository";
import { CustomError } from "../../application/abstracts/custom_error";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";

export const dependencies: IDependencies = {
  //GENERAL

  //Error Handler
  customError: new CustomError(),
  //JWT token Manager
  accessTokenManager: new AccessTokenManager(),
  //Value Encrypter using Bcrypt
  encrypter: new Encrypter(),
  //Unique ID generator using UUIDV4
  idGenerator: new IDGenerator(),

  //REPOSITORY

  //User repository
  userRepository: new UserRepository(driver),
  
  //Trainer repository
  trainerRepository: new TrainerRepository(driver),
};
