/**
 * @jest-environment jsdom
 */
import IdsAbout from '../../src/components/ids-about';

// Supporing components
import IdsText from '../../src/components/ids-text/ids-text';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

const name = 'ids-about';
const id = 'test-about-component';
const productVersion = '4.0.0';
const productName = 'Controls';
const copyrightYear = '2022';
const deviceSpecs = true;
const useDefaultCopyright = true;

describe('IdsAbout Component (using properties)', () => {
  let component;

  beforeEach(async () => {
    component = new IdsAbout();
    component.id = id;
    component.productVersion = productVersion;
    component.productName = productName;
    component.copyrightYear = copyrightYear;
    component.deviceSpecs = deviceSpecs;
    component.useDefaultCopyright = useDefaultCopyright;

    document.body.appendChild(component);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(component.outerHTML).toMatchSnapshot();
    component.show();
    expect(component.outerHTML).toMatchSnapshot();

    component.hide();
    expect(component.outerHTML).toMatchSnapshot();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.productVersion).toEqual(productVersion);
    expect(component.productName).toEqual(productName);
    expect(component.copyrightYear).toEqual(copyrightYear);
    expect(component.deviceSpecs).toEqual(deviceSpecs);
    expect(component.useDefaultCopyright).toEqual(useDefaultCopyright);
  });

  it('can alter productVersion and productName', () => {
    const newProductVersion = 'New productVersion';
    const newProductName = 'New productVersion';
    component.productVersion = newProductVersion;
    component.productName = newProductName;

    expect(component.productVersion).toEqual(newProductVersion);
    expect(component.productName).toEqual(newProductName);

    component.productVersion = '';
    component.productName = '';

    expect(component.productVersion).toEqual('');
    expect(component.productName).toEqual('');
  });

  it('can alter useDefaultCopyright', () => {
    component.useDefaultCopyright = false;

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = undefined;

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = 'false';

    expect(component.useDefaultCopyright).toBeFalsy();

    component.useDefaultCopyright = 'true';

    expect(component.useDefaultCopyright).toBeTruthy();
  });

  it('can alter deviceSpecs', () => {
    component.deviceSpecs = false;

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = undefined;

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = 'false';

    expect(component.deviceSpecs).toBeFalsy();

    component.deviceSpecs = 'true';

    expect(component.deviceSpecs).toBeTruthy();
  });

  it('can alter copyrightYear', () => {
    component.copyrightYear = undefined;

    expect(component.copyrightYear).toEqual(new Date().getFullYear());

    component.copyrightYear = 2015;

    expect(component.copyrightYear).toEqual('2015');
  });
});

describe('IdsAbout Component (using attributes)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-about id="about-example" product-name="Controls" product-version="4.0.0">
      <ids-icon slot="icon" icon="logo" size="large" /></ids-icon>
      <ids-text id="about-example-name" slot="appName" type="h1" font-size="24">IDS Enterprise</ids-text>
      <ids-text id="about-example-content" slot="content" type="p">Fashionable components for fashionable applications.</ids-text>
    </ids-about>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    component.remove();

    expect(document.querySelectorAll(name).length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(component.productName).toEqual(productName);
    expect(component.productVersion).toEqual(productVersion);
    expect(component.copyrightYear).toEqual(new Date().getFullYear());
    expect(component.useDefaultCopyright).toBeTruthy();
    expect(component.deviceSpecs).toBeTruthy();
  });
});

describe('IdsABout Component (empty)', () => {
  let component;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-about id="${id}"></ids-about>`);
    component = document.querySelector(name);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    component = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll(name).length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should have default properties', () => {
    expect(component.copyrightYear).toEqual(new Date().getFullYear());
    expect(component.deviceSpecs).toBeTruthy();
    expect(component.useDefaultCopyright).toBeTruthy();
  });

  it('can change productVersion and productName after being invoked', () => {
    const newProductVersion = '1.0.1';
    const newProductName = 'IdsAbout';

    component.productVersion = newProductVersion;
    component.productName = newProductName;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.productName).toEqual(newProductName);
    expect(component.productVersion).toEqual(newProductVersion);
  });

  it('can change copyrightYear after being invoked', () => {
    component.copyrightYear = undefined;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.copyrightYear).toEqual(new Date().getFullYear());

    component.copyrightYear = 2015;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.copyrightYear).toEqual('2015');
  });

  it('can remove default copyright after being invoked', () => {
    component.useDefaultCopyright = false;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.useDefaultCopyright).toBeFalsy();
  });

  it('can remove device specs after being invoked', () => {
    component.deviceSpecs = false;

    expect(component.querySelectorAll('*').length).toBeTruthy();
    expect(component.deviceSpecs).toBeFalsy();
  });
});
