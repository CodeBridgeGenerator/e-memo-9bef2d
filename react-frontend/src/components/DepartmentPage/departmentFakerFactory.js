
import { faker } from "@faker-js/faker";
export default (user,count,deptidIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
deptid: deptidIds[i % deptidIds.length],
deptname: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
