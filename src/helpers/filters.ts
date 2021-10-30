import { startCase } from 'lodash';

function UCFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  words: (str: string): string => UCFirst(startCase(str).toLowerCase()),
};
