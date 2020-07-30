import { IApiRequestMessage } from "../../interfaces/IApiRequestMessage";
import { IApiResponseMessage } from "../../interfaces/IApiResponseMessage";
import { IssueList } from "./components/IssuesList";
import { EventTypes } from "./definitions/events";
import { IIssue } from "../../interfaces/IIssue";

const apiWorker = new Worker('/assets/js/workers/apiWorker.js');

export function loadIssues() {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'getAll',
    list: location.hash.replace('#', '') || undefined
  };

  // set loading state
  (document.querySelector('issue-list') as IssueList).loading = true

  apiWorker.postMessage(msg);
}

apiWorker.onmessage = (event: MessageEvent) => {
  // clear loading state
  const message: IApiResponseMessage = event.data as IApiResponseMessage;

  // sanity check
  if (message.type !== 'issue') {
    throw new Error(`Unknown message type ${JSON.stringify(message)}`);
  }

  switch (message.method) {
    case 'getAll': {
      const issueList = document.querySelector('issue-list') as IssueList;
      issueList.loading = false;
      issueList.issues = message.data?.issues

      break;
    } default: {
      throw new Error(`Unknown method ${message.method}`);
    }
  }
};


document.addEventListener(EventTypes.NEW_ISSUE, (event: CustomEvent) => {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'post',
    list: location.hash.replace('#', '') || undefined,
    issue: event.detail as IIssue
  };

  apiWorker.postMessage(msg)
})