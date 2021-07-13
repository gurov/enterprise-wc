import IdsCard from '../../src/ids-card/ids-card';
import IdsNotificationBanner from '../../src/ids-notification-banner/ids-notification-banner';


// Example for populating the List View
const listView = document.querySelector('#list-view-1');

// Do an ajax request and apply the data to the list
const xmlhttp = new XMLHttpRequest();
const url = '/api/products';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200 && listView) {
    listView.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();

const notificationBanner = new IdsNotificationBanner();
console.log(notificationBanner);

document.addEventListener('DOMContentLoaded', () => {

  // notificationBanner.show({
  //   id: 'custom-notification-id',
  //   messageText: 'Hello',
  //   type: 'success',
  //   link: 'https://infor.com',
  //   linkText: 'Click to view'
  // });
});
