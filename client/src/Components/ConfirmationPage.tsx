import * as React from 'react';
import Dropdown from 'react-dropdown';
import '../App';
import UpdateFile from './UpdateFile';
import 'react-dropdown/style.css'
interface State {

    response: any;
    success: boolean;
    failure: boolean;
    jsoncontent: Array<Object>,
 
  }
  
  class ConfirmationPage extends React.Component<any, State> {
    constructor(props:any) {
      super(props);
      this.state = {
        
        response: '',
        success: false,
        failure: false,
        jsoncontent: props.jsoncontent,
        
      };
    }
    
 public componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));

      if(this.state.response["msg"] == "updation done")
        this.setState({ success : true})
      else
        this.setState({failure: true})

  }

  public callApi = async () => {
      
    const response = await fetch('/api/updateFile', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(this.state.jsoncontent), // body data type must match "Content-Type" header
    });
    
    const body = await response.json();
    if (response.status !== 200) 
    {
      throw Error(body.message);
    }
    return body;
  };


   
    public render() {
      
      return (
        <div className="App">
    <header className="App-header">
     
      <h1 className="App-title">Performance Updation Tool</h1>
    
    </header>
    <div style={{
      marginLeft: "20px",
      marginTop: "10%",
      textAlign: "center",
      fontWeight :"bold",
      fontSize : "25px"
    }}>

        <p>Benchmark Updation status : {this.state.response["msg"]} </p>
        
         
    </div>
    <br/>
   
  </div>
    );
        
      } 
  }
  
  export default ConfirmationPage;
  