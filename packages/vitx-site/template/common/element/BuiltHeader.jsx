import BuiltLogo from './BuiltLogo'

export default function BuiltHeader() {
  return (
    <header className="vitx-built-header">
      <a className="vitx-built-header__logo">
        <BuiltLogo />
        <span>Vitx Site</span>
      </a>
    </header>
  )
}
