import React from 'react';
import injectSheet from 'react-jss'; // eslint-disable-line
import Html from './Html';

const styles = theme => ({ // eslint-disable-line
  content: {
    color: theme.color,
    transition: 'color ease-in-out 2500ms',
    fontSize: '3rem',
    maxWidth: '800px',
    margin: 'auto',
  },
});

class Content extends React.Component { // eslint-disable-line
  render() {
    const {
      classes, //eslint-disable-line
    } = this.props;
    return (
      <div className={classes.content}>
        <Html />
        Hello World
      </div>
    );
  }
}

export default injectSheet(styles)(Content);
