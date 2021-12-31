import BuiltSite from 'vitx-site-common/element'
import BuiltRouter from '@vitx-documents'
import { render } from 'react-dom'
import 'vitx-site-common/styles'

function App() {
  return <BuiltRouter site={BuiltSite} />
}

render(<App />, document.getElementById('vitx-app'))
