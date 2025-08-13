import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.disabled = true;
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {

    const pickedDate = selectedDates[0];


    if (!pickedDate) {
      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }

 
    const now = Date.now();
    if (pickedDate.getTime() <= now) {
  
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }


    userSelectedDate = pickedDate;
    startBtn.disabled = false;
  },
};


flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateInterface({ days, hours, minutes, seconds }) {
 
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  datetimePicker.removeAttribute('disabled');
  startBtn.disabled = true;
}

function startTimer() {
  if (!userSelectedDate) return;


  startBtn.disabled = true;
  datetimePicker.setAttribute('disabled', ''); 

 
  timerId = setInterval(() => {
    const now = Date.now();
    const delta = userSelectedDate.getTime() - now;

    if (delta <= 0) {
   
      updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      stopTimer();
      return;
    }

    const time = convertMs(delta);
    updateInterface(time);
  }, 1000);

  const firstDelta = userSelectedDate.getTime() - Date.now();
  updateInterface(convertMs(firstDelta));
}

startBtn.addEventListener('click', () => {
 
  if (!userSelectedDate) return;
  startTimer();
});

updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
