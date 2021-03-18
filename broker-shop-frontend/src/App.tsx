import React from 'react'

class App extends React.Component {

  componentDidMount() {
    fetch('http://localhost:8090/shop/api/categories')
        .then(response => response.json())
        .then(responseBody => console.log(responseBody))
        .catch(reason => console.log(reason))
  }

  render() {
    return (
        <div>

        </div>
    )
  }
}

export default App;
