import BuiltRouter from '@vitx-documents-mobile'
import 'vitx-site-common/styles/mobile'
import { render } from 'react-dom'

function App() {
  return <BuiltRouter />
}

render(<App />, document.getElementById('vitx-app'))
