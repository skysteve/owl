import { validateIssue } from '../../src/helpers/validation';

describe('helpers/validation', () => {
  describe('validateIssue', () => {
    it('should return error if issue is an array', () => {
      const issue: any = []; // any to ignore type checking in test

      expect(validateIssue(issue)).toEqual('Type of issue should be a JSON object');
    });

    it('should return error if there is no title', () => {
      const issue: any = {}; // any to ignore type checking in test

      expect(validateIssue(issue)).toEqual('Issue title can not be empty');
    });

    it('should return error if title is whitespace', () => {
      const issue: any = {
        title: '    '
      }; // any to ignore type checking in test

      expect(validateIssue(issue)).toEqual('Issue title can not be empty');
    });

    it('should return undefined if issue has a title', () => {
      const issue: any = {
        title: 'hello testing'
      }; // any to ignore type checking in test

      expect(validateIssue(issue)).toBeUndefined();
    });
  });
});