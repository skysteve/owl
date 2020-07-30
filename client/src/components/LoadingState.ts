export class LoadingState extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<progress class="progress is-danger" max="100"></progress>'
  }
}