import React, { PureComponent } from 'react';
import { TimePicker as MaterialTimePicker } from '@material-ui/pickers';

import './style.scss';

class TimePicker extends PureComponent {
  state = { value: null, prevValue: null, reset: false };

  reset = false;

  componentDidMount() {
    const { value } = this.props;

    if (value) {
      this.setState({ value });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.value && prevProps.value) {
      this.setState({ value: null });
    }
  }

  onOpen = () => {
    const { value } = this.state;

    this.setState({ prevValue: value });
  };

  onChange = (date) => {
    const { prevValue } = this.state;

    if (this.reset) {
      this.setState({ value: prevValue });
      this.reset = false;
    } else {
      this.setState({ value: date });
    }
  };

  onAccept = (date) => {
    const { onChange } = this.props;

    this.setState({ value: date });
    onChange(date);
  };

  onClose = () => {
    this.reset = true;
  };

  render() {
    const { value } = this.state;

    return (
      <MaterialTimePicker
        {...this.props}
        format="hh:mm A"
        minutesStep={30}
        invalidDateMessage={null}
        onOpen={this.onOpen}
        onChange={this.onChange}
        onAccept={this.onAccept}
        onClose={this.onClose}
        value={value}
      />
    );
  }
}

export default TimePicker;
