import { IApiRequestMessage } from "../../../interfaces/IApiRequestMessage";
import { IIssue } from "../../../interfaces/IIssue";
import { IApiResponseMessage } from "../../../interfaces/IApiResponseMessage";

const BASE_URL = 'http://localhost:3000'

async function getAll(list?: string): Promise<IIssue[]> {
  const result = await fetch(`${BASE_URL}/issues${list ? `?list=${list}` : ''}`);

  if (!result.ok) {
    throw new Error(`Failed to load issues ${result.statusText}`);
  }

  const body = await result.json();

  return body.issues as IIssue[];
}

export async function handleIssueRequest(request: IApiRequestMessage): Promise<void> {
  const result: IApiResponseMessage = {
    type: request.type,
    method: request.method,
    data: {}
  }

  switch (request.method) {
    case 'getAll': {
      result.data.issues = await getAll(request.list);
      break;
    } default: {
      throw new Error(`Unknown issue method ${request.method}`);
    }
  }

  postMessage(result)
}