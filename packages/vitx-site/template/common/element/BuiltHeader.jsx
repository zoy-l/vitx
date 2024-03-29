import BuiltLogo from './BuiltLogo'

const showAside = () => {
  const element = document.getElementById('vitx-built-nav')
  if (element.style.marginLeft) {
    element.style = ''
  } else {
    element.style = 'margin-left: 0;'
  }
}

export default function BuiltHeader() {
  return (
    <header className="vitx-built-header">
      <section className="vitx-built-header__left">
        <a className="vitx-built-header__logo">
          <BuiltLogo />
          <span>Vitx Site</span>
        </a>

        <svg aria-hidden="true" viewBox="0 0 24 24" icon="navigation" onClick={showAside}>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </section>

      <section className="vitx-built-header__right">{/*  */}</section>
    </header>
  )
}
