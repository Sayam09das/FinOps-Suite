import { faker } from '@faker-js/faker';

export const createTestUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
});

export const testUsers = Array.from({ length: 5 }, createTestUser);
