import React, { PureComponent } from 'react';
import { Icon } from 'hoi-poi-ui';
import FormValidator from '../../components/FormValidator';

import './style.scss';

class FormPager extends PureComponent {
  state = { currentPage: 0 };

  constructor(props) {
    super(props);
    this.state.totalPages = props.schema.length;
  }

  onClickPrev = (event) => {
    const { currentPage } = this.state;

    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  onClickNext = (event) => {
    const { totalPages, currentPage } = this.state;

    if (currentPage < totalPages) {
      this.setState({ currentPage: currentPage + 1 });
    }
  };

  renderPrev() {
    const { currentPage } = this.state;

    if (currentPage === 0) return <div className="forms-pager-prev" />;
    return (
      <div className="forms-pager-prev" onClick={this.onClickPrev}>
        <Icon name="chevron" />
      </div>
    );
  }

  renderNext() {
    const { totalPages, currentPage } = this.state;

    if (currentPage === totalPages) return <div className="forms-pager-next" />;
    return (
      <div className="forms-pager-next" onClick={this.onClickNext}>
        <Icon name="chevron" />
      </div>
    );
  }

  render() {
    const { schema, onChange, values } = this.props;
    const { totalPages, currentPage } = this.state;
    const pageSchema = [schema[currentPage]];
    const pageValues = values[currentPage];

    console.log('pageSchema', pageSchema);
    return (
      <div className="forms-pager">
        <FormValidator schema={pageSchema} onChange={onChange} values={pageValues} />
        <div className="forms-pager-bar">
          {this.renderPrev()}
          <div className="forms-pager-number">{`${currentPage + 1} / ${totalPages}`}</div>
          {this.renderNext()}
        </div>
      </div>
    );
  }
}

export default FormPager;
