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
      const employee_count = faker.number.int({ min: 10, max: 1000 });
      const logo = faker.image.avatarGitHub();
      const hashedPassword = await hash('password', saltRounds);
      const company = await prisma.company.create({
        data: {
          name,
          email,
          overview,
          employee_count,
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
  companyIds: string[]
): Promise<number[]> => {
  const result: number[] = [];
  console.log('Jobs start seeding.');
  try {
    for (let i = 0; i < count; i++) {
      const company_id = faker.helpers.arrayElement(companyIds);
      const position = `${faker.person.jobDescriptor()} ${faker.person.jobArea()} ${faker.person.jobType()}`;
      const information = faker.lorem.paragraphs(6, '\n');
      const min_salary = faker.number.int({ min: 1000, max: 5000 });
      const max_salary = faker.number.int({
        min: min_salary + 100,
        max: 10000,
      });
      const start_date = faker.date.past({ years: 1 });
      const end_date = faker.date.future({ years: 1 });
      const location = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`;
      const work_mode = faker.helpers.arrayElement([
        'remote',
        'hybrid',
        'onsite',
      ]);
      const employee_type = faker.helpers.arrayElement([
        'full-time',
        'part-time',
        'contract',
      ]);
      const job = await prisma.job.create({
        data: {
          company_id,
          position,
          min_salary,
          max_salary,
          information,
          start_date,
          end_date,
          location,
          work_mode,
          employee_type,
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
      const date_of_birth = faker.date.birthdate({
        mode: 'age',
        min: 18,
        max: 50,
      });
      const gender = faker.helpers.arrayElement(['male', 'female', 'other']);
      const hashedPassword = await hash('password', saltRounds);
      const bio = faker.lorem.paragraphs(2);
      const profile_image = faker.image.avatar();
      const user = await prisma.user.create({
        data: {
          name,
          email,
          date_of_birth,
          gender,
          bio,
          profile_image,
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
      const qualification_long = qualification[0];
      const qualification_short = qualification[1];
      const { id } = await prisma.qualification.create({
        data: {
          qualification_long,
          qualification_short,
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
      const field_of_study = faker.helpers.arrayElement(fieldsOfStudy);
      const qualification_id = faker.helpers.arrayElement(qualificationIds);
      const institution = faker.helpers.arrayElement(institutions);
      const user_id = faker.helpers.arrayElement(userIds);
      const start_date = faker.date.past({ years: 4 });
      const end_date = new Date(start_date);
      end_date.setFullYear(start_date.getFullYear() + 4);
      await prisma.education.create({
        data: {
          field_of_study,
          qualification_id,
          institution,
          user_id,
          start_date,
          end_date,
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
      const company_name = faker.company.name();
      const description = faker.lorem.paragraphs(2, '\n');
      const user_id = faker.helpers.arrayElement(userIds);
      const start_date = faker.date.past({ years: 3 });
      const end_date = faker.date.past({ years: 1 });
      await prisma.experience.create({
        data: {
          position,
          company_name,
          description,
          user_id,
          start_date,
          end_date,
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
      const user_id = faker.helpers.arrayElement(userIds);
      const job_id = faker.helpers.arrayElement(jobIds);
      await prisma.job_application.create({
        data: {
          resume,
          job_id,
          user_id,
        },
      });
    }
    console.log('Job applications seeded successfully.');
  } catch (e) {
    console.error('Error seeding job applications: ', e);
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
const jobIds = await seedJob(60, companyIds);
await seedJobApplication(180, userIds, jobIds);
console.timeEnd();
console.log('Finish database seeding');
