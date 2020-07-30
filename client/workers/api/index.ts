import { IApiRequestMessage } from "../../../interfaces/IApiRequestMessage";
import { handleIssueRequest } from "./issues";
import { IApiResponseMessage } from "../../../interfaces/IApiResponseMessage";

onmessage = (event: MessageEvent) => {
  const message = event.data as IApiRequestMessage;

  try {
    switch (message.type) {
      case 'issue': {
        handleIssueRequest(message);
        return;
      } default: {
        throw new Error(`Unknown message type ${message.type}`);
      }
    }
  } catch (ex) {
    console.error('API request failed', ex);
    postMessage({ error: ex.message, type: message.type, method: message.method } as IApiResponseMessage)
  }
}