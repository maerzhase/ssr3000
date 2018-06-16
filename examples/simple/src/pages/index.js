import React from 'react';
import Link from 'ssr3000/lib/Link';

const fakeApi = () => (
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: 'Index'});
    }, 2000);
  })
)

export default class App extends React.Component {
  static async getInitialProps() {
    const data = await fakeApi();
    return data;
  }
  render() {
    return (
      <div>
        <h1>{ this.props.data }</h1>
        <h3><Link href="/page">Page</Link></h3>
        <img src="/static/cat.jpg" />
      </div>
    );
  }
}
