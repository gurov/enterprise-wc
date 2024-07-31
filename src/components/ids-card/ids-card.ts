import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsHideFocusMixin from '../../mixins/ids-hide-focus-mixin/ids-hide-focus-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsBox from '../ids-box/ids-box';

import '../ids-hyperlink/ids-hyperlink';
import '../ids-checkbox/ids-checkbox';
import styles from './ids-card.scss';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';
import { IdsColorValue } from '../../utils/ids-color-utils/ids-color-utils';
import IdsDraggableMixin from '../ids-draggable/ids-draggable-mixin';

const Base = IdsHideFocusMixin(
  IdsDraggableMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsBox
      )
    )
  )
);

/**
 * IDS Card Component
 * @type {IdsCard}
 * @inherits IdsBox
 * @mixes IdsEventsMixin
 * @mixes IdsSelectionMixin
 * @mixes IdsHideFocusMixin
 * @part card - the card element
 * @part header - the header element
 * @part content - the card content element
 */
@customElement('ids-card')
@scss(styles)
export default class IdsCard extends Base {
  #clonedElement: any = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setFooterClass();
    this.#handleEvents();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ACTIONABLE,
      attributes.AUTO_FIT,
      attributes.AUTO_HEIGHT,
      attributes.HEIGHT,
      attributes.HREF,
      attributes.NO_HEADER,
      attributes.OVERFLOW,
      attributes.TARGET,
      attributes.BACKGROUND_COLOR,
      attributes.WIDTH,
      attributes.DRAG_WIDTH,
      attributes.DRAG_HEIGHT,
      attributes.DRAG_BG_COLOR,
      attributes.DROPPED,
      attributes.DROP_WIDTH,
      attributes.DROP_HEIGHT,
      attributes.DROP_BG_COLOR,
      attributes.FIXED,
    ];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    if (name === attributes.BACKGROUND_COLOR) this.#setCssVar('--ids-card-color-background', newValue);
    if (name === attributes.WIDTH) this.#setCssVar('--ids-card-width', newValue);

    if (name === attributes.DRAG_WIDTH) this.#setCssVar('--ids-card-width-dragged', newValue);
    if (name === attributes.DRAG_HEIGHT) this.#setCssVar('--ids-card-height-dragged', newValue);
    if (name === attributes.DRAG_BG_COLOR) this.#setCssVar('--ids-card-color-background-dragged', newValue);

    if (name === attributes.DROP_WIDTH) this.#setCssVar('--ids-card-width-dropped', newValue);
    if (name === attributes.DROP_HEIGHT) this.#setCssVar('--ids-card-height-dropped', newValue);
    if (name === attributes.DROP_BG_COLOR) this.#setCssVar('--ids-card-color-background-dropped', newValue);
  }

  /**
   * Method for card template
   * @returns {string} html
   */
  cardTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <div class="ids-card-body">
          <div class="ids-card-header" part="header">
            <slot name="card-header"></slot>
          </div>
          <div class="ids-card-content ${this.selection === 'multiple' ? 'has-checkbox' : ''} ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <slot name="card-content"></slot>
          </div>
          <div class="ids-card-checkbox ${this.selection === 'multiple' ? '' : 'hidden'}">
            <ids-checkbox></ids-checkbox>
          </div>
          <div class="ids-card-footer" part="footer">
            <slot name="card-footer"></slot>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Method for actionable button card template
   * @returns {string} html
   */
  actionableButtonTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <ids-button>
          <slot name="card-content"></slot>
        </ids-button>
      </div>
    `;

    return html;
  }

  /**
   * Method for actionable link card template
   * @returns {string} html
   */
  actionableLinkTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <ids-hyperlink href="${this.href}" target="${this.target}">
          <slot name="card-content"></slot>
        </ids-hyperlink>
      </div>
    `;

    return html;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    if (this.actionable) {
      return this.href ? this.actionableLinkTemplate() : this.actionableButtonTemplate();
    }

    return this.cardTemplate();
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click', this, this.#handleSelectionChange);

    if (this.selection === 'multiple') {
      const idsCheckboxElem = this.container?.querySelector<IdsCheckbox>('ids-checkbox');
      idsCheckboxElem?.onEvent('click', idsCheckboxElem, (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        this.#handleMultipleSelectionChange(e);
      });
    }

    this.offEvent('drag.ids-card', this);
    this.onEvent('drag.ids-card', this, (e: any) => {
      const { translateX = 0, translateY = 0 } = e.detail;
      if (translateX === 0 && translateY === 0) {
        return;
      }
      this.removeAttribute(attributes.DROPPED);
      this.setAttribute(attributes.IS_DRAGGING, 'true');
      this.container?.classList?.add('is-dragging');
      if (!this.disabled && !this.#clonedElement && this.fixed) {
        const clonedElement = this.cloneNode(true) as IdsCard;
        clonedElement.fixed = false;
        clonedElement.draggable = true;
        clonedElement.disabled = true;
        this.#clonedElement = clonedElement;
        this.parentNode?.insertBefore(clonedElement, this.nextSibling);
      }
    });

    this.offEvent('dragend.ids-card', this);
    this.onEvent('dragend.ids-card', this, (e: any) => {
      const { translateX = 0, translateY = 0 } = e.detail;
      if (translateX === 0 && translateY === 0) {
        return;
      }
      this.removeAttribute(attributes.IS_DRAGGING);
      this.container?.classList?.remove('is-dragging');
      this.setAttribute(attributes.DROPPED, 'true');
      if (this.#clonedElement) {
        this.#clonedElement.remove();
      }
    });

    return this;
  }

  /**
   * Set css class for footer
   * @private
   * @returns {void}
   */
  #setFooterClass(): void {
    const footerSlot = this.querySelector('[slot="card-footer"]');
    this.container?.classList[footerSlot ? 'add' : 'remove']('has-footer');
    if (footerSlot) {
      const noPadding = footerSlot.hasAttribute(attributes.NO_PADDING);
      const footer = this.container?.querySelector('.ids-card-footer');
      footer?.classList[noPadding ? 'add' : 'remove'](attributes.NO_PADDING);
    }
  }

  /**
   * Handle single/multiple selection change
   * @private
   * @param {object} e Actual event
   */
  #handleSelectionChange(e: Event) {
    if (this.selection === 'single') {
      this.#handleSingleSelectionChange(e);
    } else if (this.selection === 'multiple') {
      this.#handleMultipleSelectionChange(e);
    }
  }

  /**
   * Change single selection for cards
   * @private
   * @param {object} e Actual event
   */
  #handleSingleSelectionChange(e: Event) {
    const cardElements = document.querySelectorAll('ids-card[selection="single"]');
    [...cardElements].forEach((elem) => elem.setAttribute(attributes.SELECTED, 'false'));
    this.setAttribute(attributes.SELECTED, 'true');

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
  }

  /**
   * Change multiple selection for cards
   * @private
   * @param {object} e Actual event
   */
  #handleMultipleSelectionChange(e: Event) {
    this.container?.querySelector('ids-checkbox')?.setAttribute(attributes.CHECKED, String(this.selected !== true));
    this.setAttribute(attributes.SELECTED, String(this.selected !== true));

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
  }

  /**
   * Redraw the template when some properties change.
   */
  redraw() {
    if (!this.shadowRoot || !this.container) return;

    const template = document.createElement('template');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    this.hasStyles = false;
    this.appendStyles();
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector<HTMLElement>('.ids-card');

    if (this.height) {
      const link = this.container?.querySelector<IdsHyperlink>('ids-hyperlink')?.container;
      this.setAttribute(attributes.HEIGHT, this.height);
      this.container?.style.setProperty('height', `${this.height}px`);
      link?.style.setProperty('height', `${this.height}px`);
      this.querySelector('[slot]')?.classList.add('fixed-height');
    }
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, String(value));
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit() { return stringToBool(this.getAttribute(attributes.AUTO_FIT)); }

  /**
   * Set the card to auto height
   * @param {boolean|null} value The height can be auto to contents
   */
  set autoHeight(value) {
    const val = stringToBool(value);
    if (stringToBool(value)) {
      this.setAttribute('auto-height', String(val));
      return;
    }
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute(attributes.AUTO_HEIGHT); }

  /**
   * Set the card to be actionable button.
   * @param {boolean | null} value The card can act as a button.
   */
  set actionable(value) {
    const val = stringToBool(value);
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIONABLE, String(val));
      if (this.container) this.redraw();
      return;
    }
    this.removeAttribute(attributes.ACTIONABLE);
    if (this.container) this.redraw();
  }

  get actionable() { return stringToBool(this.getAttribute(attributes.ACTIONABLE)); }

  /**
   * @param {string | boolean} value to be disabled
   */
  set disabled(value: string | boolean) {
    this.toggleAttribute(attributes.DISABLED, stringToBool(value));

    if (this.disabled) {
      this.offEvent('mousemove', window.document);
      this.offEvent('click', window.document);
    }
  }

  /**
   * @returns {boolean} disabled state
   */
  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  set draggable(value: boolean) {
    this.toggleAttribute(attributes.DRAGGABLE, stringToBool(value));
  }

  get draggable(): boolean {
    return this.hasAttribute(attributes.DRAGGABLE);
  }

  set dropped(value: boolean) {
    this.toggleAttribute(attributes.DROPPED, stringToBool(value));
    this.container?.classList.toggle('is-dropped', stringToBool(value));
  }

  get dropped() {
    return this.hasAttribute(attributes.DROPPED);
  }

  set fixed(value: boolean | string | null) {
    this.toggleAttribute(attributes.FIXED, stringToBool(value));
    this.container?.classList.toggle('is-fixed', stringToBool(value));
  }

  get fixed() {
    return this.hasAttribute(attributes.FIXED);
  }

  #setCssVar(variable: string, value: string | null) {
    if (value) {
      this.container?.style.setProperty(variable, value);
    } else {
      this.container?.style.removeProperty(variable);
    }
  }

  set backgroundColor(value: IdsColorValue) {
    this.#setCssVar('--ids-card-color-background', (value as string | null));
  }

  set width(value: string) {
    if (this.draggable) {
      this.#setCssVar('--ids-card-width', value);
    } else {
      super.width = value;
    }
  }

  /**
   * Set how the container overflows, can be hidden or auto (default)
   * @param {string | null} [value] css property for overflow
   */
  set overflow(value) {
    if (value === 'hidden') {
      this.container?.querySelector('.ids-card-content')?.classList.add('overflow-hidden');
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.container?.querySelector('.ids-card-content')?.classList.remove('overflow-hidden');
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow() { return this.getAttribute(attributes.OVERFLOW); }

  /**
   * Get href for actionable link card
   * @returns {string} href for ids-hyperlink
   */
  get href() { return this.getAttribute('href'); }

  /**
   * Set href for actionable link card
   * @param {string} url href for ids-hyperlink
   */
  set href(url) {
    if (url) {
      this.setAttribute('href', url);
      if (this.container) {
        this.redraw();
        this.container.querySelector('ids-hyperlink')?.setAttribute('href', url);
      }
    } else {
      this.removeAttribute('href');
      if (this.container) {
        this.redraw();
      }
    }
  }

  /**
   * Get target for actionable link card
   * @returns {string} target for ids-hyperlink
   */
  get target() { return this.getAttribute('target'); }

  /**
   * Set target for an actionable link card
   * @param {string} value target value for ids-hyperlink
   */
  set target(value) {
    if (value) {
      this.setAttribute('target', value);
      if (this.container) {
        this.container.querySelector('ids-hyperlink')?.setAttribute('target', value);
        this.redraw();
      }
    } else {
      this.removeAttribute('target');
      if (this.container) {
        this.redraw();
      }
    }
  }

  /**
   * Set to true to hide the header space
   * @returns {string} target for ids-hyperlink
   */
  get noHeader() { return this.getAttribute(attributes.NO_HEADER); }

  set noHeader(value) {
    if (value) {
      this.setAttribute(attributes.NO_HEADER, value);
    } else {
      this.removeAttribute(attributes.NO_HEADER);
    }
  }
}
