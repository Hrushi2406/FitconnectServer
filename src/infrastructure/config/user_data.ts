import faker from "faker";
import User from "../../domain/entities/user";
import { Encrypter } from "../../infrastructure/security/encrypter";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { UserRepository } from "../../data_provider/repository/user_repository";
import { userImages } from './images';

export async function seedUser(): Promise<void> {
  // const Imgs = await scrapeImages("https://www.gettyimages.in/photos/happy-person?family=creative&license=rf&phrase=happy%20person&sort=mostpopular#license");
  const Imgs = userImages;

  const session = driver.session();
  const userRepository = new UserRepository(driver);
  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  for (let index = 0; index < 60; index++) {
    //Creaeteing trainer
    const user = await createUser(Imgs, index);

    //ADDIING User
    await userRepository.registerUser(user);

    var n = Math.floor(Math.random() * categories.length) + 1;
    var randomCategory = categories.sort(() => 0.5 - Math.random()).slice(0, n);

    console.log(index, " USERS CREATED");

    //CATEGORY
    const randomcategory =
      categories[Math.floor(Math.random() * categories.length)];

    let query = "MATCH (u:User), (c:Category) WHERE u.userId=$userId AND";

    // randomCategory.map((c, i) => {
    //   let arr = query.split(" ");
    //   if (arr[arr.length - 1] == "AND") {
    //     query = query + " c.name='" + c + "'";
    //   } else {
    //     query = query + " OR c.name='" + c + "'";
    //   }
    // });

    for (let j = 0; j < randomCategory.length; j++) {
      const category = `MATCH (u:User), (c:Category) WHERE u.userId=$userId AND c.name=$name CREATE (u)-[:OFTYPE]->(c)`;
      //CREATING RELATIONHIP WITH CATEGORY
      await session.run(category, {
        userId: user.userId,
        name: randomCategory[j],
      });
    }

    // query = query + " CREATE (u)-[:OFTYPE]->(c)";

    console.log("U --> C RELATIONSHIP CREATED");
  }

  console.log("ADDED USERS SUCCESSFULLY");

  session.close();
}

async function createUser(Imgs: any, index: number): Promise<User> {
  const encrypter = new Encrypter();
  const gender = ["Male", "Female"];

  const user = new User({
    userId: new IDGenerator().generate(),
    email: faker.internet.email(),
    password: await encrypter.encrypt("12345678"),
    name: faker.name.firstName() + " " + faker.name.lastName(),
    age: Math.floor(Math.random() * 60) + 1,
    gender: gender[Math.floor(Math.random() * gender.length)],
    address:
      faker.address.streetAddress() +
      " " +
      faker.address.city() +
      " " +
      faker.address.country(),
    bio: faker.lorem.paragraphs(),
    mobile: faker.phone.phoneNumber(),
    imageUrl: Imgs[index],
    lat: parseFloat(
      faker.address.latitude(18.98187508229609, 19.024136650029877)
    ),
    lon: parseFloat(
      faker.address.longitude(73.09148912801847, 73.1222183629399)
    ),
  });

  return user;
}