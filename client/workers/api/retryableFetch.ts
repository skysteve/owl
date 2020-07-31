

const MAX_RETRY = 3;
const RETRY_INTERVAL = 1000;

export async function retryableFetch(input: RequestInfo, init?: RequestInit, retryCount: number = 0): Promise<Response> {

  try {
    return await fetch(input, init);
  } catch (ex) {
    if (retryCount >= MAX_RETRY) {
      postMessage({
        error: `Request failed ${MAX_RETRY} times. Please try again later`
      });
      console.error(ex);
      return;
    }

    console.error(`Fetch Failed ${input}, retrying`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        retryableFetch(input, init, retryCount += 1)
          .then(resolve)
          .catch(reject);
      }, RETRY_INTERVAL);
    })
  }
} 