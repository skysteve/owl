import { InputForm } from "./components/InputForm";
import { IssueList } from "./components/IssuesList";

function registerComponents() {
  customElements.define('input-form', InputForm)
  customElements.define('issue-list', IssueList)
}

function main() {
  registerComponents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}