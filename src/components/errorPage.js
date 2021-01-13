import React , {Component} from 'react';
import '../asserts/css/subMenu.css';
class ErrorPage extends Component {
	// PointerError是错误捕获组件
	constructor(props) {
	  super(props)
	  this.state = {
		error: false,
		text: ''
	  }
	}
	// parseStr(str) {
	// 格式化位置组件错误信息
	//   let res = str.match(/in[^\(]+\(/g)
	//   res = res.map(item => item.slice(3, -2))
	//   console.log('res', res)
	// }
	componentDidCatch(error, info) {
	  console.log(error, info)
	  alert('错误发生的位置：' + info.componentStack) //错误信息error.message, 错误堆栈error.stack, 组件堆栈info.componentStack
	  this.setState({
		error,
		info,
		text: info.componentStack
	  })
	}
	render() {
	  if (this.state.error) {
		return (
		  <div  className="mainBody">
			<h1>エラーは：{this.state.error.toString()}</h1>
			<h2>エラーが発生したところ：{this.state.text}</h2>
		  </div>
		)
	  }
	  return this.props.children
	}
  }
export default ErrorPage;
