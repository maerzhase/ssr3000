import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

const log = (...str) => {
  console.log('[SSR]', ...str);
};

export const info = (...str) => {
  log(chalk.bgWhite.black(...str));
};

export const success = (...str) => {
  log(chalk.green(...str));
};

export const warning = (...str) => {
  log(chalk.yellow(...str));
};

export const warningBanner = (...str) => {
  log(chalk.bgYellow.black(...str));
};

export const error = (...str) => {
  log(chalk.red(...str));
};

export const errorBanner = (...str) => {
  log(chalk.bgRed.black(...str));
};

export const buildTime = (stats) => {
  const {
    startTime,
    endTime,
  } = stats;
  return `${Number(endTime) - Number(startTime)}`;
};

export const webpackReporter = (stats, env) => {
  const messages = formatWebpackMessages(stats.toJson({}, true));

  if (messages.errors.length > 0) {
    errorBanner(`${env && chalk.bgWhite.black(env)} failed to compile`);
    console.log();
    messages.errors.forEach((message) => {
      console.log(message);
      console.log();
    });
    return true;
  }
  if (messages.warnings.length > 0) {
    warningBanner(`${env && chalk.bgWhite.black(env)} compiled with warnings`);
    console.log();
    messages.errors.forEach((message) => {
      log(message);
      console.log();
    });
    return true;
  }

  success(`webpack build in ${buildTime(stats)}ms`);
  return true;
};

export default log;
