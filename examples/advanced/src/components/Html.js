import injectSheet from 'react-jss';
import Media from './mediaQueries';

const styles = theme => ({ // eslint-disable-line
  '@global': {
    [Media.xs]: {
      html: {
        fontSize: '13px',
      },
    },
    [Media.s]: {
      html: {
        fontSize: '13px',
      },
    },
    [Media.m]: {
      html: {
        fontSize: '14px',
      },
    },
    [Media.l]: {
      html: {
        fontSize: '16px',
      },
    },
    [Media.xl]: {
      html: {
        fontSize: '16px',
      },
    },
    html: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      width: '100%',
      minHeight: '100%',
      background: theme.background,
      transition: 'background-color ease-in-out 2500ms',
    },
    'h1, h2, h3, h4, h5, h6': {
      marginTop: 0,
    },
    h1: {
      fontSize: '3.7rem',
      marginBottom: theme.spacing.unit * 6,
    },
    h2: {
      fontSize: '3.2rem',
      marginBottom: theme.spacing.unit * 6,
    },
    h3: {
      fontSize: '2.8rem',
      marginBottom: theme.spacing.unit * 6,
    },
    h4: {
      fontSize: '2.3rem',
      marginBottom: theme.spacing.unit * 2,
    },
    h5: {
      fontSize: '2rem',
      marginBottom: theme.spacing.unit * 2,
    },
    h6: {
      fontSize: '1.5rem',
      marginBottom: theme.spacing.unit * 2,
    },
    p: {
      fontSize: '2rem',
      marginTop: 0,
    },
    a: {
      textDecoration: 'underline',
      color: 'rgb(232,79,37)',
      transition: 'color ease-in-out 300ms',
      '&:hover': {
        color: 'rgba(232,79,37,0.7)',
      },
    },
  },
});

const Html = () => null;

export default injectSheet(styles)(Html);
