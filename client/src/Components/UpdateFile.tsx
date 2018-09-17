//tslint:disable: no-unused-variable
import * as React from 'react';
import '../App';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import selectTableHOC from 'react-table/lib/hoc/selectTable'
import treeTableHOC from 'react-table/lib/hoc/treeTable'
import ConfirmationPage from './ConfirmationPage';

var _react = require('react');

import { ReactTableDefaults } from 'react-table'
Object.assign(ReactTableDefaults, {
    PivotValueComponent: function (props) {
        var subRows = props.subRows,
            value = props.value;

        var passed = 0;
        var failed = 0;
        Object.keys(subRows).forEach(testcase => {
            let data = subRows[testcase]["value"]
            let values = data.split("(");
            let benchmarkdata = (values[1]).split(")");

            if (parseInt(values[0].trim()) <= parseInt(benchmarkdata[0].trim()))
                passed++;
            else
                failed++;
        })

        return <span style={{ fontWeight: "bold" }}> {value} <span style={{ color: "green" }}>: (Passed: {passed}</span> /<span style={{ color: "red" }}> Failed: {failed})</span></span>
    }
}

)

const SelectTreeTable = selectTableHOC(treeTableHOC(ReactTable))
let jsonArrayBenchmark: Array<Object> = [];
interface State {
    openLayout: boolean;
    update: boolean;
    resultFile: string;
    benchmarkFile: string;
    resultresponse: any,
    benchmarkresponse: any,
    compoName: any,
    compoNamebenchmark: any,
    selection: any,
    selectAll: boolean,
    pivotBy: Array<String>,
    expanded: any,
    selectType: string

}

class UpdateFile extends React.Component<any, State> {
    selectTable: any;
    constructor(props: any) {
        super(props);

        this.state = {
            openLayout: false,
            update: props.update,
            resultFile: props.resultFile,
            benchmarkFile: props.benchmarkFile,
            resultresponse: '',
            compoName: [],
            compoNamebenchmark: [],
            selection: [],
            selectAll: false,
            pivotBy: ["componentName"],
            expanded: {},
            selectType: 'checkbox',
            benchmarkresponse: ''
        };
    }


    componentWillMount() {
        const firebase = require("firebase");
    }

    public componentDidMount() {
        this.callApiresult()
            .then(res => this.setState({ resultresponse: res }))
            .catch(err => console.log(err));
        this.callApibenchmark()
            .then(res => this.setState({ benchmarkresponse: res }))
            .catch(err => console.log(err));
    }

    public callApiresult = async () => {
        const name = (this.state.resultFile).replace("\"\"", "");
        const response = await fetch('/api/getdata:' + name);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body;
    };

    public callApibenchmark = async () => {
        const name = (this.state.benchmarkFile).replace("\"\"", "");
        const response = await fetch('/api/getbenchmarkdata:' + name);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    };


    public getComponentName(): Array<Object> {
        const jsonArray: Array<Object> = [];
        //compoName array contains the component name
        if (this.state.resultresponse.result) {
            Object.keys(this.state.resultresponse["result"]).forEach(key => {

                if (this.state.compoName.includes(key)) {
                    //dummy code - do nothing
                }
                else {
                    if (key === 'LibraryMode') {
                        //do nothing
                    }
                    else
                        this.state.compoName.push(key);
                }

            });

            // find the description and totaltimespent for each component
            for (let key in this.state.compoName) {
                const name = this.state.compoName[key];

                Object.keys(this.state.resultresponse.result[name]).forEach(testCase => {
                    var timeSpent = 0;
                    var timeSpent_benchmark = 0;
                    var flag = true;
                    const testCaseObject = this.state.resultresponse.result[name][testCase];
                    if (testCaseObject.perf) {
                        Object.keys(testCaseObject.perf).forEach(Key => {
                            timeSpent += testCaseObject.perf[Key].totalTimeSpent;
                        })
                    };

                    //calculate the benchmark timespent
                    if (this.state.benchmarkresponse) {
                        if (this.state.benchmarkresponse.result[name]) {
                            Object.keys(this.state.benchmarkresponse.result[name]).forEach(testCase => {
                                const benchmakrtestcaseobject = this.state.benchmarkresponse.result[name][testCase]
                                if (benchmakrtestcaseobject.description == testCaseObject.description) {
                                    flag = false
                                    if (benchmakrtestcaseobject.perf) {
                                        Object.keys(benchmakrtestcaseobject.perf).forEach(Key => {
                                            timeSpent_benchmark += benchmakrtestcaseobject.perf[Key].totalTimeSpent;
                                        })
                                    };
                                }
                            })
                        }
                    }

                    if (flag) {
                        jsonArray.push({
                            componentName: name,
                            testCase: testCaseObject.description,
                            value: timeSpent.toFixed(2) + "      ( Benchmark not found )",

                        });
                        flag = false;
                    }
                    else {
                        jsonArray.push({
                            componentName: name,
                            testCase: testCaseObject.description,
                            value: timeSpent.toFixed(2) + "      (  " + timeSpent_benchmark.toFixed(2) + "  )",

                        });
                    }


                })


            }
        }

        return jsonArray
    }

