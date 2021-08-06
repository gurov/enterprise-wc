import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-summary-form.scss';

/**
 * IDS Summary Form Component
 * @type {IdsSummaryForm}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-summary-form')
@scss(styles)
class IdsSummaryForm extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    console.log('getting attributes()');
    return [
      attributes.DATA,
      attributes.FONT_WEIGHT,
      attributes.LABEL,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-summary-form">
        <ids-text class="label">${this.label ?? ''}</ids-text>
        <ids-text class="data" font-weight="${this.fontWeight ?? 'bold'}">${this.data ?? ''}</ids-text>
      </div>`;
  }

  /**
   * Set the data field
   * @param {string} value The input for the data
   */
  set data(value) {
    console.log('setting data to: ' + value);
    this.setAttribute(attributes.VALUE, value || '');
    this.#updateData();
  }

  get data() {
    console.log('getting data: ' + this.getAttribute('data'));
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Set the label field
   * @param {string} value The name for the label
   */
  set label(value) {
    console.log('setting label to: ' + value);
    this.setAttribute(attributes.LABEL, value || '');
    this.#updateLabel();
  }

  get label() {
    console.log('getting label: ' + this.getAttribute('label'));
    return this.getAttribute(attributes.LABEL);
  }

  /**
   * Sets the font-weight of the data field
   * The default is bold
   * It can be explicitly disabled by setting the font-weight to an empty string
   * @param {string} value The attribute value for font-weight of the data field
   */
  set fontWeight(value) {
    console.log('font-weight is being set to ' + value);
    this.setAttribute(attributes.FONT_WEIGHT, value);
    this.#updateFontWeight();
  }

  get fontWeight() {
    console.log('getting font-weight: ' + this.getAttribute('font-weight'));
    return this.getAttribute(attributes.FONT_WEIGHT);
  }

  #updateFontWeight() {
    this.container.querySelector('.data').setAttribute('font-weight', this.fontWeight);
  }

  /**
   * Updates the UI when the label is set
   * @private
   */
  #updateLabel() {
    console.log('UI is being updated');
    this.container.querySelector('.label').innerHTML = this.label;
  }

  /**
   * Updates the UI when the data is set
   * @private
   */
  #updateData() {
    this.container.querySelector('.data').innerHTML = this.data;
  }
}

export default IdsSummaryForm;
