import { IIssue } from '../../../interfaces/IIssue';
import { DeleteIssueEvent } from '../events/DeleteIssueEvent';
import { EventTypes } from '../definitions/events';
import { IssueList } from './IssuesList';


export class IssueItem extends HTMLLIElement {
  constructor(issue: IIssue) {
    super();

    this.issue = issue;
    this.id = `issue-${issue._id}`;

    this.render();
    this.addEventListener('dragstart', this.onIssueDragStart.bind(this));
    this.addEventListener('dragend', this.onIssueDragEnd.bind(this));
    this.addEventListener('dragover', this.onIssueDragOver.bind(this), false);
    this.addEventListener('drop', this.onIssueDrop.bind(this));
  }

  private issue: IIssue;

  private onDelete(): void {
    this.loading = true;

    const event = new DeleteIssueEvent(this.issue._id);
    document.dispatchEvent(event);
  }

  private onIssueDragStart(event: DragEvent) {
    this.style.opacity = '0.5';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify({ ...this.issue }));
  }

  private onIssueDragEnd(event: DragEvent) {
    event.preventDefault();
    this.style.opacity = '1';
    this.style.border = 'none';
  }

  private onIssueDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private onIssueDrop(event: DragEvent) {
    event.preventDefault();
    const issue = JSON.parse(event.dataTransfer.getData('application/json'));

    (this.closest('issue-list') as IssueList).reorderIssues(issue, this.issue);
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
      this.querySelector('.icon').removeAttribute('style');
    } else {
      this.querySelector('.icon').setAttribute('style', 'display: none;');
    }
  }

  public get order(): number {
    return this.issue.order;
  }

  public set loading(isLoading: boolean) {
    this.toggleDelete(!isLoading);

    if (isLoading) {
      this.controlEl.classList.add('is-loading');
    } else {
      this.controlEl.classList.remove('is-loading');
    }
  }

  public updateCreateStatus(success: boolean, updatedIssue?: IIssue): void {
    this.loading = false;

    if (!success) {
      this.remove();
    } else {
      this.issue = updatedIssue;
      this.id = `issue-${this.issue._id}`;
    }
  }

}