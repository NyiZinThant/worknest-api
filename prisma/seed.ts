import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import prisma from 'src/config/prisma';
const saltRounds = process.env.SALT_ROUND ? +process.env.SALT_ROUND : 10;

const seedCompany = async (count: number): Promise<string[]> => {
  const result: string[] = [];
  console.log('Companys start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const name = faker.company.name();
      const email = faker.internet.email();
      const overview = faker.lorem.paragraphs(3, '\n');
      const employeeCount = faker.number.int({ min: 10, max: 1000 });
      const logo = faker.image.avatarGitHub();
      const hashedPassword = await hash('password', saltRounds);
      const company = await prisma.company.create({
        data: {
          name,
          email,
          overview,
          employeeCount,
          logo,
          password: hashedPassword,
        },
      });
      result.push(company.id);
    }
    console.log('Companys seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding companys: ', e);
    process.exit(1);
  }
};
const seedJob = async (
  count: number,
  companyIds: string[],
  workModeIds: number[],
  typeIds: number[]
): Promise<number[]> => {
  const result: number[] = [];
  console.log('Jobs start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const companyId = faker.helpers.arrayElement(companyIds);
      const position = `${faker.person.jobDescriptor()} ${faker.person.jobArea()} ${faker.person.jobType()}`;
      const information = faker.lorem.paragraphs(6, '\n');
      const minSalary = faker.number.int({ min: 1000, max: 5000 });
      const maxSalary = faker.number.int({
        min: minSalary + 100,
        max: 10000,
      });
      const startDate = faker.date.past({ years: 1 });
      const endDate = faker.date.future({ years: 1 });
      const location = `${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}`;
      const workModeId = faker.helpers.arrayElement(workModeIds);
      const employeeTypeId = faker.helpers.arrayElement(typeIds);
      const job = await prisma.job.create({
        data: {
          companyId,
          position,
          minSalary,
          maxSalary,
          information,
          startDate,
          endDate,
          location,
          workModeId,
          employeeTypeId,
        },
      });
      result.push(job.id);
    }
    console.log('Jobs seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding jobs: ', e);
    process.exit(1);
  }
};
const seedUser = async (count: number): Promise<string[]> => {
  const result: string[] = [];
  console.log('Users start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const dateOfBirth = faker.date.birthdate({
        mode: 'age',
        min: 18,
        max: 50,
      });
      const gender = faker.helpers.arrayElement(['male', 'female', 'other']);
      const hashedPassword = await hash('password', saltRounds);
      const bio = faker.lorem.paragraphs(2);
      const profileImage = faker.image.avatar();
      const user = await prisma.user.create({
        data: {
          name,
          email,
          dateOfBirth,
          gender,
          bio,
          profileImage,
          password: hashedPassword,
        },
      });
      result.push(user.id);
    }
    console.log('Users seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding users: ', e);
    process.exit(1);
  }
};
const seedQualification = async (): Promise<string[]> => {
  const result: string[] = [];
  const qualifications = [
    ['Bachelor of Science', 'BSc'],
    ['Master of Science', 'MSc'],
    ['Doctor of Philosophy', 'PhD'],
    ['Bachelor of Arts', 'BA'],
    ['Master of Arts', 'MA'],
    ['Bachelor of Engineering', 'BEng'],
    ['Master of Engineering', 'MEng'],
    ['Bachelor of Business Administration', 'BBA'],
    ['Master of Business Administration', 'MBA'],
    ['Associate of Science', 'AS'],
    ['Associate of Arts', 'AA'],
    ['Diploma in Computer Science', 'DipCS'],
    ['Certificate in Project Management', 'CertPM'],
    ['High School Diploma', 'HSD'],
    ['General Educational Development', 'GED'],
    ['Doctor of Medicine', 'MD'],
    ['Juris Doctor', 'JD'],
    ['Bachelor of Laws', 'LLB'],
    ['Master of Laws', 'LLM'],
    ['Bachelor of Fine Arts', 'BFA'],
    ['Master of Fine Arts', 'MFA'],
    ['Certificate', 'Cert'],
  ];
  console.log('Qualifications start seeding.');
  try {
    for (let qualification of qualifications) {
      const qualificationLong = qualification[0];
      const qualificationShort = qualification[1];
      const { id } = await prisma.qualification.create({
        data: {
          qualificationLong,
          qualificationShort,
        },
      });
      result.push(id);
    }
    console.log('Qualifications seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding qualifications: ', e);
    process.exit(1);
  }
};

