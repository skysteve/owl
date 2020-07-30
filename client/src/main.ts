import { InputForm } from "./components/InputForm";

function registerComponents() {
  customElements.define('input-form', InputForm)
}

function main() {
  registerComponents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}