    public updateBenchmarkFile(): Array<Object> {

        let jsonArrayWithComponent: Array<Object> = [];
        let jsonArrayWithNewComponent: Array<Object> = [];
        let jsonArray: Array<Object> = [];
        // all components are selected
        if (this.state.selectAll) {
            for (let key in this.state.compoName) {
                const name = this.state.compoName[key];

                Object.keys(this.state.resultresponse.result[name]).forEach(testCase => {
                    var timeSpent = 0;
                    var timeSpent_benchmark = 0;
                    const testCaseObject = this.state.resultresponse.result[name][testCase];
                    if (testCaseObject.perf) {
                        Object.keys(testCaseObject.perf).forEach(Key => {
                            timeSpent += testCaseObject.perf[Key].totalTimeSpent;
                        })
                    };

                    jsonArray.push({
                        suite: name,
                        description: testCaseObject.description,
                        perf: timeSpent.toFixed(2),
                    })
                });

                jsonArrayWithComponent.push({
                    [name]: jsonArray
                })

                jsonArray = [];
            }
        }
        else {
            // when all components are not selected. 
            Object.keys(this.state.benchmarkresponse["result"]).forEach(key => {
                const componentname = key;
                //already existing components
                Object.keys(this.state.benchmarkresponse.result[componentname]).forEach(testcase => {
                    var flag = false;
                    var timespent = 0;
                    const testCaseObject = this.state.benchmarkresponse.result[componentname][testcase];
                    if (testCaseObject.perf) {
                        Object.keys(testCaseObject.perf).forEach(Key => {
                            timespent += testCaseObject.perf[Key].totalTimeSpent;
                        })
                    };

                    const customkey = componentname + "_" + testCaseObject.description;

                    //check selection array for the updated values for each testcase
                    for (var selectionkey in this.state.selection) {
                        const testCaseObjectkey = this.state.selection[selectionkey];
                        if (testCaseObjectkey === customkey) {
                            timespent = 0;
                            Object.keys(this.state.resultresponse.result[componentname]).forEach(resulttestcase => {
                                const resulttestcaseobject = this.state.resultresponse.result[componentname][resulttestcase]
                                if (resulttestcaseobject.description == testCaseObject.description) {
                                    if (resulttestcaseobject.perf) {
                                        Object.keys(resulttestcaseobject.perf).forEach(Key => {
                                            timespent += resulttestcaseobject.perf[Key].totalTimeSpent;
                                        })
                                    };
                                }
                            })


                        }

                    }


                    jsonArray.push({
                        suite: componentname,
                        description: testCaseObject.description,
                        perf: timespent.toFixed(2),
                    })
                })

                //for new testcases
                for (let component in this.state.selection) {
                    let data = (this.state.selection[component]).split("_")
                    let componentName = data[0];
                    let description = data[1];
                    let status = false;
                    let timespent = 0;

                    if(componentName == componentname){
                        //component exist in benchmark
                    if (this.state.benchmarkresponse.result[componentName]) {
                        //testcase doesnot exist in benchmark
                        Object.keys(this.state.benchmarkresponse.result[componentName]).forEach(benchmarkTestCase => {
                            const benchmarkTestCaseObject = this.state.benchmarkresponse.result[componentName][benchmarkTestCase]
                            if (benchmarkTestCaseObject["description"] == description) {
                                status = true
                            }
                        })
                    }

                    if (!status) {

                        //find the perf time in result
                        Object.keys(this.state.resultresponse.result[componentName]).forEach(resulttestcase => {
                            const resulttestcaseobject = this.state.resultresponse.result[componentName][resulttestcase]
                            if (resulttestcaseobject.description == description) {
                                if (resulttestcaseobject.perf) {
                                    Object.keys(resulttestcaseobject.perf).forEach(Key => {
                                        timespent += resulttestcaseobject.perf[Key].totalTimeSpent;
                                    })
                                };
                            }
                        })

                        jsonArray.push({
                            suite: componentName,
                            description: description,
                            perf: timespent.toFixed(2),
                        })

                    }
                    }
                    
                }

                jsonArrayWithComponent.push({
                    [componentname]: jsonArray
                })

                jsonArray = [];

            });
        }

        //check for new components
        let newcompoenntstatus = false;
        for(let comp in this.state.selection)
        {
            let data = (this.state.selection[comp]).split("_")
            let componentName = data[0];
            let description = data[1];
            let timespent = 0;
            let status = false
            if(!(this.state.benchmarkresponse.result[componentName]))
            {
                newcompoenntstatus= true
                Object.keys(this.state.resultresponse.result[componentName]).forEach(test =>{
                    const resulttest = this.state.resultresponse.result[componentName][test]
                    if(resulttest["description"] == description)
                    {
                        status= true
                        if(resulttest.perf)
                        {
                            Object.keys(resulttest.perf).forEach(perfobject => {
                                timespent += resulttest.perf[perfobject].totalTimeSpent;
                            })
                        }
                    }
                })

                if(status){

                    status = false 
                    jsonArray.push({
                        suite: componentName,
                        description: description,
                        perf: timespent.toFixed(2),
                    })

                    let keyexist = false
                    //check for existing key
                    Object.keys(jsonArrayWithNewComponent).forEach(compkey => {
                        Object.keys(jsonArrayWithNewComponent[compkey]).forEach(testcase => {
                            const suitetestcase = jsonArrayWithNewComponent[compkey][testcase]
                            if(testcase == componentName){
                                keyexist = true
                                suitetestcase.push({
                                    suite: componentName,
                                    description: description,
                                    perf: timespent.toFixed(2),
                                })
                            }
                        })
                       
                    })


                    if(!keyexist){

                        jsonArrayWithNewComponent.push({
                            [componentName] : jsonArray
                        })
                    }
                   
                   
                    jsonArray =[];
                   
                }
               
            }
        }

        if(jsonArrayWithNewComponent.length)
        {
            //jsonArrayWithComponent.concat(jsonArrayWithNewComponent)
            jsonArrayWithComponent = jsonArrayWithComponent.concat(jsonArrayWithNewComponent)
            console.log(jsonArrayWithComponent)
        }
        
        jsonArrayBenchmark.push({
            result: jsonArrayWithComponent
        })
        jsonArrayWithComponent = [];

        return jsonArrayBenchmark
    }

