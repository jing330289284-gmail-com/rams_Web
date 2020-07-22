import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Card , FormControl , Table , OverlayTrigger , Popover, CloseButton} from 'react-bootstrap';
import $ from 'jquery';
import axios from "axios";
import * as customerInfoSearchJs from '../components/CustomerInfoSearchJs.js';
import { BrowserRouter as Router, Route, Link ,Switch } from "react-router-dom";
import {BootstrapTable, TableHeaderColumn , ReactBsTable} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class CustomerInfoSearch extends Component {
    state = { 
        radioValue:'',
        customerInfoData:[],
        currentPage: 1,
		emploryeesPerPage: 5,
     }
    componentDidMount(){
        customerInfoSearchJs.onload();
    }
    radioChange =(e)=>{
        this.setState({
            radioValue:e.target.value
            }
        )
    }
    search =()=>{
        var customerInfoMod = {};
        var formArray =$("#conditionForm").serializeArray();
        $.each(formArray,function(i,item){
            customerInfoMod[item.name] = item.value;     
        });
        axios.post("http://127.0.0.1:8080/customerInfoSearch/search" , customerInfoMod)
        .then(resultList => {
            this.setState({
                customerInfoData : resultList.data,
            })
        })
        .catch(function (error) {
        alert("select框内容获取错误，请检查程序");
        });  
    }
    isExpandableRow(row) {
        if (row.employeeNameList !== null) return true;
        else return false;
    }
    
    expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content = '';

        if (isExpandableRow) {
        content = (isExpanded ? '(-)' : '(+)' );
        } else {
        content = ' ';
        }
        return (
        <div> { content } </div>
        );
    }
    //行Selectファンクション
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            document.getElementById('shusei').className = "btn btn-sm btn-primary";
            document.getElementById('sakujo').className = "btn btn-sm btn-primary";
        } else {
            document.getElementById('shusei').className = "btn btn-sm btn-primary disabled";
            document.getElementById('sakujo').className = "btn btn-sm btn-primary disabled";
        }
    }
    //稼動者テーブル
    expandComponent(row) {
    return (
        <div>
        <Table>
            <thead>
                <th>稼動者</th>
                <th>現場</th>
                <th>責任者</th>
                <th>単価</th>
            </thead>
            <tbody>
                {row.employeeNameList === null ? null : row.employeeNameList.map((employeeName,index)=>
                    <tr key={row.rowNo} align="center">
                        <td>{employeeName}</td>
                        <td>{row.locationList[index]}</td>
                        <td>{row.siteManagerList[index]}</td>
                        <td>{row.unitPriceList[index]}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        </div>
    );
    }
    render() {
        const { radioValue , customerInfoData , emploryeesPerPage , currentPage}=this.state;
        var tsuikaPath = {
            pathname:'/subMenu/customerInfo',state:"tsuika",
          }
        var shuseiPath = {
        pathname:'/subMenu/customerInfo',state:"shusei",
        }
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect:this.handleRowSelect,
        };
        const options = {
        page: 2,  // which page you want to show as default
        sizePerPage: 5,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        prePage: 'Prev', // Previous page button text
        nextPage: 'Next', // Next page button text
        firstPage: 'First', // First page button text
        lastPage: 'Last', // Last page button text
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        // paginationPosition: 'top'  // default is bottom, top and both is all available
        hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
        // alwaysShowAllBtns: true // Always show next and previous button
        // withFirstAndLast: false > Hide the going to First and Last page button
        expandRowBgColor: 'rgb(165, 165, 165)',
        };
        return (
           <div>
               <Row inline="true">
                    <Col  className="text-center">
                    <h2>お客様・協力情報検索</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="technologyTypeMasterErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
               <Form id="conditionForm">
                   <div className="container col-8">
                   <Row>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="お客様番号" id="customerNo" name="customerNo"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="お客様名" id="customerName" name="customerName"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="本社場所" id="headOffice" name="headOffice"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Button size="sm" block onClick={this.search}>検索</Button>
                    </Col>
                    </Row>
                    <br/>
                    <Row>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様ランキング</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="お客様ランキング" id="customerRankingCode" name="customerRankingCode">
                                <option value=''>選択してください</option>
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="会社性質" id="companyNatureCode" name="companyNatureCode">
                                <option value=''>選択してください</option>
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="上位お客様" id="topCustomerName" name="topCustomerName"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Link to={tsuikaPath} className="btn btn-sm btn-primary btn-block">追加</Link>
                    </Col>
                    </Row>
                    <br/>
                    <Row>
                    <Col className="text-center">
                        <Form.Check defaultChecked={true} onChange={this.radioChange.bind("customerOnly")} label="お客様" inline="true" type="radio" id="customerOnly" name="sortCondition" value="customerOnly" />
                        <Form.Check label="稼動者に付き" onChange={this.radioChange.bind("haveOperator")} inline="true" type="radio" name="sortCondition" id="haveOperator" value="haveOperator"/>
                    </Col>
                    </Row>
                   </div>
               </Form>
               <Form>
                <br/>
                <Card>
                    <Card.Body>
                    <Row>
                        <Col sm={1}>
                        </Col>
                        <Col sm={8}>
                        
                        </Col>
                        <Col sm={1}></Col>
                        <Col sm={2}>
                                <Link to={shuseiPath} className="btn btn-sm btn-primary" id="shusei">修正</Link>
                                <Link className="btn btn-sm btn-primary" id="sakujo">删除</Link>
                        </Col>
                    </Row>
                        { radioValue === "haveOperator" ?
                            <BootstrapTable  
                            pagination={ true } 
                            data={customerInfoData} 
                            options={ options }
                            expandColumnOptions={ {
                                expandColumnVisible: true,
                                expandColumnComponent: this.expandColumnComponent,
                                columnWidth: 50,
                                text:"稼動者"
                              } }
                            selectRow={ selectRow }
                            expandableRow={ this.isExpandableRow }
                            expandComponent={ this.expandComponent }
                             >
                                <TableHeaderColumn isKey dataField='rowNo' dataSort={ true }>番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerNo' dataSort={ true }>お客様番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerName' dataSort={ true }>お客様名</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerRankingName' dataSort={ true }>ランキング</TableHeaderColumn>
                                <TableHeaderColumn dataField='headOffice' dataSort={ true }>本社場所</TableHeaderColumn>
                                <TableHeaderColumn dataField='companyNatureName' dataSort={ true }>会社性質</TableHeaderColumn>
                                <TableHeaderColumn dataField='topCustomerName' dataSort={ true }>上位客様</TableHeaderColumn>
                                </BootstrapTable>
                            :
                                <BootstrapTable selectRow={ selectRow } pagination={ true } data={customerInfoData} options={ options }>
                                <TableHeaderColumn isKey dataField='rowNo' dataSort={ true }>番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerNo' dataSort={ true }>お客様番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerName' dataSort={ true }>お客様名</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerRankingName' dataSort={ true }>ランキング</TableHeaderColumn>
                                <TableHeaderColumn dataField='headOffice' dataSort={ true }>本社場所</TableHeaderColumn>
                                <TableHeaderColumn dataField='companyNatureName' dataSort={ true }>会社性質</TableHeaderColumn>
                                <TableHeaderColumn dataField='topCustomerName' dataSort={ true }>上位客様</TableHeaderColumn>
                            </BootstrapTable>
                        }
                            </Card.Body>
                </Card>
                </Form>
           </div> 
        );
    }
    renderShowsTotal(start, to, total) {
        return (
            <p>
            ページ： { start } /{ to }, トータル件数： { total }&nbsp;&nbsp;
            </p>
        );
      }
}

export default CustomerInfoSearch;