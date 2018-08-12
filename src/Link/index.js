import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'url';
import { SSR3000Context } from '../server/context';

const injectScript = async (entry) => {
  return new Promise((resolve) => {
    const src = `/static/__SSR3000.${entry}.js`;
    let script = document.querySelector(`[src="${src}"]`);
    if (script) return resolve();
    script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    document.body.appendChild(script);
  })
}

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]).isRequired,
    href: PropTypes.string.isRequired,
    prefetch: PropTypes.boolean,
    preload: PropTypes.boolean,
  }

  static defaultProps = {
    prefetch: false,
    preload: false,
  }

  componentDidMount() {
    const {
      preload,
      prefetch,
    } = this.props;
    if (this.isLocal && (prefetch || preload)) injectScript(this.entry);
  }

  get isLocal() {
    const {
      href,
    } = this.props;
    const url = parse(href);
    const origin = parse(window.location.origin);
    return !url.host ||
      (url.protocol === origin.protocol && url.host === origin.host);
  }

  get entry() {
    const {
      href,
    } = this.props;
    const url = parse(href);
    return url.pathname === '/' ? 'index' : url.pathname.substr(1);
  }

  handleClick = async (e) => {
    const {
      href,
    } = this.props;
    if (!this.isLocal) return;
    e.preventDefault();
    await injectScript(this.entry);
    const {
      default: {
        getInitialProps
      },
    } = window.__SSR3000[this.entry];
    if (getInitialProps) {
      const props = await getInitialProps();
      window.___SRR3000InitialProps = props;
    }
    window.history.pushState({}, href, href);
    window.__SSR3000.render.default(this.entry);
  }

  render() {
    const {
      children,
      ...rest
    } = this.props;
    return (
      <a
        {...rest}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    );
  }
}