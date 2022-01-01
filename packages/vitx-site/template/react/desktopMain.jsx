import BuiltRouter from '@vitx-documents-desktop'
import BuiltSite from 'vitx-site-common/element'
import { render } from 'react-dom'
import 'vitx-site-common/styles'

function App() {
  return <BuiltRouter site={BuiltSite} />
}

render(<App />, document.getElementById('vitx-app'))
