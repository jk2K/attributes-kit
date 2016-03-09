import merge from 'lodash/merge';
import radium from 'radium';
import React from 'react';
import reactDom from 'react-dom';

import Column from '../Column/Column';
import Description from '../Description/Description';
import Key from '../Key/Key';
import ObjectPropertyDefaults from '../ObjectPropertyDefaults/ObjectPropertyDefaults';
import ObjectPropertySamples from '../ObjectPropertySamples/ObjectPropertySamples';
import Requirement from '../Requirement/Requirement';
import Row from '../Row/Row';
import Ruler from '../Ruler/Ruler';
import Toggle from '../Toggle/Toggle';
import Type from '../Type/Type';

import {
  isExpandableCollapsible,
  containsExpandableCollapsibleElement,
  renderValue,
} from '../elements/expandableCollapsibleElement';

import {
  hasDescription,
  hasSamples,
  isArray,
  hasDefaults,
  isLastArrayItem,
  isObject,
} from '../elements/element';

class StructuredObjectProperty extends React.Component {
  static propTypes = {
    element: React.PropTypes.object,
    parentElement: React.PropTypes.object,
    index: React.PropTypes.number,
  };

  static contextTypes = {
    theme: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpandableCollapsible: isExpandableCollapsible(this.props.element),
      isObject: isObject(this.props.element),
      isArray: isArray(this.props.element),
    };

    // State hasn't been set; tree is expanded by default,
    // after a click, it collapses.
    if (this.state.isExpandableCollapsible) {
      if (this.props.collapseByDefault) {
        this.state.isExpanded = false;
      } else {
        this.state.isExpanded = true;
      }

      this.state.containsExpandableCollapsibleElement =
        containsExpandableCollapsibleElement(this.props.parentElement.content);
    }
  }

  componentDidMount = () => {
    const keyIdentifier = this.props.element.meta.id;
    const keyDomNode = reactDom.findDOMNode(this.refs.key);

    this.props.reportKeyWidth(keyIdentifier, keyDomNode.clientWidth);
  }

  handleExpandCollapse = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  get style() {
    const { BORDER_COLOR } = this.context.theme;

    let style = {
      root: {
        borderBottom: `1px solid ${BORDER_COLOR}`,
        paddingTop: '8px',
        paddingBottom: '8px',
      },
      toggleColumn: {
        width: '20px',
        maxWidth: '20px',
        minWidth: '20px',
      },
      keyColumn: {
      },
      requirementColumn: {
        width: '25px',
        maxWidth: '25px',
        minWidth: '25px',
      },
      valueRow: {
        marginTop: '8px',
      },
      ruler: {
        root: {
          width: '100%',
          marginLeft: '6px',
          paddingBottom: '8px',
        },
      },
      description: {
        root: {
          marginTop: '4px',
        },
      },
    };

    const isLast = isLastArrayItem(this.props.parentElement, this.props.index);

    // Last array item doesn't have a border.
    if (isLast) {
      style.ruler.root.paddingBottom = '0px';
      style.root.borderBottom = 'none';
      style.root.paddingBottom = '8px';
    } else {
      style.root.paddingBottom = '8px';
    }

    if (!this.state.isExpanded) {
      style.ruler.root.borderLeft = '1px solid #ffffff';
    }

    let keyWidth;

    if (this.props.keyWidth) {
      keyWidth = `${this.props.keyWidth}px`;
    } else {
      keyWidth = 'auto';
    }

    style.keyColumn.width = keyWidth;
    style.keyColumn.minWidth = keyWidth;
    style.keyColumn.maxWidth = keyWidth;

    return merge(style, this.props.style || {});
  }

  renderValue() {
    if (this.state.isExpanded) {
      return (
        <Row style={this.style.valueRow}>
          {renderValue(this.props.element)}
        </Row>
      );
    }

    return null;
  }

  render() {
    return (
      <Row style={this.style.root}>
        <Column>
          <Row>
            <Column
              style={this.style.toggleColumn}
            >
              <Toggle
                isExpanded={this.state.isExpanded}
                onClick={this.handleExpandCollapse}
              />
            </Column>

            <Column style={this.style.keyColumn}>
              <Key
                onClick={this.handleExpandCollapse}
                element={this.props.element}
                ref="key"
              />
            </Column>

            <Column style={this.style.requirementColumn}>
              <Requirement element={this.props.element} />
            </Column>

            {
              this.props.element.element !== 'select' &&
                <Column>
                  <Type
                    element={this.props.element}
                  />
                </Column>
            }
          </Row>

          <Ruler style={styles.ruler}>
            {
              hasDescription(this.props.element) &&
                <Row>
                  <Description
                    element={this.props.element}
                    style={styles.description}
                  />
                </Row>
            }

            {this.renderValue()}
          </Ruler>

          <Row>
            {
              hasSamples(this.props.element) &&
                <ObjectPropertySamples element={this.props.element} />
            }

            {
              hasDefaults(this.props.element) &&
                <ObjectPropertyDefaults element={this.props.element} />
            }
          </Row>
        </Column>
      </Row>
    );
  }
}

export default radium(StructuredObjectProperty);
