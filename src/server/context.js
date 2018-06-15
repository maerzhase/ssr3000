import React from 'react';
import PropTypes from 'prop-types';

const defaultContext = {
  entry: 'index',
  chunks: {},
  initialProps: {},
  App: null,
  setEntry: null,
};

export const SSR3000Context = React.createContext(
  defaultContext
);

export class SSR3000Provider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.object,
  }
  static defaultProps = {
    value: {},
  }
  constructor(props) {
    super(props);
    this.setEntry = (entry) => {
      this.setState(() => ({
        entry,
      }));
    };
    this.state = {
      ...props.value,
      setEntry: this.setEntry,
    }
  }
  render() {
    console.log(this.state);
    return (
      <SSR3000Context.Provider
        value={this.state}
      >
        {this.props.children}
      </SSR3000Context.Provider>
    )
  }
}
