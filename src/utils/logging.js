import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

export const log = (...str) => {
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

export const webpackReporter = (stats, target) => {
  const messages = formatWebpackMessages(stats.toJson({}, true));

  if (messages.errors.length > 0) {
    errorBanner(`failed to compile ${target && chalk.bgWhite.black(target)}`);
    console.log();
    messages.errors.forEach((message) => {
      console.log(message);
      console.log();
    });
    return true;
  }
  if (messages.warnings.length > 0) {
    warningBanner(`compiled with warnings ${target && chalk.bgWhite.black(target)}`);
    console.log();
    messages.warnings.forEach((message) => {
      log(message);
      console.log();
    });
    return false;
  }

  success(`${chalk.gray(target)} webpack build in ${buildTime(stats)}ms`);
  return false;
};

export default log;
