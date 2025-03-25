import { SCENARIO_KEY, SESSION_ID } from "../constants/custom_headers";

export class Interceptor {
  static originalXMLHttpRequestOpen = XMLHttpRequest ? XMLHttpRequest.prototype.open : null;
  static originalFetch = window ? window.fetch.bind(window) : null;

  private _applied: boolean = false;
  private urls: (RegExp | string)[] = [];
  private scenarioKey: string | null = null;
  private sessionId: string | null = null;

  get applied() {
    return this._applied;
  }

  apply(sessionId?: string) {
    this.sessionId = sessionId || (new Date()).getTime().toString();

    if (typeof window !== "undefined" && "cy" in window) {
      this.decorateCypress(); // Cypress loads the application within an iframe
    } else {
      this.decorateFetch();
      this.decorateXMLHttpRequestOpen();
    }

    this._applied = true;

    return this.sessionId;
  } 

  clear() {
    if (Interceptor.originalFetch) {
      window.fetch = Interceptor.originalFetch;
    }

    if (Interceptor.originalXMLHttpRequestOpen) {
      XMLHttpRequest.prototype.open = Interceptor.originalXMLHttpRequestOpen;
    }

    this._applied = false;
  }

  withUrls(urls: (RegExp | string)[]) {
    this.urls = urls;
  }

  withScenario(key: string): void {
    this.scenarioKey = key;
  }

  private decorateCypress() {
    this.urls.forEach((url) => {
      (window as any).cy?.intercept(url, (req: { continue: () => void, headers: any }) => {
        if (this.scenarioKey) {
          req.headers[SCENARIO_KEY] = this.scenarioKey;
        }

        if (this.sessionId) {
          req.headers[SESSION_ID] = this.sessionId;
        }

        req.continue();
      });
    });
  }

  private decorateFetch() {
    if (!Interceptor.originalFetch) {
      return false;
    }

    const self = this;
    const original = Interceptor.originalFetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = input instanceof Request ? input.url : input.toString();

      if (self.allowedUrl(url)) {
        const customHeaders: Record<string, string> = {};

        if (self.scenarioKey) {
          customHeaders[SCENARIO_KEY] = self.scenarioKey;
        }

        if (self.sessionId) {
          customHeaders[SESSION_ID] = self.sessionId;
        }

        if (!init) init = {};
        init.headers = {
          ...(init.headers as Record<string, string>),
          ...customHeaders,
        };
      }

      return original(input, init);
    };

    return true;
  }

  private allowedUrl(url: string) {
    for (let i = 0; i < this.urls.length; ++i) {
      const urlAllowed = this.urls[i];

      if (urlAllowed instanceof RegExp) {
        if (urlAllowed.test(url)) {
          return true;
        }
      }

      if (urlAllowed === url) {
        return true;
      }
    }

    return false;
  }

  private decorateXMLHttpRequestOpen() {
    if (!Interceptor.originalXMLHttpRequestOpen) {
      return false;
    }

    const self = this;
    const original = Interceptor.originalXMLHttpRequestOpen;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async: boolean = true,
      user?: string | null,
      password?: string | null
    ): void {
      this.addEventListener("readystatechange", function () {
        if (this.readyState !== 1) { 
          return; // Not opened
        }
        
        if (!self.allowedUrl(url)) {
          return;
        }

        if (self.scenarioKey) {
          this.setRequestHeader(SCENARIO_KEY, self.scenarioKey);
        }

        if (self.sessionId) {
          this.setRequestHeader(SESSION_ID, self.sessionId);
        }
      });
      return original.apply(this, arguments as any);
    };

    return true;
  }
}