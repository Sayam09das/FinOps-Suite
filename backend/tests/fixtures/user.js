"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUsers = exports.createTestUser = void 0;
const faker_1 = require("@faker-js/faker");
const createTestUser = () => ({
    email: faker_1.faker.internet.email(),
    password: faker_1.faker.internet.password(),
    name: faker_1.faker.person.fullName(),
});
exports.createTestUser = createTestUser;
exports.testUsers = Array.from({ length: 5 }, exports.createTestUser);
