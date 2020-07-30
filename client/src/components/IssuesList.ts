import { EventTypes } from "../definitions/events";

export class IssueList extends HTMLElement {
  constructor() {
    super();

    this.render();
    document.addEventListener(EventTypes.NEW_ISSUE, this.onNewEvent.bind(this))
  }

  private onNewEvent(event: CustomEvent): void {
    // TODO should be a custom element
    const element = document.createElement('li');
    element.textContent = event.detail.value;
    this.eventList.appendChild(element);
  }

  private render(): void {
    const template = document.querySelector('#tmpl-issue-list') as HTMLTemplateElement;
    const templateContent = template.content;

    this.appendChild(templateContent);
  }

  private get eventList(): HTMLUListElement {
    return this.querySelector('ul') as HTMLUListElement;
  }

}