import { IApiRequestMessage } from "../../../interfaces/IApiRequestMessage";
import { IIssue } from "../../../interfaces/IIssue";
import { IApiResponseMessage } from "../../../interfaces/IApiResponseMessage";
import { retryableFetch } from './retryableFetch';

const BASE_URL = 'http://localhost:3000'

async function createIssue(issue: IIssue, list?: string): Promise<{ newList: boolean, issue: IIssue }> {
  const result = await retryableFetch(`${BASE_URL}/issues${list ? `?list=${list}` : ''}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ ...issue, _id: undefined }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!result || !result.ok) {
    throw new Error(`Failed to create issue ${result?.statusText || 'unknown error'}`);
  }

  const body = await result.json();

  return body as { newList: boolean, issue: IIssue };
}

async function deleteIssue(issue: string, list?: string): Promise<void> {
  const result = await retryableFetch(`${BASE_URL}/issues/${issue}${list ? `?list=${list}` : ''}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!result || !result.ok) {
    throw new Error(`Failed to create issue ${result?.statusText || 'unknown error'}`);
  }
}

async function getAll(list?: string): Promise<IIssue[]> {
  const result = await retryableFetch(`${BASE_URL}/issues${list ? `?list=${list}` : ''}`);

  if (!result || !result.ok) {
    throw new Error(`Failed to load issues ${result?.statusText || 'unknown error'}`);
  }

  const body = await result.json();

  return body.issues as IIssue[];
}

async function reorderIssues({ id, previousId }: { id: string, previousId?: string }, list?: string): Promise<IIssue[]> {
  const result = await retryableFetch(`${BASE_URL}/issues/setSortOrder${list ? `?list=${list}` : ''}`, {
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify({
      id,
      previousId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!result || !result.ok) {
    throw new Error(`Failed to reorder issues ${result?.statusText || 'unknown error'}`);
  }

  const body = await result.json();

  return body.issues as IIssue[];
}

async function resetIssues(list?: string): Promise<void> {
  const result = await retryableFetch(`${BASE_URL}/issues${list ? `?list=${list}` : ''}`, {
    method: 'DELETE'
  });

  if (!result || !result.ok) {
    throw new Error(`Failed to reset list  ${result?.statusText || 'unknown error'}`);
  }

  return;
}

export async function handleIssueRequest(request: IApiRequestMessage): Promise<void> {
  const result: IApiResponseMessage = {
    type: request.type,
    method: request.method,
    data: {},
    originalId: request.issueId || request.issue?._id
  };

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
      result.data = await createIssue(request.issue, request.list);
      break;
    }
    case 'reorder': {
      if (!request.reorder) {
        throw new Error('request.reorder should exist');
      } else {
        await reorderIssues(request.reorder, request.list);
      }
      break;
    }
    case 'reset': {
      await resetIssues(request.list);
      break;
    }
    default: {
      throw new Error(`Unknown issue method ${request.method}`);
    }
  }

  postMessage(result)
}