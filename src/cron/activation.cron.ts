import cron from 'node-cron';
import { userRepository } from '../repositories/user.repository';
import { sendActivationEmail } from '../utils/email';
import { logger } from '../utils/logger';

const BATCH_SIZE = 50;

export const activateInactiveUsers = async (): Promise<number> => {
  const users = await userRepository.findInactiveOlderThan(15);
  if (!users.length) {
    return 0;
  }

  let totalActivated = 0;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    const ids = batch.map((user) => user.id);

    try {
      const count = await userRepository.activateUsers(ids);
      totalActivated += count;

      for (const user of batch) {
        try {
          await sendActivationEmail(user.email, user.fullname);
        } catch (emailError) {
          logger.error(`Failed to send activation email to ${user.email}: ${emailError instanceof Error ? emailError.message : 'unknown'}`);
        }
      }

      logger.info(`Activated ${count} users in batch`);
    } catch (batchError) {
      logger.error(`Failed to activate batch: ${batchError instanceof Error ? batchError.message : 'unknown'}`);
    }
  }

  return totalActivated;
};

export const startActivationJob = (): void => {
  cron.schedule('* * * * *', async () => {
    try {
      await activateInactiveUsers();
    } catch (error) {
      logger.error('Cron job failed: ' + (error instanceof Error ? error.message : 'unknown'));
    }
  });
};
