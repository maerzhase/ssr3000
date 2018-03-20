import { Component } from 'react';

const HELLOS = [
  'Hallo',
  'Hi',
  'Привет',
  'Hej',
  'Hæ',
  'Bom dia',
  'Bonjour',
  'Cześć',
];

const hello = HELLOS[(Math.random() * (HELLOS.length - 1)).toFixed(0)];

class Hello extends Component {
  render() {
    return hello;
  }
}

export default Hello;
