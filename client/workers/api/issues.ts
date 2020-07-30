import { IApiRequestMessage } from "../../../interfaces/IApiRequestMessage";
import { IIssue } from "../../../interfaces/IIssue";
import { IApiResponseMessage } from "../../../interfaces/IApiResponseMessage";

const BASE_URL = 'http://localhost:3000'

async function createIssue(issue: IIssue, list?: string): Promise<IIssue> {
  const result = await fetch(`${BASE_URL}/issues${list ? `?list=${list}` : ''}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(issue),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!result.ok) {
    throw new Error(`Failed to create issue ${result.statusText}`);
  }

  const body = await result.json();

  return body.issue as IIssue;
}

async function deleteIssue(issue: string, list?: string): Promise<void> {
  const result = await fetch(`${BASE_URL}/issues/${issue}${list ? `?list=${list}` : ''}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!result.ok) {
    throw new Error(`Failed to create issue ${result.statusText}`);
  }
}

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
    case 'delete': {
      await deleteIssue(request.issueId, request.list);
      break;
    }
    case 'getAll': {
      result.data.issues = await getAll(request.list);
      break;
    }
    case 'post': {
      result.data.issue = await createIssue(request.issue, request.list);
    }
    default: {
      throw new Error(`Unknown issue method ${request.method}`);
    }
  }

  postMessage(result)
}