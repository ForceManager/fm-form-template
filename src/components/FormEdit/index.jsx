import React, { PureComponent } from 'react';
import { Icon, Toast, toast } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import FormValidator from '../FormValidator';
import FormSummary from '../FormSummary';

import './style.scss';

class FormsEdit extends PureComponent {
  state = { currentPage: 0, showSummary: false };

  constructor(props) {
    super(props);
    this.state.totalPages = props.schema.length;
  }

  componentDidUpdate() {
    const { currentPage } = this.state;
    const { schema, setImagesView, imagesView } = this.props;
    const pageSchema = schema[currentPage];

    if (pageSchema && pageSchema.imagesView && !imagesView) {
      bridge
        .showCameraImages()
        .then(() => {
          setImagesView(true);
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (!pageSchema || (imagesView && !pageSchema.imagesView)) {
      bridge
        .hideCameraImages()
        .then(() => {
          setImagesView(false);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }

  onClickPrev = (event) => {
    const { formData } = this.props;
    const { currentPage } = this.state;

    if (currentPage > 0) {
      bridge
        .showLoading()
        .then(() => bridge.saveData(formData))
        .then(() => {
          this.setState({ currentPage: currentPage - 1 });
          bridge.hideLoading();
        })
        .catch((err) => {
          console.warn(err);
          bridge.hideLoading();
          toast({
            type: 'error',
            text: 'The form could not be saved',
            title: 'Error',
          });
        });
    }
  };

  onClickNext = (event) => {
    const { formData, values } = this.props;
    const { currentPage } = this.state;

    bridge
      .showLoading()
      .then(() => {
        console.log('values', values);
        return bridge.saveData(formData);
      })
      .then(() => {
        this.setState({ currentPage: currentPage + 1 });
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err);
        bridge.hideLoading();
        toast({
          type: 'error',
          text: 'The form could not be saved',
          title: 'Error',
        });
      });
  };

  onFormChange = (values, field) => {
    const { onChange } = this.props;
    const { currentPage } = this.state;

    onChange(values, field, currentPage);
  };

  onFieldFocus = (values, field) => {
    const { onFocus } = this.props;
    const { currentPage } = this.state;

    onFocus(values, field, currentPage);
  };

  onClickFinish = () => {
    bridge.finishActivity();
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

  renderPageNumber() {
    const { totalPages, currentPage } = this.state;

    if (currentPage === totalPages) {
      return (
        <div className="forms-pager-finish" onClick={this.onClickFinish}>
          FINISH
        </div>
      );
    }
    return <div className="forms-pager-number">{`${currentPage + 1} / ${totalPages}`}</div>;
  }

  renderContent() {
    const { schema, formData, customFields } = this.props;
    const { currentPage, totalPages } = this.state;

    if (currentPage === totalPages) {
      return <FormSummary schema={schema} values={formData.formObject} />;
    }
    return (
      <FormValidator
        schema={[schema[currentPage]]}
        currentPage={currentPage}
        onChange={this.onFormChange}
        onFocus={this.onFieldFocus}
        values={formData.formObject[schema[currentPage].name] || {}}
        customFields={customFields}
      />
    );
  }

  render() {
    return (
      <div className="forms-pager">
        <div className="form-container">{this.renderContent()}</div>
        <div className="forms-pager-bar">
          {this.renderPrev()}
          {this.renderPageNumber()}
          {this.renderNext()}
        </div>
        <Toast />
      </div>
    );
  }
}

export default FormsEdit;
