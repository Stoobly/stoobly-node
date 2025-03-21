import { SCENARIO_KEY, SESSION_ID } from "../constants/custom_headers";

export class Interceptor {
  static originalXMLHttpRequestOpen = XMLHttpRequest ? XMLHttpRequest.prototype.open : null;
  static originalFetch = window ? window.fetch.bind(window) : null;

  private _active: boolean = false;
  private scenarioKey: string | null = null;
  private sessionId: string | null = null;

  get active() {
    return this._active;
  }

  activate(sessionId?: string) {
    this.sessionId = sessionId || (new Date()).getTime().toString();

    this.decorateFetch();
    this.decorateXMLHttpRequestOpen();
    this._active = true;

    return this.sessionId;
  }

  deactivate() {
    if (Interceptor.originalFetch) {
      window.fetch = Interceptor.originalFetch;
    }

    if (Interceptor.originalXMLHttpRequestOpen) {
      XMLHttpRequest.prototype.open = Interceptor.originalXMLHttpRequestOpen;
    }

    this._active = false;
  }

  withScenario(key: string): void {
    this.scenarioKey = key;
  }

  private decorateFetch() {
    if (!Interceptor.originalFetch) {
      return false;
    }

    const self = this;
    const selfFetch = Interceptor.originalFetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!init) init = {};

      const customHeaders: Record<string, string> = {};

      if (self.scenarioKey) {
        customHeaders[SCENARIO_KEY] = self.scenarioKey;
      }

      if (self.sessionId) {
        customHeaders[SESSION_ID] = self.sessionId;
      }

      init.headers = {
        ...(init.headers as Record<string, string>),
        ...customHeaders,
      };

      return selfFetch(input, init);
    };

    return true;
  }

  private decorateXMLHttpRequestOpen() {
    if (!Interceptor.originalXMLHttpRequestOpen) {
      return false;
    }

    const self = this;
    const selfOpen = Interceptor.originalXMLHttpRequestOpen;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async: boolean = true,
      user?: string | null,
      password?: string | null
    ): void {
      this.addEventListener("readystatechange", function () {
        if (this.readyState !== 1) {
          // Not opened
          return;
        }
          
        if (self.scenarioKey) {
          this.setRequestHeader(SCENARIO_KEY, self.scenarioKey);
        }

        if (self.sessionId) {
          this.setRequestHeader(SESSION_ID, self.sessionId);
        }
      });
      return selfOpen.apply(this, arguments as any);
    };

    return true;
  }
}