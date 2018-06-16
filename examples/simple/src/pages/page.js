import React from 'react';
import PropTypes from 'prop-types';
import Link from 'ssr3000/lib/Link';


const fakeApi = () => (
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: 'Page'});
    }, 2000);
  })
)

export default class Page extends React.Component {
  static propTypes = {
    data: PropTypes.string.isRequired
  }
  static async getInitialProps() {
    const data = await fakeApi();
    return data;
  }
  render() {
    return (
      <div>
        <h1>{ this.props.data }</h1>
        <h3><Link href="/">Index</Link></h3>
        <img style={{maxWidth: '400px'}} src="/static/cat2.jpg" />
      </div>
    );
  }
}
