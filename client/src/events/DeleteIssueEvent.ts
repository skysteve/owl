import { EventTypes } from '../definitions/events';

export class DeleteIssueEvent extends CustomEvent<any> {

  constructor(id: string, eventInitDict: CustomEventInit<DeleteIssueEvent> = {}) {
    super(EventTypes.DELETE_ISSUE, {
      detail: {
        issueId: id,
        ...eventInitDict
      }
    });
    this.issueId = id;
  }

  public issueId: string;
}