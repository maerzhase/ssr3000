import React from 'react';

const fakeApi = () => (
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: 'Hello World 2'});
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
        { this.props.data }
        <img src="/static/cat2.jpg" />
      </div>
    );
  }
}