    public getNodes(data, node: any = []) {
        data.forEach((item) => {
            if (item.hasOwnProperty('_subRows') && item._subRows) {
                node = this.getNodes(item._subRows, node);
            } else {
                node.push(item._original);
            }
        });
        return node;
    }

    public getData(jsonArray: Array<Object>) {

        const data = jsonArray.map((item) => {

            const _id = item["componentName"] + "_" + item["testCase"];
            return {
                _id,
                ...item,
            }
        })

        return data;
    }

    public getColumns() {
        const columns: Array<Object> = [];
        columns.push({
            accessor: 'testCase',
            Header: 'TestCase Description',
            style: { whiteSpace: 'normal' },
        })
        columns.push({
            accessor: 'value',
            Header: 'Rendered Time (KB)',
            getProps: (state, rowInfo, column) => {
                if (rowInfo) {
                    if (rowInfo.row.value) {
                        var splitvalues = (rowInfo.row.value).split("(");
                        var benchmarkvalue = splitvalues[1];
                        var limit = parseInt(benchmarkvalue.split(")")[0]);
                        return {
                            style: {
                                color: parseInt(splitvalues[0]) <= limit ? "green" : "red"
                            }
                        };
                    }
                    else return {};


                }
                else return {};

            }
            ,
            filterMethod: (filter, row) => {

                if (filter.value === "noBenchmark") {
                    let variable = 0
                    let status = false
                    if (row[filter.id]) {
                        variable = row[filter.id].indexOf("Benchmark")
                    }
                    return variable == -1 ? false : true
                }
                else if (filter.value === "failed") {
                    let status = false;
                    let resultValue = 0, benchmarkvalue = 0
                    if (row[filter.id]) {
                        const value = row[filter.id].split("(")
                        resultValue = parseInt(value[0].trim())
                        const benchmarkValue = (value[1]).split(")")
                        benchmarkvalue = parseInt((benchmarkValue[0]).trim())
                    }

                    let variable = 0
                    if (row[filter.id]) {
                        variable = row[filter.id].indexOf("Benchmark")
                    }

                    if (variable != -1) {
                        return true
                    }
                    else
                        return resultValue <= benchmarkvalue ? false : true
                }
                else if (filter.value === "passed") {

                    let status = false;
                    let resultValue = 0, benchmarkvalue = 0
                    if (row[filter.id]) {
                        const value = row[filter.id].split("(")
                        resultValue = parseInt(value[0].trim())
                        const benchmarkValue = (value[1]).split(")")
                        benchmarkvalue = parseInt((benchmarkValue[0]).trim())
                    }
                    return resultValue <= benchmarkvalue ? true : false
                }
                else
                    return true;
            },
            Filter: ({ filter, onChange }) =>
                <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                >
                    <option value="noBenchmark">Benchmark not available</option>
                    <option value="all">Show All</option>
                    <option value="passed">Passed Testcases</option>
                    <option value="failed">Failed Testcases</option>
                </select>
        })
        columns.push({
            accessor: 'componentName',
            Header: 'componentName',
            style: { whiteSpace: 'normal' },


        })


        return columns;
    }

