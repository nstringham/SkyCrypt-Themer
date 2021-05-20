const dialogTemplate = document.querySelector("template#dialog") as HTMLTemplateElement;

declare global {
  interface HTMLElementEventMap {
    closed: CustomEvent<{ action: string }>;
  }
}

export function asyncConfirm(heading: string, body: string, action: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const fragment = dialogTemplate.content.cloneNode(true) as DocumentFragment;
    const dialogElement = fragment.querySelector("mwc-dialog") as HTMLElement;

    dialogElement.setAttribute("heading", heading);

    (dialogElement.querySelector("#dialog-body") as HTMLDivElement).innerHTML = body;
    (dialogElement.querySelector("#primary-action") as HTMLButtonElement).innerHTML = action;

    dialogElement.addEventListener("closed", (event) => {
      resolve(event.detail.action === "ok");
      setTimeout(() => dialogElement.remove(), 100);
    });

    document.body.appendChild(fragment);
  });
}
