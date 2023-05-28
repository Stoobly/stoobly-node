export class UrlBuilder {
  url = '';
  query = false;

  constructor() {}

  withPath(path: string) {
    if (this.url.length === 0) {
      this.url = path;
    } else {
      this.url = this.join(this.url, path);
    }
  }

  search(parameter: string, value: string) {
    if (value !== undefined && value !== null) {
      this.glue();
      this.url += parameter + '=' + value;
    }

    return this;
  }

  join(...args: string[]) {
    let path = args[0];
    const len = args.length;

    for (let i = 1; i < len; ++i) {
      const pathLen = path.length;
      let tok = args[i];

      if (tok[0] === '/') {
        tok = tok.replace('/', '');
      }

      if (path[pathLen - 1] === '/') {
        path += tok;
      } else {
        path += '/' + tok;
      }
    }

    return path;
  }

  glue() {
    if (!this.query) {
      this.url += '?';
      this.query = true;
    } else {
      this.url += '&';
    }
  }
}