    toggleAll = () => {

        const selectAll = this.state.selectAll ? false : true;
        const selection: any = [];
        if (selectAll) {

            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            const nodes = this.getNodes(currentRecords);
            nodes.forEach((item) => {
                selection.push(item._id);
            })
        }
        this.setState({ selectAll, selection })
    }

    toggleSelection = (key: never, shift, row) => {

        let selection = [
            ...this.state.selection
        ];

        const keyIndex = selection.indexOf(key);

        if (keyIndex == -1) {
          //  console.log("doesnot exists")
            selection.push(key);
        }
        else {
           // console.log("it exists")
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ]
        }

        this.setState({ selection });
      //  console.log("main selection level : ", this.state.selection, " : ", selection)

    }

    isSelected = (key) => {
        return this.state.selection.includes(key);
    }
    logSelection = () => {
        console.log('selection:', this.state.selection);
    }

    toggleType = () => {
        this.setState({ selectType: this.state.selectType === 'radio' ? 'checkbox' : 'radio', selection: [], selectAll: false, });
    }

    onExpandedChange = (expanded) => {
        this.setState({ expanded });
    }

    public handlestate = () => {
        this.setState({ update: false });
    }


    public render() {
        const { isSelected,
            toggleSelection,
            toggleAll,
            onExpandedChange
        } = this;
        const { selectAll, pivotBy, selectType, expanded } = this.state;
        const extraProps =
        {
            selectAll,
            toggleSelection,
            isSelected,
            selectType,
            expanded,
            pivotBy,
            toggleAll,
            onExpandedChange,
        }
        if (this.state.update) {
            return (
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Performance Updation Tool</h1>
                    </header>
                    <br />

                    <br />
                    <div style={{ width: "100%", fontSize: "13px" }}>

                        <button style={{ width: "10%", float: "left", marginTop: "10px" }} onClick={this.handlestate}>Submit</button>
                        <br />
                    </div>
                    <br /> <br />
                    <div style={{
                        fontSize: "12px"

                    }}>
                        <SelectTreeTable
                            data={this.getData(this.getComponentName())}
                            columns={this.getColumns()}
                            {...extraProps}
                            freezWhenExpanded={true}
                            className="-striped -highlight"
                            ref={r => (this.selectTable = r)}
                            filterable
                        />

                    </div>
                    <br /><br />

                </div>
            );
        } else {
            return (<div> <ConfirmationPage jsoncontent={this.updateBenchmarkFile()} />

            </div>);
        }
    }
}

export default UpdateFile;
