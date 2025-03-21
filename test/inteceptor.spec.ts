import { jest } from "@jest/globals";
import { SpiedFunction } from "jest-mock";

import { SCENARIO_KEY, SESSION_ID } from "@constants/custom_headers";
import { Interceptor } from "@core/interceptor";

describe("Interceptor", () => {
  const scenarioKey = "test-key";
  const sessionId = "test-session";
  const url = "https://example.com";

  let interceptor: Interceptor;

  describe('fetch', () => {
    let fetchMock = jest.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      return Promise.resolve(new Response(null, { status: 200 }));
    });
    let originalFetch: typeof window.fetch = window.fetch;

    beforeAll(async () => {
      Interceptor.originalFetch = fetchMock;
      interceptor = new Interceptor();
      interceptor.withScenario(scenarioKey, sessionId);
      interceptor.activate();
      await fetch(url);
    });

    afterAll(() => {
      Interceptor.originalFetch = originalFetch;
    });

    test(`adds '${SCENARIO_KEY}' header to fetch requests`, async () => {
      expect(fetchMock).toHaveBeenCalledWith(url, {
        headers: expect.objectContaining({
          [SCENARIO_KEY]: scenarioKey,
        }),
      }); 
    });

    test(`adds '${SESSION_ID}' header to fetch requests`, async () => {
      expect(fetchMock).toHaveBeenCalledWith(url, {
        headers: expect.objectContaining({
          [SESSION_ID]: expect.any(String),
        }),
      });
    });

    describe('deactivate', () => {
      beforeAll(async () => {
        fetchMock.mockClear();
        interceptor.deactivate();

        await fetch(url);
      });

      test(`does not add '${SCENARIO_KEY}' header to fetch requests`, async () => {
        expect(fetchMock).not.toHaveBeenCalledWith(SCENARIO_KEY, scenarioKey);
      });


      test(`does not add '${SESSION_ID}' header to fetch requests`, async () => {
        expect(fetchMock).not.toHaveBeenCalledWith(SESSION_ID, expect.any(String));
      });
    });
  });

  describe('XMLHttpRequest.prototype.open', () => {
    let originalXMLHttpRequestOpen: typeof XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.open;
    let setRequestHeaderMock: SpiedFunction<(name: string, value: string) => void>;

    beforeAll(() => {
      interceptor.withScenario(scenarioKey, sessionId);
      interceptor.activate();

      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      setRequestHeaderMock = jest.spyOn(xhr, "setRequestHeader");
      xhr.dispatchEvent(new Event("readystatechange"));
    });

    afterAll(() => {
      XMLHttpRequest.prototype.open = originalXMLHttpRequestOpen;
    });

    test(`adds '${SCENARIO_KEY}' header to fetch requests`, async () => {
      expect(setRequestHeaderMock).toHaveBeenCalledWith(SCENARIO_KEY, scenarioKey);
    });


    test(`adds '${SESSION_ID}' header to fetch requests`, async () => {
      expect(setRequestHeaderMock).toHaveBeenCalledWith(SESSION_ID, expect.any(String));
    });

    describe('deactivate', () => {
      beforeAll(() => {
        setRequestHeaderMock.mockClear();
        interceptor.deactivate();

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        setRequestHeaderMock = jest.spyOn(xhr, "setRequestHeader");
        xhr.dispatchEvent(new Event("readystatechange"));
      });

      test(`does not add '${SCENARIO_KEY}' header to fetch requests`, async () => {
        expect(setRequestHeaderMock).not.toHaveBeenCalledWith(SCENARIO_KEY, scenarioKey);
      });

      test(`does not add '${SESSION_ID}' header to fetch requests`, async () => {
        expect(setRequestHeaderMock).not.toHaveBeenCalledWith(SESSION_ID, expect.any(String));
      });
    });
  });
});