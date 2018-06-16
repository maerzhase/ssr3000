import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'url';
import { SSR3000Context } from '../server/context';

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]).isRequired,
    href: PropTypes.string.isRequired,
  }

  get isLocal() {
    const {
      href,
    } = this.props;
    const url = parse(href);
    const origin = parse(window.location.origin);
    return !url.host || (url.protocol === origin && url.host === origin.host);
  }

  get entry() {
    const {
      href,
    } = this.props;
    return href === '/' ? 'index' : href.substr(1); 
  }

  handleClick = (e) => {
    const {
      href,
    } = this.props;
    if (!this.isLocal) return;
    e.preventDefault();
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