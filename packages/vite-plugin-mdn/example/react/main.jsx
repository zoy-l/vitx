import ReactDom from 'react-dom'
import Counter from './Counter'
import App from './App'

ReactDom.render(
  <>
    <Counter />
    <App />
  </>,
  document.getElementById('app')
)
