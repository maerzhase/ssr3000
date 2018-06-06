import React from 'react';

class App extends React.Component {
  state = {
    code: "",
  }
  handleChange = (e) => {
    this.setState({
      code: e.target.value,
    });
  }

  tryRender = () => {
    try {
      return eval(Babel.transform(this.state.code, { presets: ['es2015'], plugins: ["transform-react-jsx"] }).code);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        <textarea onChange={this.handleChange} />
        <div>
          {this.tryRender()}
        </div>
      </div>
    );
  }
};

export default App;
