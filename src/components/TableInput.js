import React from 'react';

class TableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value : props.defaultValue
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  focus() {
    this.refs.inputRef.focus();
  }
  onChange(e) {
    //can be used to validate based on input type
//alert(e.target.value)
    this.setState({
      value : e.target.value
    });
  }

  onBlur(e) {
    this.props.onUpdate(this.state.value);
  }

  render() {
    // Will be adding regex support in future
    let { value } = this.state;
    let { type } = this.props;
    return (
      <div>
        <input type={type || 'text'} ref="inputRef" size="5" value={value}
            onChange={this.onChange} onBlur={this.onBlur}/>
      </div>
    );
  }
}

/*const TableInput = (onUpdate, props) => (
    <InputEditor onUpdate={ onUpdate } {...props} /> );*/

export default TableInput;