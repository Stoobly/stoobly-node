import { SCENARIO_KEY, SESSION_ID } from "../constants/custom_headers";

export class Interceptor {
  static originalXMLHttpRequestOpen = XMLHttpRequest ? XMLHttpRequest.prototype.open : null;
  static originalFetch = window ? window.fetch.bind(window) : null;

  private _applied: boolean = false;
  private origins: string[] = [];
  private scenarioKey: string | null = null;
  private sessionId: string | null = null;

  get applied() {
    return this._applied;
  }

  apply(sessionId?: string) {
    this.sessionId = sessionId || (new Date()).getTime().toString();

    this.decorateFetch();
    this.decorateXMLHttpRequestOpen();
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

  withOrigins(origins: string[]) {
    this.origins = origins;
  }

  withScenario(key: string): void {
    this.scenarioKey = key;
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
    for (let i = 0; i < this.origins.length; ++i) {
      if (url.startsWith(this.origins[i])) {
        return true; // Only allow urls that start with one of the specified origins
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