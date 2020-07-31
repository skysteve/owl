import { IApiRequestMessage } from "../../interfaces/IApiRequestMessage";
import { IApiResponseMessage } from "../../interfaces/IApiResponseMessage";
import { IssueList } from "./components/IssuesList";
import { EventTypes } from "./definitions/events";
import { IIssue } from "../../interfaces/IIssue";
import { DeleteIssueEvent } from "./events/DeleteIssueEvent";
import { PopupNotification } from "./components/PopupNotification";

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

  if (message.error) {
    const notification = new PopupNotification(message.error);
    notification.display();
    return;
  }

  switch (message.method) {
    case 'delete': {
      break;
    }
    case 'getAll': {
      const issueList = document.querySelector('issue-list') as IssueList;
      issueList.loading = false;
      issueList.issues = message.data?.issues

      break;
    }
    case 'reset': {
      (document.querySelector('issue-list') as IssueList).reset();
      break;
    }
    default: {
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
});

document.addEventListener(EventTypes.DELETE_ISSUE, (event: DeleteIssueEvent) => {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'delete',
    list: location.hash.replace('#', '') || undefined,
    issueId: event.issueId
  };

  apiWorker.postMessage(msg)
});

document.addEventListener(EventTypes.REORDER_ISSUE, (event: CustomEvent) => {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'reorder',
    list: location.hash.replace('#', '') || undefined,
    reorder: {
      ...event.detail
    }
  };

  apiWorker.postMessage(msg)
});

document.querySelector('#btn-reset').addEventListener('click', () => {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'reset',
    list: location.hash.replace('#', '') || undefined,
  };

  apiWorker.postMessage(msg)
});