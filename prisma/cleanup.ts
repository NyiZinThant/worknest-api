import prisma from 'src/config/prisma';

const cleanUp = async () => {
  try {
    await prisma.job_application.deleteMany();
    console.log('Job application table cleanup success');
    await prisma.job.deleteMany();
    console.log('Job table cleanup success.');
    await prisma.experience.deleteMany();
    console.log('Experience table cleanup success.');
    await prisma.qualification.deleteMany();
    console.log('qualification table cleanup success.');
    await prisma.education.deleteMany();
    console.log('Education table cleanup success.');
    await prisma.company.deleteMany();
    console.log('Company table cleanup success.');
    await prisma.user.deleteMany();
    console.log('User table cleanup success.');
    process.exit(1);
  } catch (error) {
    console.error('Cleanup database error: ', error);
    process.exit(1);
  }
};

cleanUp();
