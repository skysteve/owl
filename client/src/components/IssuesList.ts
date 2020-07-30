import { EventTypes } from "../definitions/events";
import { IssueItem } from "./IssueItem";

export class IssueList extends HTMLElement {
  constructor() {
    super();

    this.render();
    document.addEventListener(EventTypes.NEW_ISSUE, this.onNewEvent.bind(this))
  }

  private onNewEvent(event: CustomEvent): void {
    console.log('aa', event);
    const element = new IssueItem(event);
    this.eventList.appendChild(element);
  }

  private render(): void {
    const template = document.querySelector('#tmpl-issue-list') as HTMLTemplateElement;
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));
  }

  private get eventList(): HTMLUListElement {
    return this.querySelector('ul') as HTMLUListElement;
  }

}