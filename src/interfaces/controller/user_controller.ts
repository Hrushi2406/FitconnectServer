import { MyPayment, MyTrainer } from "../../domain/return_types";
import { IDependencies } from "../../application/abstracts/dependencies_interface";
import User from "../../domain/entities/user"
import Request from "../../domain/relations/request";

export class UserController {

  //constructor
  constructor(public dependencies: IDependencies) {}

  //Connect user to categories
  async addUserInterests({userId, interests}: {userId:string, interests:string[]}): Promise<void> {
    try {

      //Create relationships
      await this.dependencies.userRepository.addUserInterests(userId, interests);
        
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Get Profile
  async getUserProfile({userId}: {userId:string}): Promise<User | null> {
    try {

      //Get user
      const user: User | null = await this.dependencies.userRepository.getUserById(userId);
        
      //Return the user
      return user;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Fetch all pairing requests
  async getPairingRequests({userId}: {userId:string}): Promise<[Request] | null> {
    try {

      //Get pairing request received by userId
      const reqs: [Request] | null = await this.dependencies.userRepository.getRequestsToId(userId);
       
      //Return the requests
      return reqs;
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

    //Send pairing request
    async sendPairingRequest(args: any): Promise<void> {
      try {
  
        //Send request from senderId to receiverId
        await this.dependencies.userRepository.sendRequest(args);
         
      } catch (err) {
        //Format Error Message
        throw this.dependencies.customError.throw();
      }
    }

  //Update Profile
  async updateUserProfile(args: any): Promise<void> {
    try {

      //Get user
      await this.dependencies.userRepository.updateUser(args);

    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Decline pairing request
  async declineRequest(args: any): Promise<void> {
    try {

      //Decline request from senderId to receiverId with planId
      await this.dependencies.userRepository.deleteRequest(args);
       
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Accept pairing request
  async acceptRequest(args: any): Promise<void> {
    try {

      //Decline request from senderId to receiverId with planId
      await this.dependencies.userRepository.deleteRequest(args);

      //Accept request from senderId to receiverId with planId
      await this.dependencies.userRepository.createFriends(args);
       
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Subscribe to plan
  async subscribe({userId, planId, duration, price}: {userId:string, planId:string, duration:string, price:number}){
    try {

      //Subscribe userId to planId for price
      await this.dependencies.userRepository.subscribeToPlan(userId, planId, duration, price);
       
    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

  //Pay to a plan in pair 
  async payInPair({payeeId, partnerId, planId, duration, price}: {payeeId:string, partnerId:string, planId:string, duration:string, price:number}){
    try {

      //Pay to plan via payeeId
      await this.dependencies.userRepository.pay(payeeId, partnerId, planId);

      const partnerPaid: boolean = await this.dependencies.userRepository.checkPayment(partnerId, payeeId, planId);

      if(partnerPaid){
        //Subscribe payeeId & partnerId to planId for price
        await this.dependencies.userRepository.subscribeToPlan(payeeId, planId, duration, price);
        await this.dependencies.userRepository.subscribeToPlan(partnerId, planId, duration, price);
      }

    } catch (err) {
      //Format Error Message
      throw this.dependencies.customError.throw();
    }
  }

    //Fetch all subscriptions
    async getMyTrainers({userId}: {userId:string}): Promise<[MyTrainer] | null>{
      try {
  
        //Fetch subscriptions by userId
        const result = await this.dependencies.userRepository.getSubsbyUserId(userId);
       
      //Return the result
        return result;
      } catch (err) {
        //Format Error Message
        throw this.dependencies.customError.throw();
      }
    }
    
    //Fetch all payments in pairs
    async getMyPayments({userId}: {userId:string}): Promise<[MyPayment] | null>{
      try {
  
        //Fetch friendships by userId
        const result = await this.dependencies.userRepository.getAllPairings(userId);
       
      //Return the result
        return result;
      } catch (err) {
        //Format Error Message
        throw this.dependencies.customError.throw();
      }
    }
}

