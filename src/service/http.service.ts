async function request(url: string, init?: RequestInit): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new Error(`通信失敗: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) {
    throw new Error(`HTTPリクエスト失敗: ${response.status} ${response.statusText}`);
  }

  return response;
}

async function get(url: string): Promise<Response> {
  return request(url);
}

async function post(url: string, payload: unknown): Promise<Response> {
  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function put(url: string, payload: unknown): Promise<Response> {
  return request(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function patch(url: string, payload: unknown): Promise<Response> {
  return request(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function del(url: string): Promise<Response> {
  return request(url, {
    method: "DELETE",
  });
}

export { get, post, put, patch, del };
