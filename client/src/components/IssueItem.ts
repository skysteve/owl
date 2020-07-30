import { IIssue } from '../../../interfaces/IIssue';
import { DeleteIssueEvent } from '../events/DeleteIssueEvent';


export class IssueItem extends HTMLLIElement {
  constructor(issue: IIssue) {
    super();

    this.issue = issue;

    this.render();
  }

  private issue: IIssue;

  private onDelete(): void {
    this.loading = true;

    const event = new DeleteIssueEvent(this.issue._id);
    document.dispatchEvent(event);
  }

  private render(): void {
    const template = document.querySelector('#tmpl-issue-item') as HTMLTemplateElement;
    const templateContent = template.content;

    templateContent.querySelector('textarea').textContent = this.issue.title;

    this.appendChild(templateContent.cloneNode(true));

    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  private get controlEl(): HTMLDivElement {
    return this.querySelector('.control') as HTMLDivElement;
  }

  private get deleteButton(): HTMLButtonElement {
    return this.querySelector('.delete-button') as HTMLButtonElement;
  }

  private toggleDelete(isVisible: boolean) {
    if (isVisible) {
      this.removeAttribute('style');
    } else {
      this.querySelector('.icon').setAttribute('style', 'display: none;');
    }
  }

  public set loading(isLoading: boolean) {
    this.toggleDelete(!isLoading);

    if (isLoading) {
      this.controlEl.classList.add('is-loading');
    } else {
      this.controlEl.classList.remove('is-loading');
    }
  }

}