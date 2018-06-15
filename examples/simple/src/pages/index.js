import React from 'react';
import Link from 'ssr3000/lib/Link';
import { SSR3000Provider } from 'ssr3000/lib/server/context';

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
        <SSR3000Provider><h3><Link href="/page">Page</Link></h3></SSR3000Provider>
        <img src="/static/cat.jpg" />
      </div>
    );
  }
}
