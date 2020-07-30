export class PopupNotification extends HTMLElement {
  constructor(message?: string) {
    super();

    this.message = message;

    this.render();
  }

  private message: string;

  public display(): void {
    document.body.appendChild(this);

    // self delete after 5s
    setTimeout(() => {
      document.body.removeChild(this);
    }, 5000);
  }

  private render(): void {
    const template = document.querySelector('#tmpl-notification') as HTMLTemplateElement;
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));

    (this.querySelector('#message') as HTMLSlotElement).innerHTML = this.message;
  }
}