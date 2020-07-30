import { IIssue } from '../../../interfaces/IIssue';


export class IssueItem extends HTMLLIElement {
  constructor(issue: IIssue) {
    super();

    this.issue = issue;

    this.render();
  }

  private issue: IIssue;

  private render(): void {
    const template = document.querySelector('#tmpl-issue-item') as HTMLTemplateElement;
    const templateContent = template.content;

    templateContent.querySelector('textarea').textContent = this.issue.title;

    this.appendChild(templateContent.cloneNode(true));
  }


}