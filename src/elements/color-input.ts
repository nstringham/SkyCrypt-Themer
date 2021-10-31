import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { defaultTheme, ColorName, BackgroundName } from "../common.js";

@customElement("color-input")
export class ColorInputElement extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    label {
      display: inline-flex;
      min-width: 200px;
      position: relative;
      border-radius: var(--mdc-shape-small);
      height: 56;
      align-items: center;
      justify-content: space-between;
    }

    span {
      padding-left: max(16px, calc(var(--mdc-shape-small, 4px) + 4px));
      color: white;
      text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      text-transform: capitalize;
      font-weight: 500;
      font-size: 1rem;
    }

    input {
      visibility: hidden;
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    input,
    input::-webkit-color-swatch-wrapper,
    input::-webkit-color-swatch {
      padding: 0;
      border: none;
      height: 100%;
      width: 100%;
    }

    input::-webkit-color-swatch {
      visibility: visible;
      border-radius: var(--mdc-shape-small);
    }
  `;

  @property({ attribute: "color-name" })
  colorName = "";

  @property({ attribute: "is-background", type: Boolean })
  isBackground = true;

  @property()
  value!: string;

  render() {
    return html`
      <label>
        <span>${this.colorName} color</span>
        <input type="color" .value="${this.value}" @input="${this._onInput}" @change="${this._onChange}" />
        <mwc-icon-button icon="format_color_reset" @click="${this.reset}"></mwc-icon-button>
      </label>
    `;
  }

  private _onInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
  }

  private _onChange(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  reset(): void {
    this.value = this.defaultColor;
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  get defaultColor(): string {
    if (this.isBackground) {
      return defaultTheme.backgrounds[this.colorName as BackgroundName]?.color ?? defaultTheme.colors.icon;
    } else {
      return defaultTheme.colors[this.colorName as ColorName] ?? defaultTheme.colors.icon;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "color-input": ColorInputElement;
  }
}
