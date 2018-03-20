import React from 'react';
import injectSheet from 'react-jss'; // eslint-disable-line
import Hello from './Hello';
import Html from './Html';


const styles = theme => ({ // eslint-disable-line
  content: {
    color: theme.color,
    transition: 'color ease-in-out 2500ms',
    fontSize: '3rem',
    maxWidth: '800px',
    margin: 'auto',
  },
  more: {
    fontSize: '2.5rem',
  },
  contact: {
    fontSize: '1.5rem',
  },
  h6: {
    marginTop: theme.spacing.unit * 10,
  },
});

class Content extends React.Component { // eslint-disable-line

  handleEmail = (e) => {
    e.preventDefault();
    window.location.href = 'mailto:markus@lili16.de';
  }

  render() {
    const {
      classes, //eslint-disable-line
    } = this.props;
    return (
      <div className={classes.content}>
        <Html />
        <h1>
          <Hello />.
          I am Markus — <br />
          Developer and Designer living in Berlin.
        </h1>
        <p>
          I am working with data inside and outside the web since 2011.
          I am familiar with most of the modern design and coding environments
          and if there is no tool to solve a problem I enjoy to build my own.
        </p>
        <p>
          I studied interaction design at&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="///fh-potsdam.de/"
          >
            University of Applied Science Potsdam
          </a>
          &nbsp;and&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="///zhdk.ch"
          >
            University of Arts Zürich
          </a>.
        </p>
        <p>
          Since 2015 I am working as a Design Technologist at&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="///nand.io"
          >
            Studio NAND
          </a>
          .
        </p>
        <p>
          From 2013 - 2015 I build hardware prototypes for&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="///artcom.de"
          >
            ART+COM Studios
          </a>
          .
        </p>
        <h6
          className={classes.h6}
        >
          Interested to collaborate?
        </h6>
        <p className={classes.contact}>
          Get in touch via&nbsp;
          <a
            ref={(ref) => { this.email = ref; }}
            href="mailto:there_is_no_clear_link_to_not_feed_the_machines"
            onMouseDown={this.handleEmail}
          >
            email
          </a>
          .
          <br />
          Or check out what I am doing on&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/maerzhase/"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    );
  }
}

export default injectSheet(styles)(Content);
