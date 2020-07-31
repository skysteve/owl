import { EventTypes } from "../definitions/events";
import { IssueItem } from "./IssueItem";
import { LoadingState } from "./LoadingState";
import { IIssue } from "../../../interfaces/IIssue";

export class IssueList extends HTMLElement {
  constructor() {
    super();

    this.render();
    document.addEventListener(EventTypes.NEW_ISSUE, this.onNewEvent.bind(this));

    this.addEventListener('dragstart', this.onIssueDragStart.bind(this));
    this.addEventListener('dragend', this.onIssueDragEnd.bind(this));
    this.addEventListener('dragstart', this.onIssueDragStart.bind(this));
    this.addEventListener('dragend', this.onIssueDragEnd.bind(this));
  }

  private _issues: IIssue[] = [];

  private onIssueDragStart() {
    this.style.border = '1px solid green';
  }

  private onIssueDragEnd() {
    this.style.border = 'unset';
  }


  private onNewEvent(event: CustomEvent): void {
    const element = new IssueItem(event.detail as IIssue);
    this.eventList.appendChild(element);
  }

  private render(): void {
    const template = document.querySelector('#tmpl-issue-list') as HTMLTemplateElement;
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));

    if (Array.isArray(this._issues)) {
      this._issues.forEach((issue) => {
        const element = new IssueItem(issue);
        this.eventList.appendChild(element);
      });
    }
  }

  private get eventList(): HTMLUListElement {
    return this.querySelector('ul') as HTMLUListElement;
  }

  public reset() {
    this._issues = [];
    this.innerHTML = '';
    this.render();
  }

  public set loading(isLoading: boolean) {
    // always clear inner html
    this.innerHTML = '';

    // if loading, set the loading bar
    if (isLoading) {
      this.appendChild(new LoadingState());
    }
  }

  public set issues(issues: IIssue[]) {
    if (!Array.isArray(issues)) {
      throw new Error(`Expected issues to be an array but got ${JSON.stringify(issues)}`);
    }

    this._issues = issues;
    this.render();
  }

}