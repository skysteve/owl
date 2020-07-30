import { InputForm } from "./components/InputForm";
import { IssueList } from "./components/IssuesList";
import { IssueItem } from "./components/IssueItem";
import { LoadingState } from "./components/LoadingState";
import { PopupNotification } from "./components/PopupNotification";
import { loadIssues } from './apiHelper'


function registerComponents() {
  customElements.define('input-form', InputForm);
  customElements.define('issue-list', IssueList);
  customElements.define('issue-item', IssueItem, { extends: 'li' });
  customElements.define('loading-state', LoadingState);
  customElements.define('popup-notification', PopupNotification);
}

function main() {
  registerComponents();
  // initial load of requests
  loadIssues();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// load new issue list when hash changes
window.addEventListener('hashchange', loadIssues, false);
