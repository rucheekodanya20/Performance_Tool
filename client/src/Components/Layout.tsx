import * as React from 'react';
import Dropdown from 'react-dropdown';
import '../App';
import UpdateFile from './UpdateFile';
import 'react-dropdown/style.css'
interface State {
  openLayout: boolean;
  response: any;
  update: boolean;
  selectedOption: any,
  resultFile: any,
  BenchmarkFile: any,
  benchmarkresponse: any,
  selectedOptionbenchmark :any
  }
  
  class Layout extends React.Component<any, State> {
    constructor(props:any) {
      super(props);
      this.state = {
        response: '',
        benchmarkresponse: '',
        openLayout: props.openLayout,
        update: props.update,
        selectedOption: '',
        resultFile: '',
        BenchmarkFile: '',
        selectedOptionbenchmark:''
      };
    }
    
 public componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));

      this.callApibenchmark()
      .then(res => this.setState({ benchmarkresponse: res.express }))
      .catch(err => console.log(err));
  }

  public callApi = async () => {
    const response = await fetch('/api/check');
    const body = await response.json();
    if (response.status !== 200) 
    {
      throw Error(body.message);
    }
    return body;
  };

  public callApibenchmark = async () => {
    const response = await fetch('/api/benchmark');
    const body = await response.json();
    if (response.status !== 200) 
    {
      throw Error(body.message);
    }
    return body;
  };

    public handlestate=() => {
      this.setState({ update: true, openLayout: false, resultFile: this.state.selectedOption, BenchmarkFile: this.state.selectedOptionbenchmark  });
    }
  
    public change= (selectedOption:any) =>{
      this.setState({ selectedOption: selectedOption});
  }

  public changebenchmark= (selectedOptionbenchmark:any) =>{
    this.setState({ selectedOptionbenchmark: selectedOptionbenchmark, selectedOption: this.state.response[0] });
}
    public render() {
      if (this.state.openLayout) {
        return (
            <div className="App">
        <header className="App-header">
         
          <h1 className="App-title">Performance Updation Tool</h1>
        
        </header>
        <div className="dropdownContainer">
           <p className="dropdownFile">Select Latest Result File :</p>
           
           <Dropdown disabled options={this.state.response} placeholder="Select an option" value={this.state.response[0]}/>
              
        </div>
        <br/>
        <div className="dropdownContainer">
           <p className="dropdownFile">Select Latest Benchmark File :</p>
            <div className="dropdownList"/>
            <Dropdown options={this.state.benchmarkresponse} placeholder="Select an option" onChange={this.changebenchmark} value={this.state.selectedOptionbenchmark}/>
        </div>
        <br/>
        <div className="dropdownContainer">
          <button type="submit" className="DropdownButton" onClick={this.handlestate}>Submit</button>
        </div>
      </div>
        );
      } else {
       return (<div>
         <UpdateFile update={this.state.update} resultFile={JSON.stringify(this.state.response[0])} benchmarkFile={JSON.stringify(this.state.BenchmarkFile.value)}/></div>);
      }
    }
  }
  
  export default Layout;
  