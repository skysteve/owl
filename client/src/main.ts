import { InputForm } from "./components/InputForm";
import { IssueList } from "./components/IssuesList";
import { IssueItem } from "./components/IssueItem";
import { IApiRequestMessage } from "../../interfaces/IApiRequestMessage";
import { LoadingState } from "./components/LoadingState";
import { IApiResponseMessage } from "../../interfaces/IApiResponseMessage";

const apiWorker = new Worker('/assets/js/workers/apiWorker.js');

function loadIssues() {
  const msg: IApiRequestMessage = {
    type: 'issue',
    method: 'getAll',
    list: location.hash.replace('#', '') || undefined
  };

  // set loading state
  (document.querySelector('issue-list') as IssueList).loading = true

  apiWorker.postMessage(msg);
}

function registerComponents() {
  customElements.define('input-form', InputForm);
  customElements.define('issue-list', IssueList);
  customElements.define('issue-item', IssueItem, { extends: 'li' });
  customElements.define('loading-state', LoadingState);
}

function main() {
  registerComponents();
  // initial load of requests
  loadIssues();
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// load new issue list when hash changes
window.addEventListener('hashchange', loadIssues, false);