const seedEducation = async (
  count: number,
  userIds: string[],
  qualificationIds: string[]
) => {
  const fieldsOfStudy = [
    'Computer Science',
    'Mechanical Engineering',
    'Business Administration',
    'Biology',
    'Psychology',
    'Education',
    'Political Science',
    'Accounting',
    'Nursing',
    'Marketing',
  ];
  const institutions = [
    'Harvard University',
    'Stanford University',
    'Massachusetts Institute of Technology',
    'University of California, Berkeley',
    'Oxford University',
    'Cambridge University',
    'University of Chicago',
    'Princeton University',
    'California Institute of Technology',
    'Yale University',
  ];
  console.log('Educations start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const fieldOfStudy = faker.helpers.arrayElement(fieldsOfStudy);
      const qualificationId = faker.helpers.arrayElement(qualificationIds);
      const institution = faker.helpers.arrayElement(institutions);
      const userId = faker.helpers.arrayElement(userIds);
      const startDate = faker.date.past({ years: 4 });
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 4);
      await prisma.education.create({
        data: {
          fieldOfStudy,
          qualificationId,
          institution,
          userId,
          startDate,
          endDate,
        },
      });
    }
    console.log('Educations seeded successfully.');
  } catch (e) {
    console.error('Error seeding educations: ', e);
    process.exit(1);
  }
};

const seedExperience = async (count: number, userIds: string[]) => {
  console.log('Experiences start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const position = `${faker.person.jobDescriptor()} ${faker.person.jobArea()} ${faker.person.jobType()}`;
      const companyName = faker.company.name();
      const description = faker.lorem.paragraphs(2, '\n');
      const userId = faker.helpers.arrayElement(userIds);
      const startDate = faker.date.past({ years: 3 });
      const endDate = faker.date.past({ years: 1 });
      await prisma.experience.create({
        data: {
          position,
          companyName,
          description,
          userId,
          startDate,
          endDate,
        },
      });
    }
    console.log('Experiences seeded successfully.');
  } catch (e) {
    console.error('Error seeding experiences: ', e);
    process.exit(1);
  }
};

const seedJobApplication = async (
  count: number,
  userIds: string[],
  jobIds: number[]
) => {
  console.log('Job applications start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const resume = 'resume.txt';
      const userId = faker.helpers.arrayElement(userIds);
      const jobId = faker.helpers.arrayElement(jobIds);
      await prisma.job_application.create({
        data: {
          resume,
          jobId,
          userId,
        },
      });
    }
    console.log('Job applications seeded successfully.');
  } catch (e) {
    console.error('Error seeding job applications: ', e);
    process.exit(1);
  }
};
const seedEmployeeType = async (): Promise<number[]> => {
  const result: number[] = [];
  const data = ['full-time', 'part-time', 'contract'];
  console.log('Employee type start seeding.');
  try {
    for (let i = 0; i < data.length; i++) {
      const name = data[i];
      const { id } = await prisma.employee_type.create({
        data: {
          name,
        },
      });
      result.push(id);
    }
    console.log('Employee type seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding employee types: ', e);
    process.exit(1);
  }
};
const seedWorkMode = async (): Promise<number[]> => {
  const result: number[] = [];
  const data = ['remote', 'hybrid', 'onsite'];
  console.log('Work modes start seeding.');
  try {
    for (let i = 0; i < data.length; i++) {
      const name = data[i];
      const { id } = await prisma.work_mode.create({
        data: {
          name,
        },
      });
      result.push(id);
    }
    console.log('Work modes seeded successfully.');
    return result;
  } catch (e) {
    console.error('Error seeding work modes: ', e);
    process.exit(1);
  }
};
console.log('Start database seeding!');
console.time();
const companyIds = await seedCompany(20);
const userIds = await seedUser(120);
const qualificationIds = await seedQualification();
await seedEducation(240, userIds, qualificationIds);
await seedExperience(360, userIds);
const employeeTypeIds = await seedEmployeeType();
const workModeIds = await seedWorkMode();
const jobIds = await seedJob(60, companyIds, workModeIds, employeeTypeIds);
await seedJobApplication(180, userIds, jobIds);
console.timeEnd();
console.log('Finish database seeding');
