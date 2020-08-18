import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Table } from 'react-bootstrap';
import $ from 'jquery';
import axios from "axios";
import { BrowserRouter as Router , Link  } from "react-router-dom";
import {BootstrapTable, TableHeaderColumn , DeleteButton} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as utils from './utils/dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch , faEdit , faTrash , faList } from '@fortawesome/free-solid-svg-icons';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker ,　{registerLocale} from "react-datepicker"
import ja from 'date-fns/locale/ja';
registerLocale('ja', ja);

class CustomerInfoSearch extends Component {
    state = { 
        radioValue:'',//稼働の表示
        customerInfoData:[],//テーブルのデータ
        currentPage: 1,//テーブルの第一ページ
        emploryeesPerPage: 5,//毎ページの項目数
        customerNo:'',//選択した列のお客様番号
        rowNo:'',//選択した行番号
        businessStartDate: '',//取引開始の期日
     }
     /**
      * 画面の初期化
      */
    componentDidMount(){
        document.getElementById('shusei').className += " disabled";
        document.getElementById('shosai').className += " disabled";
        $("#sakujo").attr("disabled",true);
        var methodArray = ["getLevel", "getCompanyNature", "getPaymentsite"]
        var selectDataList = utils.getPublicDropDown(methodArray);
        //お客様ランキン
        var level = selectDataList[0];
        //会社性質
        var companyNature = selectDataList[1];
        //支払サイト
        var paymentsiteCode = selectDataList[2];
        for(let i = 0;i<level.length ; i++){
            $("#levelCode").append('<option value="'+level[i].code+'">'+level[i].name+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){
            $("#companyNatureCode").append('<option value="'+companyNature[i].code+'">'+companyNature[i].name+'</option>');
        }
        for(let i = 0;i<paymentsiteCode.length ; i++){
            $("#paymentsiteCode").append('<option value="'+paymentsiteCode[i].code+'">'+paymentsiteCode[i].name+'</option>');
        }
    }
    /**
      * 稼働のフラグ変化
      */
    radioChange =(e)=>{
        this.setState({
            radioValue:e.target.value
            }
        )
    }
    /**
      * 検索ボタン
      */
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
        alert("查询错误，请检查程序");
        });  
    }
    /**
      * 稼働テーブルの開き
      */
    isExpandableRow(row) {
        if (row.employeeNameList !== null) return true;
        else return false;
    }
    /**
      * 稼働テーブル開きアイコン
      */
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
    /**
      * 行Selectファンクション
      */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            document.getElementById('shusei').className = "btn btn-sm btn-info";
            document.getElementById('shosai').className = "btn btn-sm btn-info";
            $("#sakujo").attr("disabled",false);
            this.setState({
                customerNo:row.customerNo,
                rowNo:row.rowNo,
            })
        } else {
            document.getElementById('shusei').className = "btn btn-sm btn-info disabled";
            document.getElementById('shosai').className = "btn btn-sm btn-info disabled";
            $("#sakujo").attr("disabled",true);
            this.setState({
                customerNo:'',
                rowNo:row.rowNo,
            })
        }
    }
    /**
     * 行の削除
     */
    listDelete=()=>{
        //将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
        var a = window.confirm("削除していただきますか？");
        if(a){
            var id = this.state.rowNo;
            var customerInfoList = this.state.customerInfoData;
            for(let i=customerInfoList.length-1; i>=0; i--){
                if(customerInfoList[i].rowNo === id){
                    customerInfoList.splice(i,1);
                }
            }
            if(customerInfoList.length !== 0){
                for(let i=customerInfoList.length-1; i>=0; i--){
                    customerInfoList[i].rowNo = (i + 1);
                }  
            }
            this.setState({
                customerInfoData:customerInfoList,
                rowNo:'',
            })
            var customerInfoMod = {};
            customerInfoMod["customerNo"] = this.state.customerNo;
            axios.post("http://127.0.0.1:8080/customerInfoSearch/delect", customerInfoMod)
            .then(function (result) {
                if(result.data === true){
                    alert("删除成功");
                }else{
                    alert("删除失败");
                }
            })
            .catch(function (error) {
                alert("删除失败，请检查程序");
            });
        }
    }
    /**
     * 取引開始のonChange 
     */
    businessStartDateChange = date => {
        this.setState({
            businessStartDate: date,
        });
            let month = date.getMonth() + 1;
            $("#businessStartDate").val(date.getFullYear() + '' + (month < 10 ? '0'+month: month));
        
        };
     /**
     * 稼働テーブル
     */
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
        const { radioValue , customerInfoData }=this.state;
        //画面遷移のパラメータ（追加）
        var tsuikaPath = {
            pathname:'/subMenu/customerInfo',state:{actionType:'insert'},
          }
        //画面遷移のパラメータ（修正）
        var shuseiPath = {
            pathname:'/subMenu/customerInfo',state:{actionType:'update' , customerNo:this.state.customerNo},
        }
        var shosaiPath = {
            pathname:'/subMenu/customerInfo',state:{actionType:'detail' , customerNo:this.state.customerNo},
        }
        //テーブルの行の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect:this.handleRowSelect,
        };
        //テーブルの定義
        const options = {
        page: 1,  // which page you want to show as default
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
                   <div className="container col-9">
                   <Row>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：C001" id="customerNo" name="customerNo"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：LYC株式会社" id="customerName" name="customerName"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="秋葉原" id="stationCode" name="stationCode"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">支払サイト</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" />
                        </InputGroup>
                    </Col>
                    </Row>
                    <br/>
                    <Row>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様ランキング</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" id="levelCode" name="levelCode">
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" id="companyNatureCode" name="companyNatureCode">
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：富士通" id="topCustomerName" name="topCustomerName"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
                            </InputGroup.Prepend>
                                <DatePicker
                                selected={this.state.businessStartDate}
                                onChange={this.businessStartDateChange}
                                dateFormat={"yyyy/MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                showMonthYearPicker
                                showFullMonthYearPicker
                                // minDate={new Date()}
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="customerInfoSearchDatePicker"
                                name="businessStartDate"
                                locale="ja"
                                />
                        </InputGroup>
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
                    <div style={{ "textAlign": "center" }}>
                            <Button onClick={this.search} size="sm" variant="info">
                                <FontAwesomeIcon icon={faSearch} /> 検索
                            </Button>{' '}
                            <Link to={tsuikaPath} className="btn btn-sm btn-info">
                                <FontAwesomeIcon icon={faSave} />追加
                            </Link>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo} /> Reset
                            </Button>
                        </div>
               </Form>
               <Form>
                <br/>
                    <Row>
                        <Col sm={10}>
                        </Col>
                        <Col sm={2}>
                                <Link to={shosaiPath} className="btn btn-sm btn-info" id="shosai"><FontAwesomeIcon icon={faList} />詳細</Link>
                                <Link to={shuseiPath} className="btn btn-sm btn-info" id="shusei"><FontAwesomeIcon icon={faEdit} />修正</Link>
                                <Button variant="info" size="sm" id="sakujo" onClick={this.listDelete} > <FontAwesomeIcon icon={faTrash} />删除</Button>
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
                            className={"bg-white text-dark"}
                             >
                                <TableHeaderColumn isKey dataField='rowNo'  headerAlign='center' dataAlign='center' width='70'>番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerNo'  headerAlign='center' dataAlign='center' width="110">お客様番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerName'  headerAlign='center' dataAlign='center' width="160">お客様名</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerRankingName'  headerAlign='center' dataAlign='center' width="110">ランキング</TableHeaderColumn>
                                <TableHeaderColumn dataField='stationCode'  headerAlign='center' dataAlign='center'>本社場所</TableHeaderColumn>
                                <TableHeaderColumn dataField='companyNatureName' headerAlign='center' dataAlign='center' width="110">会社性質</TableHeaderColumn>
                                <TableHeaderColumn dataField='topCustomerName'  headerAlign='center' dataAlign='center' width="160">上位客様</TableHeaderColumn>
                                </BootstrapTable>
                            :
                                <BootstrapTable selectRow={ selectRow } pagination={ true } data={customerInfoData} options={ options } className={"bg-white text-dark"}>
                                <TableHeaderColumn isKey dataField='rowNo'  headerAlign='center' dataAlign='center' width='70'>番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerNo'  headerAlign='center' dataAlign='center' width="110">お客様番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerName'  headerAlign='center' dataAlign='center' width="160">お客様名</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerRankingName'  headerAlign='center' dataAlign='center' width="110">ランキング</TableHeaderColumn>
                                <TableHeaderColumn dataField='stationCode'  headerAlign='center' dataAlign='center'>本社場所</TableHeaderColumn>
                                <TableHeaderColumn dataField='companyNatureName'  headerAlign='center' dataAlign='center' width="110">会社性質</TableHeaderColumn>
                                <TableHeaderColumn dataField='topCustomerName'  headerAlign='center' dataAlign='center' width="160">上位客様</TableHeaderColumn>
                            </BootstrapTable>
                        }
                </Form>
           </div> 
        );
    }
    renderShowsTotal(start, to, total) {
        if(total === 0){
            return (<></>);
        }else{
            return (
                <p>
                ページ： { start } /{ to }, トータル件数： { total }&nbsp;&nbsp;
                </p>
            );
            }
      }
}

export default CustomerInfoSearch;