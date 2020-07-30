import { EventTypes } from "../definitions/events";

export class InputForm extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  private onAdd(): void {
    const value = this.input.value.trim();

    const event = new CustomEvent(EventTypes.NEW_ISSUE, {
      detail: {
        title: value
      }
    });

    document.dispatchEvent(event);
    // clear input
    this.input.value = '';
    // TODO API request
  }

  private onInputChange(event: KeyboardEvent): void {
    // toggle the button active state if the input has a value
    if (this.input.value.trim().length < 1) {
      this.button.setAttribute('disabled', 'disabled');
      return;
    }

    this.button.removeAttribute('disabled');

    // if enter was pressed, call the onAdd method
    if (event.code === 'Enter') {
      this.onAdd();
    }
  }

  private render(): void {
    const template = document.querySelector('#tmpl-input-form') as HTMLTemplateElement;
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));

    this.button.addEventListener('click', this.onAdd.bind(this));
    this.input.addEventListener('keyup', this.onInputChange.bind(this));
  }

  private get button(): HTMLButtonElement {
    return this.querySelector('button') as HTMLButtonElement;
  }

  private get input(): HTMLInputElement {
    return this.querySelector('input') as HTMLInputElement;
  }
}