
import { faker } from "@faker-js/faker";
export default (user,count,memoidIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
memoid: memoidIds[i % memoidIds.length],
memotitle: faker.lorem.sentence(""),
file: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
