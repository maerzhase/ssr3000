import React from 'react';
import PropTypes from 'prop-types';
import { SSR3000Context } from '../server/context';

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  handleClick = (e, context) => {
    e.preventDefault();
    console.log(context);
    context.setEntry('page');
  }

  render() {
    const {
      children,
      ...rest
    } = this.props;
    return (
      <SSR3000Context.Consumer>
        { (context) =>
          <a {...rest} onClick={(e) => this.handleClick(e, context)}>
            {this.props.children}
          </a>
        }
      </SSR3000Context.Consumer>
    );
  }
}