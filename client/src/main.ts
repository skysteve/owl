import { InputForm } from "./components/InputForm";
import { IssueList } from "./components/IssuesList";
import { IssueItem } from "./components/IssueItem";


function registerComponents() {
  customElements.define('input-form', InputForm);
  customElements.define('issue-list', IssueList);
  customElements.define('issue-item', IssueItem, { extends: 'li' });
}

function main() {
  registerComponents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}