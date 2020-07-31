import { IIssue } from '../../../interfaces/IIssue';
import { DeleteIssueEvent } from '../events/DeleteIssueEvent';
import { EventTypes } from '../definitions/events';


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
    event.dataTransfer.setData('text', this.id);
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
    const issueId = event.dataTransfer.getData('text');

    const elIssue = this.parentElement.querySelector(`#${issueId}`);
    this.parentElement.removeChild(elIssue);
    this.after(elIssue);

    const reorderEvent = new CustomEvent(EventTypes.REORDER_ISSUE, {
      detail: {
        id: issueId.replace('issue-', ''),
        previousId: this.issue._id
      }
    });

    document.dispatchEvent(reorderEvent);
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