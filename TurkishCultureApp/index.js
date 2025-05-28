import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the main component
registerRootComponent(App);

// For web platform
AppRegistry.registerComponent('TurkishCultureApp', () => App);
AppRegistry.runApplication('TurkishCultureApp', {
  initialProps: {},
  rootTag: document.getElementById('root'),
}); 