import './header-tabs-demo.scss';
import IdsText from '../../src/components/ids-text';
import IdsHeader from '../../src/components/ids-header';

import IdsTabs, {
  IdsTab,
  IdsTabContent,
  IdsTabsContext,
  IdsTabDivider
} from '../../src/components/ids-tabs';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.getElementById('ids-tabs-basic');

  tabs.addEventListener('change', (e) => {
    console.info(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
