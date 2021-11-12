import React from 'react'

export default class Com extends React.Component<{ name: string }, { age?: number }> {
  constructor(props: { name: string }) {
    super(props)

    this.state = {}
  }

  render() {
    return <div>hello vitx!</div>
  }
}
