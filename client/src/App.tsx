import * as React from 'react';
import './App.css';
import Layout from "./Components/Layout";


interface State {
  openLayout: boolean;
  update: boolean
  }
  
class App extends React.Component<any,State> {
  constructor(props:any) {
    super(props);
    this.state = {
      openLayout: true,
      update: false
    };
  }

  public render() {
    return (
      <div>
        <Layout openLayout={this.state.openLayout} update={this.state.update}/>
    </div>
    );
  }
}

export default App;
