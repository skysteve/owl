import { IIssue } from '../../../interfaces/IIssue';

export function validateIssue(issue: IIssue): string | void {
  if (typeof issue !== 'object' || Array.isArray(issue)) {
    return 'Type of issue should be a JSON object';
  }

  if (!issue.title || issue.title.length < 1) {
    return 'Issue title can not be empty';
  }
}